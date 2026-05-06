const axios = require('axios');

class PaystackService {
  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY;
    this.publicKey = process.env.PAYSTACK_PUBLIC_KEY;
    this.baseUrl = process.env.PAYSTACK_BASE_URL || 'https://api.paystack.co';
    this.useMock = process.env.USE_MOCK_PAYMENTS === 'true' || !process.env.PAYSTACK_SECRET_KEY;
    // Use the CLIENT_URL from environment variables, default to port 5173
    this.frontendUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  }

  async initializeTransaction({ email, amount, reference, callback_url, metadata = {} }) {
    if (this.useMock) {
      return await this.mockInitializeTransaction({ email, amount, reference, callback_url, metadata });
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/transaction/initialize`,
        {
          email,
          amount: amount * 100, // Convert to kobo
          reference,
          callback_url: callback_url || `${this.frontendUrl}/order-confirm`,
          metadata
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        authorization_url: response.data.data.authorization_url,
        access_code: response.data.data.access_code,
        reference: response.data.data.reference
      };
    } catch (error) {
      console.error('Paystack initialization error:', error.response?.data || error.message);
      throw new Error('Failed to initialize payment');
    }
  }

  async verifyTransaction(reference) {
    if (this.useMock) {
      return await this.mockVerifyTransaction(reference);
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`
          }
        }
      );

      return {
        status: response.data.data.status,
        reference: response.data.data.reference,
        amount: response.data.data.amount / 100,
        currency: response.data.data.currency,
        paid_at: response.data.data.paid_at,
        channel: response.data.data.channel,
        metadata: response.data.data.metadata
      };
    } catch (error) {
      console.error('Paystack verification error:', error.response?.data || error.message);
      throw new Error('Failed to verify payment');
    }
  }

  // Mock implementation for development/testing
  async mockInitializeTransaction({ email, amount, reference, callback_url, metadata }) {
    console.log('Mock Paystack payment initialized:', { email, amount, reference });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Use the correct frontend URL for mock payments (port 5173)
    const mockPaymentUrl = `${this.frontendUrl}/mock-payment?reference=${reference}&amount=${amount}`;
    
    console.log('Redirecting to mock payment URL:', mockPaymentUrl);
    
    return {
      authorization_url: mockPaymentUrl,
      access_code: `MOCK_ACCESS_${reference}`,
      reference: reference
    };
  }

  async mockVerifyTransaction(reference) {
    console.log('Mock Paystack verification:', reference);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // For mock, always return success
    return {
      status: 'success',
      reference: reference,
      amount: 1200, // in kobo (GHS 12.00)
      currency: 'GHS',
      paid_at: new Date().toISOString(),
      channel: 'mock',
      metadata: {}
    };
  }

  // Utility method to generate unique reference
  generateReference() {
    return `PSK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

module.exports = new PaystackService();