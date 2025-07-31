# HerbCraft Component Hierarchy & Page Structure

## Page Structure

### Public Pages
```
/                           # Homepage
/herbs                      # Herb directory
/herbs/[slug]              # Individual herb profile
/recipes                   # Recipe directory
/recipes/[slug]            # Individual recipe
/remedies                  # Natural remedies
/community                 # Community hub
/community/posts/[id]      # Individual post
/ai-advisor                # AI Herbal Advisor
/learn                     # Educational content
/about                     # About HerbCraft
/shop                      # Affiliate products
```

### User Pages (Authenticated)
```
/dashboard                 # User dashboard
/profile                   # User profile
/profile/edit             # Edit profile
/journals                  # User journals
/journals/[id]            # Individual journal
/saved                    # Saved herbs/recipes
/settings                 # User settings
```

### Web3 Pages
```
/mint-badge               # Mint NFT badges
/rewards                  # Token rewards dashboard
/wallet                   # Wallet management
/provenance              # Herb provenance tracking
```

## Component Architecture (Vanilla JS)

### Core Components

#### 1. Layout Components
```javascript
// components/Header.js
class Header {
  constructor() {
    this.element = null;
    this.isAuthenticated = false;
    this.walletConnected = false;
  }
  
  render() {
    return `
      <header class="header">
        <nav class="nav">
          <div class="nav-brand">
            <a href="/">🌿 HerbCraft</a>
          </div>
          <ul class="nav-menu">
            <li><a href="/herbs">Herbs</a></li>
            <li><a href="/recipes">Recipes</a></li>
            <li><a href="/community">Community</a></li>
            <li><a href="/ai-advisor">AI Advisor</a></li>
          </ul>
          <div class="nav-actions">
            ${this.renderAuthSection()}
          </div>
        </nav>
      </header>
    `;
  }
}

// components/Footer.js
class Footer {
  render() {
    return `
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-section">
            <h3>Explore</h3>
            <ul>
              <li><a href="/herbs">Herb Database</a></li>
              <li><a href="/recipes">Recipes</a></li>
              <li><a href="/remedies">Natural Remedies</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h3>Community</h3>
            <ul>
              <li><a href="/community">Forums</a></li>
              <li><a href="/learn">Learn</a></li>
              <li><a href="/about">About Us</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h3>Web3</h3>
            <ul>
              <li><a href="/mint-badge">NFT Badges</a></li>
              <li><a href="/rewards">$HERB Rewards</a></li>
              <li><a href="/provenance">Provenance</a></li>
            </ul>
          </div>
        </div>
      </footer>
    `;
  }
}
```

#### 2. Herb Components
```javascript
// components/HerbCard.js
class HerbCard {
  constructor(herb) {
    this.herb = herb;
  }
  
  render() {
    return `
      <article class="herb-card">
        <img src="${this.herb.image}" alt="${this.herb.name}">
        <h3>${this.herb.commonName}</h3>
        <p class="scientific-name">${this.herb.scientificName}</p>
        <div class="herb-properties">
          ${this.herb.properties.map(p => `<span class="tag">${p}</span>`).join('')}
        </div>
        <a href="/herbs/${this.herb.slug}" class="btn-primary">Learn More</a>
      </article>
    `;
  }
}

// components/HerbProfile.js
class HerbProfile {
  constructor(herb) {
    this.herb = herb;
    this.activeTab = 'overview';
  }
  
  render() {
    return `
      <div class="herb-profile">
        <div class="herb-header">
          <img src="${this.herb.primaryImage}" alt="${this.herb.commonName}">
          <div class="herb-info">
            <h1>${this.herb.commonName}</h1>
            <p class="scientific-name">${this.herb.scientificName}</p>
            <div class="herb-meta">
              <span>Family: ${this.herb.family}</span>
              <span>Origin: ${this.herb.origin.join(', ')}</span>
            </div>
          </div>
        </div>
        
        <nav class="herb-tabs">
          <button data-tab="overview">Overview</button>
          <button data-tab="uses">Uses</button>
          <button data-tab="growing">Growing</button>
          <button data-tab="recipes">Recipes</button>
        </nav>
        
        <div class="herb-content">
          ${this.renderTabContent()}
        </div>
      </div>
    `;
  }
}
```

#### 3. Recipe Components
```javascript
// components/RecipeCard.js
class RecipeCard {
  constructor(recipe) {
    this.recipe = recipe;
  }
  
  render() {
    return `
      <article class="recipe-card">
        <img src="${this.recipe.image}" alt="${this.recipe.title}">
        <div class="recipe-content">
          <h3>${this.recipe.title}</h3>
          <p>${this.recipe.description}</p>
          <div class="recipe-meta">
            <span>⏱️ ${this.recipe.prepTime + this.recipe.cookTime} min</span>
            <span>🍽️ ${this.recipe.servings} servings</span>
            <span>⭐ ${this.recipe.rating}</span>
          </div>
          <a href="/recipes/${this.recipe.slug}" class="btn-primary">View Recipe</a>
        </div>
      </article>
    `;
  }
}

// components/RecipeDetail.js
class RecipeDetail {
  constructor(recipe) {
    this.recipe = recipe;
  }
  
  render() {
    return `
      <article class="recipe-detail">
        <header class="recipe-header">
          <h1>${this.recipe.title}</h1>
          <div class="recipe-actions">
            <button class="btn-save">💚 Save</button>
            <button class="btn-share">📤 Share</button>
            <button class="btn-print">🖨️ Print</button>
          </div>
        </header>
        
        <div class="recipe-grid">
          <div class="recipe-main">
            <img src="${this.recipe.primaryImage}" alt="${this.recipe.title}">
            <p class="recipe-description">${this.recipe.description}</p>
            
            <section class="ingredients">
              <h2>Ingredients</h2>
              <ul>
                ${this.recipe.ingredients.map(i => `
                  <li>${i.quantity} ${i.unit} ${i.name}</li>
                `).join('')}
              </ul>
            </section>
            
            <section class="instructions">
              <h2>Instructions</h2>
              <ol>
                ${this.recipe.instructions.map(i => `
                  <li>${i.text}</li>
                `).join('')}
              </ol>
            </section>
          </div>
          
          <aside class="recipe-sidebar">
            <div class="recipe-info">
              <h3>Recipe Info</h3>
              <dl>
                <dt>Prep Time</dt>
                <dd>${this.recipe.prepTime} minutes</dd>
                <dt>Cook Time</dt>
                <dd>${this.recipe.cookTime} minutes</dd>
                <dt>Difficulty</dt>
                <dd>${this.recipe.difficulty}</dd>
              </dl>
            </div>
            
            <div class="health-benefits">
              <h3>Health Benefits</h3>
              <ul>
                ${this.recipe.healthBenefits.map(b => `<li>${b}</li>`).join('')}
              </ul>
            </div>
          </aside>
        </div>
      </article>
    `;
  }
}
```

#### 4. AI Advisor Components
```javascript
// components/AIAdvisor.js
class AIAdvisor {
  constructor() {
    this.messages = [];
    this.isLoading = false;
  }
  
  render() {
    return `
      <div class="ai-advisor">
        <div class="ai-header">
          <h2>🤖 AI Herbal Advisor</h2>
          <p>Ask me about herbs, remedies, or health concerns</p>
        </div>
        
        <div class="ai-chat">
          <div class="messages" id="ai-messages">
            ${this.renderMessages()}
          </div>
          
          <form class="ai-input-form" id="ai-form">
            <input 
              type="text" 
              placeholder="Ask about herbs, symptoms, or recipes..."
              id="ai-input"
              ${this.isLoading ? 'disabled' : ''}
            >
            <button type="submit" ${this.isLoading ? 'disabled' : ''}>
              ${this.isLoading ? '⏳' : '📤'}
            </button>
          </form>
        </div>
        
        <div class="ai-suggestions">
          <p>Try asking:</p>
          <button class="suggestion">What herbs help with sleep?</button>
          <button class="suggestion">Natural remedies for digestion</button>
          <button class="suggestion">Herbs that boost immunity</button>
        </div>
      </div>
    `;
  }
}
```

#### 5. Community Components
```javascript
// components/ForumPost.js
class ForumPost {
  constructor(post) {
    this.post = post;
  }
  
  render() {
    return `
      <article class="forum-post">
        <header class="post-header">
          <img src="${this.post.author.avatar}" alt="${this.post.author.name}">
          <div class="post-meta">
            <h3>${this.post.author.name}</h3>
            <time>${this.formatDate(this.post.createdAt)}</time>
          </div>
        </header>
        
        <div class="post-content">
          <h2>${this.post.title}</h2>
          <div class="post-body">${this.post.content}</div>
          
          <div class="post-tags">
            ${this.post.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
          </div>
        </div>
        
        <footer class="post-actions">
          <button class="btn-like">👍 ${this.post.likes}</button>
          <button class="btn-comment">💬 ${this.post.comments.length}</button>
          <button class="btn-share">📤 Share</button>
        </footer>
      </article>
    `;
  }
}

// components/CommentSection.js
class CommentSection {
  constructor(comments) {
    this.comments = comments;
  }
  
  render() {
    return `
      <section class="comments">
        <h3>Comments (${this.comments.length})</h3>
        
        <form class="comment-form">
          <textarea placeholder="Share your thoughts..."></textarea>
          <button type="submit">Post Comment</button>
        </form>
        
        <div class="comments-list">
          ${this.comments.map(comment => this.renderComment(comment)).join('')}
        </div>
      </section>
    `;
  }
}
```

#### 6. Web3 Components
```javascript
// components/WalletConnect.js
class WalletConnect {
  constructor() {
    this.connected = false;
    this.address = null;
  }
  
  render() {
    if (this.connected) {
      return `
        <div class="wallet-connected">
          <span class="wallet-address">${this.formatAddress(this.address)}</span>
          <button class="btn-disconnect">Disconnect</button>
        </div>
      `;
    }
    
    return `
      <button class="btn-connect-wallet">
        🦊 Connect Wallet
      </button>
    `;
  }
}

// components/NFTBadge.js
class NFTBadge {
  constructor(badge) {
    this.badge = badge;
  }
  
  render() {
    return `
      <div class="nft-badge">
        <img src="${this.badge.image}" alt="${this.badge.name}">
        <h3>${this.badge.name}</h3>
        <p>${this.badge.description}</p>
        ${this.badge.owned ? 
          '<span class="badge-owned">✓ Owned</span>' : 
          `<button class="btn-mint">Mint for ${this.badge.price} MATIC</button>`
        }
      </div>
    `;
  }
}

// components/TokenBalance.js
class TokenBalance {
  constructor(balance) {
    this.balance = balance;
  }
  
  render() {
    return `
      <div class="token-balance">
        <h3>$HERB Balance</h3>
        <div class="balance-amount">
          <span class="balance-value">${this.balance.herb}</span>
          <span class="balance-usd">≈ $${this.balance.usd}</span>
        </div>
        <div class="balance-actions">
          <button class="btn-earn">Earn</button>
          <button class="btn-spend">Spend</button>
          <button class="btn-transfer">Transfer</button>
        </div>
      </div>
    `;
  }
}
```

#### 7. Search Components
```javascript
// components/SearchBar.js
class SearchBar {
  constructor(options = {}) {
    this.placeholder = options.placeholder || 'Search herbs, recipes, remedies...';
    this.filters = options.filters || [];
  }
  
  render() {
    return `
      <div class="search-bar">
        <form class="search-form">
          <input 
            type="search" 
            placeholder="${this.placeholder}"
            class="search-input"
          >
          <button type="submit" class="search-button">
            🔍 Search
          </button>
        </form>
        
        ${this.filters.length > 0 ? `
          <div class="search-filters">
            ${this.filters.map(filter => `
              <select class="filter-select" name="${filter.name}">
                <option value="">All ${filter.label}</option>
                ${filter.options.map(opt => `
                  <option value="${opt.value}">${opt.label}</option>
                `).join('')}
              </select>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }
}

// components/SearchResults.js
class SearchResults {
  constructor(results) {
    this.results = results;
  }
  
  render() {
    return `
      <div class="search-results">
        <p class="results-count">${this.results.total} results found</p>
        
        <div class="results-grid">
          ${this.results.items.map(item => {
            switch(item.type) {
              case 'herb':
                return new HerbCard(item).render();
              case 'recipe':
                return new RecipeCard(item).render();
              case 'post':
                return new ForumPost(item).render();
              default:
                return '';
            }
          }).join('')}
        </div>
        
        ${this.renderPagination()}
      </div>
    `;
  }
}
```

## Component Initialization Pattern

```javascript
// scripts/components/index.js
class ComponentRegistry {
  constructor() {
    this.components = new Map();
  }
  
  register(name, component) {
    this.components.set(name, component);
  }
  
  init() {
    // Initialize all components on page load
    document.querySelectorAll('[data-component]').forEach(element => {
      const componentName = element.dataset.component;
      const ComponentClass = this.components.get(componentName);
      
      if (ComponentClass) {
        const props = JSON.parse(element.dataset.props || '{}');
        const instance = new ComponentClass(props);
        element.innerHTML = instance.render();
        
        // Attach event listeners if component has them
        if (instance.attachEvents) {
          instance.attachEvents(element);
        }
      }
    });
  }
}

// Usage
const registry = new ComponentRegistry();
registry.register('HerbCard', HerbCard);
registry.register('RecipeCard', RecipeCard);
registry.register('AIAdvisor', AIAdvisor);
// ... register all components

document.addEventListener('DOMContentLoaded', () => {
  registry.init();
});
```

## State Management

```javascript
// scripts/state/Store.js
class Store {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = new Map();
  }
  
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key).push(callback);
  }
  
  setState(key, value) {
    this.state[key] = value;
    
    // Notify listeners
    if (this.listeners.has(key)) {
      this.listeners.get(key).forEach(callback => callback(value));
    }
  }
  
  getState(key) {
    return this.state[key];
  }
}

// Global store instance
const store = new Store({
  user: null,
  wallet: null,
  herbs: [],
  recipes: [],
  cart: []
});
```

## Event System

```javascript
// scripts/events/EventBus.js
class EventBus {
  constructor() {
    this.events = {};
  }
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
  
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
}

// Global event bus
const eventBus = new EventBus();

// Usage examples
eventBus.on('user:login', (user) => {
  console.log('User logged in:', user);
  // Update UI components
});

eventBus.on('wallet:connected', (address) => {
  console.log('Wallet connected:', address);
  // Enable Web3 features
});
```

## Router System

```javascript
// scripts/router/Router.js
class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
  }
  
  register(path, handler) {
    this.routes.set(path, handler);
  }
  
  navigate(path) {
    const handler = this.routes.get(path);
    if (handler) {
      handler();
      this.currentRoute = path;
      history.pushState({}, '', path);
    }
  }
  
  init() {
    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      this.navigate(window.location.pathname);
    });
    
    // Handle link clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="/"]')) {
        e.preventDefault();
        this.navigate(e.target.getAttribute('href'));
      }
    });
    
    // Initial route
    this.navigate(window.location.pathname);
  }
}
```

This component hierarchy provides a solid foundation for building HerbCraft with vanilla JavaScript, focusing on modularity, reusability, and performance.