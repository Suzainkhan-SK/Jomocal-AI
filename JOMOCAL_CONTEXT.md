# Jomocal AI - Platform Context

**Platform Name:** Jomocal AI
**Meaning:** Joy of making operations clever, automated, and localized.

## Core Identity
Jomocal AI is a comprehensive AI automation studio meticulously designed for MSMEs (Micro, Small, and Medium Enterprises), creators, small shop owners, and small businesses. It is purpose-built for the **Indian market**, heavily prioritizing **non-technical users**.

## The Problem It Solves
Other automation platforms like n8n, Zapier, and Make advertise themselves as "no-code" or "low-code" solutions. However, they still require users to possess basic technical skills to build their own integrations and AI agents from scratch. Indian MSMEs and non-technical business owners often lack the time, resources, or technical know-how to wire these complex workflows together.

## The Jomocal AI Solution (The Differentiator)
We bridge this gap by providing **ready-to-use, pre-built automations**. 
Users do not need to build complex flowcharts or connect APIs. Jomocal AI is a genuine **1-click solution** where users browse an automation they need, click "Activate", and the agent starts working for their business instantly. 

We deliver the results of automation without the learning curve of building it.

## Key Automations & Features
Our platform features an "Automations" page where users can discover and activate a variety of out-of-the-box workflows:

1. **YouTube AI Video Automation:** 
   - Users select their content type/topic and click "activate". 
   - The automation handles everything: scriptwriting, media generation, and voiceover, outputting full short videos.
   - It then automatically uploads the finished video directly to the user's connected YouTube channel.
   - Includes various niches (e.g., Mythical Creatures, Islamic Stories, Sci-Fi & Future Worlds).

2. **Lead Hunter:** 
   - An intelligent automation that actively searches for and qualifies leads for the user's business without requiring manual intervention.

3. **AI Customer Support Bot:** 
   - An intelligent stateless customer support agent that businesses can connect immediately to handle their end-user inquiries automatically.

4. **Motion Graphics Generator:** 
   - Allows users to input text describing the desired motion graphic. The logic uses the Gemini API along with Remotion to dynamically render highly advanced motion graphics right on the platform.

## Design Philosophy & Codebase Context
- **Target Audience Mindset:** Simple, outcome-oriented language. The platform must feel localized, trustworthy, and extremely premium.
- **Tech Stack:** React, Remotion (for video rendering), Vite, Javascript/JSX. 
- **Integrations:** Integrates directly with n8n under the hood (for the heavy lifting) via Webhooks, but hides all that complexity from the end-user.
- **UI/UX Standard:** We follow a production-grade SaaS design language (inspired by tools like Stripe, Linear, and Vercel). The application supports both Light and Dark mode optimally. It relies upon sleek micro-animations, vibrant gradients where applicable, and high-quality customized styling rather than basic defaults.

---
*Note to AI Agent: Always use this context when discussing architectural changes, UI/UX updates, or when adding new automation workflows to the platform. Ensure all language and functionality remains accessible and appealing to non-technical Indian MSMEs.*
