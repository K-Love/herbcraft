# 🌿 HerbCraft - AI-Powered Herbal Knowledge Platform

HerbCraft is the first global herbalism platform combining AI-driven personalization, culinary uses, and a vibrant community. Built with modern web technologies and Web3 integration.

## 🚀 Features

### Core Features (MVP)
- **AI Herbal Advisor**: Personalized herb and remedy recommendations
- **Recipe & Remedy Database**: Searchable, curated, and user-contributed content
- **Community Hub**: Forums, Q&A, webinars, and live cook-alongs
- **Affiliate Shop**: Curated herbal products with transparent labeling

### Web3 Features
- **NFT Membership Badges**: Founding Herbalist, Herb Scholar, Master Herbalist
- **$HERB Token System**: Earn tokens for contributions, redeem for perks
- **Provenance Tracking**: Blockchain verification for rare herbs
- **Gamification**: Achievements, staking, and seasonal events

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **CSS Framework**: Tailwind CSS (utility-first)
- **Static Site Generator**: 11ty (Eleventy)
- **Content**: Markdown/JSON files
- **Backend**: Netlify Functions (serverless)
- **Database**: PostgreSQL (Supabase)
- **Search**: Client-side with Lunr.js
- **AI Integration**: OpenAI GPT-4
- **Blockchain**: Polygon (MATIC)
- **Storage**: IPFS for decentralized content
- **Hosting**: Netlify

## 📁 Project Structure

```
herbcraft/
├── src/                    # Source files
│   ├── pages/             # HTML pages
│   ├── styles/            # CSS files
│   ├── scripts/           # JavaScript files
│   └── components/        # Reusable components
├── content/               # Markdown/JSON content
│   ├── herbs/            # Herb profiles
│   ├── recipes/          # Recipe database
│   └── blog/             # SEO content
├── api/                   # Serverless functions
├── contracts/             # Smart contracts
├── public/                # Static assets
├── data/                  # JSON data files
└── tests/                 # Test files
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- Netlify CLI (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/herbcraft.git
cd herbcraft
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. Run development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Serve production build locally
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

### Content Management

Content is managed through Markdown files in the `content/` directory:

- Add herb profiles to `content/herbs/`
- Add recipes to `content/recipes/`
- Add blog posts to `content/blog/`

### API Development

Serverless functions are located in `api/`:

```javascript
// api/hello.js
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from HerbCraft!' })
  };
};
```

## 🌐 Deployment

### Netlify Deployment

1. Connect to GitHub repository
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Set environment variables in Netlify dashboard
4. Deploy!

### Environment Variables

```
OPENAI_API_KEY=your_openai_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
POLYGON_RPC_URL=your_polygon_rpc
CONTRACT_ADDRESS=your_contract_address
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📊 Roadmap

### Phase 1: Foundation (Months 1-2)
- [x] Project setup and architecture
- [ ] Core herb database
- [ ] Basic recipe system
- [ ] Static site generation

### Phase 2: Core Features (Months 3-4)
- [ ] AI Advisor integration
- [ ] User authentication
- [ ] Community forums
- [ ] Search functionality

### Phase 3: Web3 Integration (Months 5-6)
- [ ] Smart contract deployment
- [ ] NFT badge system
- [ ] Token rewards
- [ ] Wallet integration

### Phase 4: Launch (Month 6+)
- [ ] Beta testing
- [ ] Content seeding
- [ ] Marketing campaign
- [ ] Official launch

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 integration
- Polygon for blockchain infrastructure
- The global herbalism community

## 📞 Contact

- Website: [herbcraft.com](https://herbcraft.com)
- Email: hello@herbcraft.com
- Discord: [Join our community](https://discord.gg/herbcraft)

---

Built with 💚 by the HerbCraft team