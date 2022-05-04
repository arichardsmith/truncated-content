import { adjustPlaceholderLocation, extractAllFollowingNodes, findMoreComment } from './dom'
import { getStylesheet } from './style'

enum LINK_TYPE {
  More,
  Less,
}

export class TruncatedContent extends HTMLElement {
  private _root: ShadowRoot
  private _placeholder?: Node
  private _nodesPostPlaceholder: Node[][]
  private _ellipsis: HTMLSpanElement
  private _showMoreSlot: HTMLSlotElement
  private _showLessSlot: HTMLSlotElement
  private _expanded: boolean

  /**
   * Define the truncated content element
   * @param tagName - Optionally define the tag name for the element
   */
  static define(tagName: string = 'truncated-content') {
    customElements.define(tagName, TruncatedContent)
  }

  static get observedAttributes() {
    return ['expanded']
  }

  constructor() {
    super()
    this._root = this.attachShadow({ mode: 'open' })
    this._root.append(getStylesheet())
    this._root.append(document.createElement('slot'))

    this._nodesPostPlaceholder = []

    this._ellipsis = document.createElement('span')
    this._ellipsis.innerHTML = '&hellip;'

    this._showMoreSlot = document.createElement('slot')
    this._showMoreSlot.setAttribute('name', 'show-more')

    const showMoreLink = document.createElement('a')
    showMoreLink.href = '#more'
    showMoreLink.innerText = 'Show More'
    showMoreLink.classList.add('toggle-link')
    this._showMoreSlot.append(showMoreLink)

    this._showLessSlot = document.createElement('slot')
    this._showLessSlot.setAttribute('name', 'show-less')

    const showLessLink = document.createElement('a')
    showLessLink.href = '#less'
    showLessLink.innerText = 'Show Less'
    showLessLink.classList.add('toggle-link')
    this._showLessSlot.append(showLessLink)

    this._expanded = false
  }

  connectedCallback() {
    this._placeholder = findMoreComment(this)

    if (this._placeholder) {
      adjustPlaceholderLocation(this._placeholder)

      this._nodesPostPlaceholder = extractAllFollowingNodes(
        this,
        this._placeholder
      ).map((level) =>
        level.filter(
          // Remove custom links
          (node) => !(node instanceof HTMLElement) || !node.hasAttribute('slot')
        )
      )

      this._showMoreSlot.addEventListener(
        'click',
        this.handleShowMore.bind(this)
      )
      this._showLessSlot.addEventListener(
        'click',
        this.handleShowLess.bind(this)
      )

      if (!this.hasAttribute('expanded')) {
        this.hideAdditionalContent()
      } else {
        this._updateLink(LINK_TYPE.Less)
      }
    }
  }

  attributeChangedCallback(name: string, _: string, newValue: string) {
    if (name === 'expanded') {
      this.expanded = newValue !== null
    }
  }

  /**
   * Hide any content that comes after a <!--more--> comment
   */
  hideAdditionalContent() {
    if (!this._placeholder) {
      return
    }

    this._removePostPlaceholderNodes()

    this._placeholder.parentElement?.appendChild(this._ellipsis)

    this._updateLink(LINK_TYPE.More)

    this._expanded = false
    this.removeAttribute('expanded')
  }

  /**
   * Show any hidden content that came after a <!--more--> comment
   */
  showAdditionalContent() {
    if (!this._placeholder) {
      return
    }

    this._ellipsis.remove()
    this._addPostPlaceholderNodes()
    this._updateLink(LINK_TYPE.Less)

    this._expanded = true
    this.setAttribute('expanded', '')
  }

  get expanded() {
    return this._expanded
  }

  set expanded(newStatus) {
    if (newStatus !== this._expanded) {
      if (newStatus) {
        this.showAdditionalContent()
      } else {
        this.hideAdditionalContent()
      }
    }
  }

  /** Toggle the content */
  toggle() {
    this.expanded = !this._expanded
  }

  private _removePostPlaceholderNodes() {
    this._nodesPostPlaceholder
      .flat()
      .forEach((node) => node.parentElement?.removeChild(node))
  }

  private _addPostPlaceholderNodes() {
    let targetParent = this._placeholder?.parentElement ?? null
    for (let level of this._nodesPostPlaceholder) {
      if (!targetParent) {
        break
      }

      targetParent.append(...level)

      targetParent = targetParent.parentElement
    }
  }

  private _updateLink(direction: LINK_TYPE) {
    if (direction === LINK_TYPE.More) {
      this._showLessSlot.remove()
      this._root.append(this._showMoreSlot)
    } else {
      this._showMoreSlot.remove()
      this._root.append(this._showLessSlot)
    }
  }

  handleShowMore(e: MouseEvent) {
    e.preventDefault()

    this.showAdditionalContent()
  }

  handleShowLess(e: MouseEvent) {
    e.preventDefault()

    this.hideAdditionalContent()
  }
}
