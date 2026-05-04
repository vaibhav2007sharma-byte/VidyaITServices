// app/admin/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    // Auth check
    if (sessionStorage.getItem("adminAuth") !== "true") {
      router.push("/admin");
    }
  }, [router]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🛠️ Admin Dashboard</h1>
      <p>Vidya IT Services — Admin Panel</p>
      <button onClick={() => { sessionStorage.clear(); router.push("/admin"); }}>
        Logout
      </button>
    </div>
  );
}