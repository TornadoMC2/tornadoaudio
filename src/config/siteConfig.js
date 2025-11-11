// Site Configuration
// Edit this file to control various aspects of your website

const siteConfig = {
  // Sales & Promotions
  sales: {
    active: false, // Set to true to activate sale pricing
    percentage: 25, // Discount percentage (e.g., 20 for 20% off)
    name: "Launch Sale", // Display name for the sale
    endDate: new Date('2025-11-1'), // Optional: new Date('2024-12-31') for automatic expiry
    excludeServiceIds: [], // Array of service IDs to exclude from sales: ['basic-mix', 'premium-mix-master']
  },

  // Order Management
  orders: {
    accepting: true, // Set to false to stop accepting new orders
    currentCount: 0, // Update this with your current pending orders
    maxCapacity: 15, // Maximum orders you can handle at once
    capacityWarningThreshold: 0.8, // Show warning when 80% full
    capacityMessage: "I'm currently at high capacity. Orders may take longer than usual.",
    closedMessage: "I'm currently not accepting new orders due to high demand. Please check back soon!",
  },

  // Business Operations
  business: {
    maintenanceMode: false, // Set to true to show maintenance message
    turnaroundMultiplier: 1.0, // Multiply all turnaround times (1.0 = normal, 1.5 = 50% longer)
    featuredAnnouncement: null, // Banner message: "New mastering services available!"
    satisfactionGuarantee: null, // "100% satisfaction guarantee or your money back."
  },

  // Contact Information
  contact: {
    email: "hunter@tornadoaudio.com",
    phone: null, // Add phone number if desired
    businessHours: "Monday-Friday, 9 AM - 6 PM EST",
    responseTime: "within 24 hours",
    socialMedia: {
      instagram: null, // "https://instagram.com/tornadoaudio"
      twitter: null,
      youtube: null,
      soundcloud: null,
    },
  },

  // Payment & Policies
  payment: {
    methods: ["PayPal", "Venmo", "Bank Transfer"],
    depositRequired: false, // Set to true if you require deposits
    depositPercentage: 0, // Percentage required as deposit
    revisionPolicy: "Revisions included as specified in each package",
    rushOrdersAvailable: false, // Set to false if not offering rush orders
    rushOrderMultiplier: 1.5, // Price multiplier for rush orders
  },

  // Feature Toggles
  features: {
    showTestimonials: true,
    showPortfolio: true,
    showBulkPricing: true,
    enableRushOrders: true,
    showCapacityIndicator: false, // Show order capacity status
  },
};

export default siteConfig;
