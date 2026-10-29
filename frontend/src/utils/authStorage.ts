const AUTH_TOKEN_KEY = 'auth_token';
const CURRENT_USER_KEY = 'fitness_tracker_current_user';
const AUTH_INVALIDATED_EVENT = 'auth:invalidated';

interface JwtPayload {
  id?: string;
  exp?: number;
}

interface StoredUser {
  id: string;
  email: string;
  username?: string;
}

const parseBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return atob(padded);
};

export const parseJwtPayload = (token: string): JwtPayload | null => {
  try {
    const [, payload = ''] = token.split('.');
    if (!payload) {
      return null;
    }

    return JSON.parse(parseBase64Url(payload)) as JwtPayload;
  } catch {
    return null;
  }
};

export const isTokenValid = (token: string | null) => {
  if (!token) {
    return false;
  }

  const payload = parseJwtPayload(token);
  if (!payload?.id) {
    return false;
  }

  if (payload.exp && payload.exp * 1000 <= Date.now()) {
    return false;
  }

  return true;
};

export const getStoredToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const getStoredUser = (): StoredUser | null => {
  const rawUser = localStorage.getItem(CURRENT_USER_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as StoredUser;
  } catch {
    return null;
  }
};

export const persistAuth = (token: string, user: StoredUser) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const invalidateStoredAuth = () => {
  clearStoredAuth();

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AUTH_INVALIDATED_EVENT));
  }
};

export const authInvalidatedEvent = AUTH_INVALIDATED_EVENT;
