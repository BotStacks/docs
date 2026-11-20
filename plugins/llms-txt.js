/**
 * Writes /llms.txt and /llms-full.txt during the production build.
 *
 * Link lists follow the sidebar. Titles, descriptions, and the short
 * introduction come from the published docs, and every URL is a route
 * Docusaurus actually built (including the trailing slash).
 */

const fs = require('fs');
const path = require('path');

const SITE_NAME = 'BotStacks';

function readSidebarCategories(siteDir) {
  const source = fs.readFileSync(path.join(siteDir, 'sidebars.ts'), 'utf8');
  const categories = [];
  const categoryPattern = /"label":\s*"([^"]+)"[\s\S]*?"items":\s*\[([\s\S]*?)\]/g;
  let match;
  while ((match = categoryPattern.exec(source))) {
    const items = [...match[2].matchAll(/"([^"]+)"/g)].map((item) => item[1]);
    if (items.length === 0) {
      throw new Error(`Sidebar category "${match[1]}" has no doc ids`);
    }
    categories.push({label: match[1], items});
  }
  if (categories.length === 0) {
    throw new Error('Could not read sidebar categories from sidebars.ts');
  }
  return categories;
}

function parseFrontMatter(content) {
  if (!content.startsWith('---\n') && !content.startsWith('---\r\n')) {
    return {data: {}, body: content};
  }
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return {data: {}, body: content};
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!field) continue;
    let value = field[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[field[1]] = value;
  }
  return {data, body: content.slice(match[0].length)};
}

function walkDocs(dir, rel = '') {
  const files = [];
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
    const relPath = rel ? `${rel}/${entry.name}` : entry.name;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDocs(fullPath, relPath));
    } else if (entry.isFile() && /\.mdx?$/i.test(entry.name)) {
      files.push(relPath.split(path.sep).join('/'));
    }
  }
  return files;
}

function toDocId(relPath, explicitId) {
  const segments = relPath
    .replace(/\.mdx?$/i, '')
    .split('/')
    .map((segment) => segment.replace(/^\d+-/, ''));
  if (explicitId) {
    if (explicitId.includes('/')) return explicitId.replace(/^\/+|\/+$/g, '');
    segments[segments.length - 1] = explicitId;
  }
  return segments.join('/');
}

function candidateRoute(docId, slug) {
  if (slug === '/' || slug === '') return '/';
  if (slug) {
    if (slug.startsWith('/')) return slug;
    const parent = docId.split('/').slice(0, -1).join('/');
    return `${parent ? `/${parent}` : ''}/${slug}`.replace(/\/{2,}/g, '/');
  }
  return `/${docId}`;
}

function findBuiltRoute(routesPaths, candidate) {
  const key = candidate.replace(/\/+$/, '') || '/';
  const matches = routesPaths.filter((route) => (route.replace(/\/+$/, '') || '/') === key);
  if (matches.length !== 1) return null;
  return matches[0] || '/';
}

function oneLine(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function escapeLinkText(text) {
  return oneLine(text).replace(/[\\[\]]/g, '\\$&');
}

function firstParagraph(body) {
  const paragraphs = body
    .replace(/<[^>]+>/g, ' ')
    .split(/\n\s*\n/);
  for (const paragraph of paragraphs) {
    const line = oneLine(paragraph.replace(/^import\s.+$/gm, ''));
    if (!line || line.startsWith('#') || line.startsWith('import ')) continue;
    return line;
  }
  return '';
}

function descriptionFor(data, body, title) {
  const fromFrontMatter = data.description ? oneLine(data.description) : '';
  const description = fromFrontMatter || firstParagraph(body) || title;
  if (description.length <= 180) return description;
  return `${description.slice(0, 177).trimEnd()}...`;
}

function absoluteDocLinks(markdown, origin) {
  return markdown.replace(/\]\((\/[^)\s]*)\)/g, (_, dest) => {
    const hashAt = dest.indexOf('#');
    const hash = hashAt === -1 ? '' : dest.slice(hashAt);
    const pathOnly = hashAt === -1 ? dest : dest.slice(0, hashAt);
    if (pathOnly === '/' || pathOnly === '') return `](${origin}/${hash})`;
    if (/\.[a-z0-9]+$/i.test(pathOnly)) return `](${origin}${pathOnly}${hash})`;
    const withSlash = pathOnly.endsWith('/') ? pathOnly : `${pathOnly}/`;
    return `](${origin}${withSlash}${hash})`;
  });
}

function cleanPage(body) {
  const withoutImports = body
    .split(/\r?\n/)
    .filter((line) => !/^\s*import\s/.test(line) && !/^\s*export\s/.test(line))
    .join('\n');
  const blocked = withoutImports.replace(
    /<\/(p|h[1-6]|li|div|section)>/gi,
    (match) => `${match}\n\n`,
  );
  // Separate inline tags on the same line ("</strong><span>") without
  // joining elements that already sit on their own lines.
  const spaced = blocked.replace(/<\/[A-Za-z][^>]*>[ \t]*<[A-Za-z][^>]*>/g, ' ');
  const text = spaced.replace(/<[^>]+>/g, '');
  return text.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

function demoteHeadings(markdown) {
  // Page titles are H2s. Shift source headings down so they nest under that title.
  return markdown.replace(
    /^(#{1,6}) /gm,
    (_, marks) => `${'#'.repeat(Math.min(6, marks.length + 2))} `,
  );
}

function pageBody(doc) {
  let body = cleanPage(doc.body);
  const heading = body.match(/^#\s+(.+)\n*/);
  if (heading && oneLine(heading[1]) === oneLine(doc.title)) {
    body = body.slice(heading[0].length).trim();
  }
  return demoteHeadings(body).trim();
}

function proseParagraphs(body) {
  const prose = body
    .split(/\r?\n/)
    .filter(
      (line) =>
        !/^\s*import\s/.test(line) &&
        !line.includes('<Link') &&
        !line.includes('<div'),
    )
    .join('\n');
  return cleanPage(prose)
    .split(/\n\s*\n/)
    .map((paragraph) => oneLine(paragraph))
    .filter((paragraph) => paragraph && !paragraph.startsWith('#') && paragraph.includes('.'));
}

function loadDocs(siteDir) {
  const docsDir = path.join(siteDir, 'docs');
  const byId = new Map();
  for (const relPath of walkDocs(docsDir)) {
    const raw = fs.readFileSync(path.join(docsDir, relPath), 'utf8');
    const {data, body} = parseFrontMatter(raw);
    if (data.draft === 'true') continue;
    const id = toDocId(relPath, data.id);
    if (byId.has(id)) {
      throw new Error(`Duplicate doc id "${id}" (${relPath} and ${byId.get(id).relPath})`);
    }
    const title = oneLine(data.title || '') || id;
    byId.set(id, {
      id,
      relPath,
      title,
      slug: data.slug,
      description: descriptionFor(data, body, title),
      body,
    });
  }
  return byId;
}

function attachRoutes(docsById, routesPaths) {
  for (const doc of docsById.values()) {
    const built = findBuiltRoute(routesPaths, candidateRoute(doc.id, doc.slug));
    if (!built) {
      throw new Error(
        `No built route for docs/${doc.relPath} (id ${doc.id}, slug ${doc.slug || 'auto'})`,
      );
    }
    if (built !== '/' && !built.endsWith('/')) {
      throw new Error(`Refusing to link ${built} without the site's trailing slash`);
    }
    doc.route = built;
  }
}

function sectionsFromSidebar(docsById, categories) {
  const used = new Set();
  const sections = [];
  const optional = [];
  const take = (id) => {
    const doc = docsById.get(id);
    if (!doc) throw new Error(`Sidebar item "${id}" does not match a docs page`);
    if (used.has(id)) throw new Error(`Sidebar item "${id}" is listed more than once`);
    used.add(id);
    return doc;
  };
  const home = docsById.get('index');
  if (home) {
    used.add(home.id);
    sections.push({label: 'Help center', docs: [home]});
  }
  for (const category of categories) {
    const docs = category.items.map(take);
    if (category.label === 'Your website') {
      const guides = docs.filter((doc) => !doc.id.startsWith('common-tasks/integrations/'));
      const install = docs.filter(
        (doc) =>
          doc.id.startsWith('common-tasks/integrations/') && !doc.id.includes('godaddy'),
      );
      const planned = docs.filter((doc) => doc.id.includes('godaddy'));
      if (guides.length > 0) sections.push({label: 'Your website', docs: guides});
      if (install.length > 0) sections.push({label: 'CMS installation', docs: install});
      optional.push(...planned);
      continue;
    }
    sections.push({label: category.label, docs});
  }
  const omitted = [...docsById.values()].filter((doc) => !used.has(doc.id));
  if (omitted.length > 0) {
    omitted.sort((a, b) => a.route.localeCompare(b.route));
    sections.push({label: 'Other', docs: omitted});
  }
  if (optional.length > 0) sections.push({label: 'Optional', docs: optional});
  const installAt = sections.findIndex((section) => section.label === 'CMS installation');
  const startAt = sections.findIndex((section) => section.label === 'Start here');
  if (installAt !== -1 && startAt !== -1 && installAt !== startAt + 1) {
    const [install] = sections.splice(installAt, 1);
    const startNow = sections.findIndex((section) => section.label === 'Start here');
    sections.splice(startNow + 1, 0, install);
  }
  return sections;
}

function introduction(home) {
  const paragraphs = home ? proseParagraphs(home.body) : [];
  const headline = paragraphs.find((paragraph) =>
    paragraph.startsWith('Turn your website content into helpful answers'),
  );
  const summary = home?.description || '';
  const blockquote = [headline, summary].filter(Boolean).join(' ');
  const details = paragraphs.filter(
    (paragraph) =>
      paragraph !== headline &&
      !paragraph.includes('](') &&
      !paragraph.startsWith('Contact support'),
  );
  return {blockquote, details};
}

function renderLlmsTxt(origin, sections, intro) {
  const lines = [`# ${SITE_NAME}`, ''];
  if (intro.blockquote) lines.push(`> ${intro.blockquote}`, '');
  for (const paragraph of intro.details) lines.push(paragraph, '');
  for (const section of sections) {
    lines.push(`## ${section.label}`, '');
    for (const doc of section.docs) {
      const url = `${origin}${doc.route === '/' ? '/' : doc.route}`;
      lines.push(`- [${escapeLinkText(doc.title)}](${url}): ${doc.description}`);
    }
    lines.push('');
  }
  return `${lines.join('\n').trim()}\n`;
}

function renderLlmsFull(origin, sections, intro) {
  const lines = [`# ${SITE_NAME}`, ''];
  if (intro.blockquote) lines.push(`> ${intro.blockquote}`, '');
  lines.push(
    'Full text of the BotStacks help center. The same pages are listed with short descriptions in /llms.txt.',
    '',
  );
  for (const section of sections) {
    for (const doc of section.docs) {
      const url = `${origin}${doc.route === '/' ? '/' : doc.route}`;
      lines.push(`## ${doc.title}`, '', url, '');
      const body = absoluteDocLinks(pageBody(doc), origin);
      if (body) lines.push(body, '');
      lines.push('---', '');
    }
  }
  return `${lines.join('\n').trim()}\n`;
}

function generateLlmsFiles({siteDir, outDir, routesPaths, siteUrl}) {
  const origin = siteUrl.replace(/\/+$/, '');
  const docsById = loadDocs(siteDir);
  attachRoutes(docsById, routesPaths);
  const categories = readSidebarCategories(siteDir);
  const sections = sectionsFromSidebar(docsById, categories);
  const intro = introduction(docsById.get('index'));
  if (!intro.blockquote) {
    throw new Error('Homepage description is missing, so llms.txt has no summary');
  }
  const llmsTxt = renderLlmsTxt(origin, sections, intro);
  const llmsFull = renderLlmsFull(origin, sections, intro);
  fs.writeFileSync(path.join(outDir, 'llms.txt'), llmsTxt);
  fs.writeFileSync(path.join(outDir, 'llms-full.txt'), llmsFull);
  const pageCount = sections.reduce((count, section) => count + section.docs.length, 0);
  return {pageCount, llmsTxt, llmsFull};
}

module.exports = function llmsTxtPlugin() {
  return {
    name: 'llms-txt',
    async postBuild({siteDir, outDir, routesPaths, siteConfig}) {
      const siteUrl = `${siteConfig.url}${siteConfig.baseUrl === '/' ? '' : siteConfig.baseUrl}`;
      const {pageCount} = generateLlmsFiles({
        siteDir,
        outDir,
        routesPaths,
        siteUrl,
      });
      console.log(`[llms-txt] Wrote /llms.txt and /llms-full.txt (${pageCount} pages)`);
    },
  };
};

module.exports.generateLlmsFiles = generateLlmsFiles;
