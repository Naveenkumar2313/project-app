
import { Address, ShippingRate, TrackingEvent } from '../types';

// Mock database of Indian Pincodes for validation demo
const PINCODE_DB: Record<string, { city: string; state: string; zone: string }> = {
  '560001': { city: 'Bangalore', state: 'Karnataka', zone: 'South' },
  '110001': { city: 'New Delhi', state: 'Delhi', zone: 'North' },
  '400001': { city: 'Mumbai', state: 'Maharashtra', zone: 'West' },
  '700001': { city: 'Kolkata', state: 'West Bengal', zone: 'East' },
  '600001': { city: 'Chennai', state: 'Tamil Nadu', zone: 'South' },
  '500001': { city: 'Hyderabad', state: 'Telangana', zone: 'South' },
};

export const ShippingService = {
  // Validate Pincode & Get Details
  validatePincode: async (pincode: string): Promise<{ valid: boolean; city?: string; state?: string; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    if (!/^\d{6}$/.test(pincode)) {
      return { valid: false, error: 'Pincode must be 6 digits.' };
    }

    const data = PINCODE_DB[pincode];
    if (data) {
      return { valid: true, city: data.city, state: data.state };
    }

    // Fallback logic for demo purposes (accept any 6 digit starting with 1-9)
    if (/^[1-9]\d{5}$/.test(pincode)) {
      return { valid: true, city: 'Unknown City', state: 'Unknown State' };
    }

    return { valid: false, error: 'Service not available in this area.' };
  },

  // Calculate Shipping Rates
  calculateRates: async (address: Address, weightKg: number = 1.5): Promise<ShippingRate[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const isMetro = ['560', '110', '400', '700', '600', '500'].some(prefix => address.zip.startsWith(prefix));
    
    const rates: ShippingRate[] = [
      {
        id: 'std_ground',
        name: 'Standard Ground',
        carrier: 'Delhivery Surface',
        price: isMetro ? 0 : 150, // Free in mock metros
        estimatedDays: isMetro ? '3-4 Days' : '5-7 Days'
      }
    ];

    // Add express option
    rates.push({
      id: 'exp_air',
      name: 'Express Air',
      carrier: 'Blue Dart Aviation',
      price: isMetro ? 150 : 350,
      estimatedDays: isMetro ? '1-2 Days' : '2-3 Days'
    });

    return rates;
  },

  // Generate Mock Tracking Timeline
  getTrackingDetails: (orderId: string): TrackingEvent[] => {
    const today = new Date();
    const history: TrackingEvent[] = [];

    // Reverse chronological order generation based on mock statuses
    // For demo, we just return a static list that looks realistic
    return [
      {
        date: new Date().toLocaleString(),
        location: 'Bangalore Hub',
        status: 'Out for Delivery',
        description: 'Agent has left the facility for delivery.'
      },
      {
        date: new Date(today.getTime() - 86400000).toLocaleString(),
        location: 'Bangalore Hub',
        status: 'Arrived at Destination Facility',
        description: 'Shipment received at destination hub.'
      },
      {
        date: new Date(today.getTime() - 172800000).toLocaleString(),
        location: 'Mumbai Gateway',
        status: 'In Transit',
        description: 'Shipment departed from intermediate facility.'
      },
      {
        date: new Date(today.getTime() - 259200000).toLocaleString(),
        location: 'Mumbai Hub',
        status: 'Picked Up',
        description: 'Shipment picked up by courier partner.'
      }
    ];
  }
};
