import { findAdminRouteByUrl } from '../../../../router';
import { usePageContext } from '../../../layouts';
import Loading from '../../../pages/loading';
import KeepAlive from 'keepalive-for-react';
import { Suspense, useEffect, useMemo } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';

function KeepAliveOutlet() {
  const { getKeepAliveRef, open } = usePageContext();
  const location = useLocation();
  const keepAliveRef = getKeepAliveRef();
  const outlet = useOutlet();
  /**
   * 区分要缓存的不同页面
   */
  const active = useMemo(() => {
    return location.pathname + location.search;
  }, [location.pathname, location.search]);

  const currentRoute = useMemo(() => {
    return findAdminRouteByUrl(active);
  }, [active]);

  useEffect(() => {

    open({ name: currentRoute?.name || '未知', url: location.pathname + location.search });
  }, [location, currentRoute]);


  return (
    <Suspense fallback={<Loading />}>
      <KeepAlive
        onBeforeActive={() => {
          const dropdowns = document.querySelectorAll(`.${client.antPrefix}-select-dropdown`);

          dropdowns.forEach((dropdown) => {
            if (dropdown) {
              dropdown.setAttribute('style', '');
            }
          });
          const pickerDropdowns = document.querySelectorAll(`${client.antPrefix}-picker-dropdown`);

          pickerDropdowns.forEach((pickerDropdown) => {
            if (pickerDropdown) {
              pickerDropdown.setAttribute('style', '');
            }
          });

          const dropdowns2 = document.querySelectorAll(`${client.antPrefix}-dropdown`);

          dropdowns2.forEach((dropdown) => {
            if (dropdown) {
              dropdown.setAttribute('style', '');
            }
          });
        }}
        aliveRef={keepAliveRef}
        cache={currentRoute?.cache}
        activeName={active}
        max={10}
        strategy={'LRU'}
      >
        {outlet}
      </KeepAlive>
    </Suspense>
  );
}

export default KeepAliveOutlet;
