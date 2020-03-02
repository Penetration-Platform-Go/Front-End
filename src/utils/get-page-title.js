import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Draw Your Network'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
