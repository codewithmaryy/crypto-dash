'use client';

import { useEffect, useState } from 'react';
import { getMarketData } from '@/lib/api';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../utils/watchlist';
import SkeletonRow from '@/components/SkeletonRow';
import Link from 'next/link';

export default function Home() {
  const [coins, setCoins] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        setError(false);
        const data = await getMarketData(page);
        setCoins(data);
      } catch (error) {
        console.error('Error fetching coins:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
  }, [page]);

  let filteredCoins = coins.filter((coin: any) =>
    coin.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  if (sortBy) {
    filteredCoins.sort((a: any, b: any) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-10 py-6 max-w-7xl mx-auto text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">Top Cryptocurrencies</h1>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 sm:items-center">
        <input
          type="text"
          placeholder="Search by name or symbol..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-4 mb-4">
        <button onClick={() => toggleSort('market_cap_rank')} className="px-3 py-1 text-sm border rounded bg-gray-100 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700">
          Sort by Rank {sortBy === 'market_cap_rank' ? `(${sortOrder})` : ''}
        </button>
        <button onClick={() => toggleSort('price_change_percentage_24h')} className="px-3 py-1 text-sm border rounded bg-gray-100 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700">
          Sort by 24h % {sortBy === 'price_change_percentage_24h' ? `(${sortOrder})` : ''}
        </button>
        <button onClick={() => toggleSort('total_volume')} className="px-3 py-1 text-sm border rounded bg-gray-100 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700">
          Sort by Volume {sortBy === 'total_volume' ? `(${sortOrder})` : ''}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4 text-sm">Failed to load data. Please try again.</p>}

      <div className="overflow-x-auto rounded border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Coin</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">24h %</th>
              <th className="px-3 py-2">Market Cap</th>
              <th className="px-3 py-2">Volume</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(10)].map((_, i) => <SkeletonRow key={i} />)
            ) : filteredCoins.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500 dark:text-gray-400">No coins match your search.</td>
              </tr>
            ) : (
              filteredCoins.map((coin: any) => (
                <tr key={coin.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-3 py-2">{coin.market_cap_rank}</td>
                  <td className="px-3 py-2">
                    <Link href={`/coin/${coin.id}`} className="flex items-center gap-2 hover:underline">
                      <img src={coin.image} alt={coin.name} className="w-5 h-5" />
                      {coin.name} <span className="text-gray-500 text-xs dark:text-gray-400">({coin.symbol.toUpperCase()})</span>
                    </Link>
                  </td>
                  <td className="px-3 py-2">${coin.current_price.toLocaleString()}</td>
                  <td className={`px-3 py-2 ${coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </td>
                  <td className="px-3 py-2">${coin.market_cap.toLocaleString()}</td>
                  <td className="px-3 py-2">${coin.total_volume.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm">Page {page}</span>
        <button
          onClick={() => setPage(prev => prev + 1)}
          className="px-4 py-2 border rounded bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}
