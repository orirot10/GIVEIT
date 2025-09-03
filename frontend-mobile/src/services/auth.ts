export async function login(email: string, password: string) {
  await new Promise(r => setTimeout(r, 500));
  if (email === 'user@example.com' && password === 'password') {
    return { id: '1', email };
  }
  throw new Error('Invalid credentials');
}

export async function logout() {
  await new Promise(r => setTimeout(r, 200));
}
