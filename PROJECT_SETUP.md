# HerbCraft Project Setup Guide

## Initial Setup Commands

Run these commands to set up the project:

```bash
# Initialize Git
git init

# Create .gitignore file with this content:
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-error.log*
package-lock.json

# Environment variables
.env
.env.local
.env.production

# Build outputs
dist/
build/
.cache/
.tmp/

# IDE files
.vscode/
.idea/
*.swp
*.swo
.DS_Store

# Test coverage
coverage/
.nyc_output/

# Logs
logs/
*.log

# Temporary files
tmp/
temp/

# Netlify
.netlify/

# Web3
artifacts/
cache/
typechain/

# IPFS
.ipfs/
EOF

# Create project structure
mkdir -p src/{pages,styles,scripts,components}
mkdir -p content/{herbs,recipes,blog,remedies}
mkdir -p api
mkdir -p public/{images,fonts,icons}
mkdir -p data
mkdir -p contracts
mkdir -p tests
mkdir -p scripts

# Create package.json
cat > package.json << 'EOF'
{
  "name": "herbcraft",
  "version": "0.1.0",
  "description": "AI-powered herbal knowledge platform",
  "main": "index.js",
  "scripts": {
    "dev": "eleventy --serve",
    "build": "eleventy",
    "serve": "eleventy --serve",
    "test": "jest",
    "lint": "eslint src/**/*.js",
    "format": "prettier --write \"**/*.{js,json,md,css,html}\""
  },
  "keywords": ["herbs", "wellness", "ai", "web3"],
  "author": "HerbCraft Team",
  "license": "MIT",
  "devDependencies": {
    "@11ty/eleventy": "^2.0.1",
    "eslint": "^8.57.0",
    "jest": "^29.7.0",
    "prettier": "^3.2.5"
  },
  "dependencies": {
    "dotenv": "^16.4.5"
  }
}
EOF

# Create .eleventy.js configuration
cat > .eleventy.js << 'EOF'
module.exports = function(eleventyConfig) {
  // Copy static files
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy("src/scripts");
  eleventyConfig.addPassthroughCopy("public");
  
  // Watch targets
  eleventyConfig.addWatchTarget("src/styles/");
  eleventyConfig.addWatchTarget("src/scripts/");
  
  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data"
    },
    templateFormats: ["html", "md", "njk"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
EOF

# Create environment example
cat > .env.example << 'EOF'
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Web3
POLYGON_RPC_URL=https://polygon-rpc.com
CONTRACT_ADDRESS=0x...

# Analytics
GA_TRACKING_ID=UA-XXXXXXXXX-X

# Netlify
NETLIFY_SITE_ID=your_site_id
EOF

# Create initial HTML template
cat > src/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HerbCraft - AI-Powered Herbal Knowledge Platform</title>
    <meta name="description" content="Discover the world of herbs with AI-powered recommendations, recipes, and a vibrant community.">
    <link rel="stylesheet" href="/styles/main.css">
</head>
<body>
    <h1>Welcome to HerbCraft</h1>
    <p>Your AI-powered herbal knowledge platform</p>
    <script src="/scripts/main.js"></script>
</body>
</html>
EOF

# Create main CSS file
cat > src/styles/main.css << 'EOF'
/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
}
EOF

# Create main JavaScript file
cat > src/scripts/main.js << 'EOF'
// Main JavaScript file
console.log('Welcome to HerbCraft!');
EOF

# Initialize npm and install dependencies
npm init -y
npm install

# Initialize Git and make first commit
git add .
git commit -m "Initial commit: Project setup"
```

## Project Structure Explanation

### `/src` - Source Files
- **`/pages`** - HTML pages and templates
- **`/styles`** - CSS files (will use Tailwind CSS)
- **`/scripts`** - JavaScript files (vanilla JS)
- **`/components`** - Reusable HTML/JS components
- **`/_includes`** - Eleventy includes (partials)
- **`/_layouts`** - Eleventy layout templates
- **`/_data`** - Global data files for Eleventy

### `/content` - Content Management
- **`/herbs`** - Markdown files for herb profiles
- **`/recipes`** - Recipe content in Markdown
- **`/blog`** - Blog posts for SEO
- **`/remedies`** - Natural remedy guides

### `/api` - Serverless Functions
- Netlify Functions for backend logic
- AI integration endpoints
- Authentication handlers
- Web3 interactions

### `/public` - Static Assets
- **`/images`** - Image assets
- **`/fonts`** - Custom fonts
- **`/icons`** - Icon files

### `/data` - JSON Data Files
- Structured data for herbs
- Recipe databases
- Configuration files

### `/contracts` - Smart Contracts
- Solidity contracts
- Deployment scripts
- Contract ABIs

### `/tests` - Test Files
- Unit tests
- Integration tests
- E2E tests

### `/scripts` - Build Scripts
- Content generation
- SEO optimization
- Deployment scripts

## Next Steps

1. **Switch to Code Mode** to implement the file structure
2. **Set up Tailwind CSS** for styling
3. **Configure Eleventy** for static site generation
4. **Create base templates** and components
5. **Implement Git workflow** and GitHub repository

## Development Workflow

1. **Local Development**
   ```bash
   npm run dev
   # Opens http://localhost:8080
   ```

2. **Building for Production**
   ```bash
   npm run build
   # Creates optimized build in /dist
   ```

3. **Testing**
   ```bash
   npm test
   ```

4. **Linting & Formatting**
   ```bash
   npm run lint
   npm run format
   ```

## Git Workflow

1. **Feature Development**
   ```bash
   git checkout -b feature/feature-name
   # Make changes
   git add .
   git commit -m "feat: add feature description"
   git push origin feature/feature-name
   ```

2. **Commit Convention**
   - `feat:` - New features
   - `fix:` - Bug fixes
   - `docs:` - Documentation
   - `style:` - Code style changes
   - `refactor:` - Code refactoring
   - `test:` - Test updates
   - `chore:` - Build/config updates

## Deployment

### Netlify Setup

1. Connect GitHub repository
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Environment variables in Netlify UI
4. Deploy!

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml` for automated deployment:

```yaml
name: Deploy to Netlify

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: netlify/actions/deploy@v1
        with:
          prod: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}