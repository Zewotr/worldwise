import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const FAKE_USER = {
  name: "Zewotr",
  email: "zedo@example.com",
  password: "test@123",
  avatar: "https://i.pravatar.cc/100?u=zz",
};
const initialState = {
    user: null,
    isAuthenticated: false,
};

function reducer(state, action) {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
            };
        case "LOGOUT":
            return {
                ...state,
                user: null,
                isAuthenticated: false,
            };
        default:
            return state;
    }
}

function AuthProvider({children}) {
    const [{user, isAuthenticated }, dispatch ] = useReducer(reducer, initialState);
 
     function login(email, password) {
        if (email === FAKE_USER.email && password === FAKE_USER.password)
             dispatch({ type: "LOGIN", user: FAKE_USER});
     }

     function logout() {
        dispatch({ type: "LOGOUT" });
     }

     
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {/* Your app components go here */}
      {children}
    </AuthContext.Provider>
  )
};
function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        console.log(context)
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}


export { AuthProvider , useAuth };