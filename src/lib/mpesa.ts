interface MpesaCredentials {
  consumerKey: string;
  consumerSecret: string;
  passkey: string;
  shortcode: string;
  callbackUrl: string;
}

class MpesaClient {
  private credentials: MpesaCredentials;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(credentials: MpesaCredentials) {
    this.credentials = credentials;
  }

  private async getAccessToken(): Promise<string> {
    // Return existing token if not expired
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const auth = Buffer.from(
      `${this.credentials.consumerKey}:${this.credentials.consumerSecret}`
    ).toString('base64');

    const response = await fetch(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    // Token expires in 1 hour, we'll refresh 5 minutes before expiry
    this.tokenExpiry = Date.now() + (55 * 60 * 1000);
    return this.accessToken;
  }

  private generateTimestamp(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hour}${minute}${second}`;
  }

  private generatePassword(timestamp: string): string {
    const str = `${this.credentials.shortcode}${this.credentials.passkey}${timestamp}`;
    return Buffer.from(str).toString('base64');
  }

  async initiateSTKPush(phoneNumber: string, amount: number, accountReference: string) {
    const timestamp = this.generateTimestamp();
    const password = this.generatePassword(timestamp);
    const accessToken = await this.getAccessToken();

    // Format phone number (remove leading 0 or +254)
    const formattedPhone = phoneNumber.replace(/^(?:0|\+254)/, '254');

    const response = await fetch(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          BusinessShortCode: this.credentials.shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: amount,
          PartyA: formattedPhone,
          PartyB: this.credentials.shortcode,
          PhoneNumber: formattedPhone,
          CallBackURL: this.credentials.callbackUrl,
          AccountReference: accountReference,
          TransactionDesc: 'School Manager Subscription',
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to initiate STK push');
    }

    return await response.json();
  }

  async checkTransactionStatus(checkoutRequestId: string) {
    const timestamp = this.generateTimestamp();
    const password = this.generatePassword(timestamp);
    const accessToken = await this.getAccessToken();

    const response = await fetch(
      'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          BusinessShortCode: this.credentials.shortcode,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: checkoutRequestId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to check transaction status');
    }

    return await response.json();
  }
}

// Create singleton instance
let mpesaClient: MpesaClient | null = null;

export function initializeMpesa(credentials: MpesaCredentials) {
  mpesaClient = new MpesaClient(credentials);
}

export function getMpesaClient(): MpesaClient {
  if (!mpesaClient) {
    throw new Error('M-Pesa client not initialized');
  }
  return mpesaClient;
} 