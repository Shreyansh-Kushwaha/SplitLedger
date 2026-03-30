export const authService = {
  getToken: () => localStorage.getItem('splitledger_token'),
  getUser: () => JSON.parse(localStorage.getItem('splitledger_user') || 'null'),
  getDarkMode: () => JSON.parse(localStorage.getItem('splitledger_darkMode') ?? 'true'),

  setToken: (token) => localStorage.setItem('splitledger_token', token),
  setUser: (user) => localStorage.setItem('splitledger_user', JSON.stringify(user)),
  setDarkMode: (darkMode) => localStorage.setItem('splitledger_darkMode', JSON.stringify(darkMode)),

  clear: () => {
    localStorage.removeItem('splitledger_token');
    localStorage.removeItem('splitledger_user');
    localStorage.removeItem('splitledger_darkMode');
  },

  isAuthenticated: () => Boolean(authService.getToken() && authService.getUser()),
};