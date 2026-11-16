const {themes: prismThemes} = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
module.exports = {
  title: 'BotStacks Help Center',
  url: 'https://docs.botstacks.ai',
  baseUrl: '/',
  favicon: 'favicon.svg',
  organizationName: 'BotStacks',
  projectName: 'docs',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  i18n: { defaultLocale: 'en', locales: ['en'] },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        blog: false,
        docs: { 
          routeBasePath: '/',
          sidebarPath: './sidebars.ts' },
        theme: { customCss: './src/css/custom.css' },
      },
    ],
  ],
  plugins: [
    // short name works if the package is resolvable from root
    'docusaurus-plugin-image-zoom',
    'docusaurus-lunr-search',
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
  {
    "from": "/common-tasks/integrations/crisp",
    "to": "/resources/integration-availability"
  },
  {
    "from": "/getting-started/quickstart-guide/deployment",
    "to": "/products/cms-deployment"
  },
  {
    "from": "/getting-started/conceptual-overview",
    "to": "/products/ai-studio"
  },
  {
    "from": "/common-tasks/knowledge-management/preview-responses",
    "to": "/products/brainvault"
  },
  {
    "from": "/tools-features/brain-vault",
    "to": "/products/brainvault"
  },
  {
    "from": "/common-tasks/integrations/whatsapp-integration",
    "to": "/resources/integration-availability"
  },
  {
    "from": "/resources/discord",
    "to": "/resources/contact-support"
  },
  {
    "from": "/getting-started/what-is-botstacks",
    "to": "/website-guides/start"
  },
  {
    "from": "/tools-features/sequence-studio/node-reference",
    "to": "/products/workflows"
  },
  {
    "from": "/common-tasks/integrations/discord-integration",
    "to": "/resources/integration-availability"
  },
  {
    "from": "/common-tasks/testing-and-improvement/test-in-dirtbox",
    "to": "/products/dirtbox"
  },
  {
    "from": "/common-tasks/testing-and-improvement/simulate-conversations-and-debug",
    "to": "/products/dirtbox"
  },
  {
    "from": "/tools-features/dirtbox-reference",
    "to": "/products/dirtbox"
  },
  {
    "from": "/tools-features/sequence-studio/faq",
    "to": "/products/ai-studio"
  },
  {
    "from": "/common-tasks/conversation-design/conditions-logic",
    "to": "/products/workflows"
  },
  {
    "from": "/common-tasks/knowledge-management/add-knowledge-sources",
    "to": "/products/brainvault"
  },
  {
    "from": "/common-tasks/conversation-design/build-flows",
    "to": "/products/workflows"
  },
  {
    "from": "/getting-started/quickstart-guide/create-botstack",
    "to": "/website-guides/start"
  },
  {
    "from": "/common-tasks/knowledge-management/prioritize-organize",
    "to": "/products/brainvault"
  },
  {
    "from": "/getting-started/quickstart-guide/conversation-flow",
    "to": "/products/ai-studio"
  },
  {
    "from": "/common-tasks/deployment/embed-chatbot",
    "to": "/products/cms-deployment"
  },
  {
    "from": "/common-tasks/integrations/crm-integrations",
    "to": "/resources/integration-availability"
  },
  {
    "from": "/tools-features/sequence-studio/overview",
    "to": "/products/ai-studio"
  },
  {
    "from": "/resources/tutorials",
    "to": "/resources/contact-support"
  },
  {
    "from": "/getting-started/quickstart-guide/testing",
    "to": "/products/dirtbox"
  },
  {
    "from": "/tools-features/sequence-studio/panels",
    "to": "/products/ai-studio"
  },
  {
    "from": "/tools-features/sequence-studio/design-features",
    "to": "/products/workflows"
  },
  {
    "from": "/common-tasks/conversation-design/understand-nodes",
    "to": "/products/workflows"
  },
  {
    "from": "/getting-started/quickstart-guide/knowledge-base",
    "to": "/products/brainvault"
  },
  {
    "from": "/tools-features/activation-kit-reference",
    "to": "/products/cms-deployment"
  },
  {
    "from": "/common-tasks/integrations/slack-integration",
    "to": "/resources/integration-availability"
  },
  {
    "from": "/common-tasks/log-analytics/logs-analytics",
    "to": "/manage/conversations"
  },
  {
    "from": "/common-tasks/testing-and-improvement/analyze-and-improve-performance",
    "to": "/products/dirtbox"
  },
  {
    "from": "/tools-features/sequence-studio/best-practices",
    "to": "/products/workflows"
  },
  {
    "from": "/billing",
    "to": "/common-tasks/usage-and-costs/track-costs"
  },
  {
    "from": "/getting-started/what-is-botstacks/quickstart-guide/create-botstack",
    "to": "/website-guides/start"
  },
  {
    "from": "/resource-center/overview",
    "to": "/resources/changelog"
  },
  {
    "from": "/tools-features/02-common-tasks/02-conversation-design/01-build-flows",
    "to": "/products/workflows"
  },
  {
    "from": "/tools-features/02-common-tasks/02-conversation-design/03-conditions-logic",
    "to": "/products/workflows"
  },
  {
    "from": "/tools-features/02-common-tasks/04-testing-and-improvement/01-test-in-dirtbox",
    "to": "/products/dirtbox"
  },
  {
    "from": "/tools-features/common-tasks/conversation-design/build-flows",
    "to": "/products/workflows"
  },
  {
    "from": "/tools-features/common-tasks/conversation-design/understand-nodes",
    "to": "/products/workflows"
  },
  {
    "from": "/tools-features/sequence-studio/faq/05-best-practices.mdx",
    "to": "/products/workflows"
  },
  {
    "from": "/tools-features/sequence-studio/faq/05-best-practices",
    "to": "/products/workflows"
  },
  {
    "from": "/tools-features/sequence-studio/overview/node-reference",
    "to": "/products/workflows"
  },
  {
    "from": "/tools-features/03-common-tasks/02-conversation-design/01-build-flows",
    "to": "/products/workflows"
  },
  {
    "from": "/tools-features/03-common-tasks/02-conversation-design/02-understand-nodes",
    "to": "/products/workflows"
  },
  {
    "from": "/tools-features/03-common-tasks/02-conversation-design/03-conditions-logic",
    "to": "/products/workflows"
  },
  {
    "from": "/tools-features/03-common-tasks/03-testing-and-improvement/01-test-in-dirtbox",
    "to": "/products/dirtbox"
  },
  {
    "from": "/category/sequence-studio",
    "to": "/products/ai-studio"
  },
  {
    "from": "/category/getting-started",
    "to": "/website-guides/start"
  },
  {
    "from": "/category/common-tasks",
    "to": "/website-guides/start"
  },
  {
    "from": "/category/tools--features",
    "to": "/products/ai-studio"
  },
  {
    "from": "/category/resources",
    "to": "/resources/contact-support"
  },
  {
    "from": "/category/knowledge-management",
    "to": "/products/brainvault"
  },
  {
    "from": "/category/conversation-design",
    "to": "/products/workflows"
  },
  {
    "from": "/category/testing-and-improvement",
    "to": "/products/dirtbox"
  },
  {
    "from": "/category/deployment",
    "to": "/products/cms-deployment"
  },
  {
    "from": "/category/integrations",
    "to": "/products/cms-deployment"
  },
  {
    "from": "/category/quickstart-guide",
    "to": "/website-guides/start"
  },
  {
    "from": "/category/usage-and-costs",
    "to": "/common-tasks/usage-and-costs/track-costs"
  },
  {
    "from": "/category/logs--analytics",
    "to": "/manage/conversations"
  }
],

      },
    ],
  ],

  themeConfig: /** @type {import('@docusaurus/preset-classic').ThemeConfig} */ ({
    image: 'images/docs-social.png',
    navbar: {
      //title: 'BotStacks Help Center',
      logo: { alt: 'BotStacks Logo', src: 'images/logo/light.svg', srcDark: 'images/logo/dark.svg', className: 'navbar-logo' },
      items: [
        { to: '/website-guides/start', label: 'Start here', position: 'left' },
        { to: '/website-guides/platforms', label: 'Your website', position: 'left' },
        { href: 'https://www.botstacks.ai/pricing/', label: 'Pricing', position: 'right' },
        //{ to: '/', label: 'Home', position: 'left' },
        //{ type: 'docSidebar', sidebarId: 'tutorialSidebar', position: 'left', label: 'Docs' },
        { to: 'mailto:support@botstacks.ai', label: 'Contact Us', position: 'right', className: 'hide-on-mobile' },
        { to: 'https://sandbox.botstacks.ai/login', label: 'Dashboard', position: 'right', className: 'button button--primary dashboard-link hide-on-mobile' },
      ],
    },
    footer: {
      links: [
        {
          items: [
            { label: 'Twitter', to: 'https://twitter.com/botstacks' },
            { label: 'GitHub', to: 'https://github.com/BotStacks' },
            { label: 'LinkedIn', to: 'https://www.linkedin.com/company/botstacks' },
            { label: 'YouTube', to: 'https://www.youtube.com/@BotStacksai/videos' },
            { label: 'Support', to: '/resources/contact-support' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} BotStacks. Built with Docusaurus.`,
    },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
    colorMode: { defaultMode: 'dark', disableSwitch: true },
    zoom: {
      selector: '.markdown > img',      // which images to target
      background: {
      light: 'transparent',
      dark: '#0d0f14',
      },
      config: {
        margin: 90,
      },
    },
  }),
};