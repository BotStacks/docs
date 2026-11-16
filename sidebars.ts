import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';
const sidebars: SidebarsConfig = {
  "tutorialSidebar": [
    "index",
    {
      "type": "category",
      "label": "Start here",
      "items": [
        "website-guides/start",
        "website-guides/knowledge",
        "website-guides/assistant",
        "website-guides/test-and-launch"
      ]
    },
    {
      "type": "category",
      "label": "Product guides",
      "items": [
        "products/crawler",
        "products/brainvault",
        "products/ai-studio",
        "products/workflows",
        "products/dirtbox",
        "products/cms-deployment"
      ]
    },
    {
      "type": "category",
      "label": "Your website",
      "items": [
        "website-guides/platforms",
        "website-guides/wix",
        "website-guides/webflow",
        "website-guides/squarespace",
        "website-guides/bubble",
        "common-tasks/integrations/wix-integration",
        "common-tasks/integrations/webflow-integration",
        "common-tasks/integrations/squarespace-integration",
        "common-tasks/integrations/bubble-integration",
        "common-tasks/integrations/godaddy-airo-integration"
      ]
    },
    {
      "type": "category",
      "label": "Manage and improve",
      "items": [
        "website-guides/maintenance",
        "manage/conversations",
        "manage/workspace"
      ]
    },
    {
      "type": "category",
      "label": "Billing",
      "items": [
        "common-tasks/usage-and-costs/track-costs",
        "common-tasks/usage-and-costs/pay-as-you-go",
        "common-tasks/usage-and-costs/manage-subscription"
      ]
    },
    {
      "type": "category",
      "label": "Help and updates",
      "items": [
        "resources/contact-support",
        "resources/integration-availability",
        "resources/changelog"
      ]
    }
  ]
};
export default sidebars;
