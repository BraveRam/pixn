# Pixn 📸

Your images, perfectly organized. **Pixn** is an AI-powered image gallery and search platform that understands your photos better than you do.

[![Homepage](https://img.shields.io/badge/homepage-pixn.vercel.app-red)](https://pixn.vercel.app)
[![Tech Stack](https://img.shields.io/badge/stack-Next.js%20|%20Supabase%20|%20AI-black)](https://github.com/BraveRam/pixn)

## 🚀 Overview

Pixn isn't just an image uploader; it's a smart gallery. Using Google's Gemini model, Pixn automatically generates detailed descriptions for every image you upload. This enables **semantic search**, allowing you to find photos using natural language (e.g., "show me photos of sunset at the beach") instead of just filenames or tags.

## ✨ Key Features

- **AI-Powered Tagging**: Automatically generates rich descriptions for uploaded images.
- **Semantic Search**: Find images using natural language queries powered by vector embeddings.
- **Modern UI/UX**: Sleek, dark-themed interface built with Tailwind CSS 4 and Framer Motion.
- **Secure Authentication**: Built-in user accounts and data protection via Supabase.
- **Optimized Uploads**: Fast, multi-file uploads with a dedicated dashboard.
- **Dynamic Share Links**: Share one or multiple photos using Pixn-hosted URLs.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Backend / Database**: [Supabase](https://supabase.com/) (PostgreSQL + Vector)
- **AI Integration**: [AI SDK](https://sdk.vercel.ai/) routed through the [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) (Google Gemini for descriptions, OpenAI for embeddings)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Package Manager**: [Bun](https://bun.sh/)

## 🏁 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js
- Supabase project with Vector extension enabled
- Gemini API Key

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/BraveRam/pixn.git
   cd pixn
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   AI_GATEWAY_API_KEY=your_vercel_ai_gateway_key
   SHARE_TOKEN_SECRET=your_long_random_secret
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. (Required for image grouping) create grouping tables in Supabase:

   Run `docs/groups-schema.sql` in your Supabase SQL editor.

5. Run the development server:
   ```bash
   bun dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the app in action.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/feature`)
3. Commit your Changes (`git commit -m 'Add some feature'`)
4. Push to the Branch (`git push origin feature/feature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👤 Author

**BraveRam** - [GitHub](https://github.com/BraveRam)

---

Built with ❤️ by [BraveRam](https://github.com/BraveRam)
