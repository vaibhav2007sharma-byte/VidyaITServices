// app/admin/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Vidya@Admin2024") {
      // Store auth in sessionStorage
      sessionStorage.setItem("adminAuth", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Wrong password!");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f0f2f5" }}>
      <form onSubmit={handleLogin} style={{ background: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", width: "320px" }}>
        <h2 style={{ marginBottom: "1.5rem", textAlign: "center", color: "#1a1a2e" }}>🔐 Admin Login</h2>
        <input
          type="password"
          placeholder="Password daalo"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "0.75rem", marginBottom: "1rem", border: "1px solid #ddd", borderRadius: "8px", fontSize: "1rem", boxSizing: "border-box" }}
        />
        {error && <p style={{ color: "red", marginBottom: "0.5rem", fontSize: "0.9rem" }}>{error}</p>}
        <button type="submit" style={{ width: "100%", padding: "0.75rem", background: "#0070f3", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", cursor: "pointer" }}>
          Login
        </button>
      </form>
    </div>
  );
}