import KeepAliveOutlet from './components/KeepAliveOutlet';
import PageManageProvider from './components/pagesProvider';
import React from 'react';
import usePageContext from './components/pagesProvider/usePageContext';
import Tabs from './components/tabs';

function LayoutContent() {
  const { pages, open, close, active } = usePageContext();

  return (
    <div className="ci-layout-container">
      <Tabs
        active={active}
        onClose={(key) => {
          close(key);
        }}
        items={pages.map((page) => {
          return {
            key: page.url,
            name: page.name,
          };
        })}
      ></Tabs>
      <div className={'ci-layout-body'}>
        <KeepAliveOutlet />
      </div>
    </div>
  );
}

const Layout: React.FC = () => {
  return (
    <PageManageProvider>
      <LayoutContent />
    </PageManageProvider>
  );
};

export default Layout;

export { usePageContext };
