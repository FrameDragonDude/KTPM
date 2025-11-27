export async function login({ username, password }) {
  if (username === 'admin' && password === 'Admin123') {
    return 'fake-token-admin';
  }
  throw new Error('Invalid credentials');
}
