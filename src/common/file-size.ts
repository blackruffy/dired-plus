export const formatFileSize = (size: number): string => {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`;
  } else if (size < 1024 * 1024 * 1024) {
    return `${Math.round(size / 1024 / 1024)} MB`;
  } else if (size < 1024 * 1024 * 1024 * 1024) {
    return `${Math.round(size / 1024 / 1024 / 1024)} GB`;
  } else {
    return `${Math.round(size / 1024 / 1024 / 1024 / 1024)} TB`;
  }
};
