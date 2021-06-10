import { useCallback, useState } from 'react';
import { nextAuthWrapper } from '@/lib/nextAuthWrapper';

import ProfileStats from '@/components/Profile/ProfileStats';
import ProfileUser from '@/components/Profile/ProfileUser';
import ProfileStatsPostCardList from '@/components/Profile/ProfileStatsPostCardList';
import AsyncBoundary from '@/components/AsyncBoundary';
import SkeletonProfileUser from '@/components/Skeleton/Profile/SkeletonProfileUser';
import SKeletonPostCardLayout from '@/components/Skeleton/PostCardLayout';
import FallbackProfileUser from '@/components/ErrorFallback/Profile/FallbackProfileUser';
import FallbackPostCardLayout from '@/components/ErrorFallback/PostCardLayout/FallbackPostCardLayout';

import { GET_ME_KEY } from '@/hooks/swr/useGetMe';
import useDeleteErrorCache from '@/hooks/swr/useDeleteErrorCache';

type SelectedType = 'histories' | 'likes';

function profile() {
  const [selected, setSelected] = useState<SelectedType>('histories');

  const onSetSelected = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    setSelected(e.currentTarget.name as SelectedType);
  }, []);

  return (
    <>
      <AsyncBoundary
        rejectedFallback={FallbackProfileUser}
        pendingFallback={<SkeletonProfileUser />}
        onReset={() => useDeleteErrorCache(GET_ME_KEY)}
      >
        <ProfileUser />
      </AsyncBoundary>
      <ProfileStats selected={selected} onClick={onSetSelected} />
      <AsyncBoundary
        rejectedFallback={FallbackPostCardLayout}
        pendingFallback={<SKeletonPostCardLayout />}
        onReset={() => useDeleteErrorCache()}
      >
        <ProfileStatsPostCardList selected={selected} />
      </AsyncBoundary>
    </>
  );
}

export const getServerSideProps = nextAuthWrapper({ redirectToHome: true });

export default profile;
