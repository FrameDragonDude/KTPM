// validation.test.js
import { validateLogin } from './validateLogin';

describe('validateLogin', () => {
  it('returns true for valid username and password', () => {
    expect(validateLogin('admin', 'Admin123')).toBe(true);
  });
  it('returns false for missing username', () => {
    expect(validateLogin('', 'Admin123')).toBe(false);
  });
  it('returns false for short username', () => {
    expect(validateLogin('ab', 'Admin123')).toBe(false);
  });
  it('returns false for short password', () => {
    expect(validateLogin('admin', '123')).toBe(false);
  });
  it('returns false for password without letters', () => {
    expect(validateLogin('admin', '123456')).toBe(false);
  });
  it('returns false for password without numbers', () => {
    expect(validateLogin('admin', 'abcdef')).toBe(false);
  });
});
