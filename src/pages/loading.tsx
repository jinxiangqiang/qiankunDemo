
import { Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';

const TIMEOUT_MESSAGE = '可能有网络问题, 加载已超时, 请等待或刷新重试。';
const NETWORK_ISSUES_ENGLISH = 'Network issues possible, Load timed out, Wait or refresh.';

const LoadingPage = () => {
  const timeoutIdRef = useRef<number | null>(null);
  const [tip, setTip] = useState(<>loading...</>);

  useEffect(() => {
    timeoutIdRef.current = window.setTimeout(() => {
      setTip(
        <div className="margin-top-xl">
          <div>{TIMEOUT_MESSAGE}</div>
          <div>{NETWORK_ISSUES_ENGLISH}</div>
        </div>,
      );
    }, 15000);

    return () => {
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  return (
    <Spin spinning={true} style={{ height: '100%', width: '100%' }} tip={tip}>
      <div style={{height: '100%'}}></div>
    </Spin>
  );
};

export default LoadingPage;
