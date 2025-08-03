<<<<<<< HEAD
// utils/watchlist.ts

const WATCHLIST_KEY = 'crypto_watchlist';

export function getWatchlist(): string[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(WATCHLIST_KEY) || '[]');
}

export function addToWatchlist(id: string) {
  const list = getWatchlist();
  if (!list.includes(id)) {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify([...list, id]));
  }
}

export function removeFromWatchlist(id: string) {
  const list = getWatchlist().filter((coinId) => coinId !== id);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
}

export function isInWatchlist(id: string): boolean {
  return getWatchlist().includes(id);
}
=======
// utils/watchlist.ts

const WATCHLIST_KEY = 'crypto_watchlist';

export function getWatchlist(): string[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(WATCHLIST_KEY) || '[]');
}

export function addToWatchlist(id: string) {
  const list = getWatchlist();
  if (!list.includes(id)) {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify([...list, id]));
  }
}

export function removeFromWatchlist(id: string) {
  const list = getWatchlist().filter((coinId) => coinId !== id);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
}

export function isInWatchlist(id: string): boolean {
  return getWatchlist().includes(id);
}
>>>>>>> 0531485727fe6bd55323a352e32c0f6dfb728122
