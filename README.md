<div align="center">

[<img src="https://capsule-render.vercel.app/api?type=waving&color=0:F4C430,100:D4537E&height=200&section=header&text=Luminary&fontSize=70&fontColor=07070E&fontAlignY=38&desc=Discover%20%26%20Read%20Original%20Ebooks&descAlignY=58&descSize=18&descColor=07070E&animation=fadeIn" />](https://capsule-render.vercel.app/api?type=waving&color=0:F4C430,100:D4537E&height=200&section=header&text=Luminary&fontSize=70&fontColor=07070E&fontAlignY=38&desc=Discover%20%26%20Read%20Original%20Ebooks&descAlignY=58&descSize=18&descColor=07070E&animation=fadeIn)

<p>
  <a href="https://luminary-client.vercel.app/"><img src="https://img.shields.io/badge/Live-Demo-F4C430?style=for-the-badge&logo=vercel&logoColor=07070E" /></a>
  <a href="https://github.com/sahidul-dev-47/luminary-client/stargazers"><img src="https://img.shields.io/github/stars/sahidul-dev-47/luminary-client?style=for-the-badge&color=D4537E" /></a>
  <a href="https://github.com/sahidul-dev-47/luminary-client"><img src="https://img.shields.io/github/last-commit/sahidul-dev-47/luminary-client?style=for-the-badge&color=818CF8" /></a>
</p>

<p>
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white" />
</p>

**[🌐 Live Site](https://luminary-client.vercel.app/)** · **[📦 Repository](https://github.com/sahidul-dev-47/luminary-client)**

</div>

<br/>

## 📚 About Luminary

Traditional ebook reading is locked behind bookstores and publishers. **Luminary** removes that barrier — a full-stack marketplace where readers discover and purchase original ebooks, and independent writers publish directly to a global audience.

Built to demonstrate production-grade MERN/Next.js architecture: **role-based dashboards**, **real Stripe payment flows**, **JWT + Google authentication**, and **live analytics** — wrapped in a polished, recruiter-friendly UI.

<br/>

## ✨ Key Features

<table>
<tr>
<td width="50%" valign="top">

### 🔐 Authentication & Roles
- Email/password + **Google OAuth** login
- JWT-based sessions with secure route protection
- Three roles — **Reader, Writer, Admin** — each with a dedicated dashboard
- Persistent sessions, no unwanted redirect-to-login on reload

### 📖 Browse & Discover
- Search, filter (genre / price / availability), and sort
- Responsive grid — 2 / 3 / 4 columns across breakpoints
- Skeleton loaders and graceful empty/error states
- Pagination for smooth catalog browsing
- Bookmarking to save ebooks for later

</td>
<td width="50%" valign="top">

### 💳 Payments
- **Stripe Checkout** for ebook purchases
- Stripe-powered writer verification fee
- Purchase history and sales records update automatically

### 📊 Dashboards
| Role | Highlights |
|---|---|
| Reader | Purchase history, library, bookmarks, profile |
| Writer | Ebook CRUD, publish control, sales history |
| Admin | User management, ebook moderation, revenue & genre analytics |

</td>
</tr>
</table>

### 🎨 Design & UX
Cohesive color system · fully responsive · global loading states · custom 404 & error boundary · toast notifications · Framer Motion animations throughout

<br/>

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js, React, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose |
| **Auth** | JWT, Better Auth, Google OAuth |
| **Payments** | Stripe |
| **Images** | imgBB |
| **Deployment** | Vercel |

<br/>

## 🚀 Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/sahidul-dev-47/luminary-client.git
cd luminary-client
npm install
```

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_IMGBB_API_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

> 🔒 This is the **client** repository. The Express/MongoDB backend lives in a separate `luminary-server` repository.

<br/>

## 📂 Project Structure

```
luminary-client/
├── src/
│   ├── app/               # Next.js App Router pages
│   ├── components/        # Reusable UI components
│   ├── lib/                # API clients, auth helpers
│   └── data/                # Static/shared data
├── public/                  # Static assets
├── next.config.mjs
└── package.json
```

<br/>

## 🗺️ Roadmap

- [ ] Wishlist system with a dedicated wishlist page
- [ ] Simulated email notifications on purchase/publish
- [ ] Persistent dark mode toggle
- [ ] AI-powered ebook recommendations

<br/>

## 📬 Contact

<div align="center">

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sahidul-islam-)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sahidul-dev-47)

</div>

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:D4537E,100:F4C430&height=100&section=footer" />

</div>
