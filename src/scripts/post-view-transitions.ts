// Morphs a post's title and date between list pages and post pages during
// cross-document view transitions. Must be loaded on the list pages.

const LIST_PATHS = ['/', '/blog', '/notes']

window.addEventListener('pageswap', (e) => {
  const { viewTransition, activation } = e as PageSwapEvent
  const targetUrl = activation?.entry.url

  if (!viewTransition || !targetUrl) {
    return
  }

  const elements = getPostElements(new URL(targetUrl))

  if (elements) {
    setTemporaryViewTransitionNames(elements, viewTransition.finished)
  }
})

window.addEventListener('pagereveal', (e) => {
  const { viewTransition } = e as PageRevealEvent
  const navigation = window.navigation as
    | (Navigation & { activation?: NavigationActivation })
    | undefined
  const fromUrl = navigation?.activation?.from?.url

  if (!viewTransition || !fromUrl || !isListPage(new URL(location.href))) {
    return
  }

  const elements = getPostElements(new URL(fromUrl))

  if (elements) {
    setTemporaryViewTransitionNames(elements, viewTransition.ready)
  }
})

function normalizePath(url: URL) {
  return url.pathname.replace(/(.)\/$/, '$1')
}

function isListPage(url: URL) {
  return LIST_PATHS.includes(normalizePath(url))
}

function getPostElements(url: URL): [HTMLElement, string][] | null {
  const slug = normalizePath(url).match(/^\/(?:blog|notes)\/([^/]+)$/)?.[1]

  if (!slug) {
    return null
  }

  const item = `#${CSS.escape(`_${slug}`)}`
  const heading = document.querySelector<HTMLElement>(`${item} h3`)
  const date = document.querySelector<HTMLElement>(`${item} time`)

  if (!heading || !date) {
    return null
  }

  return [
    [heading, 'heading'],
    [date, 'date'],
  ]
}

async function setTemporaryViewTransitionNames(
  entries: [HTMLElement, string][],
  until: Promise<unknown>,
) {
  for (const [el, name] of entries) {
    el.style.viewTransitionName = name
  }

  await until.catch(() => {})

  for (const [el] of entries) {
    el.style.viewTransitionName = ''
  }
}
