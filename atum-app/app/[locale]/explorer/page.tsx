'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ExplorerPage from '@/components/ExplorerPage';

interface SearchResultItem {
  id: string; european: string; arabicRoot: string; rootId: string;
  rule: string; meaning: string; confidence: string; language: string;
}

interface SearchResponse {
  results: SearchResultItem[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  counts: { ATUM: number; BULL: number; TOR: number };
}

export default function Page() {
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [rootCounts, setRootCounts] = useState({ ATUM: 0, BULL: 0, TOR: 0 });
  const [search, setSearch] = useState('');
  const [activeRoot, setActiveRoot] = useState('ALL');
  const [activeLang, setActiveLang] = useState('ALL');
  const [randomLoading, setRandomLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const searchRef = useRef(search);
  const rootRef = useRef(activeRoot);
  const langRef = useRef(activeLang);
  const loadingRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  searchRef.current = search;
  rootRef.current = activeRoot;
  langRef.current = activeLang;

  const doFetch = useCallback(async (pageNum: number, append: boolean) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    if (append) setLoadingMore(true); else setLoading(true);

    const params = new URLSearchParams();
    if (searchRef.current) params.set('q', searchRef.current);
    if (rootRef.current !== 'ALL') params.set('root', rootRef.current);
    if (langRef.current !== 'ALL') params.set('lang', langRef.current);
    params.set('page', String(pageNum));
    params.set('limit', '50');

    try {
      const res = await fetch(`/api/etymology/search?${params}`);
      const data: SearchResponse = await res.json();
      setResults(prev => (append ? [...prev, ...data.results] : data.results));
      setTotal(data.total);
      setPage(data.page);
      setHasMore(data.hasMore);
      setRootCounts(data.counts);
    } catch { /* ignore */ } finally {
      setLoading(false);
      setLoadingMore(false);
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => { doFetch(1, false); }, [doFetch]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doFetch(1, false), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search, doFetch]);

  useEffect(() => { doFetch(1, false); }, [activeRoot, activeLang, doFetch]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore || loading) return;
    doFetch(page + 1, true);
  }, [hasMore, loadingMore, loading, page, doFetch]);

  const handleRandom = useCallback(async () => {
    if (randomLoading) return;
    setRandomLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeRoot !== 'ALL') params.set('root', activeRoot);
      if (activeLang !== 'ALL') params.set('lang', activeLang);
      const res = await fetch(`/api/etymology/random?${params}`);
      const data = await res.json();
      if (data?.word) {
        router.push(`/${locale}/etymology/${encodeURIComponent(data.word.toLowerCase())}`);
      }
    } catch {
      router.push(`/${locale}/etymology/paradise`);
    } finally {
      setRandomLoading(false);
    }
  }, [randomLoading, activeRoot, activeLang, router, locale]);

  return (
    <ExplorerPage
      results={results}
      total={total}
      loading={loading}
      loadingMore={loadingMore}
      hasMore={hasMore}
      rootCounts={rootCounts}
      search={search}
      activeRoot={activeRoot}
      activeLang={activeLang}
      onSearch={setSearch}
      onRootFilter={setActiveRoot}
      onLangFilter={setActiveLang}
      onLoadMore={loadMore}
      onRandom={handleRandom}
      randomLoading={randomLoading}
    />
  );
}
