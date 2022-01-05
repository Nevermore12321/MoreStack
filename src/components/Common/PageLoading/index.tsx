import React from 'react';
import { Spin } from 'antd';

interface Props {
  className: string;
}

const PageLoading: React.FC<Props> = function PageLoading({ className }: Props) {
  return (
    <div className={className} style={{ textAlign: 'center' }}>
      <Spin size="large" />
    </div>
  );
};

export default PageLoading;
