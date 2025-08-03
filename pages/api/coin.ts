<<<<<<< HEAD
// pages/api/coin.ts
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, range } = req.query;

  if (!id || !range) return res.status(400).json({ error: 'Missing params' });

  try {
    const [coin, chart] = await Promise.all([
      axios.get(`https://api.coingecko.com/api/v3/coins/${id}`, {
        headers: { 'x-cg-demo-api-key': API_KEY },
        params: { localization: false },
      }),
      axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`, {
        headers: { 'x-cg-demo-api-key': API_KEY },
        params: {
          vs_currency: 'usd',
          days: range,
        },
      }),
    ]);

    res.status(200).json({
      coin: coin.data,
      chart: chart.data, // Includes prices, market_caps, total_volumes
    });
  } catch (error: any) {
    console.error("API Proxy Error:", error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
=======
// pages/api/coin.ts
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, range } = req.query;

  if (!id || !range) return res.status(400).json({ error: 'Missing params' });

  try {
    const [coin, chart] = await Promise.all([
      axios.get(`https://api.coingecko.com/api/v3/coins/${id}`, {
        headers: { 'x-cg-demo-api-key': API_KEY },
        params: { localization: false },
      }),
      axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`, {
        headers: { 'x-cg-demo-api-key': API_KEY },
        params: {
          vs_currency: 'usd',
          days: range,
        },
      }),
    ]);

    res.status(200).json({
      coin: coin.data,
      chart: chart.data, // Includes prices, market_caps, total_volumes
    });
  } catch (error: any) {
    console.error("API Proxy Error:", error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
>>>>>>> 0531485727fe6bd55323a352e32c0f6dfb728122
