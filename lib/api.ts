<<<<<<< HEAD
// lib/api.ts
import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
const BASE_URL = 'https://api.coingecko.com/api/v3';

export const getMarketData = async (page = 1) => {
  const res = await axios.get(`${BASE_URL}/coins/markets`, {
    headers: {
      'x-cg-demo-api-key': API_KEY,
    },
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 50,
      page,
      sparkline: false,
    },
  });

  return res.data;
};
=======
// lib/api.ts
import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
const BASE_URL = 'https://api.coingecko.com/api/v3';

export const getMarketData = async (page = 1) => {
  const res = await axios.get(`${BASE_URL}/coins/markets`, {
    headers: {
      'x-cg-demo-api-key': API_KEY,
    },
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 50,
      page,
      sparkline: false,
    },
  });

  return res.data;
};
>>>>>>> 0531485727fe6bd55323a352e32c0f6dfb728122
