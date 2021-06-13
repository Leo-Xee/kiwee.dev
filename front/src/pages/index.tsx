import React, { useEffect } from 'react';

import { nextAuthWrapper } from '@/lib/nextAuthWrapper';
import useGetArticles from '@/hooks/swr/useGetArticles';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

import PostCardLayout from '@/components/PostCardLayout';

function Home() {
  const { articles, onNextPage, hasNextPage, isValidating } = useGetArticles();

  // 무한 스크롤
  const handleObserver: IntersectionObserverCallback = ([entry]) => {
    if (entry.isIntersecting) {
      onNextPage();
    }
  };

  const [
    onInfiniteScrollInit,
    onInfiniteScrollUpdate,
    onInfiniteScrollDisconnect,
  ] = useInfiniteScroll(handleObserver);

  useEffect(() => {
    onInfiniteScrollInit(document.querySelector('footer'));
  });

  useEffect(() => {
    const target = document.querySelector('footer');
    if (!hasNextPage) return onInfiniteScrollDisconnect(target);
    onInfiniteScrollUpdate(target);
  }, [articles, hasNextPage]);

  return <PostCardLayout articles={articles} isLoading={isValidating} />;
}

export const getServerSideProps = nextAuthWrapper({ redirectToHome: false });

export default Home;
