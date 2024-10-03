"use client";
import dotEnv from "dotenv";

dotEnv.config();
import type { AuthProvider } from "@refinedev/core";
import Cookies from "js-cookie";

export const authProvider: AuthProvider = {
  login: async ({ email, username, password, remember }) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      const user = result?.user; // assuming result contains user info

      if (!response.ok || !result || !user) {
        return {
          success: false,
          error: {
            name: "LoginError",
            message: result.message || "Invalid username or password",
          },
        };
      }

      Cookies.set("auth", JSON.stringify(user), {
        expires: remember ? 1 : undefined, // 30 days if 'remember' is true
        path: "/",
      });

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        error: {
          name: "LoginError",
          message: "An unexpected error occurred",
        },
      };
    }
  },
  logout: async () => {
    Cookies.remove("auth", { path: "/" });
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const auth = Cookies.get("auth");
    if (auth) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => {
    const auth = Cookies.get("auth");
    if (auth) {
      const parsedUser = JSON.parse(auth);
      return parsedUser.roles;
    }
    return null;
  },
  getIdentity: async () => {
    const auth = Cookies.get("auth");
    if (auth) {
      const parsedUser = JSON.parse(auth);
      return parsedUser;
    }
    return null;
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
};
