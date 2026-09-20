# Bharath Kumar — Portfolio Website

> **UI Engineer & Enterprise Accessibility Architecture Specialist**  
> Bengaluru, India • [LinkedIn Profile](https://www.linkedin.com/in/bharath2297) • [Email Contact](mailto:bharathkumar22971997@gmail.com)

A modern, accessible, and interactive developer portfolio showcasing 6.3+ years of enterprise UI engineering, WCAG 2.1/2.2 AA compliance leadership, live interactive prototypes, and generative AI workflow acceleration.

---

## 🚀 Deploy to GitHub Pages (2 Methods)

Because this is a modern React + Vite + TypeScript application, it compiles into static files in `dist/`. Choose either of the two standard deployment methods below:

### Method 1: GitHub Actions (Recommended — 100% Automated)

A pre-configured GitHub Actions workflow is already included in `.github/workflows/deploy.yml`. Whenever you push to `main`, GitHub will automatically install dependencies, build the app, and deploy it.

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: setup GitHub Pages deployment"
   git push origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** (top navigation tab)
   - On the left sidebar, click **Pages**
   - Under **Build and deployment** > **Source**, choose **GitHub Actions**
3. That's it! GitHub Actions will automatically run the build and publish your site. You can track progress in the **Actions** tab.

---

### Method 2: 1-Command Deploy via `gh-pages`

You can also deploy directly from your local terminal with one command:

1. Ensure your git remote is set:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   ```
2. Run the deploy script:
   ```bash
   npm run deploy
   ```
   *(This automatically runs `npm run build` and pushes the `dist` folder to the `gh-pages` branch on GitHub).*
3. In your GitHub repository:
   - Go to **Settings** > **Pages**
   - Under **Build and deployment** > **Source**, select **Deploy from a branch**
   - Choose branch **`gh-pages`** and folder **`/ (root)`**, then click **Save**.
4. Your site will be live at `https://<your-username>.github.io/<your-repo-name>/`!

---

## 📂 Repository File Structure

```text
├── index.html          # Primary production application (All styles, scripts, UI & interactive tools)
├── .nojekyll           # Bypasses Jekyll processing on GitHub Pages
├── README.md           # Documentation and deployment setup guide
├── package.json        # Project metadata and local preview tooling
├── vite.config.ts      # Optional Vite preview configuration
├── tsconfig.json       # TypeScript configuration
└── metadata.json       # Application metadata & permissions
```

---

## 💻 Local Development (Optional)

If you wish to run the app locally with Node.js and Vite:

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build
```

---

## ✨ Features Included
- **Live Interactive Prototypes**: Built-in WCAG 2.2 AA Keyboard Trap Remediator, Color Contrast Checker (APCA & WCAG AA/AAA), Live Screen Reader DOM Inspector, Responsive Breakpoint Simulator, and Accessible Component Library.
- **Enterprise Career Milestones**: ZeOmega Infotech, MindMap Consulting, TotalAI Systems, and Sri Eshwar College of Engineering.
- **Modern Portfolio Animations**: Top scroll reading progress indicator, smooth scroll-reveal effects, cursor-tracking spotlight card glow, and ScrollSpy navigation.
- **Integrated Resume Center**: High-contrast interactive CV preview modal, print-to-PDF formatting, and one-click Markdown (`.md`) download.
- **LinkedIn & Professional Verification**: Direct links to [linkedin.com/in/bharath2297](https://www.linkedin.com/in/bharath2297) and Google AI Professional Certification verification.
- **Accessibility First**: WCAG 2.1/2.2 AA compliant, keyboard navigable, screen-reader optimized, and supports `prefers-reduced-motion`.
