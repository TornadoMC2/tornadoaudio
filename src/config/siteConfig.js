// Site Configuration
//
// Single source of truth for anything that appears in more than one place.
// If a number or a claim shows up in two components, it belongs here.

const siteConfig = {
  // Introductory Pricing
  //
  // The standard rate is the real rate. The intro rate is a temporary discount
  // bought with portfolio rights and a testimonial, and it has to actually end
  // — decrement `projectsRemaining` as projects come in, and set `active: false`
  // when it hits zero. A permanent introductory rate is just a fake sale.
  introOffer: {
    active: true,
    projectsRemaining: 8,
    totalProjects: 8,
    reason: 'in exchange for permission to use the finished track in my portfolio and a short written testimonial',
    showRemainingCount: true,
  },

  // Order Management
  orders: {
    accepting: true,
    currentCount: 0,
    maxCapacity: 15,
    capacityWarningThreshold: 0.8,
    capacityMessage: "I'm currently at high capacity. Orders may take longer than usual.",
    closedMessage: "I'm currently not accepting new orders due to high demand. Please check back soon!",
  },

  // Business Operations
  business: {
    maintenanceMode: false,
    turnaroundMultiplier: 1.0, // Multiply all turnaround times (1.0 = normal, 1.5 = 50% longer)
    featuredAnnouncement: null, // Banner message: "New mastering services available!"
    satisfactionGuarantee: null, // "100% satisfaction guarantee or your money back."
    foundedYear: 2020,
    // Displayed wherever experience is claimed. Kept here so the hero, the live
    // sound section and the page metadata can't drift apart again.
    yearsExperience: '5+',
  },

  // Location
  //
  // Named deliberately: a real city reads as a real person, and it's what makes
  // a Google Business Profile and local search possible for live sound work.
  location: {
    city: 'Bloomington-Normal',
    region: 'IL',
    regionName: 'Illinois',
    country: 'US',
    short: 'Bloomington-Normal, IL',
    // Live sound travel radius. Not a second business location — Chicago is
    // reach, not a base.
    serviceArea: ['Bloomington-Normal', 'Central Illinois', 'Chicago area'],
    serviceAreaLabel: 'Central Illinois and the Chicago area',
    remoteNote: 'Studio mixing and mastering handled remotely for artists anywhere.',
  },

  // Live Sound
  //
  // Named rooms carry more weight than the six generic category bullets in
  // LiveSoundSection — the categories are unfalsifiable, the names aren't. Only
  // add a venue Hunter has actually worked and can say so publicly.
  liveSound: {
    venues: [
      { name: 'Thelma Gaylord Performing Arts Theatre', location: 'Oklahoma City, OK' },
      { name: 'The Arcada Theatre', location: 'St. Charles, IL' },
      { name: 'The Clyde Theatre', location: 'Fort Wayne, IN' },
      { name: 'Ludlow Garage', location: 'Cincinnati, OH' },
      { name: 'Des Plaines Theatre', location: 'Des Plaines, IL' },
      { name: 'Devon Lakeshore Amphitheater', location: 'Decatur, IL' },
      { name: 'Salem Civic Center', location: 'Salem, VA' },
      { name: 'Braden Auditorium', location: 'Normal, IL' },
    ],
  },

  // About
  //
  // Drop a portrait at public/images/about/hunter.jpg and set `photo` to
  // '/images/about/hunter.jpg'. Until then the About section renders as a
  // single full-width column rather than a broken image. A real photo is the
  // single highest-value asset missing from this site.
  about: {
    photo: '/images/profile.jpg',
    photoCaption: null,
  },

  // Contact Information
  contact: {
    email: 'contact@tornadoaudio.net',
    phone: null,
    businessHours: 'Monday-Friday, 9 AM - 6 PM CT',
    responseTime: 'within 24 hours',
    socialMedia: {
      instagram: 'https://instagram.com/tornadoaudio_mixing',
      twitter: null,
      youtube: null,
      soundcloud: null,
    },
  },

  // Payment & Policies
  payment: {
    methods: ['Zelle', 'Venmo', 'Bank Transfer'],
    depositRequired: true,
    depositPercentage: 50,
    revisionPolicy: 'Revision rounds are capped per package; further revisions are billed hourly.',
    rushOrdersAvailable: true,
    rushOrderMultiplier: 1.5,
    albumDiscountPercentage: 15,
    albumDiscountMinSongs: 4,
  },

  // Feature Toggles
  features: {
    showTestimonials: false, // Flip to true once real testimonials exist in testimonials.js
    showPortfolio: true,
    enableRushOrders: true,
    showCapacityIndicator: false,
    showFreeSample: true,
  },
};

export default siteConfig;
