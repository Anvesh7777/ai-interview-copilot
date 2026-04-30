import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext =
  createContext();

export const AuthProvider =
  ({
    children,
  }) => {
    const [user, setUser] =
      useState(
        () => {
          const storedUser =
            localStorage.getItem(
              "user"
            );

          return storedUser
            ? JSON.parse(
                storedUser
              )
            : null;
        }
      );

    /*
    |---------------------------------------------------------
    | Login
    |---------------------------------------------------------
    */

    const login =
      (
        userData,
        token
      ) => {
        localStorage.setItem(
          "token",
          token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            userData
          )
        );

        setUser(
          userData
        );
      };

    /*
    |---------------------------------------------------------
    | Logout
    |---------------------------------------------------------
    */

    const logout =
      () => {
        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        setUser(
          null
        );
      };

    /*
    |---------------------------------------------------------
    | Sync User Across Refresh
    |---------------------------------------------------------
    */

    useEffect(
      () => {
        const storedUser =
          localStorage.getItem(
            "user"
          );

        if (
          storedUser
        ) {
          setUser(
            JSON.parse(
              storedUser
            )
          );
        }
      },
      []
    );

    return (
      <AuthContext.Provider
        value={{
          user,
          isAuthenticated:
            !!user,
          login,
          logout,
        }}
      >
        {
          children
        }
      </AuthContext.Provider>
    );
  };

export const useAuth =
  () =>
    useContext(
      AuthContext
    );