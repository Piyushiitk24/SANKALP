<a name="readme-top"></a>

# SANKALP<sup>®</sup> - Study of Advanced Novel Knowledge And Learning Practices

**Interactive gamified learning platform with engaging lessons, quizzes, and progress tracking across multiple subjects.**

![SANKALP<sup>®</sup> - Interactive gamified learning platform.](/.github/images/img_main.png "SANKALP<sup>®</sup> - Interactive gamified learning platform.")

[![Ask Me Anything!](https://flat.badgen.net/static/Ask%20me/anything?icon=github&color=black&scale=1.01)](https://github.com/Piyushiitk24 "Ask Me Anything!")
[![GitHub license](https://flat.badgen.net/github/license/Piyushiitk24/SANKALP?icon=github&color=black&scale=1.01)](https://github.com/Piyushiitk24/SANKALP/blob/main/LICENSE "GitHub license")
[![Maintenance](https://flat.badgen.net/static/Maintained/yes?icon=github&color=black&scale=1.01)](https://github.com/Piyushiitk24/SANKALP/commits/main "Maintenance")
[![GitHub branches](https://flat.badgen.net/github/branches/Piyushiitk24/SANKALP?icon=github&color=black&scale=1.01)](https://github.com/Piyushiitk24/SANKALP/branches "GitHub branches")
[![Github commits](https://flat.badgen.net/github/commits/Piyushiitk24/SANKALP?icon=github&color=black&scale=1.01)](https://github.com/Piyushiitk24/SANKALP/commits "Github commits")
[![GitHub issues](https://flat.badgen.net/github/issues/Piyushiitk24/SANKALP?icon=github&color=black&scale=1.01)](https://github.com/Piyushiitk24/SANKALP/issues "GitHub issues")
[![GitHub pull requests](https://flat.badgen.net/github/prs/Piyushiitk24/SANKALP?icon=github&color=black&scale=1.01)](https://github.com/Piyushiitk24/SANKALP/pulls "GitHub pull requests")
[![Vercel status](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://sankalp-flax.vercel.app/ "Vercel status")

---

## 🌟 **Latest Updates & Features**

### **🎨 Neon Purple Theme**
- **Complete UI Transformation**: Replaced all green elements with neon purple (#a259ff)
- **Glow Effects**: Added stunning neon purple glow effects to buttons and interactive elements
- **Consistent Theming**: Purple theme applied across all components, modals, and progress indicators

### **🤖 New Mascot Design**
- **Updated Mascot**: Transitioned from `mascot.svg` to `mascotnew.svg` throughout the application
- **Purple-Themed Character**: Mascot now matches the new neon purple brand identity
- **Consistent Usage**: All references updated across UI components and authentication flows

### **👤 Guest User Experience**
- **Continue as Guest**: Users can now explore the platform without creating an account
- **Full Feature Access**: Guest users have access to lessons, quizzes, hearts system, and progress tracking
- **Local Storage**: Guest progress is saved locally for session persistence
- **Easy Upgrade Path**: Clear prompts for guests to create accounts for permanent progress saving

### **💜 Enhanced Hearts System**
- **Instant Refill**: Hearts now refill immediately after watching video ads
- **Improved Modal**: Better UI feedback and loading states during heart refill
- **Real-time Sync**: Fixed synchronization between server and client heart counts
- **Guest Compatible**: Hearts system works seamlessly for both authenticated and guest users

### **🏛️ Professional Branding**
- **Registered Trademark**: Added ® symbol to SANKALP branding
- **Full Form Display**: "Study of Advanced Novel Knowledge And Learning Practices" shown as subtitle
- **Consistent Branding**: Updated across all components, metadata, and documentation
- **SEO Optimization**: Enhanced titles and descriptions for better search visibility

### **🔐 Enhanced Authentication**
- **Clerk Integration**: Beautiful purple-themed authentication modals
- **Custom Theming**: Clerk components styled to match neon purple brand
- **Guest Options**: Authentication flows include guest user alternatives
- **Improved UX**: Seamless login/signup experience with consistent styling

### **🚀 Technical Improvements**
- **Build Optimization**: Zero lint errors and successful builds
- **Type Safety**: Complete TypeScript coverage for all new features
- **Performance**: Optimized database queries for guest and authenticated users
- **Mobile Responsive**: All new features work seamlessly across devices

---

<!-- Table of Contents -->
<details>

<summary>

# :notebook_with_decorative_cover: Table of Contents

</summary>

- [Latest Updates & Features](#-latest-updates--features)
- [Folder Structure](#bangbang-folder-structure)
- [Getting Started](#toolbox-getting-started)
- [Screenshots](#camera-screenshots)
- [Tech Stack](#gear-tech-stack)
- [Core Features](#sparkles-core-features)
- [Stats](#wrench-stats)
- [Contribute](#raised_hands-contribute)
- [Acknowledgements](#gem-acknowledgements)
- [Buy Me a Coffee](#coffee-buy-me-a-coffee)
- [Follow Me](#rocket-follow-me)
- [Learn More](#books-learn-more)
- [Deploy on Vercel](#page_with_curl-deploy-on-vercel)
- [Give A Star](#star-give-a-star)
- [Star History](#star2-star-history)

</details>

## :bangbang: Folder Structure

Here is the folder structure of this app.

```bash
sankalp/
  |- actions/
    |- challenge-progress.ts
    |- user-progress.ts
    |- user-subscription.ts
  |- app/
    |-- (main)/
        |--- courses/
        |--- leaderboard/
        |--- learn/
        |--- quests/
        |--- shop/
        |--- layout.tsx
    |-- (marketing)/
        |--- footer.tsx
        |--- header.tsx
        |--- layout.tsx
        |--- page.tsx
    |-- admin/
        |--- challenge/
        |--- challengeOption/
        |--- course/
        |--- lesson/
        |--- unit/
        |--- app.tsx
        |--- page.tsx
    |-- api/
        |--- challengeOptions/
        |--- challenges/
        |--- courses/
        |--- lessons/
        |--- units/
        |--- webhooks/stripe/
    |-- lesson/
        |--- [lessonId]/
        |--- card.tsx
        |--- challenge.tsx
        |--- footer.tsx
        |--- header.tsx
        |--- layout.tsx
        |--- page.tsx
        |--- question-bubble.tsx
        |--- quiz.tsx
        |--- result-card.tsx
    |-- apple-icon.png
    |-- favicon.ico
    |-- globals.css
    |-- icon1.png
    |-- icon2.png
    |-- layout.tsx
  |- components/
    |-- modals/
    |-- ui/
    |-- feed-wrapper.tsx
    |-- mobile-wrapper.tsx
    |-- mobile-sidebar.tsx
    |-- promo.tsx
    |-- quests.tsx
    |-- sidebar-item.tsx
    |-- sidebar.tsx
    |-- sticky-wrapper.tsx
    |-- user-progress.tsx
  |- config/
    |-- index.ts
  |- db/
    |-- drizzle.ts
    |-- queries.ts
    |-- schema.ts
  |- lib/
    |-- admin.ts
    |-- stripe.ts
    |-- utils.ts
  |- public/
  |- scripts/
    |-- prod.ts
    |-- reset.ts
    |-- seed.ts
  |- store/
    |-- use-exit-modal.ts
    |-- use-hearts-modal.ts
    |-- use-practice-modal.ts
  |- types/
    |-- canvas.ts
  |- .env
  |- .env.example
  |- .eslintrc.js
  |- .gitignore
  |- .prettierrc.json
  |- components.json
  |- constants.ts
  |- drizzle.config.ts
  |- environment.d.ts
  |- middleware.ts
  |- next.config.mjs
  |- package-lock.json
  |- package.json
  |- postcss.config.js
  |- tailwind.config.ts
  |- tsconfig.json
```

<br />

## :toolbox: Getting Started

1. Make sure **Git** and **NodeJS** is installed.
2. Clone this repository to your local computer.
3. Create `.env` file in **root** directory.
4. Contents of `.env`:

```env
# .env

# disabled next.js telemetry
NEXT_TELEMETRY_DISABLED=1

# clerk auth keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
CLERK_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# neon db uri
DATABASE_URL="postgresql://<user>:<password>@<host>:<post>/sankalp?sslmode=require"

# stripe api key and webhook
STRIPE_API_SECRET_KEY=your_stripe_api_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# public app url
NEXT_PUBLIC_APP_URL=http://localhost:3000

# clerk admin user id(s) separated by comma and space (, )
CLERK_ADMIN_IDS="user_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
# or CLERK_ADMIN_IDS="user_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx, user_xxxxxxxxxxxxxxxxxxxxxx" for multiple admins.

```

5. Obtain Clerk Authentication Keys

   1. **Source**: Clerk Dashboard or Settings Page
   2. **Procedure**:
      - Log in to your Clerk account.
      - Navigate to the dashboard or settings page.
      - Look for the section related to authentication keys.
      - Copy the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` provided in that section.

6. Retrieve Neon Database URI

   1. **Source**: Database Provider (e.g., Neon, PostgreSQL)
   2. **Procedure**:
      - Access your database provider's platform or configuration.
      - Locate the database connection details.
      - Replace `<user>`, `<password>`, `<host>`, and `<port>` placeholders in the URI with your actual database credentials.
      - Ensure to include `?sslmode=require` at the end of the URI for SSL mode requirement.

7. Fetch Stripe API Key and Webhook Secret

   1. **Source**: Stripe Dashboard
   2. **Procedure**:
      - Log in to your Stripe account.
      - Navigate to the dashboard or API settings.
      - Find the section related to API keys and webhook secrets.
      - Copy the `STRIPE_API_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.

8. Specify Public App URL

   1. **Procedure**:
      - Replace `http://localhost:3000` with the URL of your deployed application.

9. Identify Clerk Admin User IDs

   1. **Source**: Clerk Dashboard or Settings Page
   2. **Procedure**:
      - Log in to your Clerk account.
      - Navigate to the dashboard or settings page.
      - Find the section related to admin user IDs.
      - Copy the user IDs provided, ensuring they are separated by commas and spaces.

10. Save and Secure:

    - Save the changes to the `.env` file.

11. Install Project Dependencies using `npm install --legacy-peer-deps` or `yarn install --legacy-peer-deps`.

12. Run the Seed Script:

In the same terminal, run the following command to execute the seed script:

```bash
npm run db:push && npm run db:prod
```

This command uses `npm` to execute the Typescript file (`scripts/prod.ts`) and writes challenges data in database.

13. Verify Data in Database:

Once the script completes, check your database to ensure that the challenges data has been successfully seeded.

14. Now app is fully configured 👍 and you can start using this app using either one of `npm run dev` or `yarn dev`.

**NOTE:** Please make sure to keep your API keys and configuration values secure and do not expose them publicly.

## :camera: Screenshots

![Modern UI/UX](/.github/images/img1.png "Modern UI/UX")

![Quests](/.github/images/img2.png "Quests")

![Shop](/.github/images/img3.png "Shop")

## :gear: Tech Stack

[![React JS](https://skillicons.dev/icons?i=react "React JS")](https://react.dev/ "React JS") [![Next JS](https://skillicons.dev/icons?i=next "Next JS")](https://nextjs.org/ "Next JS") [![Typescript](https://skillicons.dev/icons?i=ts "Typescript")](https://www.typescriptlang.org/ "Typescript") [![Tailwind CSS](https://skillicons.dev/icons?i=tailwind "Tailwind CSS")](https://tailwindcss.com/ "Tailwind CSS") [![Vercel](https://skillicons.dev/icons?i=vercel "Vercel")](https://vercel.app/ "Vercel") [![Postgresql](https://skillicons.dev/icons?i=postgres "Postgresql")](https://www.postgresql.org/ "Postgresql")

## 🧭 Architecture & Developer Guide

- Framework: Next.js App Router + TypeScript + Tailwind
- UI vs Logic vs Data:
  - UI components in `components/*` and route UIs in `app/(main)/*`, `app/(marketing)/*`, `app/admin/*`
  - Server actions in `actions/*` (mutations, `revalidatePath` for `/learn`, `/lesson`, `/quests`, `/leaderboard`)
  - Drizzle ORM in `db/*` (`schema.ts`, `queries.ts` with `cache()` + Clerk `auth()`), DB seeding via `scripts/prod.ts`
- Auth & Admin: Clerk themed via `components/theme-aware-clerk-provider.tsx`; admin is gated in `middleware.ts` using `CLERK_ADMIN_IDS` and a route matcher for `/admin`
- Guest Mode: Client-side user in `lib/guest-user.ts` + `hooks/use-guest-user.ts`; UI gated with `components/guest-user-handler.tsx`
  - For guests, `db/queries.getUserProgress()` returns `null`; update guest state in the client via `updateGuestUser()` and a `CustomEvent("guest-user-updated")`
- State: Zustand stores under `store/*` (e.g., hearts/practice/exit modals)
- Payments: Stripe client/server code in `lib/stripe.ts` with webhook handler under `app/api/webhooks/stripe`

### Security & Ops (in practice)
- Security headers + CSP: configured in `next.config.mjs` (extend `script-src`, `connect-src`, `img-src`, `frame-src` if you add providers)
- Middleware (`middleware.ts`): blocks suspicious user agents, prevents path traversal, and restricts `/admin` to IDs from `CLERK_ADMIN_IDS`
- Rate limiting helpers: `lib/rate-limit.ts` (Upstash Redis via `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`); use `withRateLimit` / `withAuthRateLimit` in API routes as needed
- Logging: Winston logs to `logs/combined.log`, `logs/error.log`, `logs/security.log` with rotation (see repo `logs/` directory)
- Theming: Neon purple `#a259ff` via `components/theme-provider.tsx` and Clerk theme in `components/theme-aware-clerk-provider.tsx`

### Developer Commands
- Install: `npm install --legacy-peer-deps`
- Dev: `npm run dev`
- DB: `npm run db:push` (Drizzle push), `npm run db:prod` (seed via `scripts/prod.ts`), optional studio: `npm run db:studio`
- Build/Start: `npm run build` / `npm start`
- Lint/Format: `npm run lint`, `npm run format:fix`

### Environment
Required env keys in `.env` (see examples below and details in this README):
`DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `STRIPE_API_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_APP_URL`, `CLERK_ADMIN_IDS`

## 👤 Guest Mode (summary)

- Continue as guest from marketing or direct `/learn` entry; guest user is auto-created on the client
- Persistence via `localStorage` under key `sankalp_guest_user`; updates broadcast with `CustomEvent("guest-user-updated")`
- Course validation: call `actions/user-progress.selectCourseAsGuest(courseId)` then set `activeCourseId` via `updateGuestUser()`
- Actions pattern: for guests, server actions return lightweight results and the client updates local guest state (e.g., hearts/points)

## 🌓 Dark Mode

- Implemented using `next-themes` and Tailwind dark variants; consistent neon purple accent (#a259ff)
- Toggles available in sidebar, mobile header, and marketing pages; smooth transitions and accessible contrast

## 🧪 Demo Mode

- Feature flag lives in `constants.ts` under `DEMO_MODE.HIDE_PAID_HEART_OPTIONS`
  - `true`: hides paid heart options; keeps “Watch Video to refill hearts” flow (hearts modal auto-opens with video)
  - `false`: shows full shop (points refill + subscription via Stripe)

## :sparkles: Core Features

- **🌍 Multi-Subject Learning**: Comprehensive lessons across various educational topics and subjects
- **🎯 Interactive Lessons**: Engaging lessons with various challenge types and gamified elements
- **💜 Hearts System**: Gamified lives system with video ads for refills
- **🏆 Progress Tracking**: Visual progress bars and streak counters
- **🎁 Shop System**: Purchase hearts and other items with points
- **🔊 Audio Support**: Immersive audio feedback and pronunciation guides
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **👤 Guest Mode**: Try the platform without creating an account
- **🎨 Modern UI**: Beautiful neon purple theme with glow effects
- **⚡ Fast Performance**: Built with Next.js 14 for optimal speed

## :wrench: Stats

[![Stats for SANKALP](/.github/images/stats.svg "Stats for SANKALP")](https://pagespeed.web.dev/analysis?url=https://sankalp-flax.vercel.app/ "Stats for SANKALP")

## :raised_hands: Contribute

You might encounter some bugs while using this app. You are more than welcome to contribute. Just submit changes via pull request and I will review them before merging. Make sure you follow community guidelines.

## :gem: Acknowledgements

Useful resources and dependencies that are used in SANKALP<sup>®</sup>.

- Special Thanks to Kenney Assets: https://kenney.nl/
- Freesound: https://freesound.org/
- Elevenlabs AI: https://elevenlabs.io/
- Flagpack: https://flagpack.xyz/

- [@clerk/nextjs](https://www.npmjs.com/package/@clerk/nextjs): ^4.29.9
- [@neondatabase/serverless](https://www.npmjs.com/package/@neondatabase/serverless): ^0.9.0
- [@radix-ui/react-avatar](https://www.npmjs.com/package/@radix-ui/react-avatar): ^1.0.4
- [@radix-ui/react-dialog](https://www.npmjs.com/package/@radix-ui/react-dialog): ^1.0.5
- [@radix-ui/react-progress](https://www.npmjs.com/package/@radix-ui/react-progress): ^1.0.3
- [@radix-ui/react-separator](https://www.npmjs.com/package/@radix-ui/react-separator): ^1.0.3
- [@radix-ui/react-slot](https://www.npmjs.com/package/@radix-ui/react-slot): ^1.0.2
- [class-variance-authority](https://www.npmjs.com/package/class-variance-authority): ^0.7.0
- [clsx](https://www.npmjs.com/package/clsx): ^2.1.0
- [dotenv](https://www.npmjs.com/package/dotenv): ^16.4.5
- [drizzle-orm](https://www.npmjs.com/package/drizzle-orm): ^0.30.4
- [lucide-react](https://www.npmjs.com/package/lucide-react): ^0.359.0
- [next](https://www.npmjs.com/package/next): 14.2.21
- [next-themes](https://www.npmjs.com/package/next-themes): ^0.3.0
- [ra-data-simple-rest](https://www.npmjs.com/package/ra-data-simple-rest): ^4.16.12
- [react](https://www.npmjs.com/package/react): ^18
- [react-admin](https://www.npmjs.com/package/react-admin): ^4.16.13
- [react-circular-progressbar](https://www.npmjs.com/package/react-circular-progressbar): ^2.1.0
- [react-confetti](https://www.npmjs.com/package/react-confetti): ^6.1.0
- [react-dom](https://www.npmjs.com/package/react-dom): ^18
- [react-use](https://www.npmjs.com/package/react-use): ^17.5.0
- [sonner](https://www.npmjs.com/package/sonner): ^1.4.32
- [stripe](https://www.npmjs.com/package/stripe): ^14.22.0
- [tailwind-merge](https://www.npmjs.com/package/tailwind-merge): ^2.2.2
- [tailwindcss-animate](https://www.npmjs.com/package/tailwindcss-animate): ^1.0.7
- [zustand](https://www.npmjs.com/package/zustand): ^4.5.2

## :coffee: Buy Me a Coffee

[<img src="https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" width="200" />](https://coff.ee/Piyushiitk24 "Buy me a Coffee")

## :rocket: Follow Me

[![Follow Me](https://img.shields.io/github/followers/Piyushiitk24?style=social&label=Follow&maxAge=2592000)](https://github.com/Piyushiitk24 "Follow Me")
[![Tweet about this project](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Ftwitter.com%2Fpiyushiitk24)](https://twitter.com/intent/tweet?text=Check+out+this+amazing+app:&url=https%3A%2F%2Fgithub.com%2FPiyushiitk24%2FSANKALP "Tweet about this project")
[![Subscribe to my YouTube Channel](https://img.shields.io/youtube/channel/subscribers/UCNAz_hUVBG2ZUN8TVm0bmYw)](https://www.youtube.com/@OPGAMER./?sub_confirmation=1 "Subscribe to my YouTube Channel")

## :books: Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## :page_with_curl: Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## :star: Give A Star

You can also give this repository a star to show more people and they can use this repository.

## :star2: Star History

<a href="https://star-history.com/#Piyushiitk24/SANKALP&Timeline">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=Piyushiitk24/SANKALP&type=Timeline&theme=dark" />
  <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=Piyushiitk24/SANKALP&type=Timeline" />
  <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=Piyushiitk24/SANKALP&type=Timeline" />
</picture>
</a>

<br />
<p align="right">(<a href="#readme-top">back to top</a>)</p>
