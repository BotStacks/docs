---
id: workflows
title: "Build and publish conversation workflows"
slug: /products/workflows
description: "Use the current BotStacks workflow steps, topic routes, validation, and draft-to-publish controls."
---

Open **Assistants → your assistant → Workflows**. The canvas shows the conversation flow for that assistant. Keep the first version small: Start → Answer from knowledge → End is the starter pattern.

## Current step types
| Step | What it is for |
| --- | --- |
| Start | Entry point; exactly one per flow |
| Split by topic | Route a question using configured topic keywords and paths |
| Set reply | Use a fixed reply you provide |
| AI reply | Generate a response using the step's instructions |
| Answer from knowledge | Respond using information added to the assistant |
| Pass to your team | Use the handoff path; verify the destination and staffing separately |
| End | Finish the path, optionally with a closing message |

## Build a path
Add the needed steps and connect them. Give topic routes clear names and relevant keywords. Connect a fallback route for questions that do not match the intended topics. Provide reply text for fixed replies.

Do not substitute unrelated old node names or copied node IDs. Use the steps offered in the current canvas. Workflow behavior and external tool access are separate concerns.

## Save, validate, and publish
**Save** stores the draft. **Publish** changes the live workflow. Resolve validation errors before publishing: the flow needs exactly one Start, Start must connect to one next step, End cannot connect onward, and references to deleted steps must be corrected. Review disconnected-step warnings as well.

Test every topic, its fallback, a missing-information question, and the team-handoff path. A handoff response does not itself prove that a staff member received a notification.

## Change safely
Keep the previous behavior documented. Use the available unpublish controls when appropriate and verify the resulting public behavior. Do not assume unpublishing a workflow removes the website widget.

Next: [DIRTbox tests](/products/dirtbox) and [launch checks](/website-guides/test-and-launch).
