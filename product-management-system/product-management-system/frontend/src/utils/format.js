// Formatting helpers

export const formatCurrencyVND = (n) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

export const formatNumber = (n) =>
  new Intl.NumberFormat('vi-VN').format(Number(n) || 0);

export default { formatCurrencyVND, formatNumber };
