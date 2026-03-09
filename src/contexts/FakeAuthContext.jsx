import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const initialState = {
    user: null,
    isAuthenticated: false,
};

function reducer(state, action) {
    switch (action.type) {
        case "login":
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
            };
        case "logout":
            return {
                ...state,
                user: null,
                isAuthenticated: false,
            };
        default:
            return state;
    }
}

const FAKE_USER = {
  name: "Zewotr",
  email: "zedo@example.com",
  password: "test@123",
//   avatar: "https://i.pravatar.cc/100?u=zz",
};

function AuthProvider({ children }) {
    const [{user, isAuthenticated }, dispatch ] = useReducer(reducer, initialState);
 
     function login(email, password) {
        if (email === FAKE_USER.email && password === FAKE_USER.password)
             dispatch({ type: "login", user: FAKE_USER});
     }

     function logout() {
        dispatch({ type: "logout" });
     }

     
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {/* Your app components go here */}
      {children}
    </AuthContext.Provider>
  )
}
function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        console.log(context)
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}


export { AuthProvider, useAuth }