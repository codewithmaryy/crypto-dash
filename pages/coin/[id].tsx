
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '@/utils/watchlist';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function CoinDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [range, setRange] = useState('7');
  const [coin, setCoin] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [watchlisted, setWatchlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (coin && descriptionRef.current) {
      const contentHeight = descriptionRef.current.scrollHeight;
      setShowReadMore(contentHeight > 200);
    }
  }, [coin]);

useEffect(() => {
  const checkDark = () => document.documentElement.classList.contains('dark');
  setIsDarkMode(checkDark());

  const observer = new MutationObserver(() => setIsDarkMode(checkDark()));
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  return () => observer.disconnect();
}, []);




  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/coin`, { params: { id, range } });
        const { coin, chart } = res.data;

        setCoin(coin);
        setChartData({
          labels: chart.prices.map((p: any) => new Date(p[0]).toLocaleDateString()),
          datasets: [
            {
              label: `${coin.name} Price (${range}d)`,
              data: chart.prices.map((p: any) => p[1]),
              fill: true,
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderColor: 'rgba(59, 130, 246, 1)',
            },
          ],
        });

        setWatchlisted(isInWatchlist(id));
      } catch (error) {
        console.error("Failed to load coin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, range]);

  const toggleWatchlist = () => {
    if (!id || typeof id !== 'string') return;
    watchlisted ? removeFromWatchlist(id) : addToWatchlist(id);
    setWatchlisted(!watchlisted);
  };

  if (!coin) return <p className="p-6 text-gray-800 dark:text-gray-200">Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-800 dark:text-gray-200">
      <div className="flex items-center gap-4 mb-4">
        <img src={coin.image.large} alt={coin.name} className="w-12 h-12" />
        <h1 className="text-3xl font-bold">
          {coin.name}{' '}
          <span className="text-gray-500 dark:text-gray-400 uppercase">({coin.symbol})</span>
        </h1>
        <button onClick={toggleWatchlist} className="ml-auto text-2xl text-red-500">
          {watchlisted ? <AiFillHeart /> : <AiOutlineHeart />}
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600 pb-2">
          About {coin.name}
        </h2>

        <div className="relative">
          <div
            ref={descriptionRef}
            className={`prose prose-sm max-w-none transition-all duration-300 leading-relaxed text-justify whitespace-pre-line dark:prose-invert ${
              expanded ? '' : 'max-h-[200px] overflow-hidden'
            }`}
            dangerouslySetInnerHTML={{
              __html: coin.description.en || '<p>No description available.</p>',
            }}
          />
          {!expanded && showReadMore && (
            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none" />
          )}
        </div>

        {showReadMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div><strong>Current Price:</strong> ${coin.market_data.current_price.usd.toLocaleString()}</div>
        <div><strong>Market Cap:</strong> ${coin.market_data.market_cap.usd.toLocaleString()}</div>
        <div><strong>24h Volume:</strong> ${coin.market_data.total_volume.usd.toLocaleString()}</div>
        <div><strong>Market Rank:</strong> #{coin.market_cap_rank}</div>
        <div><strong>Circulating Supply:</strong> {coin.market_data.circulating_supply.toLocaleString()}</div>
        <div><strong>Total Supply:</strong> {coin.market_data.total_supply ? coin.market_data.total_supply.toLocaleString() : 'N/A'}</div>
      </div>

      {chartData && (
        <div className="bg-transparent dark:bg-gray-900 shadow dark:shadow-md rounded p-4 h-[400px]">
          <div className="flex gap-2 justify-end mb-4">
            {['1', '7', '30', '90'].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 rounded text-sm font-medium border ${
                  range === r
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {r === '1' ? '24h' : `${r}d`}
              </button>
            ))}
          </div>

          <Line
  data={chartData}
  options={{
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? '#ccc' : '#333',
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#333' : '#fff',
        titleColor: isDarkMode ? '#fff' : '#000',
        bodyColor: isDarkMode ? '#fff' : '#000',
      },
    },
    scales: {
      x: {
        ticks: { color: isDarkMode ? '#aaa' : '#333' },
        grid: { color: isDarkMode ? '#444' : '#ddd' },
      },
      y: {
        ticks: { color: isDarkMode ? '#aaa' : '#333' },
        grid: { color: isDarkMode ? '#444' : '#ddd' },
      },
    },
  }}
/>

        </div>
      )}
    </div>
  );
}
