import React, { Suspense } from 'react';
import PageLoading from '@components/Common/PageLoading';
import './index.less';

/*
 * 懒加载，避免全局闪屏，局部组件闪屏
 */
const LazyLoad = function LazyLoad(children: React.ReactNode) {
  return <Suspense fallback={<PageLoading className="lazy-page-loading" />}>{children}</Suspense>;
};

export { LazyLoad };
