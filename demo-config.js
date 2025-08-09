// Demo Configuration - Works Locally Without Supabase
// This replaces config.js for local demo purposes

// Demo users database
const DEMO_USERS = {
  'seller@demo.com': {
    password: 'seller123',
    role: 'seller',
    name: 'Demo Seller'
  },
  'admin@demo.com': {
    password: 'admin123',
    role: 'admin',
    name: 'Admin User'
  }
};

// Mock ASINs data
let DEMO_ASINS = [
  {
    id: 1,
    product_name: 'Wireless Bluetooth Headphones',
    country: 'US',
    currency: 'USD',
    ASIN: 'B08N5WRWNW',
    product_price: 29.99,
    '% Commission': 15,
    expiry_date: '2024-12-31',
    category: 'Electronics',
    custom_label1: 'Premium',
    created_at: '2024-01-15'
  },
  {
    id: 2,
    product_name: 'Smart Fitness Watch',
    country: 'UK',
    currency: 'GBP',
    ASIN: 'B07XJ8C8F5',
    product_price: 89.50,
    '% Commission': 12,
    expiry_date: '2024-11-30',
    category: 'Wearables',
    custom_label1: 'Featured',
    created_at: '2024-01-20'
  },
  {
    id: 3,
    product_name: 'Gaming Mechanical Keyboard',
    country: 'DE',
    currency: 'EUR',
    ASIN: 'B09KMVJY8P',
    product_price: 65.00,
    '% Commission': 18,
    expiry_date: '2025-01-15',
    category: 'Gaming',
    custom_label1: 'Trending',
    created_at: '2024-02-01'
  },
  {
    id: 4,
    product_name: 'Portable Phone Charger',
    country: 'FR',
    currency: 'EUR',
    ASIN: 'B07VJKQXW9',
    product_price: 24.99,
    '% Commission': 14,
    expiry_date: '2024-10-31',
    category: 'Accessories',
    custom_label1: 'High Convert',
    created_at: '2024-02-05'
  },
  {
    id: 5,
    product_name: 'USB-C Cable Set',
    country: 'CA',
    currency: 'CAD',
    ASIN: 'B08XQVYQMH',
    product_price: 19.99,
    '% Commission': 16,
    expiry_date: '2024-12-15',
    category: 'Accessories',
    custom_label1: 'Basic',
    created_at: '2024-02-10'
  },
  {
    id: 6,
    product_name: 'Laptop Stand Adjustable',
    country: 'JP',
    currency: 'JPY',
    ASIN: 'B07PDHSJ41',
    product_price: 4999,
    '% Commission': 11,
    expiry_date: '2024-12-31',
    category: 'Office',
    custom_label1: 'Ergonomic',
    created_at: '2024-02-15'
  }
];

// Initialize demo system
document.addEventListener('DOMContentLoaded', function() {
  // Load saved ASINs from localStorage if available
  const savedAsins = localStorage.getItem('demo_asins');
  if (savedAsins) {
    DEMO_ASINS = JSON.parse(savedAsins);
  }
});

// Demo Auth helper functions
const auth = {
  // Demo sign in
  async signIn(email, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = DEMO_USERS[email.toLowerCase()];
        
        if (user && user.password === password) {
          // Store session
          localStorage.setItem('demo_user', JSON.stringify({
            email: email.toLowerCase(),
            role: user.role,
            name: user.name
          }));
          
          resolve({ 
            user: { email: email.toLowerCase(), role: user.role }, 
            error: null 
          });
        } else {
          resolve({ 
            user: null, 
            error: { message: 'Invalid login credentials' } 
          });
        }
      }, 500); // Simulate network delay
    });
  },

  // Demo sign up
  async signUp(email, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (DEMO_USERS[email.toLowerCase()]) {
          resolve({ 
            user: null, 
            error: { message: 'User already exists' } 
          });
        } else {
          // Add new demo user
          DEMO_USERS[email.toLowerCase()] = {
            password: password,
            role: 'seller',
            name: email.split('@')[0]
          };
          
          resolve({ 
            user: { email: email.toLowerCase(), role: 'seller' }, 
            error: null 
          });
        }
      }, 500);
    });
  },

  // Check if logged in
  async isLoggedIn() {
    const user = localStorage.getItem('demo_user');
    return !!user;
  },

  // Get current user
  async getCurrentUser() {
    const user = localStorage.getItem('demo_user');
    return user ? JSON.parse(user) : null;
  },

  // Sign out
  async signOut() {
    localStorage.removeItem('demo_user');
    return { error: null };
  }
};

// Demo Database helper functions
const database = {
  // Get user's ASINs
  async getAsins() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, filter by user. For demo, return all
        resolve({ data: DEMO_ASINS, error: null });
      }, 300);
    });
  },

  // Get all ASINs (admin function)
  async getAllAsins() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: DEMO_ASINS, error: null });
      }, 300);
    });
  },

  // Save new ASINs
  async saveAsins(newAsins) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Add IDs to new ASINs
        const maxId = Math.max(...DEMO_ASINS.map(a => a.id), 0);
        newAsins.forEach((asin, index) => {
          asin.id = maxId + index + 1;
          asin.created_at = new Date().toISOString();
        });
        
        DEMO_ASINS.push(...newAsins);
        
        // Save to localStorage
        localStorage.setItem('demo_asins', JSON.stringify(DEMO_ASINS));
        
        resolve({ data: newAsins, error: null });
      }, 500);
    });
  },

  // Update specific ASIN
  async updateAsin(id, field, value) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const asinIndex = DEMO_ASINS.findIndex(a => a.id == id);
        if (asinIndex !== -1) {
          DEMO_ASINS[asinIndex][field] = value;
          localStorage.setItem('demo_asins', JSON.stringify(DEMO_ASINS));
          resolve({ error: null });
        } else {
          resolve({ error: { message: 'ASIN not found' } });
        }
      }, 300);
    });
  },

  // Delete specific ASIN
  async deleteAsin(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const asinIndex = DEMO_ASINS.findIndex(a => a.id == id);
        if (asinIndex !== -1) {
          DEMO_ASINS.splice(asinIndex, 1);
          localStorage.setItem('demo_asins', JSON.stringify(DEMO_ASINS));
          resolve({ error: null });
        } else {
          resolve({ error: { message: 'ASIN not found' } });
        }
      }, 300);
    });
  },

  // Get performance report (mock data)
  async getPerformanceReport() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const performanceData = DEMO_ASINS.map(asin => ({
          ...asin,
          revenue: (parseFloat(asin.product_price || 0) * (parseInt(asin['% Commission'] || 0) / 100) * (Math.random() * 50 + 10)).toFixed(2),
          clicks: Math.floor(Math.random() * 1000) + 100,
          conversions: Math.floor(Math.random() * 50) + 5,
          performance_period: '2024-01'
        }));
        
        resolve({ data: performanceData, error: null });
      }, 400);
    });
  }
};

// Utility functions
const utils = {
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      padding: 1rem 1.5rem;
      border-radius: 4px;
      color: white;
      font-weight: 500;
      max-width: 400px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      opacity: 0;
      transition: opacity 0.3s;
    `;
    
    // Set background color based on type
    switch(type) {
      case 'success':
        notification.style.backgroundColor = '#28a745';
        break;
      case 'error':
        notification.style.backgroundColor = '#dc3545';
        break;
      case 'warning':
        notification.style.backgroundColor = '#ffc107';
        notification.style.color = '#000';
        break;
      default:
        notification.style.backgroundColor = '#007bff';
    }
    
    document.body.appendChild(notification);
    
    // Fade in
    setTimeout(() => {
      notification.style.opacity = '1';
    }, 100);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 4000);
  },

  showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: #666;">
          <div style="display: inline-block; width: 20px; height: 20px; border: 2px solid #f3f3f3; border-top: 2px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <p style="margin-top: 1rem;">Loading...</p>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `;
    }
  },

  hideLoading(containerId) {
    // Loading will be replaced by actual content
  }
};

console.log('🎭 Demo mode active! Use these credentials:');
console.log('Seller: seller@demo.com / seller123');
console.log('Admin: admin@demo.com / admin123');