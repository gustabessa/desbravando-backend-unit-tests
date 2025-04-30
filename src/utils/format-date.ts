export function formatDate(date: Date) {
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  return `${date.getUTCDate()}/${
    date.getUTCMonth() + 1
  }/${date.getUTCFullYear()}`;
}
