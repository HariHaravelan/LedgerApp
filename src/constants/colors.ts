export const colors = {
  // Primary Colors
  primary: '#1A365D',    // Dark blue
  primaryLight: '#2C5282', // Lighter blue for hover/active states
  primaryDark: '#152951', // Darker blue for pressed states
  
  // Background Colors
  background: '#FFFFFF',  // White
  surface: '#FFFFFF',     // White
  
  // Text Colors
  text: '#1A365D',       // Dark blue for primary text
  textSecondary: '#718096', // Gray for secondary text
  textLight: '#A0AEC0',    // Light gray for disabled/placeholder
  
  // UI Elements
  border: '#E2E8F0',     // Light gray for borders
  error: '#E53E3E',      // Red for errors
  success: '#38A169',    // Green for success
  
  // Status Colors
  income: '#38A169',     // Green for income
  expense: '#E53E3E',    // Red for expenses
  
  white: '#FFFFFF'       // Pure white
};

export const themeColors = {
  primary: '#1E3A8A',       // Dark blue
  primaryLight: '#2563EB',  // Lighter blue for hover/active states
  primaryFaded: '#1E3A8A20', // Used for inactive or disabled states
  text: '#1E293B',         // Dark text
  textLight: '#64748B',    // Light text
  white: '#FFFFFF',        // White
  border: '#E2E8F0',       // Light border
  success: '#38A169',
  error: '#E53E3E', 
};

export const WIZARD_COLORS = {
  gradient1: '#4F46E5', // Indigo - but used more sparingly now
  accent1: '#10B981', // Emerald green for success/actions
  accent2: '#F59E0B', // Amber for highlights
  accent3: '#6366F1', // Violet for selection
  surface: '#F8FAFF', // Light background
  cardHover: 'rgba(99, 102, 241, 0.08)', // Light violet for hover
  success: '#10B981',
};
export const BANK_COLORS: { [key: string]: string } = {
  'HDFC Bank': '#004C8F',     // HDFC Blue
  'ICICI Bank': '#F58220',    // ICICI Orange
  'State Bank of India': '#2D5BA4', // SBI Blue
  'Axis Bank': '#97144C',     // Axis Burgundy
  'Kotak Bank': '#AF272F',    // Kotak Red
  'Yes Bank': '#002A54',      // Yes Bank Blue
  'default': WIZARD_COLORS.accent3
};