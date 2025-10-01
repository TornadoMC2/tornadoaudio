import { useMemo } from 'react';
import siteConfig from '../config/siteConfig';

const useSiteConfig = () => {
  // Helper function to calculate sale prices
  const calculateSalePrice = (originalPrice, serviceId = null) => {
    // Check if this specific service should be excluded from sales
    const isExcludedFromSale = serviceId && siteConfig.sales.excludeServiceIds.includes(serviceId);

    if (!siteConfig.sales.active || isExcludedFromSale) {
      return {
        price: originalPrice,
        originalPrice: originalPrice,
        onSale: false,
        savings: 0,
      };
    }

    const discount = siteConfig.sales.percentage / 100;
    const discountedPrice = originalPrice * (1 - discount);

    // Round down to nearest multiple of 5
    const roundedPrice = Math.floor(discountedPrice / 5) * 5;

    return {
      price: roundedPrice,
      originalPrice: originalPrice,
      onSale: true,
      savings: originalPrice - roundedPrice,
      salePercentage: siteConfig.sales.percentage,
    };
  };

  // Helper function to format price
  const formatPrice = (price) => `$${price}`;

  // Helper function to get order capacity status
  const getOrderCapacityStatus = () => {
    const { currentCount, maxCapacity, capacityWarningThreshold } = siteConfig.orders;
    const ratio = currentCount / maxCapacity;

    return {
      current: currentCount,
      max: maxCapacity,
      ratio: ratio,
      isAtCapacity: !siteConfig.orders.accepting,
      isNearCapacity: ratio >= capacityWarningThreshold,
      statusMessage: !siteConfig.orders.accepting
        ? siteConfig.orders.closedMessage
        : ratio >= capacityWarningThreshold
          ? siteConfig.orders.capacityMessage
          : null,
    };
  };

  // Check if sale has expired
  const isSaleExpired = useMemo(() => {
    if (!siteConfig.sales.endDate) return false;
    return new Date() > new Date(siteConfig.sales.endDate);
  }, []);

  // Get dynamic sale message based on service inclusion
  const getSaleMessage = () => {
    if (!siteConfig.sales.active || isSaleExpired) return null;

    // All available service IDs (you can expand this list as you add more services)
    const allServiceIds = ['basic-mix', 'professional-mix', 'premium-mix-master'];
    const excludedCount = siteConfig.sales.excludeServiceIds.length;
    const totalServices = allServiceIds.length;

    if (excludedCount === 0) {
      // All services on sale
      return `🔥 ${siteConfig.sales.name} - ${siteConfig.sales.percentage}% Off All Services! 🔥`;
    } else if (excludedCount === totalServices) {
      // No services on sale (shouldn't happen if sale is active, but just in case)
      return `🔥 ${siteConfig.sales.name} - Special Pricing Available! 🔥`;
    } else {
      // Some services on sale
      return `🔥 ${siteConfig.sales.name} - ${siteConfig.sales.percentage}% Off Select Services! 🔥`;
    }
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

        if (adjustedMin === adjustedMax) {
          return `${adjustedMin} days`;
        } else {
          return `${adjustedMin}-${adjustedMax} days`;
        }
      }
    }
    return originalTime;
  };

  return {
    // Direct config access
    config: siteConfig,

    // Calculated values
    isSaleActive: siteConfig.sales.active && !isSaleExpired,
    isMaintenanceMode: siteConfig.business.maintenanceMode,
    isAcceptingOrders: siteConfig.orders.accepting,

    // Helper functions
    calculateSalePrice,
    formatPrice,
    getOrderCapacityStatus,
    adjustTurnaroundTime,

    // Convenience getters
    salesInfo: {
      active: siteConfig.sales.active && !isSaleExpired,
      name: siteConfig.sales.name,
      percentage: siteConfig.sales.percentage,
      endDate: siteConfig.sales.endDate,
    },

    contactInfo: siteConfig.contact,
    businessInfo: siteConfig.business,
    paymentInfo: siteConfig.payment,
    features: siteConfig.features,

    // Dynamic sale messaging
    saleMessage: getSaleMessage(),
  };
};

export default useSiteConfig;
