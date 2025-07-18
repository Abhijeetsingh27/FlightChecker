import axios from 'axios';

const AMADEUS_API_URL = 'https://test.api.amadeus.com/v2';

class AmadeusService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiration = null;
  }

  async getAccessToken() {
    const clientId = process.env.REACT_APP_AMADEUS_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_AMADEUS_CLIENT_SECRET;

    // Debug logging
    console.log('Amadeus Client ID:', clientId ? 'Present' : 'Missing');
    console.log('Amadeus Client Secret:', clientSecret ? 'Present' : 'Missing');

    if (!clientId || !clientSecret) {
      throw new Error('Amadeus API credentials are missing. Please check your .env file.');
    }

    if (this.accessToken && this.tokenExpiration > Date.now()) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        'https://test.api.amadeus.com/v1/security/oauth2/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiration = Date.now() + response.data.expires_in * 1000;
      return this.accessToken;
    } catch (error) {
      const errorMessage = error.response?.data?.error_description || error.message;
      console.error('Error getting Amadeus access token:', errorMessage);
      throw new Error(`Failed to authenticate with Amadeus API: ${errorMessage}`);
    }
  }

  async searchFlights(originLocationCode, destinationLocationCode, departureDate, returnDate, adults = 1, cabinClass = 'ECONOMY') {
    try {
      const token = await this.getAccessToken();
      const response = await axios.get(`${AMADEUS_API_URL}/shopping/flight-offers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          originLocationCode,
          destinationLocationCode,
          departureDate,
          returnDate,
          adults,
          currencyCode: 'USD',
          max: 10,
          travelClass: cabinClass,
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.[0]?.detail || error.message;
      console.error('Error searching flights:', errorMessage);
      throw new Error(`Failed to search flights: ${errorMessage}`);
    }
  }

  async getFlightOffersPrice(offer) {
    try {
      const token = await this.getAccessToken();
      const response = await axios.post(
        `${AMADEUS_API_URL}/shopping/flight-offers/pricing`,
        { data: { type: 'flight-offers-pricing', flightOffers: [offer] } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.[0]?.detail || error.message;
      console.error('Error getting flight price:', errorMessage);
      throw new Error(`Failed to get flight price: ${errorMessage}`);
    }
  }
}

const amadeusService = new AmadeusService();
export default amadeusService;
