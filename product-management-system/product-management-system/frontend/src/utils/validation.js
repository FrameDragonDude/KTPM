// Utility validation helpers for frontend

export const isNonEmpty = (s) => String(s ?? '').trim().length > 0;
export const isPositiveNumber = (n) => {
  const v = Number(n);
  return Number.isFinite(v) && v > 0;
};
export const isNonNegativeInt = (n) => {
  const v = Number(n);
  return Number.isInteger(v) && v >= 0;
};

// Validate product payload; returns an errors object mapping field -> message
export const validateProduct = (p) => {
  const errors = {};
  if (!isNonEmpty(p?.name) || String(p.name).trim().length < 3) {
    errors.name = 'Name must be at least 3 characters';
  }
  if (!isPositiveNumber(p?.price)) {
    errors.price = 'Price must be greater than 0';
  }
  if (!isNonNegativeInt(p?.quantity)) {
    errors.quantity = 'Quantity must be an integer and not negative';
  }
  return errors;
};

export default {
  isNonEmpty,
  isPositiveNumber,
  isNonNegativeInt,
  validateProduct,
};
