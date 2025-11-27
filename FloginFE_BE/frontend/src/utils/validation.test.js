import { validateLogin } from './validateLogin.js'

describe('validateLogin', () => {
  it('returns true for valid username and password', () => {
    expect(validateLogin('testuser', 'abc123')).toBe(true);
  });

  it('returns false for missing username', () => {
    expect(validateLogin('', 'abc123')).toBe(false);
  });

  it('returns false for short password', () => {
    expect(validateLogin('testuser', 'abc')).toBe(false);
  });
});