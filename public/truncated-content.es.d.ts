export class TruncatedContent extends HTMLElement {
  /**
   * Boolean indicating if all content is shown or not
   */
  expanded: boolean

  /**
   * Show all the content in the element
   */
  showAdditionalContent(): void

  /**
   * Hide all content that comes after a <!--more--> tag
   */
  hideAdditionalContent(): void

  /**
   * Define the custom element
   * @param tagName {string} - Tag name to use for the element, defaults to `truncated-content`
   */
  static define(tagName?: string): void
}