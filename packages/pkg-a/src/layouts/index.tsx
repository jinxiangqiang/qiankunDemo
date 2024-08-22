import { useLocation, useModel, useOutlet } from '@umijs/max';
import KeepAlive from 'keepalive-for-react';
import { useMemo } from 'react';

function Layouts() {
  const outlet = useOutlet();
  const location = useLocation();
  const cacheKey = useMemo(() => {
    return location.pathname + location.search;
  }, [location]);

  return (
    <KeepAlive activeName={cacheKey} max={10} strategy={'LRU'}>
      {outlet}
    </KeepAlive>
  );
}

export default Layouts;
