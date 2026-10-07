/** Homepage sections remain reachable from service pages; contact stays local. */
export function sectionHref(href: string, pathname: string) {
  return pathname !== "/" && href.startsWith("#") && href !== "#contact"
    ? `/${href}`
    : href;
}
