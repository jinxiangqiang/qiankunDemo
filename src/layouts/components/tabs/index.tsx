import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Link } from '@umijs/max';
import { Dropdown, MenuProps, Tooltip } from 'antd';
import classNames from 'classnames';
import { Base64 } from 'js-base64';
import { Fragment, useEffect, useRef } from 'react';
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from 'react-beautiful-dnd';
import usePageContext from '../pagesProvider/usePageContext';

interface TabsProps {
  active: string;
  items: { key: string; name: string }[];
  onClose?: (key: string) => void;
}

function Tabs(props: TabsProps) {
  const { active, items, onClose } = props;
  const { setPages, pages, closeOther, closeLeft, closeRight } = usePageContext();

  const scrollContainer = useRef<HTMLDivElement>(null);
  // listen wheel event to scroll

  useEffect(() => {
    const container = scrollContainer.current;

    if (container) {
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const x_abs = Math.abs(e.deltaX);
        const y_abs = Math.abs(e.deltaY);

        container.scrollLeft += x_abs > y_abs ? e.deltaX : e.deltaY;
      };

      container.addEventListener('wheel', handleWheel);
      return () => {
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);

  const onDragEnd: OnDragEndResponder = ({ destination, source }: any) => {
    // 拖拽到不能放置的区域
    if (!destination) {
      return;
    }
    // 原地放下
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const newTabs = Array.from(pages);
    const [movedTab] = newTabs.splice(source.index, 1);

    newTabs.splice(destination.index, 0, movedTab);

    setPages(newTabs);
  };

  useEffect(() => {
    const container = scrollContainer.current;

    if (container) {
      const activeTab = container.querySelector(`#tab-${Base64.encode(active)?.replace(/=/g, '')}`);

      if (activeTab) {
        activeTab.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [active]);

  const menuItems: MenuProps['items'] = [
    {
      key: 'close-others',
      label: '关闭其他',
      onClick: () => {
        closeOther();
      },
    },
    {
      key: 'close-left',
      label: '关闭左侧所有',
      onClick: () => {
        closeLeft();
      },
    },
    {
      key: 'close-right',
      label: '关闭右侧所有',
      onClick: () => {
        closeRight();
      },
    },
  ];

  return (
    <div className={`${client.prefix}-alive-tabs`}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tabs" direction="horizontal">
          {(provided: any) => (
            <div className={`${client.prefix}-tabs-box`} {...provided.droppableProps} ref={provided.innerRef}>
              <div className={`${client.prefix}-tabs-scroll`} ref={scrollContainer}>
                {items.map((item, index) => {
                  return (
                    <Fragment key={index}>
                      {item.key === active ? (
                        <Draggable key={item.key} draggableId={item.key} index={index}>
                          {(provided: any) => (
                            <Dropdown
                              trigger={['contextMenu']}
                              menu={{
                                items: menuItems,
                              }}
                            >
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                id={`tab-${Base64.encode(item.key)?.replace(/=/g, '')}`}
                                data-key={item.key}
                                className={classNames(`${client.prefix}-tabs-tab`, active === item.key && 'active')}
                              >
                                <Link to={item.key}>
                                  {item.name}
                                  {items.length > 1 && (
                                    <div
                                      className={`${client.prefix}-icon-close`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        if (onClose) {
                                          onClose(item.key);
                                        }
                                      }}
                                    >
                                      <CloseOutlined />
                                    </div>
                                  )}
                                </Link>
                              </div>
                            </Dropdown>
                          )}
                        </Draggable>
                      ) : (
                        <Draggable key={item.key} draggableId={item.key} index={index}>
                          {(provided: any) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              id={`tab-${Base64.encode(item.key)?.replace(/=/g, '')}`}
                              data-key={item.key}
                              className={classNames(`${client.prefix}-tabs-tab`, active === item.key && 'active')}
                            >
                              <Link to={item.key}>
                                {item.name}
                                {items.length > 1 && (
                                  <div
                                    className={`${client.prefix}-icon-close`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      if (onClose) {
                                        onClose(item.key);
                                      }
                                    }}
                                  >
                                    <CloseOutlined />
                                  </div>
                                )}
                              </Link>
                            </div>
                          )}
                        </Draggable>
                      )}
                    </Fragment>
                  );
                })}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Tooltip title="标签按住拖拽排序，选中标签右键可展开关闭其他等菜单" placement={'left'}>
        <ExclamationCircleOutlined className="margin-h" />
      </Tooltip>
    </div>
  );
}

export default Tabs;
