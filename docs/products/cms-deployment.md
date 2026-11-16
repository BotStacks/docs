---
id: cms-deployment
title: "CMS Deployment: design and add your assistant"
slug: /products/cms-deployment
description: "Customize Bot Design, choose a website installation method, and verify the public BotStacks widget."
---

CMS Deployment connects a tested assistant to the website your visitors use. In the assistant workspace, open **Bot Design**, then follow the **Add to website** flow offered for your platform.

## Design for your visitors
Choose the available widget presentation, branding, and greeting controls. Keep the launcher clear of navigation, purchase buttons, cookie banners, and mobile browser controls. Preview long messages and keyboard interaction, not just the empty chat window.

## Choose your installation guide
- [Wix](/common-tasks/integrations/wix-integration)
- [Webflow](/common-tasks/integrations/webflow-integration)
- [Squarespace](/common-tasks/integrations/squarespace-integration)
- [Bubble](/common-tasks/integrations/bubble-integration)
- [GoDaddy Airo compatibility status](/common-tasks/integrations/godaddy-airo-integration)

Use the installation option actually offered in your workspace. A repository implementation or an editor preview is not confirmation of a public marketplace listing or a working customer installation.

## Use the generated installation details
Copy the generated snippet or installation link for the correct assistant and environment. The widget uses a public **Bot ID**; do not put model-provider keys or account secrets in website code. Keep the script and API origin from the same environment. Install one copy only.

Do not reuse the old webassistant.js example from previous docs. If you already have a working older embed, test the replacement separately and remove the old copy only after the new one is verified.

## Confirm and maintain
Open the published domain in a private window. Test the launcher, a correct response, navigation, phone layout, and closing chat. A “Detected” signal is not the same as a successful conversation.

Record where the embed is installed so you can remove it without disturbing unrelated scripts. Re-test after CMS, theme, consent, or assistant changes.
