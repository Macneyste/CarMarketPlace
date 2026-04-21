import { createContext, useContext, useEffect, useState } from 'react';
import { USER_STORAGE_KEY } from '../constants/auth';

const AppContext = createContext(null);

function getStoredUser() {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

function AppProvider({ children }) {
  const [userInfo, setUserInfo] = useState(() => getStoredUser());

  useEffect(() => {
    if (userInfo) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userInfo));
      return;
    }

    localStorage.removeItem(USER_STORAGE_KEY);
  }, [userInfo]);

  function saveUser(user) {
    setUserInfo(user);
  }

  function signout() {
    setUserInfo(null);
  }

  return (
    <AppContext.Provider
      value={{
        userInfo,
        isAuthenticated: Boolean(userInfo),
        saveUser,
        signout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
}

export { AppProvider, useAppContext };
