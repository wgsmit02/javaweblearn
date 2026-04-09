const BASE = '/api/auth'

interface AuthResponse {
  token: string
  username: string
  expiresIn: number
}

async function post(url: string, body: object): Promise<AuthResponse> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `HTTP ${res.status}`)
  }
  return res.json()
}

export const authApi = {
  login:    (username: string, password: string) => post(`${BASE}/login`,    { username, password }),
  register: (username: string, password: string) => post(`${BASE}/register`, { username, password }),
}
