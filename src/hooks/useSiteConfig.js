import siteConfig from '../config/siteConfig';

const useSiteConfig = () => {
  const introActive =
    siteConfig.introOffer.active && siteConfig.introOffer.projectsRemaining > 0;

  // Resolve a tier's displayed pricing. Intro prices are set per tier rather
  // than derived from a percentage — the discount isn't uniform, and rounding a
  // percentage produces prices nobody would choose to print.
  const getTierPricing = (tier) => {
    const onIntro = introActive && typeof tier.introPrice === 'number';

    return {
      price: onIntro ? tier.introPrice : tier.price,
      standardPrice: tier.price,
      onIntro,
      savings: onIntro ? tier.price - tier.introPrice : 0,
    };
  };

  const formatPrice = (price) => `$${price}`;

  const getOrderCapacityStatus = () => {
    const { currentCount, maxCapacity, capacityWarningThreshold } = siteConfig.orders;
    const ratio = currentCount / maxCapacity;

    return {
      current: currentCount,
      max: maxCapacity,
      ratio,
      isAtCapacity: !siteConfig.orders.accepting,
      isNearCapacity: ratio >= capacityWarningThreshold,
      statusMessage: !siteConfig.orders.accepting
        ? siteConfig.orders.closedMessage
        : ratio >= capacityWarningThreshold
          ? siteConfig.orders.capacityMessage
          : null,
    };
  };

  // Adjusted turnaround times based on multiplier
  const adjustTurnaroundTime = (originalTime) => {
    if (siteConfig.business.turnaroundMultiplier === 1.0) return originalTime;

    // Extract number and unit from strings like "48-hour" or "5-7 days"
    const timeStr = originalTime.toLowerCase();
    if (timeStr.includes('hour')) {
      const hours = parseInt(timeStr.match(/\d+/)[0]);
      const adjustedHours = Math.ceil(hours * siteConfig.business.turnaroundMultiplier);
      return `${adjustedHours}-hour`;
    } else if (timeStr.includes('day')) {
      const match = timeStr.match(/(\d+)(?:-(\d+))?/);
      if (match) {
        const minDays = parseInt(match[1]);
        const maxDays = match[2] ? parseInt(match[2]) : minDays;
        const adjustedMin = Math.ceil(minDays * siteConfig.business.turnaroundMultiplier);
        const adjustedMax = Math.ceil(maxDays * siteConfig.business.turnaroundMultiplier);

        return adjustedMin === adjustedMax
          ? `${adjustedMin} days`
          : `${adjustedMin}-${adjustedMax} days`;
      }
    }
    return originalTime;
  };

  return {
    // Direct config access
    config: siteConfig,

    // Calculated values
    isIntroOfferActive: introActive,
    isMaintenanceMode: siteConfig.business.maintenanceMode,
    isAcceptingOrders: siteConfig.orders.accepting,

    // Helper functions
    getTierPricing,
    formatPrice,
    getOrderCapacityStatus,
    adjustTurnaroundTime,

    introOffer: {
      ...siteConfig.introOffer,
      active: introActive,
    },

    contactInfo: siteConfig.contact,
    businessInfo: siteConfig.business,
    locationInfo: siteConfig.location,
    paymentInfo: siteConfig.payment,
    features: siteConfig.features,
  };
};

export default useSiteConfig;
