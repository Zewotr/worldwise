import { createContext, useContext, useEffect, useReducer } from "react";

const AuthContext = createContext();
const USERS_STORAGE_KEY = "worldwise_users";
const AUTH_USER_STORAGE_KEY = "worldwise_auth_user";

const initialState = {
  user: null,
  isAuthenticated: false,
  authError: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true, authError: null };
    case "logout":
      return { ...state, user: null, isAuthenticated: false, authError: null };
    case "auth/error":
      return { ...state, authError: action.payload };
    case "auth/clear":
      return { ...state, authError: null };
    default:
      throw new Error("Unknown action");
  }
}

function getStoredUsers() {
  const raw = localStorage.getItem(USERS_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function saveAuthUser(user) {
  localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
}

function removeAuthUser() {
  localStorage.removeItem(AUTH_USER_STORAGE_KEY);
}

function createAvatar(email) {
  return `https://i.pravatar.cc/100?u=${encodeURIComponent(email)}`;
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated, authError }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    const savedUser = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (!savedUser) return;
    try {
      const parsed = JSON.parse(savedUser);
      dispatch({ type: "login", payload: parsed });
    } catch {
      removeAuthUser();
    }
  }, []);

  function login(email, password) {
    dispatch({ type: "auth/clear" });

    if (!email || !password) {
      dispatch({ type: "auth/error", payload: "Email and password are required." });
      return false;
    }

    const users = getStoredUsers();
    const existingUser = users.find(
      (storedUser) => storedUser.email.toLowerCase() === email.toLowerCase()
    );

    if (!existingUser || existingUser.password !== password) {
      dispatch({ type: "auth/error", payload: "Email or password is incorrect." });
      return false;
    }

    const publicUser = {
      name: existingUser.name,
      email: existingUser.email,
      avatar: existingUser.avatar,
    };
    saveAuthUser(publicUser);
    dispatch({ type: "login", payload: publicUser });
    return true;
  }

  function register({ name, email, password }) {
    dispatch({ type: "auth/clear" });

    if (!name || !email || !password) {
      dispatch({ type: "auth/error", payload: "Name, email, and password are required." });
      return false;
    }

    const users = getStoredUsers();
    const existingUser = users.find(
      (storedUser) => storedUser.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      dispatch({ type: "auth/error", payload: "A user with this email already exists." });
      return false;
    }

    const newUser = {
      name,
      email,
      password,
      avatar: createAvatar(email),
    };

    saveUsers([...users, newUser]);

    const publicUser = {
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
    };
    saveAuthUser(publicUser);
    dispatch({ type: "login", payload: publicUser });
    return true;
  }

  function logout() {
    removeAuthUser();
    dispatch({ type: "logout" });
  }

  function clearError() {
    dispatch({ type: "auth/clear" });
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, authError, login, register, logout, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
