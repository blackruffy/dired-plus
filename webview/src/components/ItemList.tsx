import { formatDate } from '@common/date';
import { formatFileSize } from '@common/file-size';
import ArticleIcon from '@mui/icons-material/Article';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FolderIcon from '@mui/icons-material/Folder';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Box, Typography, useTheme } from '@mui/material';
import { useStore } from '@src/store';
import React from 'react';

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
        <CheckCircleOutlineIcon sx={[iconStyle]} />
      ) : (
        <RadioButtonUncheckedIcon
          sx={[
            iconStyle,
            { color: theme.palette.text.disabled },
            isDot ? { opacity: 0 } : {},
          ]}
        />
      )}
    </Box>
  );
};

export const ItemList = (): React.ReactElement => {
  const theme = useTheme();
  const { itemList, selectedView, setSelectedView } = useStore();
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
    <Box
      ref={scrollRef}
      sx={{
        p: 0.5,
        flex: 1,
        overflow: 'scroll',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
      }}
    >
      {items.map((item, index) => {
        const isSelected =
          selectedView.name === 'list-item' && selectedView.index === index;
        const isDot = item.name === '..' || item.name === '.';
        return (
          <Box
            ref={isSelected ? selectedRef : undefined}
            key={index}
            //selected={isSelected}
            sx={{
              paddingTop: `0px`,
              paddingBottom: `0px`,
              //height: `24px`,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: isSelected
                ? theme.palette.action.selected
                : 'transparent',
            }}
            onClick={() => {
              setSelectedView({
                name: 'list-item',
                index,
                updatedAt: selectedView.updatedAt,
              });
            }}
          >
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
                  <FolderIcon
                    sx={[iconStyle, { color: theme.palette.info.light }]}
                  />
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
          </Box>
        );
      })}
    </Box>
  );
};
