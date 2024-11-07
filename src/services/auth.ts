// const API_URL = "http://192.168.88.87:5000/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  register: async (username: string, email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    return response.json();
  },

  getCurrentUser: async (token: string) => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.json();
  },
};
