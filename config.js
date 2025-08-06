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
  // Get user's ASINs
  async getAsins() {
    const { data, error } = await supabase
      .from('seller_asins')
      .select('*')
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  // Add/Update ASINs (bulk operation)
  async saveAsins(asins) {
    // First, delete all existing ASINs for this user
    const { error: deleteError } = await supabase
      .from('seller_asins')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all user's records
    
    if (deleteError) return { error: deleteError };
    
    // Insert new ASINs
    const { data, error } = await supabase
      .from('seller_asins')
      .insert(asins.map(asin => ({
        asin: asin.asin,
        market: asin.market,
        rate: parseFloat(asin.rate)
      })));
    
    return { data, error };
  },

  // Delete specific ASIN
  async deleteAsin(id) {
    const { error } = await supabase
      .from('seller_asins')
      .delete()
      .eq('id', id);
    
    return { error };
  },

  // Get performance report data
  async getPerformanceReport() {
    const { data, error } = await supabase
      .from('user_asin_performance')
      .select('*');
    
    return { data, error };
  },

  // Generate mock performance data
  async generateMockData() {
    const { data, error } = await supabase
      .rpc('generate_mock_performance_data');
    
    return { error };
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