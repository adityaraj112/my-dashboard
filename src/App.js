import { useState, useEffect } from "react";

const STORAGE_KEY = "wellness_dashboard_v2";

const defaultProfile = {
  name: "",
  email: "",
  avatar: "😊",
  monthlyBudget: 0,
  categoryBudgets: { food: 0, health: 0, entertainment: 0, transport: 0, shopping: 0, utilities: 0, travel: 0, learning: 0 },
  joinDate: new Date().toISOString().split("T")[0],
};

const categoryEmojis = {
  health: "❤️", learning: "🎓", productivity: "⚡", mindfulness: "🧠",
  finance: "💰", food: "🍽️", entertainment: "🎬", transport: "🚗",
  shopping: "🛍️", utilities: "⚙️", travel: "✈️", personal: "👤", general: "📍"
};

const AVATARS = ["😊","🧑","👨‍💻","👩‍💻","🧑‍🎓","👨‍🚀","🦸","🧙","🐱","🐼","🦊","🌟"];

const ACHIEVEMENTS = [
  { id: "first_habit", icon: "🌱", title: "First Step", desc: "Add your first habit", check: (h) => h.length >= 1 },
  { id: "streak_7", icon: "🔥", title: "Week Warrior", desc: "Get a 7-day streak", check: (h) => h.some(x => x.streak >= 7) },
  { id: "streak_30", icon: "💫", title: "Monthly Master", desc: "Get a 30-day streak", check: (h) => h.some(x => x.streak >= 30) },
  { id: "habits_5", icon: "🏅", title: "Habit Builder", desc: "Track 5 habits", check: (h) => h.length >= 5 },
  { id: "habits_10", icon: "🏆", title: "Habit Champion", desc: "Track 10 habits", check: (h) => h.length >= 10 },
  { id: "first_expense", icon: "💸", title: "Money Tracker", desc: "Log your first expense", check: (h, e) => e.length >= 1 },
  { id: "expenses_10", icon: "📊", title: "Finance Pro", desc: "Log 10 expenses", check: (h, e) => e.length >= 10 },
  { id: "all_habits", icon: "✨", title: "Perfect Day", desc: "Complete all habits in a day", check: (h) => h.length > 0 && h.every(x => x.completed) },
  { id: "saver", icon: "🏦", title: "Saver", desc: "Stay under budget for a month", check: (h, e, p) => p.monthlyBudget > 0 && e.reduce((s, x) => s + x.amount, 0) < p.monthlyBudget },
];

export default function WellnessDashboard() {
  const [habits, setHabits] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [profile, setProfile] = useState(defaultProfile);
  const [activeTab, setActiveTab] = useState("overview");
  const [darkMode, setDarkMode] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [newHabit, setNewHabit] = useState({ name: "", icon: "⭐", category: "general", goal: 30, notes: "" });
  const [newExpense, setNewExpense] = useState({ name: "", amount: "", category: "food", vendor: "" });
  const [toast, setToast] = useState(null);
  const [profileForm, setProfileForm] = useState(defaultProfile);
  const [isNewUser, setIsNewUser] = useState(true);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setHabits(data.habits || []);
        setExpenses(data.expenses || []);
        setProfile(data.profile || defaultProfile);
        setProfileForm(data.profile || defaultProfile);
        setDarkMode(data.darkMode !== undefined ? data.darkMode : true);
        setIsNewUser(false);
      } else {
        setShowProfileModal(true);
      }
    } catch (e) {}
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ habits, expenses, profile, darkMode }));
    } catch (e) {}
  }, [habits, expenses, profile, darkMode]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ===== THEME =====
  const theme = {
    bg: darkMode ? "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)" : "linear-gradient(135deg, #e0f2fe 0%, #f0f4ff 50%, #e0f2fe 100%)",
    card: darkMode ? "rgba(30,41,59,0.7)" : "rgba(255,255,255,0.85)",
    border: darkMode ? "#334155" : "#cbd5e1",
    text: darkMode ? "#f1f5f9" : "#1e293b",
    subtext: darkMode ? "#94a3b8" : "#64748b",
    input: darkMode ? "#1e293b" : "#f8fafc",
    inputBorder: darkMode ? "#475569" : "#cbd5e1",
  };

  // ===== ANALYTICS =====
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const avgExpense = expenses.length > 0 ? (totalExpenses / expenses.length).toFixed(2) : "0.00";
  const completionRate = habits.length > 0 ? Math.round((habits.filter(h => h.completed).length / habits.length) * 100) : 0;
  const totalStreak = habits.reduce((s, h) => s + h.streak, 0);
  const longestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
  const budgetUsed = profile.monthlyBudget > 0 ? Math.round((totalExpenses / profile.monthlyBudget) * 100) : 0;

  const expensesByCategory = expenses.reduce((acc, e) => {
    const ex = acc.find(i => i.name === e.category);
    if (ex) ex.value += e.amount;
    else acc.push({ name: e.category, value: e.amount });
    return acc;
  }, []);

  const expensesByMonth = expenses.reduce((acc, e) => {
    const mk = e.date.substring(0, 7);
    const ex = acc.find(i => i.month === mk);
    if (ex) ex.value += e.amount;
    else acc.push({ month: mk, value: e.amount, name: mk });
    return acc;
  }, []).sort((a, b) => a.month.localeCompare(b.month));

  const unlockedAchievements = ACHIEVEMENTS.filter(a => a.check(habits, expenses, profile));

  // ===== FILTERED EXPENSES =====
  const filteredExpenses = expenses
    .filter(e => filterCategory === "all" || e.category === filterCategory)
    .filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()) || (e.vendor || "").toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.date) - new Date(a.date);
      if (sortBy === "amount") return b.amount - a.amount;
      return a.name.localeCompare(b.name);
    });

  const filteredHabits = habits.filter(h =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ===== HABIT FUNCTIONS =====
  const addHabit = () => {
    if (!newHabit.name.trim()) return;
    const habit = { id: Date.now(), ...newHabit, streak: 0, completed: false, createdAt: new Date().toISOString().split("T")[0] };
    setHabits(prev => [...prev, habit]);
    setNewHabit({ name: "", icon: "⭐", category: "general", goal: 30, notes: "" });
    showToast("Habit added! 🎉");
  };

  const toggleHabit = (id) => {
    setHabits(habits.map(h => h.id === id
      ? { ...h, completed: !h.completed, streak: !h.completed ? h.streak + 1 : Math.max(0, h.streak - 1) }
      : h
    ));
  };

  const deleteHabit = (id) => { setHabits(habits.filter(h => h.id !== id)); showToast("Habit deleted", "info"); };

  const saveEditHabit = () => {
    setHabits(habits.map(h => h.id === editingHabit.id ? editingHabit : h));
    setEditingHabit(null);
    showToast("Habit updated ✅");
  };

  // ===== EXPENSE FUNCTIONS =====
  const addExpense = () => {
    if (!newExpense.name.trim() || !newExpense.amount) return;
    const expense = { id: Date.now(), ...newExpense, amount: parseFloat(newExpense.amount), date: new Date().toISOString().split("T")[0], icon: "💸" };
    const newTotal = totalExpenses + expense.amount;
    setExpenses(prev => [...prev, expense]);
    setNewExpense({ name: "", amount: "", category: "food", vendor: "" });
    if (profile.monthlyBudget > 0 && newTotal > profile.monthlyBudget) showToast("⚠️ Over monthly budget!", "warning");
    else showToast("Expense logged! 💸");
  };

  const deleteExpense = (id) => { setExpenses(expenses.filter(e => e.id !== id)); showToast("Expense deleted", "info"); };

  const saveEditExpense = () => {
    setExpenses(expenses.map(e => e.id === editingExpense.id ? { ...editingExpense, amount: parseFloat(editingExpense.amount) } : e));
    setEditingExpense(null);
    showToast("Expense updated ✅");
  };

  // ===== EXPORT CSV =====
  const exportCSV = () => {
    const rows = [["Name", "Amount", "Category", "Vendor", "Date"], ...expenses.map(e => [e.name, e.amount, e.category, e.vendor, e.date])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "expenses.csv"; a.click();
    showToast("CSV exported! 📤");
  };

  // ===== SAVE PROFILE =====
  const saveProfile = () => {
    setProfile(profileForm);
    setShowProfileModal(false);
    setIsNewUser(false);
    showToast(`Welcome, ${profileForm.name || "User"}! 👋`);
  };

  // ===== CHART COMPONENTS =====
  const BarChart = ({ data }) => {
    const max = Math.max(...data.map(d => d.value), 1);
    return (
      <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", height: "200px", overflowX: "auto", padding: "8px 0" }}>
        {data.map((item, idx) => (
          <div key={idx} style={{ textAlign: "center", minWidth: "50px", flex: 1 }}>
            <div style={{ height: `${Math.max((item.value / max) * 160, 4)}px`, background: "linear-gradient(180deg, #06b6d4, #7c3aed)", borderRadius: "6px 6px 0 0", marginBottom: "6px", transition: "height 0.3s" }} title={`$${item.value.toFixed(2)}`} />
            <div style={{ fontSize: "10px", color: theme.subtext, wordBreak: "break-word" }}>{item.month || item.name}</div>
            <div style={{ fontSize: "11px", color: "#06b6d4", fontWeight: "bold" }}>${item.value.toFixed(0)}</div>
          </div>
        ))}
      </div>
    );
  };

  const PieChart = ({ data }) => {
    const total = data.reduce((s, d) => s + d.value, 0);
    if (!total) return <p style={{ color: theme.subtext, textAlign: "center", padding: "40px" }}>No data yet</p>;
    const colors = ["#f87171","#34d399","#60a5fa","#fbbf24","#a78bfa","#f472b6","#2dd4bf","#fb923c"];
    let angle = 0;
    return (
      <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          {data.map((item, idx) => {
            const slice = (item.value / total) * 360;
            const start = angle; angle += slice;
            const r = 70, cx = 80, cy = 80;
            const s = (start * Math.PI) / 180, e = ((start + slice) * Math.PI) / 180;
            const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
            const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
            return <path key={idx} d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${slice > 180 ? 1 : 0},1 ${x2},${y2} Z`} fill={colors[idx % colors.length]} />;
          })}
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
          {data.map((item, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: colors[idx % colors.length], flexShrink: 0 }} />
              <span style={{ color: theme.text }}>{categoryEmojis[item.name] || ""} {item.name}: <b>${item.value.toFixed(0)}</b></span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const inputStyle = { background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: "8px", padding: "10px 14px", color: theme.text, fontSize: "14px", outline: "none", width: "100%" };
  const cardStyle = { background: theme.card, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "20px", backdropFilter: "blur(12px)" };
  const btnPrimary = { background: "linear-gradient(90deg, #06b6d4, #7c3aed)", border: "none", borderRadius: "8px", padding: "10px 20px", color: "white", fontWeight: "600", cursor: "pointer", fontSize: "14px" };

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text, fontFamily: "system-ui,-apple-system,sans-serif", transition: "all 0.3s" }}>

      {/* ===== TOAST ===== */}
      {toast && (
        <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 9999, background: toast.type === "warning" ? "#f59e0b" : toast.type === "info" ? "#64748b" : "#10b981", color: "white", padding: "12px 20px", borderRadius: "12px", fontWeight: "600", fontSize: "14px", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
          {toast.msg}
        </div>
      )}

      {/* ===== PROFILE SETUP MODAL ===== */}
      {showProfileModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ ...cardStyle, maxWidth: "500px", width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "4px" }}>{isNewUser ? "👋 Welcome! Set Up Your Profile" : "✏️ Edit Profile"}</h2>
            <p style={{ color: theme.subtext, fontSize: "13px", marginBottom: "20px" }}>Personalize your dashboard experience</p>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "13px", color: theme.subtext, marginBottom: "8px", display: "block" }}>Choose Avatar</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {AVATARS.map(a => (
                  <button key={a} onClick={() => setProfileForm({ ...profileForm, avatar: a })}
                    style={{ fontSize: "24px", background: profileForm.avatar === a ? "rgba(6,182,212,0.3)" : "transparent", border: profileForm.avatar === a ? "2px solid #06b6d4" : "2px solid transparent", borderRadius: "8px", padding: "6px", cursor: "pointer" }}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {[["Name", "name", "text", "Your name"], ["Email", "email", "email", "your@email.com"]].map(([label, key, type, ph]) => (
              <div key={key} style={{ marginBottom: "14px" }}>
                <label style={{ fontSize: "13px", color: theme.subtext, marginBottom: "6px", display: "block" }}>{label}</label>
                <input style={inputStyle} type={type} placeholder={ph} value={profileForm[key]} onChange={e => setProfileForm({ ...profileForm, [key]: e.target.value })} />
              </div>
            ))}

            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "13px", color: theme.subtext, marginBottom: "6px", display: "block" }}>💰 Monthly Budget ($)</label>
              <input style={inputStyle} type="number" placeholder="e.g. 1000" value={profileForm.monthlyBudget || ""} onChange={e => setProfileForm({ ...profileForm, monthlyBudget: parseFloat(e.target.value) || 0 })} />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "13px", color: theme.subtext, marginBottom: "10px", display: "block" }}>📂 Category Budgets ($) — optional</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {Object.keys(profileForm.categoryBudgets || {}).map(cat => (
                  <div key={cat}>
                    <label style={{ fontSize: "11px", color: theme.subtext, display: "block", marginBottom: "3px" }}>{categoryEmojis[cat]} {cat}</label>
                    <input style={{ ...inputStyle, padding: "7px 10px", fontSize: "13px" }} type="number" placeholder="0"
                      value={profileForm.categoryBudgets[cat] || ""}
                      onChange={e => setProfileForm({ ...profileForm, categoryBudgets: { ...profileForm.categoryBudgets, [cat]: parseFloat(e.target.value) || 0 } })} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={saveProfile} style={{ ...btnPrimary, flex: 1 }}>Save Profile ✅</button>
              {!isNewUser && <button onClick={() => setShowProfileModal(false)} style={{ background: theme.input, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "10px 20px", color: theme.text, cursor: "pointer", fontWeight: "600" }}>Cancel</button>}
            </div>
          </div>
        </div>
      )}

      {/* ===== EDIT HABIT MODAL ===== */}
      {editingHabit && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ ...cardStyle, maxWidth: "420px", width: "100%" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>✏️ Edit Habit</h2>
            {[["Name", "name", "text"], ["Icon", "icon", "text"], ["Goal (days)", "goal", "number"], ["Notes", "notes", "text"]].map(([label, key, type]) => (
              <div key={key} style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "13px", color: theme.subtext, marginBottom: "4px", display: "block" }}>{label}</label>
                <input style={inputStyle} type={type} value={editingHabit[key]} onChange={e => setEditingHabit({ ...editingHabit, [key]: e.target.value })} />
              </div>
            ))}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "13px", color: theme.subtext, marginBottom: "4px", display: "block" }}>Category</label>
              <select style={{ ...inputStyle }} value={editingHabit.category} onChange={e => setEditingHabit({ ...editingHabit, category: e.target.value })}>
                {Object.keys(categoryEmojis).map(c => <option key={c} value={c}>{categoryEmojis[c]} {c}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={saveEditHabit} style={{ ...btnPrimary, flex: 1 }}>Save ✅</button>
              <button onClick={() => setEditingHabit(null)} style={{ background: theme.input, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "10px 20px", color: theme.text, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== EDIT EXPENSE MODAL ===== */}
      {editingExpense && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ ...cardStyle, maxWidth: "420px", width: "100%" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>✏️ Edit Expense</h2>
            {[["Name", "name", "text"], ["Amount ($)", "amount", "number"], ["Vendor", "vendor", "text"]].map(([label, key, type]) => (
              <div key={key} style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "13px", color: theme.subtext, marginBottom: "4px", display: "block" }}>{label}</label>
                <input style={inputStyle} type={type} value={editingExpense[key]} onChange={e => setEditingExpense({ ...editingExpense, [key]: e.target.value })} />
              </div>
            ))}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "13px", color: theme.subtext, marginBottom: "4px", display: "block" }}>Category</label>
              <select style={{ ...inputStyle }} value={editingExpense.category} onChange={e => setEditingExpense({ ...editingExpense, category: e.target.value })}>
                {["food","health","entertainment","transport","shopping","utilities","travel","learning"].map(c => <option key={c} value={c}>{categoryEmojis[c]} {c}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={saveEditExpense} style={{ ...btnPrimary, flex: 1 }}>Save ✅</button>
              <button onClick={() => setEditingExpense(null)} style={{ background: theme.input, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "10px 20px", color: theme.text, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px 16px" }}>

        {/* ===== HEADER ===== */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "clamp(20px,4vw,34px)", fontWeight: "bold", background: "linear-gradient(90deg,#06b6d4,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
              💎 Wellness & Wealth
            </h1>
            <p style={{ color: theme.subtext, fontSize: "13px", margin: "4px 0 0" }}>Personal Finance & Health Tracker</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <input style={{ ...inputStyle, width: "170px", padding: "8px 12px" }} placeholder="🔍 Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            <button onClick={() => setDarkMode(!darkMode)} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "8px 12px", color: theme.text, cursor: "pointer", fontSize: "18px" }}>
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button onClick={() => { setProfileForm(profile); setShowProfileModal(true); }} style={{ display: "flex", alignItems: "center", gap: "8px", background: theme.card, border: `1px solid ${theme.border}`, borderRadius: "10px", padding: "8px 14px", color: theme.text, cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
              <span style={{ fontSize: "20px" }}>{profile.avatar}</span>
              <span>{profile.name || "Set Profile"}</span>
            </button>
          </div>
        </div>

        {/* ===== BUDGET ALERT BAR ===== */}
        {profile.monthlyBudget > 0 && (
          <div style={{ ...cardStyle, marginBottom: "20px", borderColor: budgetUsed >= 100 ? "#f87171" : budgetUsed >= 80 ? "#fbbf24" : theme.border }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
              <span style={{ fontWeight: "600", fontSize: "14px" }}>💰 Monthly Budget: ${profile.monthlyBudget}</span>
              <span style={{ fontWeight: "bold", color: budgetUsed >= 100 ? "#f87171" : budgetUsed >= 80 ? "#fbbf24" : "#34d399" }}>
                ${totalExpenses.toFixed(2)} / ${profile.monthlyBudget} ({budgetUsed}%)
              </span>
            </div>
            <div style={{ background: theme.inputBorder, borderRadius: "99px", height: "10px", overflow: "hidden" }}>
              <div style={{ width: `${Math.min(budgetUsed, 100)}%`, height: "100%", background: budgetUsed >= 100 ? "#f87171" : budgetUsed >= 80 ? "#fbbf24" : "linear-gradient(90deg,#06b6d4,#34d399)", transition: "width 0.4s", borderRadius: "99px" }} />
            </div>
            {budgetUsed >= 100 && <p style={{ color: "#f87171", fontSize: "12px", marginTop: "6px" }}>⚠️ You have exceeded your monthly budget!</p>}
            {budgetUsed >= 80 && budgetUsed < 100 && <p style={{ color: "#fbbf24", fontSize: "12px", marginTop: "6px" }}>⚠️ Approaching your monthly budget limit!</p>}
          </div>
        )}

        {/* ===== QUICK STATS ===== */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "12px", marginBottom: "24px" }}>
          {[
            { label: "✅ Completion", value: `${completionRate}%`, sub: `${habits.filter(h=>h.completed).length}/${habits.length}`, color: "#06b6d4" },
            { label: "🔥 Best Streak", value: `${longestStreak}`, sub: `Total: ${totalStreak}`, color: "#f97316" },
            { label: "💸 Total Spent", value: `$${totalExpenses.toFixed(0)}`, sub: `${expenses.length} transactions`, color: "#f87171" },
            { label: "📊 Avg Expense", value: `$${avgExpense}`, sub: "per transaction", color: "#fbbf24" },
            { label: "🏆 Achievements", value: `${unlockedAchievements.length}/${ACHIEVEMENTS.length}`, sub: "earned", color: "#a78bfa" },
          ].map((s, i) => (
            <div key={i} style={{ ...cardStyle, textAlign: "center", padding: "14px" }}>
              <p style={{ fontSize: "11px", color: theme.subtext, marginBottom: "4px" }}>{s.label}</p>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: s.color, margin: "0 0 2px" }}>{s.value}</p>
              <p style={{ fontSize: "11px", color: theme.subtext }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ===== TABS ===== */}
        <div style={{ display: "flex", gap: "2px", marginBottom: "24px", overflowX: "auto", borderBottom: `1px solid ${theme.border}` }}>
          {[["overview","📊 Overview"],["habits","💪 Habits"],["expenses","💰 Expenses"],["analytics","📈 Analytics"],["achievements","🏆 Awards"],["profile","👤 Profile"]].map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "10px 14px", fontWeight: "600", fontSize: "13px", background: "none", border: "none",
              borderBottom: activeTab === tab ? "3px solid #06b6d4" : "3px solid transparent",
              color: activeTab === tab ? "#06b6d4" : theme.subtext, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s"
            }}>{label}</button>
          ))}
        </div>

        {/* ===== OVERVIEW TAB ===== */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "20px" }}>
            <div style={cardStyle}>
              <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "14px" }}>⚡ Today's Habits</h2>
              {habits.length === 0
                ? <div style={{ textAlign: "center", padding: "30px 20px" }}><p style={{ fontSize: "40px" }}>🌱</p><p style={{ color: theme.subtext, marginTop: "8px" }}>No habits yet — go to Habits tab to add one!</p></div>
                : <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "380px", overflowY: "auto" }}>
                    {habits.slice(0, 8).map(h => (
                      <div key={h.id} style={{ display: "flex", alignItems: "center", gap: "10px", background: h.completed ? "rgba(6,182,212,0.1)" : "rgba(71,85,105,0.2)", padding: "10px", borderRadius: "8px", cursor: "pointer" }} onClick={() => toggleHabit(h.id)}>
                        <span style={{ fontSize: "20px" }}>{h.icon}</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: "600", fontSize: "13px", textDecoration: h.completed ? "line-through" : "none", color: h.completed ? theme.subtext : theme.text }}>{h.name}</p>
                          <p style={{ fontSize: "11px", color: theme.subtext }}>🔥 {h.streak} days</p>
                        </div>
                        <span style={{ fontSize: "18px" }}>{h.completed ? "✅" : "⭕"}</span>
                      </div>
                    ))}
                  </div>
              }
            </div>

            <div style={cardStyle}>
              <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "14px" }}>💳 Recent Expenses</h2>
              {expenses.length === 0
                ? <div style={{ textAlign: "center", padding: "30px 20px" }}><p style={{ fontSize: "40px" }}>💸</p><p style={{ color: theme.subtext, marginTop: "8px" }}>No expenses yet — go to Expenses tab to add one!</p></div>
                : <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "380px", overflowY: "auto" }}>
                    {[...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8).map(e => (
                      <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(71,85,105,0.2)", padding: "10px", borderRadius: "8px" }}>
                        <div>
                          <p style={{ fontWeight: "600", fontSize: "13px" }}>{e.name}</p>
                          <p style={{ fontSize: "11px", color: theme.subtext }}>{e.vendor} • {e.date}</p>
                        </div>
                        <p style={{ color: "#f87171", fontWeight: "bold", fontSize: "13px" }}>${e.amount.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
              }
            </div>

            <div style={cardStyle}>
              <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "14px" }}>🏆 Achievements</h2>
              {unlockedAchievements.length === 0
                ? <div style={{ textAlign: "center", padding: "30px 20px" }}><p style={{ fontSize: "40px" }}>🎯</p><p style={{ color: theme.subtext, marginTop: "8px" }}>Complete habits & log expenses to earn badges!</p></div>
                : <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {unlockedAchievements.slice(0, 5).map(a => (
                      <div key={a.id} style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)", padding: "10px", borderRadius: "8px" }}>
                        <span style={{ fontSize: "22px" }}>{a.icon}</span>
                        <div><p style={{ fontWeight: "600", fontSize: "13px" }}>{a.title}</p><p style={{ fontSize: "11px", color: theme.subtext }}>{a.desc}</p></div>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>
        )}

        {/* ===== HABITS TAB ===== */}
        {activeTab === "habits" && (
          <div>
            <div style={{ ...cardStyle, marginBottom: "20px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "14px" }}>➕ Add New Habit</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "10px" }}>
                <input style={inputStyle} placeholder="Habit name *" value={newHabit.name} onChange={e => setNewHabit({ ...newHabit, name: e.target.value })} onKeyDown={e => e.key === "Enter" && addHabit()} />
                <input style={inputStyle} placeholder="Icon emoji" value={newHabit.icon} onChange={e => setNewHabit({ ...newHabit, icon: e.target.value })} />
                <select style={inputStyle} value={newHabit.category} onChange={e => setNewHabit({ ...newHabit, category: e.target.value })}>
                  {Object.keys(categoryEmojis).map(c => <option key={c} value={c}>{categoryEmojis[c]} {c}</option>)}
                </select>
                <input style={inputStyle} type="number" placeholder="Goal (days)" value={newHabit.goal} onChange={e => setNewHabit({ ...newHabit, goal: parseInt(e.target.value) || 30 })} />
                <input style={inputStyle} placeholder="Notes (optional)" value={newHabit.notes} onChange={e => setNewHabit({ ...newHabit, notes: e.target.value })} />
                <button onClick={addHabit} style={btnPrimary}>+ Add Habit</button>
              </div>
            </div>

            {habits.length === 0
              ? <div style={{ ...cardStyle, textAlign: "center", padding: "60px 20px" }}>
                  <p style={{ fontSize: "56px", marginBottom: "12px" }}>🌱</p>
                  <p style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>No habits yet!</p>
                  <p style={{ color: theme.subtext }}>Use the form above to add your first habit.</p>
                </div>
              : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "16px" }}>
                  {filteredHabits.map(habit => (
                    <div key={habit.id} style={cardStyle}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "26px" }}>{habit.icon}</span>
                          <div>
                            <p style={{ fontWeight: "bold", fontSize: "14px" }}>{habit.name}</p>
                            <p style={{ fontSize: "11px", color: theme.subtext }}>{categoryEmojis[habit.category]} {habit.category}</p>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "4px" }}>
                          <button onClick={() => setEditingHabit({ ...habit })} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "15px" }} title="Edit">✏️</button>
                          <button onClick={() => deleteHabit(habit.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "15px" }} title="Delete">🗑️</button>
                        </div>
                      </div>
                      <div style={{ marginBottom: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "5px" }}>
                          <span style={{ color: theme.subtext }}>Goal: {habit.goal} days</span>
                          <span style={{ color: "#06b6d4", fontWeight: "600" }}>{habit.streak}/{habit.goal}</span>
                        </div>
                        <div style={{ background: theme.inputBorder, borderRadius: "99px", height: "7px", overflow: "hidden" }}>
                          <div style={{ width: `${Math.min((habit.streak / habit.goal) * 100, 100)}%`, height: "100%", background: "linear-gradient(90deg,#06b6d4,#7c3aed)", transition: "width 0.3s" }} />
                        </div>
                      </div>
                      {habit.notes && <p style={{ fontSize: "11px", color: theme.subtext, fontStyle: "italic", marginBottom: "10px" }}>{habit.notes}</p>}
                      <button onClick={() => toggleHabit(habit.id)} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: habit.completed ? "1px solid #06b6d4" : `1px solid ${theme.border}`, background: habit.completed ? "rgba(6,182,212,0.15)" : "transparent", color: habit.completed ? "#06b6d4" : theme.subtext, fontWeight: "600", cursor: "pointer", fontSize: "13px" }}>
                        {habit.completed ? "✓ Completed Today" : "Mark Complete"}
                      </button>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}

        {/* ===== EXPENSES TAB ===== */}
        {activeTab === "expenses" && (
          <div>
            <div style={{ ...cardStyle, marginBottom: "20px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "14px" }}>➕ Add New Expense</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "10px" }}>
                <input style={inputStyle} placeholder="Description *" value={newExpense.name} onChange={e => setNewExpense({ ...newExpense, name: e.target.value })} onKeyDown={e => e.key === "Enter" && addExpense()} />
                <input style={inputStyle} placeholder="Vendor" value={newExpense.vendor} onChange={e => setNewExpense({ ...newExpense, vendor: e.target.value })} />
                <input style={inputStyle} type="number" step="0.01" placeholder="Amount ($) *" value={newExpense.amount} onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })} />
                <select style={inputStyle} value={newExpense.category} onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}>
                  {["food","health","entertainment","transport","shopping","utilities","travel","learning"].map(c => <option key={c} value={c}>{categoryEmojis[c]} {c}</option>)}
                </select>
                <button onClick={addExpense} style={btnPrimary}>+ Add</button>
                <button onClick={exportCSV} style={{ ...btnPrimary, background: "linear-gradient(90deg,#34d399,#059669)" }}>📤 Export CSV</button>
              </div>
            </div>

            {/* Category Budgets Progress */}
            {Object.values(profile.categoryBudgets || {}).some(v => v > 0) && (
              <div style={{ ...cardStyle, marginBottom: "20px" }}>
                <h2 style={{ fontSize: "15px", fontWeight: "bold", marginBottom: "12px" }}>🎯 Category Budgets</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "10px" }}>
                  {Object.entries(profile.categoryBudgets).filter(([, v]) => v > 0).map(([cat, budget]) => {
                    const spent = expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);
                    const pct = Math.min(Math.round((spent / budget) * 100), 100);
                    return (
                      <div key={cat} style={{ background: "rgba(71,85,105,0.2)", borderRadius: "10px", padding: "10px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "5px" }}>
                          <span>{categoryEmojis[cat]} {cat}</span>
                          <span style={{ color: pct >= 100 ? "#f87171" : theme.subtext }}>${spent.toFixed(0)}/${budget}</span>
                        </div>
                        <div style={{ background: theme.inputBorder, borderRadius: "99px", height: "6px", overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: pct >= 100 ? "#f87171" : pct >= 80 ? "#fbbf24" : "#34d399", transition: "width 0.3s" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Filters & Sort */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: "13px", color: theme.subtext }}>Filter:</span>
              {["all", ...new Set(expenses.map(e => e.category))].map(cat => (
                <button key={cat} onClick={() => setFilterCategory(cat)} style={{ padding: "5px 12px", borderRadius: "6px", border: filterCategory === cat ? "1px solid #06b6d4" : `1px solid ${theme.border}`, background: filterCategory === cat ? "rgba(6,182,212,0.2)" : "transparent", color: filterCategory === cat ? "#06b6d4" : theme.subtext, cursor: "pointer", fontSize: "12px", textTransform: "capitalize" }}>
                  {cat === "all" ? "All" : `${categoryEmojis[cat] || ""} ${cat}`}
                </button>
              ))}
              <div style={{ marginLeft: "auto", display: "flex", gap: "6px" }}>
                <span style={{ fontSize: "13px", color: theme.subtext, alignSelf: "center" }}>Sort:</span>
                {["date","amount","name"].map(s => (
                  <button key={s} onClick={() => setSortBy(s)} style={{ padding: "5px 10px", borderRadius: "6px", border: sortBy === s ? "1px solid #06b6d4" : `1px solid ${theme.border}`, background: sortBy === s ? "rgba(6,182,212,0.2)" : "transparent", color: sortBy === s ? "#06b6d4" : theme.subtext, cursor: "pointer", fontSize: "12px", textTransform: "capitalize" }}>{s}</button>
                ))}
              </div>
            </div>

            {expenses.length === 0
              ? <div style={{ ...cardStyle, textAlign: "center", padding: "60px 20px" }}>
                  <p style={{ fontSize: "56px", marginBottom: "12px" }}>💸</p>
                  <p style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>No expenses yet!</p>
                  <p style={{ color: theme.subtext }}>Use the form above to log your first expense.</p>
                </div>
              : <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {filteredExpenses.map(e => (
                    <div key={e.id} style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: "600", fontSize: "14px" }}>{e.name}</p>
                        <p style={{ fontSize: "12px", color: theme.subtext, marginTop: "2px" }}>{e.vendor} • {e.date}</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                        <span style={{ fontSize: "11px", background: "rgba(6,182,212,0.15)", color: "#06b6d4", padding: "2px 8px", borderRadius: "4px", textTransform: "capitalize" }}>{categoryEmojis[e.category]} {e.category}</span>
                        <p style={{ fontWeight: "bold", fontSize: "14px", color: "#f87171" }}>${e.amount.toFixed(2)}</p>
                        <button onClick={() => setEditingExpense({ ...e })} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "15px" }}>✏️</button>
                        <button onClick={() => deleteExpense(e.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "15px", color: theme.subtext }}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}

        {/* ===== ANALYTICS TAB ===== */}
        {activeTab === "analytics" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(360px,1fr))", gap: "20px" }}>
            <div style={cardStyle}>
              <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "14px" }}>📅 Monthly Spending</h2>
              {expensesByMonth.length > 0 ? <BarChart data={expensesByMonth} /> : <p style={{ color: theme.subtext, textAlign: "center", padding: "40px" }}>No expense data yet</p>}
            </div>
            <div style={cardStyle}>
              <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "14px" }}>🍰 Spending by Category</h2>
              <PieChart data={expensesByCategory} />
            </div>
            <div style={cardStyle}>
              <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "14px" }}>🔥 Top Habit Streaks</h2>
              {habits.length > 0
                ? <BarChart data={[...habits].sort((a,b)=>b.streak-a.streak).slice(0,8).map(h=>({ name: h.name.substring(0,10), value: h.streak }))} />
                : <p style={{ color: theme.subtext, textAlign: "center", padding: "40px" }}>No habits yet</p>}
            </div>
            <div style={cardStyle}>
              <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "14px" }}>📊 Summary</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[
                  ["Total Habits", habits.length, "#06b6d4"],
                  ["Completion", `${completionRate}%`, "#34d399"],
                  ["Total Spent", `$${totalExpenses.toFixed(0)}`, "#f87171"],
                  ["Avg Expense", `$${avgExpense}`, "#fbbf24"],
                  ["Total Streaks", totalStreak, "#f97316"],
                  ["Best Streak", `${longestStreak}d`, "#a78bfa"],
                ].map(([label, val, color]) => (
                  <div key={label} style={{ background: "rgba(71,85,105,0.2)", borderRadius: "10px", padding: "12px" }}>
                    <p style={{ color: theme.subtext, fontSize: "11px", marginBottom: "4px" }}>{label}</p>
                    <p style={{ fontSize: "22px", fontWeight: "bold", color }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== ACHIEVEMENTS TAB ===== */}
        {activeTab === "achievements" && (
          <div>
            <p style={{ color: theme.subtext, marginBottom: "20px", fontSize: "14px" }}>{unlockedAchievements.length} of {ACHIEVEMENTS.length} achievements unlocked</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "16px" }}>
              {ACHIEVEMENTS.map(a => {
                const unlocked = a.check(habits, expenses, profile);
                return (
                  <div key={a.id} style={{ ...cardStyle, opacity: unlocked ? 1 : 0.4, border: unlocked ? "1px solid rgba(167,139,250,0.5)" : `1px solid ${theme.border}`, position: "relative", transition: "opacity 0.3s" }}>
                    {unlocked && <div style={{ position: "absolute", top: "10px", right: "10px", fontSize: "11px", background: "rgba(167,139,250,0.2)", color: "#a78bfa", padding: "2px 8px", borderRadius: "99px", fontWeight: "600" }}>✨ Unlocked</div>}
                    <div style={{ fontSize: "40px", marginBottom: "10px" }}>{a.icon}</div>
                    <p style={{ fontWeight: "bold", fontSize: "15px", marginBottom: "4px" }}>{a.title}</p>
                    <p style={{ fontSize: "12px", color: theme.subtext }}>{a.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===== PROFILE TAB ===== */}
        {activeTab === "profile" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "20px" }}>
            <div style={{ ...cardStyle, textAlign: "center" }}>
              <div style={{ fontSize: "64px", marginBottom: "12px" }}>{profile.avatar}</div>
              <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "4px" }}>{profile.name || "Your Name"}</h2>
              <p style={{ color: theme.subtext, marginBottom: "4px", fontSize: "14px" }}>{profile.email || "No email set"}</p>
              <p style={{ fontSize: "12px", color: theme.subtext, marginBottom: "20px" }}>Member since {profile.joinDate}</p>
              <button onClick={() => { setProfileForm(profile); setShowProfileModal(true); }} style={{ ...btnPrimary, width: "100%" }}>✏️ Edit Profile</button>
            </div>

            <div style={cardStyle}>
              <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "14px" }}>📈 Your Stats</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {[
                  ["Total Habits Tracked", habits.length],
                  ["Total Expenses Logged", expenses.length],
                  ["Total Money Tracked", `$${totalExpenses.toFixed(2)}`],
                  ["Habits Completed Today", habits.filter(h=>h.completed).length],
                  ["Longest Streak", `${longestStreak} days`],
                  ["Achievements Earned", `${unlockedAchievements.length} / ${ACHIEVEMENTS.length}`],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${theme.border}` }}>
                    <span style={{ fontSize: "13px", color: theme.subtext }}>{label}</span>
                    <span style={{ fontWeight: "bold", fontSize: "13px" }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "14px" }}>💰 Budget Overview</h2>
              {profile.monthlyBudget > 0 ? (
                <div>
                  {[
                    ["Monthly Budget", `$${profile.monthlyBudget}`, theme.text],
                    ["Spent", `$${totalExpenses.toFixed(2)}`, "#f87171"],
                    ["Remaining", `$${Math.max(profile.monthlyBudget - totalExpenses, 0).toFixed(2)}`, "#34d399"],
                  ].map(([label, val, color]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${theme.border}` }}>
                      <span style={{ fontSize: "13px", color: theme.subtext }}>{label}</span>
                      <span style={{ fontWeight: "bold", color }}>{val}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: theme.subtext, marginBottom: "6px" }}>
                      <span>Budget used</span><span>{budgetUsed}%</span>
                    </div>
                    <div style={{ background: theme.inputBorder, borderRadius: "99px", height: "10px" }}>
                      <div style={{ width: `${Math.min(budgetUsed, 100)}%`, height: "100%", background: budgetUsed >= 100 ? "#f87171" : "linear-gradient(90deg,#06b6d4,#34d399)", borderRadius: "99px" }} />
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <p style={{ color: theme.subtext, marginBottom: "14px" }}>Set a monthly budget to track spending!</p>
                  <button onClick={() => { setProfileForm(profile); setShowProfileModal(true); }} style={btnPrimary}>Set Budget 💰</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input, select { font-family: inherit; }
        input::placeholder { color: #64748b; }
        select option { background: #1e293b; color: white; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #475569; border-radius: 3px; }
      `}</style>
    </div>
  );
}