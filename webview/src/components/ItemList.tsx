import ArticleIcon from '@mui/icons-material/Article';
import FolderIcon from '@mui/icons-material/Folder';
import {
  Checkbox,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import { useStore } from '@src/store';
import React from 'react';

export const ItemList = (): React.ReactElement => {
  const theme = useTheme();
  const { itemList, selectedView, checked, setSelectedView, setChecked } =
    useStore();
  const scrollRef = React.useRef<HTMLUListElement>(null);
  const selectedRef = React.useRef<HTMLDivElement>(null);

  const items = itemList?.items ?? [];

  React.useEffect(() => {
    if (scrollRef.current && selectedRef.current) {
      const containerRect = scrollRef.current.getBoundingClientRect();
      const scrollTop = scrollRef.current.scrollTop;
      const scrollBottom = scrollTop + containerRect.height;
      const itemRect = selectedRef.current.getBoundingClientRect();
      const itemY = scrollTop + itemRect.y - itemRect.height;
      if (itemY < scrollTop) {
        selectedRef.current.scrollIntoView({
          block: 'center',
        });
      } else if (itemY > scrollBottom) {
        selectedRef.current.scrollIntoView({
          block: 'center',
        });
      }
    }
  }, [selectedView]);

  return (
    <List
      ref={scrollRef}
      sx={{
        flex: 1,
        overflow: 'scroll',
      }}
    >
      {items.map((item, index) => {
        const isSelected =
          selectedView.name === 'list-item' && selectedView.index === index;
        const isDot = item.name === '..' || item.name === '.';
        return (
          <ListItemButton
            ref={isSelected ? selectedRef : undefined}
            key={index}
            selected={isSelected}
            sx={{
              paddingTop: `0px`,
              paddingBottom: `0px`,
              //height: `24px`,
            }}
            onClick={() => {
              setSelectedView({
                name: 'list-item',
                index,
                updatedAt: selectedView.updatedAt,
              });
            }}
          >
            <ListItemIcon>
              <Checkbox
                disabled={isDot}
                sx={{
                  padding: `0px`,
                  '.MuiCheckbox-root': {
                    height: `12px`,
                  },
                }}
                //edge='start'
                checked={(!isDot && checked[index]) ?? false}
                onClick={() => {
                  setSelectedView({
                    name: 'list-item',
                    index,
                    updatedAt: selectedView.updatedAt,
                  });
                  setChecked({
                    ...checked,
                    [index]:
                      checked[index] === undefined ? true : !checked[index],
                  });
                }}
                onChangeCapture={event => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                //tabIndex={-1}
                //disableRipple
                //inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            <ListItemIcon>
              {item.itemType === 'file' ? (
                <ArticleIcon />
              ) : (
                <FolderIcon sx={{ color: theme.palette.info.light }} />
              )}
            </ListItemIcon>
            <ListItemText
              primary={item.name}
              sx={{
                color:
                  item.itemType === 'directory'
                    ? theme.palette.info.light
                    : theme.palette.text.primary,
              }}
            />
          </ListItemButton>
        );
      })}
    </List>
  );
};
