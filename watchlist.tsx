'use client';

import { useEffect, useState } from 'react';
import { getMarketData } from '@/lib/api';
import { getWatchlist } from '@/utils/watchlist';
import Link from 'next/link';

export default function WatchlistPage() {
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlistCoins = async () => {
      const saved = getWatchlist();
      try {
        const allCoins = await getMarketData(1);
        const filtered = allCoins.filter((coin: any) => saved.includes(coin.id));
        setCoins(filtered);
      } catch (error) {
        console.error('Failed to fetch watchlist coins', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlistCoins();
  }, []);

  return (
    <div className="p-4 sm:p-6 transition-colors duration-300 text-black dark:text-white">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">⭐ Your Watchlist</h1>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      ) : coins.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No coins in your watchlist yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200 dark:border-gray-700">
            <thead className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">Coin</th>
                <th className="p-2">Price</th>
                <th className="p-2">24h %</th>
                <th className="p-2">Market Cap</th>
                <th className="p-2">Volume</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin) => (
                <tr
                  key={coin.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="p-2">{coin.market_cap_rank}</td>
                  <td className="p-2">
                    <Link
                      href={`/coin/${coin.id}`}
                      className="flex items-center gap-2 hover:underline"
                    >
                      <img src={coin.image} alt={coin.name} className="w-5 h-5" />
                      <span>{coin.name}</span>
                      <span className="text-gray-500 text-xs dark:text-gray-400">
                        ({coin.symbol.toUpperCase()})
                      </span>
                    </Link>
                  </td>
                  <td className="p-2">${coin.current_price.toLocaleString()}</td>
                  <td
                    className={`p-2 ${
                      coin.price_change_percentage_24h >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td className="p-2">${coin.market_cap.toLocaleString()}</td>
                  <td className="p-2">${coin.total_volume.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
