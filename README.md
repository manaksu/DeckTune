# DeckTune — Steam Deck Optimizer

## Deploy to Vercel

### Step 1 — Upload to GitHub
Create a new GitHub repo, upload all files from this folder.

### Step 2 — Import to Vercel
vercel.com → Add New → Project → Import from GitHub → select repo → Deploy

### Step 3 — Add API key
Vercel → Settings → Environment Variables:
  Name:  ANTHROPIC_API_KEY
  Value: sk-ant-...

Then redeploy.

## Folder structure
decktune-vercel/
├── index.html       ← the app
├── vercel.json      ← routing
└── api/
    ├── claude.js    ← Anthropic API proxy
    └── steam.js     ← Steam search proxy
