---
id: dirtbox
title: "DIRTbox: test and improve assistant answers"
slug: /products/dirtbox
description: "Test questions, review source evidence, correct weak replies, and save regression tests before releasing a BotStacks assistant."
---

DIRTbox is the workspace's **test and train** area. Choose the correct assistant before asking a question or saving a correction. Use the same questions your visitors ask, with an expected answer and an approved source for each.

## Test a reply
Ask a concrete question. Read the response and any source evidence shown. Judge accuracy, clarity, and whether the next step is useful. A fluent reply is not sufficient if it invents a price, policy, or action.

## Improve a weak answer
Use the correction controls available on the reply. Review what will be saved before applying it. A knowledge correction should contain the approved answer, not a polished copy of an incorrect response.

Where available, **Looks good**, **Fix this answer**, and **Save as test** support reviewing replies, making corrections, and retaining regression cases. Changes must be saved successfully; an unsaved draft is not a durable correction.

## Re-test after changes
Run the original question, a paraphrase, and a question that should not match the new answer. Select the same assistant when reviewing saved cases. Keep a short record of expected source, actual reply, and pass/fail outcome.

## Interpret results carefully
A passing test is evidence for that test and configuration, not a guarantee of every future answer. Knowledge can change independently. Do not assume testing creates an immutable knowledge snapshot or automatically publishes your assistant.

## Before customers see it
Verify the intended assistant and configuration, complete the [launch checklist](/website-guides/test-and-launch), and test on the published CMS domain. Editor previews and internal tests do not prove public deployment.

Next: [Design and deploy](/products/cms-deployment).
