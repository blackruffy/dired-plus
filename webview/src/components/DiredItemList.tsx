import { formatDate } from '@common/date';
import { formatFileSize } from '@common/file-size';
import { Item as CommonItem, ItemList as CommonItemList } from '@common/item';
import ArticleIcon from '@mui/icons-material/Article';
import CheckIcon from '@mui/icons-material/Check';
import FolderIcon from '@mui/icons-material/Folder';
import { Box, Typography, useTheme } from '@mui/material';
import { useStore } from '@src/store';
import React from 'react';

export type Item = CommonItem &
  Readonly<{
    getSearchWord: () => string;
  }>;

export type ItemList = Omit<CommonItemList, 'parent' | 'items'> &
  Readonly<{
    parent: Item;
    items: ReadonlyArray<Item>;
  }>;

const iconSize = `1.2em`;

const iconStyle = {
  fontSize: iconSize,
};

const CheckButton = ({
  index,
  isDot,
}: Readonly<{ index: number; isDot: boolean }>): React.ReactElement => {
  const theme = useTheme();
  const { selectedView, checked, setSelectedView, setChecked } = useStore();
  const enabled = checked[index] ?? false;

  return (
    <Box
      sx={{
        paddingRight: theme.spacing(0.5),
        paddingLeft: theme.spacing(0.5),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={() => {
        setSelectedView({
          name: 'list-item',
          index,
          updatedAt: selectedView.updatedAt,
        });
        setChecked({
          ...checked,
          [index]: checked[index] === undefined ? true : !checked[index],
        });
      }}
      onChangeCapture={event => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      {enabled ? (
        <CheckIcon sx={[iconStyle]} />
      ) : (
        <CheckIcon
          sx={[
            iconStyle,
            { color: theme.palette.text.disabled },
            isDot ? { opacity: 0 } : { opacity: 0 },
          ]}
        />
      )}
    </Box>
  );
};

export const ItemView = ({
  index,
  item,
}: Readonly<{
  index: number;
  item: Item;
}>): React.ReactElement => {
  const theme = useTheme();
  const isDot = item.name === '..' || item.name === '.';

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <CheckButton index={index} isDot={isDot} />

        <Box
          sx={{
            paddingRight: theme.spacing(0.5),
            paddingLeft: theme.spacing(0.5),
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {item.itemType === 'file' ? (
            <ArticleIcon sx={iconStyle} />
          ) : (
            <FolderIcon sx={[iconStyle, { color: theme.palette.info.light }]} />
          )}
        </Box>

        <Box
          sx={{
            paddingRight: theme.spacing(0.5),
            paddingLeft: theme.spacing(0.5),
            color:
              item.itemType === 'directory'
                ? theme.palette.info.light
                : theme.palette.text.primary,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography>{item.name}</Typography>
        </Box>
      </Box>

      <Box
        sx={{
          paddingRight: theme.spacing(0.5),
          paddingLeft: theme.spacing(0.5),
          color: theme.palette.text.primary,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <Typography>
          {item.size != null ? formatFileSize(item.size) : ``}
        </Typography>
        <Box sx={{ width: theme.spacing(2) }} />
        <Typography>
          {item.lastUpdated != null
            ? formatDate(new Date(item.lastUpdated))
            : ``}
        </Typography>
      </Box>
    </>
  );
};

// export const DiredItemList = (): React.ReactElement => {
//   const { itemList, setSearchWord, selectedView, setSelectedView } = useStore();

//   return (
//     <ItemListView
//       itemList={itemList}
//       selectedView={selectedView}
//       setSearchWord={item => setSearchWord(item.path)}
//       setSelectedView={setSelectedView}
//       ItemView={ItemView}
//     />
//   );
// };
