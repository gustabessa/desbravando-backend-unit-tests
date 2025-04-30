export function formatDate(date: Date) {
  
  if(!isValidDate(date)) return 'Invalid Date'

  return `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`;
}

function isValidDate(date: Date) {
  return date instanceof Date && !isNaN(date.getTime());
}