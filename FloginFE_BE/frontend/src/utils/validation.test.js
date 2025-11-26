// validation.test.js
import { validateLogin } from './validateLogin';

describe('validateLogin', () => {
  it('returns true for valid email and password', () => {
    expect(validateLogin('test@example.com', '123456')).toBe(true);
  });
  it('returns false for missing email', () => {
    expect(validateLogin('', '123456')).toBe(false);
  });
  it('returns false for invalid email', () => {
    expect(validateLogin('invalid', '123456')).toBe(false);
  });
  it('returns false for short password', () => {
    expect(validateLogin('test@example.com', '123')).toBe(false);
  });
});
