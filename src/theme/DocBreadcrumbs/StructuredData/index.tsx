import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {translate} from '@docusaurus/Translate';
import {useHomePageRoute} from '@docusaurus/theme-common/internal';
import type {Props} from '@theme/DocBreadcrumbs/StructuredData';

function stripTrailingSlash(url: string): string {
  return url.length > 1 && url.endsWith('/') ? url.slice(0, -1) : url;
}

// Sidebar breadcrumb hrefs omit the trailing slash even when trailingSlash is
// enabled. Canonicals and Cloudflare both use the slashed URL.
function withTrailingSlash(pathname: string): string {
  if (!pathname || pathname === '/' || pathname.endsWith('/')) {
    return pathname;
  }
  const query = pathname.indexOf('?');
  const hash = pathname.indexOf('#');
  const splitAt = Math.min(
    ...[query, hash].filter((index) => index >= 0),
    pathname.length,
  );
  return `${pathname.slice(0, splitAt)}/${pathname.slice(splitAt)}`;
}

/**
 * The theme home crumb is an icon link, so it is not part of the sidebar
 * breadcrumb array. Emit it with an explicit name, and drop any item whose
 * label is blank, so BreadcrumbList never contains an unnamed ListItem.
 * Google expects at least two named items; a single-item list is omitted.
 */
export default function DocBreadcrumbsStructuredData({
  breadcrumbs,
}: Props): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const homePageRoute = useHomePageRoute();
  const homeName = translate({
    id: 'theme.docs.breadcrumbs.homeLabel',
    message: 'Home',
    description: 'Visible name for the home page in the documentation breadcrumbs',
  });
  const homeUrl = `${siteConfig.url}${homePageRoute?.path ?? siteConfig.baseUrl}`;

  const linked = breadcrumbs
    .filter((breadcrumb) => breadcrumb.href && breadcrumb.label.trim())
    .map((breadcrumb) => ({
      name: breadcrumb.label.trim(),
      item: `${siteConfig.url}${withTrailingSlash(breadcrumb.href)}`,
    }));

  const crumbs =
    homePageRoute &&
    !linked.some((crumb) => stripTrailingSlash(crumb.item) === stripTrailingSlash(homeUrl))
      ? [{name: homeName, item: homeUrl}, ...linked]
      : linked;

  if (crumbs.length < 2) {
    return null;
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };

  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Head>
  );
}
