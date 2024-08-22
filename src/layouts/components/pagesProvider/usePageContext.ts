import { PageContext } from './index';
import { useContext } from 'react';

const usePageContext = () => {
  return useContext(PageContext);
};

export default usePageContext;
