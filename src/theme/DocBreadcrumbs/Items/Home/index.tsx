import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {translate} from '@docusaurus/Translate';
import IconHome from '@theme/Icon/Home';

export default function HomeBreadcrumbItem(): ReactNode {
  const homeHref = useBaseUrl('/');
  const label = translate({
    id: 'theme.docs.breadcrumbs.homeLabel',
    message: 'Home',
    description: 'Visible name for the home page in the documentation breadcrumbs',
  });

  return (
    <li className="breadcrumbs__item">
      <Link className="breadcrumbs__link" href={homeHref}>
        <IconHome aria-hidden="true" className="breadcrumb-home-icon" />
        {label}
      </Link>
    </li>
  );
}
