"use client";
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { authApi } from "@/services/auth";

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface AuthResponse {
  success: boolean;
  user?: any;
  token?: string;
  error?: string;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<AuthResponse>;
  logout: () => void;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: { user: any; token: string } }
  | { type: "AUTH_ERROR"; payload: string }
  | { type: "LOGOUT" };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, loading: true, error: null };
    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case "AUTH_ERROR":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...initialState,
        loading: false,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = Cookies.get("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({
          type: "AUTH_SUCCESS",
          payload: { user, token },
        });
      } catch (error) {
        Cookies.remove("token");
        localStorage.removeItem("user");
        dispatch({ type: "AUTH_ERROR", payload: "Session invalide" });
      }
    } else {
      dispatch({ type: "AUTH_ERROR", payload: "Non authentifié" });
    }
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      dispatch({ type: "AUTH_START" });
      const data = await authApi.login(email, password);

      if (data.token && data.user) {
        Cookies.set("token", data.token, {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });
        localStorage.setItem("user", JSON.stringify(data.user));

        dispatch({
          type: "AUTH_SUCCESS",
          payload: { user: data.user, token: data.token },
        });
        return { success: true, user: data.user, token: data.token };
      }
      throw new Error(data.error || "Échec de la connexion");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur de connexion";
      dispatch({ type: "AUTH_ERROR", payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      dispatch({ type: "AUTH_START" });
      const data = await authApi.register(username, email, password);

      if (data.token && data.user) {
        Cookies.set("token", data.token, {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });
        localStorage.setItem("user", JSON.stringify(data.user));

        dispatch({
          type: "AUTH_SUCCESS",
          payload: { user: data.user, token: data.token },
        });
        return { success: true, user: data.user, token: data.token };
      }
      throw new Error(data.error || "Échec de l'inscription");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur d'inscription";
      dispatch({ type: "AUTH_ERROR", payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
