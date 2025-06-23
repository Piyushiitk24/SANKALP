# Gamification_Quiz - Interactive platform for language learning.

![Gamification_Quiz - Interactive platform for language learning.](/.github/images/img_main.png "Gamification_Quiz - Interactive platform for language learning.")

[![Ask Me Anything!](https://flat.badgen.net/static/Ask%20me/anything?icon=github&color=black&scale=1.01)](https://github.com/Piyushiitk24 "Ask Me Anything!")
[![GitHub license](https://flat.badgen.net/github/license/Piyushiitk24/Gamification_Quiz?icon=github&color=black&scale=1.01)](https://github.com/Piyushiitk24/Gamification_Quiz/blob/main/LICENSE "GitHub license")
[![Maintenance](https://flat.badgen.net/static/Maintained/yes?icon=github&color=black&scale=1.01)](https://github.com/Piyushiitk24/Gamification_Quiz/commits/main "Maintenance")
[![GitHub branches](https://flat.badgen.net/github/branches/Piyushiitk24/Gamification_Quiz?icon=github&color=black&scale=1.01)](https://github.com/Piyushiitk24/Gamification_Quiz/branches "GitHub branches")
[![Github commits](https://flat.badgen.net/github/commits/Piyushiitk24/Gamification_Quiz?icon=github&color=black&scale=1.01)](https://github.com/Piyushiitk24/Gamification_Quiz/commits "Github commits")
[![GitHub issues](https://flat.badgen.net/github/issues/Piyushiitk24/Gamification_Quiz?icon=github&color=black&scale=1.01)](https://github.com/Piyushiitk24/Gamification_Quiz/issues "GitHub issues")
[![GitHub pull requests](https://flat.badgen.net/github/prs/Piyushiitk24/Gamification_Quiz?icon=github&color=black&scale=1.01)](https://github.com/Piyushiitk24/Gamification_Quiz/pulls "GitHub pull requests")
[![Vercel status](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://gamification-quiz.vercel.app/ "Vercel status")

<!-- Table of Contents -->
<details>
<summary>
# :notebook_with_decorative_cover: Table of Contents
</summary>

- [Folder Structure](#bangbang-folder-structure)
- [Getting Started](#toolbox-getting-started)
- [Screenshots](#camera-screenshots)
- [Tech Stack](#gear-tech-stack)
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
Gamification_Quiz/
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

## :toolbox: Getting Started

This section explains how to set up and run the Lingo app on your computer. These steps are designed for beginners, with clear instructions to avoid confusion. You’ll need a computer (Mac, Windows, or Linux) and an internet connection.

### Things You Need Before Starting

1. **Git**: A tool to download the project.
   - Check if it’s installed by opening a terminal (on Mac/Linux) or Command Prompt (on Windows) and typing:
     ```bash
     git --version
     ```
   - If you see a version number (e.g., `git version 2.39.5`), you’re good. If not, download and install Git from [git-scm.com](https://git-scm.com/). Follow the default installation options.

2. **Node.js**: A program to run the app’s code.
   - We recommend Node.js version 18, which works well with this project.
   - Check your version:
     ```bash
     node -v
     ```
   - If it shows `v18.x.x` (e.g., `v18.20.8`), you’re set. If not, or if Node.js isn’t installed, use a tool called `nvm` (Node Version Manager) to get the right version:
     - Open your terminal and run:
       ```bash
       curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
       ```
     - Close and reopen your terminal, or run:
       ```bash
       source ~/.bashrc  # On Mac/Linux, or ~/.zshrc if you use zsh
       ```
     - Install Node.js 18:
       ```bash
       nvm install 18
       nvm use 18
       ```
     - Check again:
       ```bash
       node -v  # Should show ~v18.x.x
       npm -v   # Should show ~v10.x.x (npm comes with Node.js)
       ```
   - If you prefer not to use `nvm`, download Node.js 18 from [nodejs.org](https://nodejs.org/en/download).

3. **Online Accounts**:
   - You’ll need accounts for three services to make the app work:
     - **Clerk**: Handles user login (sign-in/sign-up).
     - **Neon**: Stores the app’s data (like lessons and quizzes).
     - **Stripe**: Manages payments (e.g., for in-app purchases).
   - Sign up for free accounts at:
     - [Clerk](https://dashboard.clerk.com/)
     - [Neon](https://neon.tech/)
     - [Stripe](https://dashboard.stripe.com/)
   - You’ll get special keys from these services later to connect the app.

### Step-by-Step Setup

Follow these steps exactly to run the app. If you get stuck, check the “Troubleshooting” section at the end.

1. **Download the Project**:
   - Open your terminal (or Command Prompt on Windows).
   - Go to a folder where you want to store the project (e.g., `Documents`):
     ```bash
     cd ~/Documents
     ```
   - Download the project:
     ```bash
     git clone https://github.com/Piyushiitk24/Gamification_Quiz.git
     ```
   - Move into the project folder:
     ```bash
     cd Gamification_Quiz
     ```

2. **Set Up the `.env` File**:
   - The app needs a file called `.env` to store secret keys (like passwords for Clerk, Neon, and Stripe).
   - In the `Gamification_Quiz` folder, create a file named `.env`. On Mac/Linux, you can use:
     ```bash
     touch .env
     ```
     On Windows, create it using a text editor (e.g., Notepad) and save it as `.env`.
   - Open `.env` in a text editor and paste the following:
     ```env
     # .env
     NEXT_TELEMETRY_DISABLED=1
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
     CLERK_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
     DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/gamification_quiz?sslmode=require"
     STRIPE_API_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
     STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
     NEXT_PUBLIC_APP_URL=http://localhost:3000
     CLERK_ADMIN_IDS="user_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
     ```
   - **Fill in the Keys**:
     - **Clerk Keys**:
       - Go to [Clerk Dashboard](https://dashboard.clerk.com/).
       - Sign in and click **API Keys** (usually in the sidebar).
       - Copy the **Publishable Key** (starts with `pk_test_`) and paste it into `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
       - Copy the **Secret Key** (starts with `sk_test_`) and paste it into `CLERK_SECRET_KEY`.
       - Click **Users** in the dashboard, find your admin user (e.g., your account), and copy the user ID (starts with `user_`). Paste it into `CLERK_ADMIN_IDS`. If you have multiple admins, separate IDs with a comma and space (e.g., `user_xxx, user_yyy`).
     - **Neon Database URL**:
       - Go to [Neon Dashboard](https://console.neon.tech/).
       - Sign in, create a new project, and name the database `gamification_quiz`.
       - In the project’s dashboard, find the **Connection String** (looks like `postgresql://user:password@host:port/gamification_quiz?sslmode=require`).
       - Copy and paste it into `DATABASE_URL`, replacing `<user>`, `<password>`, `<host>`, and `<port>` with the values from Neon.
     - **Stripe Keys**:
       - Go to [Stripe Dashboard](https://dashboard.stripe.com/).
       - Sign in and click **Developers** > **API Keys**.
       - Copy the **Secret Key** (starts with `sk_test_`) and paste it into `STRIPE_API_SECRET_KEY`.
       - Go to **Developers** > **Webhooks**, click **Add endpoint**, and enter `http://localhost:3000/api/webhooks/stripe` as the URL. Copy the webhook secret (starts with `whsec_`) and paste it into `STRIPE_WEBHOOK_SECRET`.
     - **App URL**: Keep `NEXT_PUBLIC_APP_URL=http://localhost:3000` for now. If you deploy the app later (e.g., to Vercel), change it to the deployed URL (e.g., `https://gamification-quiz.vercel.app`).
   - Save the `.env` file. Don’t share it with anyone—it’s like a password!

3. **Install the App’s Tools**:
   - In the `Gamification_Quiz` folder, run:
     ```bash
     npm install --legacy-peer-deps
     ```
   - This downloads all the tools the app needs (like Next.js, Clerk, and others). It might take a minute or two.
   - If you see errors, try:
     ```bash
     rm -rf node_modules package-lock.json
     npm install --legacy-peer-deps
     ```
   - This clears old files and tries again.

4. **Check for Security Issues**:
   - After installing, you might see a message like “15 vulnerabilities.” This means some tools have known issues, but most are safe for local use.
   - To check:
     ```bash
     npm audit
     ```
   - To fix small issues:
     ```bash
     npm audit fix
     ```
   - If you see “critical” issues, don’t worry for now—you can still run the app locally. If you plan to share the app online, ask for help to fix these.

5. **Set Up the Database**:
   - The app uses a database to store lessons and quizzes. Run this command to set it up:
     ```bash
     npm run db:push && npm run db:prod
     ```
   - This does two things:
     - Creates the database structure (like empty folders for lessons).
     - Adds sample data (like example quizzes).
   - **Check It Worked**:
     - Go to [Neon Dashboard](https://console.neon.tech/).
     - Look at your `gamification_quiz` database. You should see tables like `challenges`, `units`, and `lessons` with data in them.
     - If you don’t see data, make sure your `DATABASE_URL` in `.env` is correct and try the command again.

6. **Run the App**:
   - Start the app:
     ```bash
     npm run dev
     ```
   - This launches the app on your computer. Wait a moment—it’ll say something like “ready - started server on http://localhost:3000”.
   - Open your web browser (Chrome, Firefox, etc.) and go to:
     ```
     http://localhost:3000
     ```
   - You should see the Gamification Quiz app’s homepage!

7. **Test the App**:
   - Try these pages:
     - **Homepage** (`http://localhost:3000`): Should load without signing in.
     - **Learn** (`http://localhost:3000/learn`): You’ll need to sign in with Clerk. Follow the sign-in prompt.
     - **Admin** (`http://localhost:3000/admin`): Only works if you’re signed in as an admin (from `CLERK_ADMIN_IDS`).
     - **Shop**: Try buying something (in test mode) to check Stripe payments.
   - If anything doesn’t work, see “Troubleshooting” below.

8. **Troubleshooting**:
   - **App Won’t Start**:
     - Check the terminal for errors. Common issues:
       - Wrong `.env` keys: Double-check `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `DATABASE_URL`, etc.
       - Node.js version: Ensure `node -v` shows `v18.x.x`.
       - Run `npm install --legacy-peer-deps` again.
   - **Sign-In Fails**:
     - Verify Clerk keys in `.env`. Ensure Clerk’s dashboard shows your app as active.
   - **Database Errors**:
     - Confirm `DATABASE_URL` matches Neon’s connection string. Retry `npm run db:push`.
   - **Payment Issues**:
     - Check `STRIPE_WEBHOOK_SECRET`. Ensure the webhook URL is `http://localhost:3000/api/webhooks/stripe` in Stripe’s dashboard.
   - **Still Stuck?**:
     - Copy the error message from the terminal or browser and ask for help (e.g., on GitHub issues or a forum).

**Important**: Never share your `.env` file or keys publicly. They’re like passwords for your app.

## :camera: Screenshots

![Modern UI/UX](/.github/images/img1.png "Modern UI/UX")

![Quests](/.github/images/img2.png "Quests")

![Shop](/.github/images/img3.png "Shop")

## :gear: Tech Stack

[![React JS](https://skillicons.dev/icons?i=react "React JS")](https://react.dev/ "React JS") [![Next JS](https://skillicons.dev/icons?i=next "Next JS")](https://nextjs.org/ "Next JS") [![Typescript](https://skillicons.dev/icons?i=ts "Typescript")](https://www.typescriptlang.org/ "Typescript") [![Tailwind CSS](https://skillicons.dev/icons?i=tailwind "Tailwind CSS")](https://tailwindcss.com/ "Tailwind CSS") [![Vercel](https://skillicons.dev/icons?i=vercel "Vercel")](https://vercel.app/ "Vercel") [![Postgresql](https://skillicons.dev/icons?i=postgres "Postgresql")](https://www.postgresql.org/ "Postgresql")

## :wrench: Stats

[![Stats for Gamification_Quiz](/.github/images/stats.svg "Stats for Gamification_Quiz")](https://pagespeed.web.dev/analysis?url=https://gamification-quiz.vercel.app/ "Stats for Gamification_Quiz")

## :raised_hands: Contribute

You might encounter bugs while using this app. You are welcome to contribute via pull requests. Ensure you follow community guidelines.

## :gem: Acknowledgements

Useful resources and dependencies used in Lingo:

- Kenney Assets: [kenney.nl](https://kenney.nl/)
- Freesound: [freesound.org](https://freesound.org/)
- Elevenlabs AI: [elevenlabs.io](https://elevenlabs.io/)
- Flagpack: [flagpack.xyz](https://flagpack.xyz/)

Dependencies:
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
- [next](https://www.npmjs.com/package/next): ^14.2.21
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

[<img src="https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" width="200" />](https://coff.ee/piyushiitk24 "Buy me a Coffee")

## :rocket: Follow Me

[![Follow Me](https://img.shields.io/github/followers/Piyushiitk24?style=social&label=Follow&maxAge=2592000)](https://github.com/Piyushiitk24 "Follow Me")
[![Tweet about this project](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Ftwitter.com%2Fpiyushiitk24)](https://twitter.com/intent/tweet?text=Check+out+this+amazing+app:&url=https%3A%2F%2Fgithub.com%2FPiyushiitk24%2FGamification_Quiz "Tweet about this project")
[![Subscribe to my YouTube Channel](https://img.shields.io/youtube/channel/subscribers/UCNAz_hUVBG2ZUN8TVm0bmYw)](https://www.youtube.com/@piyushiitk24/?sub_confirmation=1 "Subscribe to my YouTube Channel")

## :books: Learn More

To learn more about Next.js, check out:
- [Next.js Documentation](https://nextjs.org/docs) - Features and API.
- [Learn Next.js](https://nextjs.org/learn) - Interactive tutorial.
- [Next.js GitHub](https://github.com/vercel/next.js/) - Feedback and contributions welcome!

## :page_with_curl: Deploy on Vercel

Deploy easily with the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme). See [Next.js deployment documentation](https://nextjs.org/docs/deployment) for details.

## :star: Give A Star

Star this repository to share it with others!

## :star2: Star History

<a href="https://star-history.com/#Piyushiitk24/Gamification_Quiz&Timeline">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=Piyushiitk24/Gamification_Quiz&type=Timeline&theme=dark" />
  <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=Piyushiitk24/Gamification_Quiz&type=Timeline" />
  <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=Piyushiitk24/Gamification_Quiz&type=Timeline" />
</picture>
</a>

---
**Author**: Piyush Tiwari
**Email**: [piyushiitk24@gmail.com](mailto:piyushiitk24@gmail.com)  
**GitHub**: [Piyushiitk24](https://github.com/Piyushiitk24)

<br />
<p align="right">(<a href="#readme-top">back to top</a>)</p>