"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message: string;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-yellow-100 text-yellow-700",
  Converted: "bg-green-100 text-green-700",
  Closed: "bg-gray-100 text-gray-600",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState("inquiries");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [settings, setSettings] = useState({
    phone: "+91 7878407051",
    address: "251, Pakka Bagh, Anaj Mandi Hapur 245101, Uttar Pradesh",
    email: "info@vidyaitservices.com",
    whatsapp: "917878407051",
    adminPassword: "",
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin"); return; }
    fetchInquiries(token);
  }, [router]);

  const fetchInquiries = async (token: string) => {
    try {
      const res = await fetch("/api/admin/inquiries", {
        headers: { authorization: token },
      });
      const data = await res.json();
      setInquiries(data.data || []);
    } catch { setInquiries([]); }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin");
  };

  const saveSettings = () => {
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const newCount = inquiries.filter(i => i.status === "New").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <Image src="/logo.png" alt="Vidya IT" width={120} height={40} className="h-9 w-auto object-contain" />
          <div className="hidden sm:block">
            <p className="text-xs text-gray-400">Admin Panel</p>
            <p className="font-bold text-gray-900 text-sm">Vidya IT Services</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {newCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {newCount} New
            </span>
          )}
          <a href="/" target="_blank" className="text-sm text-blue-600 hover:underline hidden sm:block">View Website ↗</a>
          <button onClick={logout} className="text-sm text-red-500 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
            Logout
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Inquiries", value: inquiries.length, color: "#0056b3", emoji: "📋" },
          { label: "New", value: inquiries.filter(i => i.status === "New").length, color: "#ef4444", emoji: "🔔" },
          { label: "Converted", value: inquiries.filter(i => i.status === "Converted").length, color: "#22c55e", emoji: "✅" },
          { label: "Contacted", value: inquiries.filter(i => i.status === "Contacted").length, color: "#f59e0b", emoji: "📞" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.emoji}</span>
              <span className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</span>
            </div>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-6 mb-4">
        <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit">
          {[
            { id: "inquiries", label: "📋 Inquiries" },
            { id: "settings", label: "⚙️ Settings" },
            { id: "payment", label: "💰 Payment" },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-8">
        {/* INQUIRIES TAB */}
        {tab === "inquiries" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">All Inquiries ({inquiries.length})</h2>
              </div>
              <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
                {loading && <p className="text-center text-gray-400 py-8">Loading...</p>}
                {!loading && inquiries.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="text-gray-500">No inquiries yet</p>
                    <p className="text-gray-400 text-sm mt-1">Inquiries will appear here when customers fill the contact form</p>
                  </div>
                )}
                {inquiries.map(inq => (
                  <button
                    key={inq.id}
                    onClick={() => setSelected(inq)}
                    className={`w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors ${selected?.id === inq.id ? "bg-blue-50" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-semibold text-gray-900 text-sm">{inq.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${statusColors[inq.status] || "bg-gray-100 text-gray-600"}`}>
                        {inq.status}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs">{inq.phone} • {inq.service || "General"}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{new Date(inq.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Detail */}
            {selected ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-gray-900">Inquiry Details</h2>
                  <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Name", value: selected.name },
                      { label: "Phone", value: selected.phone },
                      { label: "Email", value: selected.email || "Not provided" },
                      { label: "Service", value: selected.service || "General" },
                    ].map(field => (
                      <div key={field.label} className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-0.5">{field.label}</p>
                        <p className="font-semibold text-gray-900 text-sm">{field.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Message</p>
                    <p className="text-gray-700 text-sm">{selected.message}</p>
                  </div>

                  {/* Actions */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Update Status:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {["New", "Contacted", "Converted", "Closed"].map(status => (
                        <button
                          key={status}
                          onClick={() => updateStatus(selected.id, status)}
                          className={`py-2 rounded-xl text-sm font-medium transition-all ${selected.status === status ? "ring-2 ring-blue-500" : ""} ${statusColors[status]}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <a
                      href={`tel:${selected.phone}`}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl text-white font-medium text-sm transition-all"
                      style={{ background: "#0056b3" }}
                    >
                      📞 Call Now
                    </a>
                    <a
                      href={`https://wa.me/${selected.phone.replace(/\D/g, "")}?text=Hello ${selected.name}! I am calling from Vidya IT Services regarding your inquiry about ${selected.service || "our services"}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 rounded-xl text-white font-medium text-sm"
                      style={{ background: "#25D366" }}
                    >
                      💬 WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl flex items-center justify-center min-h-48 border-2 border-dashed border-gray-200">
                <div className="text-center text-gray-400">
                  <p className="text-4xl mb-2">👆</p>
                  <p>Select an inquiry to view details</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {tab === "settings" && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-6">⚙️ Website Settings</h2>
              <div className="space-y-4">
                {[
                  { label: "Phone Number", key: "phone", type: "text", placeholder: "+91 7878407051" },
                  { label: "WhatsApp Number (with country code)", key: "whatsapp", type: "text", placeholder: "917878407051" },
                  { label: "Email Address", key: "email", type: "email", placeholder: "info@vidyaitservices.com" },
                  { label: "Office Address", key: "address", type: "text", placeholder: "Your address" },
                  { label: "New Admin Password (leave blank to keep current)", key: "adminPassword", type: "password", placeholder: "New password" },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      value={settings[field.key as keyof typeof settings]}
                      onChange={e => setSettings({ ...settings, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-yellow-800 text-sm font-semibold mb-1">⚠️ Important Note</p>
                  <p className="text-yellow-700 text-xs">Phone/Address changes yahan save hone ke baad developer ko code update karna hoga website pe reflect karne ke liye. Ya aap WhatsApp pe contact karein.</p>
                </div>

                <button
                  onClick={saveSettings}
                  className="w-full py-3 rounded-xl text-white font-bold transition-all hover:opacity-90"
                  style={{ background: "#0056b3" }}
                >
                  {settingsSaved ? "✅ Settings Saved!" : "💾 Save Settings"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PAYMENT TAB */}
        {tab === "payment" && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-2">💰 Payment Links</h2>
              <p className="text-gray-500 text-sm mb-6">Razorpay payment links banao aur clients ko bhejo</p>

              <div className="space-y-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="font-semibold text-brand-blue mb-3">Razorpay Account Setup</p>
                  <ol className="space-y-2 text-sm text-gray-600">
                    <li>1. 👉 <a href="https://razorpay.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">razorpay.com</a> pe account banao (FREE)</li>
                    <li>2. Dashboard → Payment Links → Create</li>
                    <li>3. Amount aur description daalo</li>
                    <li>4. Link copy karo aur client ko bhejo WhatsApp pe</li>
                  </ol>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    { service: "Website Development", amount: "8999", desc: "Basic Website Package" },
                    { service: "CCTV Installation", amount: "4999", desc: "Basic CCTV Package" },
                    { service: "Digital Marketing", amount: "4999", desc: "Monthly Digital Marketing" },
                    { service: "Hardware Service", amount: "299", desc: "Computer Repair/Service" },
                  ].map((pkg, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{pkg.service}</p>
                        <p className="text-gray-500 text-xs">Starting ₹{pkg.amount}</p>
                      </div>
                      <a
                        href="https://dashboard.razorpay.com/app/payment-links/new"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-white px-3 py-2 rounded-lg"
                        style={{ background: "#0056b3" }}
                      >
                        Create Link
                      </a>
                    </div>
                  ))}
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-green-800 font-semibold text-sm mb-1">✅ Razorpay Benefits</p>
                  <ul className="text-green-700 text-xs space-y-1">
                    <li>• No setup fee — FREE account</li>
                    <li>• UPI, Cards, Net Banking sab accept karo</li>
                    <li>• 2% transaction fee only on successful payments</li>
                    <li>• Automatic payment confirmation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
