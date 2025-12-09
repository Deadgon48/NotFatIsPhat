const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

export const ApiService = {
  async get(url) {
    const res = await fetch(API_BASE_URL + url, {
      credentials: "include"
    });
    return res.json();
  },

  async post(url, body) {
    const res = await fetch(API_BASE_URL + url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    return res.json();
  }
};
