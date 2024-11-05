"use client";
import { createContext, useContext, useReducer, ReactNode } from "react";
import { User } from "@/types/user";

type UserState = {
  users: User[];
  loading: boolean;
  error: string | null;
};

type UserAction =
  | { type: "SET_USERS"; payload: User[] }
  | { type: "ADD_USER"; payload: User }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "DELETE_USER"; payload: string }
  | { type: "SET_LOADING" }
  | { type: "SET_ERROR"; payload: string };

const UserContext = createContext<
  | {
      state: UserState;
      dispatch: React.Dispatch<UserAction>;
    }
  | undefined
>(undefined);

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "SET_USERS":
      return { ...state, users: action.payload, loading: false };
    case "ADD_USER":
      return { ...state, users: [...state.users, action.payload] };
    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        ),
      };
    case "DELETE_USER":
      return {
        ...state,
        users: state.users.filter(
          (user) => user.id !== parseInt(action.payload)
        ),
      };
    case "SET_LOADING":
      return { ...state, loading: true };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, {
    users: [],
    loading: false,
    error: null,
  });

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return context;
}
