# ROBROUX — Cyber Chrome Next.js App

## Folder Structure

```
robroux/
├── app/
│   ├── layout.js          # Root layout (Navbar + Footer)
│   ├── page.js            # Home page (hero + login)
│   ├── globals.css        # All custom cyber-chrome styles
│   └── dashboard/
│       └── page.js        # Dashboard page
├── components/
│   ├── Navbar.js
│   └── Footer.js
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── jsconfig.json
└── package.json
```

## Setup

```bash
npm install
npm run dev
```

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

## Adding Your Logo

In `components/Navbar.js`, find this comment:

```jsx
{/* Replace above with: <img src="/logo.png" alt="ROBROUX Logo" className="h-9 w-auto" /> */}
```

Place your `logo.png` in the `/public` folder and swap the `<span>` tag for the `<img>` tag shown in the comment.

## How the Cookie Auth Works

- `js-cookie` saves `roblox_username` as a 7-day browser cookie on login.
- Dashboard reads the cookie on mount; if missing, redirects home.
- Logout button clears the cookie and redirects home.

> **Note**: This is a frontend-only cookie session — no server-side auth.
> For production, replace with NextAuth.js or a real auth provider.
