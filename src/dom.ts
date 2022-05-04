/**
 * Find a <!--more--> comment in a DOM tree
 */
export function findMoreComment(rootElement: HTMLElement): Node | undefined {
  for (let child of iterateChildren(rootElement)) {
    if (child.nodeType === 8) {
      // Comment
      if (child.nodeValue && /^\s*more\s*$/.test(child.nodeValue)) {
        return child
      }
    } else if (child instanceof HTMLElement && child.hasChildNodes()) {
      let sub: Node | undefined
      if ((sub = findMoreComment(child)) !== undefined) {
        return sub
      }
    }
  }

  return undefined
}

/**
 * Extract all nodes that come after a given target node.
 * This recursively climbs up the tree until the root node is reached.
 *
 * It returns a 2d array where the first row is the nodes that were siblings of the target node,
 * the next is siblings of the target nodes parents etc.
 *
 * @param rootElement {HTMLElement} - Element to stop recursively extracting at
 * @param targetNode {Node} - Node to start extracting from
 * @returns {Node[][]} 2d array of node
 */
export function extractAllFollowingNodes(
  rootElement: HTMLElement,
  targetNode: Node
): Node[][] {
  const levels: Node[][] = []
  while (targetNode !== rootElement) {
    levels.push(Array.from(iterateSiblings(targetNode)))

    if (targetNode.parentNode === null) {
      break
    }

    targetNode = targetNode.parentNode
  }

  return levels
}

/**
 * Iterate through an element's children
 * @param element {HTMLElement}
 */
export function* iterateChildren(element: HTMLElement) {
  let child = element.firstChild

  if (child) {
    yield child
    yield* iterateSiblings(child)
  }
}

/**
 * Iterate through the sibling nodes that come after a node
 * @param startNode {Node}
 */
export function* iterateSiblings(startNode: Node) {
  let node = startNode

  while (node.nextSibling) {
    yield node.nextSibling
    node = node.nextSibling
  }
}
