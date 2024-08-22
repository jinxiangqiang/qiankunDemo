import { useSessionStorageState } from 'ahooks';
import { message } from 'antd';
import { useKeepaliveRef } from 'keepalive-for-react';
import { createContext, MutableRefObject, ReactNode, useMemo, useRef } from 'react';
import { NavigateOptions, useLocation, useNavigate } from 'react-router-dom';

export type PageItem = {
  // 路由的名称
  name: string;
  // 路由的 path 值 例如 /home /user?id=1
  url: string;
  // 路由的参数
  state?: any;
};

export interface PageManage {
  active: string;
  pages: PageItem[];
  close: (url: string) => void;
  open: (page: PageItem) => void;
  closeCurrent: () => void;
  getKeepAliveRef: () => MutableRefObject<any> | undefined;
  setPages: (pages: PageItem[]) => void;
  closeOther: () => void;
  closeLeft: () => void;
  closeRight: () => void;
}

export const PageContext = createContext<PageManage>({
  active: '',
  pages: [],
  close: () => {},
  open: () => {},
  closeCurrent: () => {},
  getKeepAliveRef: () => {
    return undefined;
  },
  closeOther: () => {},
  closeLeft: () => {},
  closeRight: () => {},
  setPages: () => {},
});

const TabPageStorageKey = 'ci_pages';

export function PageManageProvider(props: { children: ReactNode }) {
  const [messageApi, messageEle] = message.useMessage();
  const keepAliveRef = useKeepaliveRef();
  const lastOpenUrl = useRef<string>('');
  const location = useLocation();
  const { children } = props;
  const [pages = [], setPages] = useSessionStorageState<PageItem[]>(TabPageStorageKey, {
    defaultValue: [],
  });

  const navigate = useNavigate();

  const active = useMemo(() => {
    return location.pathname + location.search;
  }, [location.pathname, location.search]);

  const navigateTo = (key: string, options?: NavigateOptions) => {
    const pathname = key.indexOf('?') > -1 ? key.split('?')[0] : key;
    const search = key.indexOf('?') > -1 ? key.split('?')[1] : '';

    navigate(
      {
        pathname,
        search,
      },
      options,
    );
  };

  const getKeepAliveRef = () => {
    return keepAliveRef;
  };

  const open = (page: PageItem) => {
    if (!page || !page.url) {
      throw new Error(`route info error ${JSON.stringify(page)}`);
    }

    // 记住上一个打开的路由
    lastOpenUrl.current = active;
    setPages((prev = []) => {
      const existed = prev.some((item) => item.url === page.url);

      if (!existed) {
        return [...prev, page];
      }
      return prev;
    });
  };

  const close = (url: string) => {
    const index = pages.findIndex((item) => item.url === url);

    if (index === -1) return;

    const newPages = [...pages];

    if (newPages.length <= 1) {
      messageApi.error('至少保留一个标签页').then();
      return null;
    }

    keepAliveRef.current?.removeCache(url);

    newPages.splice(index, 1);
    setPages(newPages);

    let nextActiveUrl = null;
    // 如果关闭当前页面

    if (active === url) {
      const lastUrl = lastOpenUrl.current;
      // 最后打开的url是否存在于页面中

      if (lastUrl && newPages.some((item) => item.url === lastUrl)) {
        // 将最后一次打开的url设置为活动页
        nextActiveUrl = lastUrl;
      } else {
        // 如果页面中不存在最后一个打开的url，或者最后一个打开的url不存在
        // 将最后一页设置为活动页
        nextActiveUrl = newPages[newPages.length - 1].url;
      }
    }

    // 如果 nextActiveUrl 存在，就导航到 nextActiveUrl
    if (nextActiveUrl) {
      navigateTo(nextActiveUrl, {
        replace: true,
      });
    }
  };

  const closeCurrent = () => {
    return close(active);
  };

  const closeOther = () => {
    const newPages = [...pages]?.filter((item) => item.url === active);
    const removeUrls = [...pages]?.filter((item) => item.url !== active).map((item) => item.url);
    // remove cache

    removeUrls.forEach((url) => {
      keepAliveRef.current?.removeCache(url);
    });
    lastOpenUrl.current = active;
    setPages(newPages);
    if (removeUrls.length === 0) {
      message.warning('没有其他页面了！').then();
    }
  };

  const closeLeft = () => {
    // 获取当前激活页面的索引
    const currentIndex = pages.findIndex((item) => item.url === active);

    if (currentIndex > 0) {
      // 创建新数组，移除当前激活页面左侧的所有页面
      const newPages = [pages[currentIndex], ...pages.slice(currentIndex + 1)];

      // 计算需要移除的 URL 列表
      const removeUrls = pages.slice(0, currentIndex).map((item) => item.url);

      // 移除缓存
      removeUrls.forEach((url) => {
        keepAliveRef.current?.removeCache(url);
      });

      // 更新 lastOpenUrl 和 pages
      lastOpenUrl.current = active;
      setPages(newPages);
    } else {
      message.warning('左侧没有标签了!').then();
    }
  };

  const closeRight = () => {
    // 获取当前激活页面的索引
    const currentIndex = pages.findIndex((item) => item.url === active);

    if (currentIndex < pages.length - 1) {
      // 创建新数组，移除当前激活页面右侧的所有页面
      const newPages = [...pages.slice(0, currentIndex + 1)];

      // 计算需要移除的 URL 列表
      const removeUrls = pages.slice(currentIndex + 1).map((item) => item.url);

      // 移除缓存
      removeUrls.forEach((url) => {
        keepAliveRef.current?.removeCache(url);
      });

      // 更新 lastOpenUrl 和 pages
      lastOpenUrl.current = active;
      setPages(newPages);
    } else {
      message.warning('右侧没有标签了!').then();
    }
  };

  return (
    <PageContext.Provider
      value={{
        setPages,
        active,
        pages,
        close,
        open,
        closeCurrent,
        getKeepAliveRef,
        closeOther,
        closeLeft,
        closeRight,
      }}
    >
      {messageEle}
      {children}
    </PageContext.Provider>
  );
}

export default PageManageProvider;
