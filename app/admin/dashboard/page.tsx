"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  date: string;
  status: "new" | "contacted" | "closed";
}

// ─── Mock Data (replace with real API calls later) ────────────────────────────
const MOCK_INQUIRIES: Inquiry[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "9876543210",
    service: "Web Development",
    message: "Mujhe ek e-commerce website chahiye.",
    date: "2024-12-01",
    status: "new",
  },
  {
    id: "2",
    name: "Priya Singh",
    email: "priya@example.com",
    phone: "9123456789",
    service: "SEO",
    message: "Meri website ka SEO improve karna hai.",
    date: "2024-12-03",
    status: "contacted",
  },
  {
    id: "3",
    name: "Amit Kumar",
    email: "amit@example.com",
    phone: "9988776655",
    service: "App Development",
    message: "Android app develop karwani hai.",
    date: "2024-12-05",
    status: "closed",
  },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Inquiry["status"] }) {
  const styles: Record<Inquiry["status"], React.CSSProperties> = {
    new: { background: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0" },
    contacted: { background: "#fef9c3", color: "#854d0e", border: "1px solid #fef08a" },
    closed: { background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0" },
  };
  const labels = { new: "🟢 New", contacted: "🟡 Contacted", closed: "⚪ Closed" };
  return (
    <span style={{ ...styles[status], padding: "2px 10px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600 }}>
      {labels[status]}
    </span>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"stats" | "inquiries" | "settings" | "payment">("stats");
  const [inquiries, setInquiries] = useState<Inquiry[]>(MOCK_INQUIRIES);
  const [filterStatus, setFilterStatus] = useState<"all" | Inquiry["status"]>("all");
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settings, setSettings] = useState({ siteName: "Vidya IT Services", email: "info@vidyaitservices.com", phone: "9876543210" });

  // ✅ SSR-safe auth check — runs only on client after mount
  useEffect(() => {
    setMounted(true);
    const auth = sessionStorage.getItem("adminAuth");
    if (auth !== "true") {
      router.replace("/admin");
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    router.replace("/admin");
  };

  const handleStatusChange = (id: string, newStatus: Inquiry["status"]) => {
    setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq)));
  };

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const filtered = filterStatus === "all" ? inquiries : inquiries.filter((i) => i.status === filterStatus);
  const stats = {
    total: inquiries.length,
    new: inquiries.filter((i) => i.status === "new").length,
    contacted: inquiries.filter((i) => i.status === "contacted").length,
    closed: inquiries.filter((i) => i.status === "closed").length,
  };

  // Prevent SSR flash — show loading until client mounts
  if (!mounted) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "4px solid #e2e8f0", borderTopColor: "#0070f3", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }} />
          <p style={{ color: "#64748b", fontFamily: "sans-serif" }}>Loading dashboard...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  const tabStyle = (tab: string): React.CSSProperties => ({
    padding: "0.6rem 1.2rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.9rem",
    transition: "all 0.2s",
    background: activeTab === tab ? "#0070f3" : "transparent",
    color: activeTab === tab ? "white" : "#64748b",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ── Header ── */}
      <header style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#0070f3,#00c6ff)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: "1.1rem" }}>V</div>
          <div>
            <div style={{ fontWeight: 700, color: "#1e293b", fontSize: "1rem" }}>Vidya IT Services</div>
            <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Admin Dashboard</div>
          </div>
        </div>
        <button onClick={handleLogout} style={{ padding: "0.5rem 1.2rem", background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}>
          🚪 Logout
        </button>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1rem" }}>

        {/* ── Tabs ── */}
        <nav style={{ display: "flex", gap: "0.5rem", background: "white", padding: "0.5rem", borderRadius: "12px", marginBottom: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", flexWrap: "wrap" }}>
          {(["stats", "inquiries", "settings", "payment"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={tabStyle(tab)}>
              {{ stats: "📊 Stats", inquiries: "📩 Inquiries", settings: "⚙️ Settings", payment: "💳 Payment" }[tab]}
            </button>
          ))}
        </nav>

        {/* ══ STATS TAB ══ */}
        {activeTab === "stats" && (
          <div>
            <h2 style={{ color: "#1e293b", marginBottom: "1.5rem", fontWeight: 700 }}>📊 Overview</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              {[
                { label: "Total Inquiries", value: stats.total, color: "#0070f3", bg: "#eff6ff" },
                { label: "New", value: stats.new, color: "#16a34a", bg: "#f0fdf4" },
                { label: "Contacted", value: stats.contacted, color: "#ca8a04", bg: "#fefce8" },
                { label: "Closed", value: stats.closed, color: "#64748b", bg: "#f8fafc" },
              ].map((card) => (
                <div key={card.label} style={{ background: card.bg, border: `1px solid ${card.color}22`, borderRadius: "14px", padding: "1.5rem", textAlign: "center" }}>
                  <div style={{ fontSize: "2.5rem", fontWeight: 800, color: card.color }}>{card.value}</div>
                  <div style={{ color: "#64748b", fontWeight: 600, marginTop: "0.25rem", fontSize: "0.9rem" }}>{card.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "white", borderRadius: "14px", padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <h3 style={{ color: "#1e293b", marginBottom: "1rem", fontWeight: 700 }}>Recent Activity</h3>
              {inquiries.slice(0, 3).map((inq) => (
                <div key={inq.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div>
                    <span style={{ fontWeight: 600, color: "#1e293b" }}>{inq.name}</span>
                    <span style={{ color: "#94a3b8", fontSize: "0.85rem", marginLeft: "0.5rem" }}>— {inq.service}</span>
                  </div>
                  <StatusBadge status={inq.status} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ INQUIRIES TAB ══ */}
        {activeTab === "inquiries" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
              <h2 style={{ color: "#1e293b", fontWeight: 700, margin: 0 }}>📩 Inquiries ({filtered.length})</h2>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                style={{ padding: "0.5rem 1rem", border: "1px solid #e2e8f0", borderRadius: "8px", background: "white", color: "#1e293b", fontWeight: 600, cursor: "pointer" }}>
                <option value="all">All</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8", background: "white", borderRadius: "14px" }}>No inquiries found.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {filtered.map((inq) => (
                  <div key={inq.id} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
                      <div>
                        <span style={{ fontWeight: 700, color: "#1e293b", fontSize: "1.05rem" }}>{inq.name}</span>
                        <span style={{ marginLeft: "0.75rem", background: "#eff6ff", color: "#0070f3", padding: "2px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600 }}>{inq.service}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <StatusBadge status={inq.status} />
                        <select value={inq.status} onChange={(e) => handleStatusChange(inq.id, e.target.value as Inquiry["status"])}
                          style={{ padding: "4px 8px", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "0.8rem", cursor: "pointer", background: "white" }}>
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.4rem", marginBottom: "0.75rem" }}>
                      <span style={{ color: "#64748b", fontSize: "0.85rem" }}>📧 {inq.email}</span>
                      <span style={{ color: "#64748b", fontSize: "0.85rem" }}>📱 {inq.phone}</span>
                      <span style={{ color: "#64748b", fontSize: "0.85rem" }}>📅 {inq.date}</span>
                    </div>
                    <div style={{ background: "#f8fafc", borderRadius: "8px", padding: "0.75rem", color: "#475569", fontSize: "0.9rem", borderLeft: "3px solid #0070f3" }}>
                      💬 {inq.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ SETTINGS TAB ══ */}
        {activeTab === "settings" && (
          <div>
            <h2 style={{ color: "#1e293b", marginBottom: "1.5rem", fontWeight: 700 }}>⚙️ Settings</h2>
            <div style={{ background: "white", borderRadius: "14px", padding: "2rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <form onSubmit={handleSettingsSave}>
                {[
                  { label: "Site Name", key: "siteName", type: "text" },
                  { label: "Contact Email", key: "email", type: "email" },
                  { label: "Phone Number", key: "phone", type: "tel" },
                ].map(({ label, key, type }) => (
                  <div key={key} style={{ marginBottom: "1.25rem" }}>
                    <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "0.4rem", fontSize: "0.9rem" }}>{label}</label>
                    <input type={type} value={settings[key as keyof typeof settings]}
                      onChange={(e) => setSettings((prev) => ({ ...prev, [key]: e.target.value }))}
                      style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "0.95rem", boxSizing: "border-box", outline: "none", color: "#1e293b" }} />
                  </div>
                ))}
                <button type="submit" style={{ padding: "0.75rem 2rem", background: "#0070f3", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "0.95rem" }}>
                  💾 Save Settings
                </button>
                {settingsSaved && <span style={{ marginLeft: "1rem", color: "#16a34a", fontWeight: 600 }}>✅ Saved!</span>}
              </form>
            </div>
          </div>
        )}

        {/* ══ PAYMENT TAB ══ */}
        {activeTab === "payment" && (
          <div>
            <h2 style={{ color: "#1e293b", marginBottom: "1.5rem", fontWeight: 700 }}>💳 Payment Info</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
              {[
                { icon: "🏦", title: "Bank Transfer", lines: ["Bank: SBI / HDFC", "A/C No: XXXX-XXXX-XXXX", "IFSC: SBIN0001234", "Name: Vidya IT Services"] },
                { icon: "📱", title: "UPI Payment", lines: ["UPI ID: vidyait@upi", "PhonePe / GPay / Paytm", "Scan QR Code to pay"] },
                { icon: "💼", title: "Business Info", lines: ["GST: 09XXXXX1234X1ZX", "PAN: XXXXX1234X", "Regd: Rampur, UP"] },
              ].map((card) => (
                <div key={card.title} style={{ background: "white", borderRadius: "14px", padding: "1.75rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{card.icon}</div>
                  <h3 style={{ color: "#1e293b", fontWeight: 700, marginBottom: "1rem", fontSize: "1rem" }}>{card.title}</h3>
                  {card.lines.map((line, i) => (
                    <p key={i} style={{ color: "#64748b", fontSize: "0.875rem", margin: "0.3rem 0" }}>{line}</p>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ marginTop: "1.5rem", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "12px", padding: "1rem 1.25rem", color: "#92400e", fontSize: "0.875rem" }}>
              ⚠️ Payment details update karne ke liye Settings tab use karein ya developer se contact karein.
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
