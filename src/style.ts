const STYLES = css`
  :host {
    display: block;
  }

  a.toggle-link {
    display: block;
  }
`

export function getStylesheet(): HTMLStyleElement {
  const ss = document.createElement('style')
  ss.setAttribute('type', 'text/css')
  ss.innerHTML = STYLES
  return ss
}

/**
 * Helper to get syntax highlighting
 */
function css(parts: TemplateStringsArray, ...values: string[]) {
  return String.raw(parts, ...values)
}
