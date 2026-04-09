const AUTH_EVENT = 'authchange';
const AUTH_STORAGE_KEY = 'authSession';

// Devuelve la sesion actual parseada desde localStorage.
export const getAuthSession = () => {
  const rawSession = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession);
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem('auth');
    localStorage.removeItem('authUserName');
    localStorage.removeItem('authUserEmail');
    return null;
  }
};

// Guarda una sesion consistente y emite un evento para refrescar la UI.
export const saveAuthSession = (user) => {
  const session = {
    id: user.id,
    name: user.name,
    email: user.email
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  localStorage.setItem('auth', 'true');
  localStorage.setItem('authUserName', session.name);
  localStorage.setItem('authUserEmail', session.email);
  window.dispatchEvent(new Event(AUTH_EVENT));
};

// Limpia la sesion local y notifica el cambio.
export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem('auth');
  localStorage.removeItem('authUserName');
  localStorage.removeItem('authUserEmail');
  window.dispatchEvent(new Event(AUTH_EVENT));
};

// Permite suscribirse a cambios de sesion desde distintos componentes.
export const subscribeToAuthSession = (callback) => {
  const handleChange = () => callback();

  window.addEventListener(AUTH_EVENT, handleChange);
  window.addEventListener('storage', handleChange);

  return () => {
    window.removeEventListener(AUTH_EVENT, handleChange);
    window.removeEventListener('storage', handleChange);
  };
};

export const isAuthenticated = () => Boolean(getAuthSession());
