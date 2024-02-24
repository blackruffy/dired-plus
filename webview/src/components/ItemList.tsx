import ArticleIcon from '@mui/icons-material/Article';
import FolderIcon from '@mui/icons-material/Folder';
import {
  Checkbox,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useStore } from '@src/store';
import React from 'react';

export const ItemList = (): React.ReactElement => {
  const { itemList, selectedIndex, checked, setSelectedIndex, setChecked } =
    useStore();

  return (
    <List>
      {(itemList === undefined ? [] : itemList.items).map((item, index) => (
        <ListItemButton
          key={index}
          selected={selectedIndex === index}
          sx={{
            height: `24px`,
          }}
        >
          <ListItemIcon>
            <Checkbox
              //edge='start'
              checked={checked[index] ?? false}
              onClick={() => {
                setSelectedIndex(index);
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
            {item.type === 'file' ? <ArticleIcon /> : <FolderIcon />}
          </ListItemIcon>
          <ListItemText primary={item.name} />
        </ListItemButton>
      ))}
    </List>
  );
};
