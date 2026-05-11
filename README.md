# Photon Robot Hub

Frontend prototype for Photon Laser Manufacturing Company to manage robot routine checks, robot information, important updates, documentation, analytics, maintenance notes, and operator conversations.

## Demo Users

The app currently uses demo users instead of real authentication. On the login page, choose a user from the **Demo user** dropdown, then click **Login**.

Available demo roles:

- `Operator`: daily routine checks, robot updates, messages, and robot documentation.
- `Supervisor`: operator pages plus analytics, history, maintenance, and documentation management.
- `Admin`: supervisor pages plus admin tools.

The selected demo user is saved in the browser with `localStorage`, so refreshing the page keeps the same role.

Demo users are defined in [src/data/currentUser.ts](src/data/currentUser.ts).

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Push To GitHub

From the project folder:

```bash
git init
git add .
git commit -m "Initial Photon Robot Hub app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Do not commit `node_modules` or `dist`; they are already ignored in `.gitignore`.

## Free Hosting Options

Recommended: **Vercel** or **Netlify**. Both are simple for a Vite React app.

### Vercel

1. Push the project to GitHub.
2. Go to `https://vercel.com`.
3. Import the GitHub repository.
4. Use these settings:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
5. Deploy.

### Netlify

1. Push the project to GitHub.
2. Go to `https://netlify.com`.
3. Add a new site from GitHub.
4. Use these settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy.

## Notes

This is currently a frontend prototype. Created updates, documents, confirmations, selected demo user, and conversations are stored in browser `localStorage`. For production, these should move to a backend database with real user authentication and role permissions.
