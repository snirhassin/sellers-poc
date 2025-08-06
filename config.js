// Supabase Configuration
// Replace these with your actual Supabase project details

const SUPABASE_CONFIG = {
  url: 'https://lphvztvrglimycfbfsga.supabase.co', // e.g., https://abcdefghijk.supabase.co
  anon_key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwaHZ6dHZyZ2xpbXljZmJmc2dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NjY5MjMsImV4cCI6MjA3MDA0MjkyM30.1lcqClKX6l_SGoZc6hJzYUG_z0QMrV8Xp3Psde2ZHrc' // Your anon/public key
};

// Initialize Supabase client (will be loaded from CDN)
let supabase;

// Initialize Supabase when the script loads
document.addEventListener('DOMContentLoaded', function() {
  if (typeof window.supabase !== 'undefined') {
    supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anon_key);
  }
});

// Auth helper functions
const auth = {
  // Sign up new user
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    });
    return { user: data.user, error };
  },

  // Sign in user
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
    return { user: data.user, error };
  },

  // Sign out user
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Check if user is logged in
  async isLoggedIn() {
    const user = await this.getCurrentUser();
    return !!user;
  }
};

// Database helper functions
const database = {
  // Get user's ASINs from the "Sellers's ASINs" table
  async getAsins() {
    const { data, error } = await supabase
      .from("Sellers's ASINs")
      .select('*')
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  // Add/Update ASINs (bulk operation)
  async saveAsins(asins) {
    // Note: For this POC, we'll just insert new records
    // In production, you might want to handle duplicates differently
    
    // Insert new ASINs with correct field order
    const { data, error } = await supabase
      .from("Sellers's ASINs")
      .insert(asins.map(asin => ({
        seller_name: asin.seller_name || '',
        country: asin.country || asin.market || '',
        product_name: asin.product_name || '',
        ASIN: asin.ASIN || asin.asin || '',
        product_price: parseFloat(asin.product_price || 0),
        '% Commission': parseInt(asin['% Commission'] || asin.rate || 0),
        expiry_date: asin.expiry_date || null,
        category: asin.category || '',
        custom_label1: asin.custom_label1 || ''
      })));
    
    return { data, error };
  },

  // Delete specific ASIN
  async deleteAsin(id) {
    const { error } = await supabase
      .from("Sellers's ASINs")
      .delete()
      .eq('id', id);
    
    return { error };
  },

  // Update specific ASIN
  async updateAsin(id, field, value) {
    const updateData = {};
    updateData[field] = value;
    
    const { error } = await supabase
      .from("Sellers's ASINs")
      .update(updateData)
      .eq('id', id);
    
    return { error };
  },

  // Get performance report data (mock for now)
  async getPerformanceReport() {
    // Since we don't have the performance_reports table with your structure,
    // we'll generate mock data based on the ASINs
    const { data: asins, error } = await this.getAsins();
    
    if (error) return { data: null, error };
    
    // Generate mock performance data
    const performanceData = asins?.map(asin => ({
      ...asin,
      revenue: (parseFloat(asin.product_price || 0) * (parseInt(asin['% Commission'] || 0) / 100) * (Math.random() * 50 + 10)).toFixed(2),
      clicks: Math.floor(Math.random() * 1000) + 100,
      conversions: Math.floor(Math.random() * 50) + 5,
      conversion_rate: (Math.random() * 8 + 2).toFixed(2)
    })) || [];
    
    return { data: performanceData, error: null };
  }
};

// Utility functions
const utils = {
  // Show loading spinner
  showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.opacity = '0.5';
      element.style.pointerEvents = 'none';
    }
  },

  // Hide loading spinner
  hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.opacity = '1';
      element.style.pointerEvents = 'auto';
    }
  },

  // Show notification
  showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: ${type === 'error' ? '#dc3545' : '#28a745'};
      color: white;
      border-radius: 6px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }
};