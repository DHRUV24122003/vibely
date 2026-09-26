import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/appwrite/api";
import type { IUser } from "@/types";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export const INITIAL_USER: IUser = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false,
  resetUser: () => {},
};

type IContextType = {
  user: IUser;
  isLoading: boolean;

  setUser: React.Dispatch<React.SetStateAction<IUser>>;

  isAuthenticated: boolean;

  setIsAuthenticated: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  checkAuthUser: () => Promise<boolean>;

  resetUser: () => void;
};

const AuthContext =
  createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();

  const [user, setUser] =
    useState<IUser>(INITIAL_USER);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const resetUser = () => {
    setUser(INITIAL_USER);
    setIsAuthenticated(false);
  };

  const checkAuthUser = async () => {
    setIsLoading(true);

    try {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        resetUser();
        return false;
      }

      setUser({
        id: currentUser.$id,
        name: currentUser.name ?? "",
        username: currentUser.username ?? "",
        email: currentUser.email ?? "",
        imageUrl: currentUser.imageUrl ?? "",
        bio: currentUser.bio ?? "",
      });

      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error(
        "CHECK AUTH USER ERROR:",
        error
      );

      resetUser();

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const authenticated =
        await checkAuthUser();

      if (!authenticated) {
        navigate("/sign-in");
      }
    };

    initializeAuth();
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
    resetUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useUserContext = () =>
  useContext(AuthContext);