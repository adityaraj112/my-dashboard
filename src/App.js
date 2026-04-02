import React, { useState, useEffect } from 'react';

export default function WellnessFinanceDashboard() {
  // ===== HABITS DATA =====
  const [habits, setHabits] = useState([
    // Health & Fitness
    { id: 1, name: 'Morning Exercise', streak: 24, goal: 90, completed: true, icon: '💪', category: 'health', createdAt: '2025-01-15', notes: 'Started gym routine' },
    { id: 2, name: 'Drink Water (8 glasses)', streak: 18, goal: 90, completed: true, icon: '💧', category: 'health', createdAt: '2025-02-01', notes: 'Stay hydrated' },
    { id: 3, name: 'Evening Yoga', streak: 12, goal: 60, completed: false, icon: '🧘', category: 'health', createdAt: '2025-02-15', notes: 'Flexibility training' },
    { id: 4, name: 'Sleep 8 Hours', streak: 15, goal: 90, completed: true, icon: '😴', category: 'health', createdAt: '2025-02-10', notes: 'Better sleep schedule' },
    
    // Learning & Development
    { id: 5, name: 'Read 30 mins', streak: 8, goal: 60, completed: false, icon: '📚', category: 'learning', createdAt: '2025-02-20', notes: 'Currently reading: Atomic Habits' },
    { id: 6, name: 'Learn coding', streak: 22, goal: 365, completed: true, icon: '💻', category: 'learning', createdAt: '2025-01-10', notes: 'React & JavaScript' },
    { id: 7, name: 'Language practice', streak: 5, goal: 30, completed: false, icon: '🌍', category: 'learning', createdAt: '2025-03-01', notes: 'Spanish on Duolingo' },
    
    // Productivity & Work
    { id: 8, name: 'Complete daily goals', streak: 19, goal: 90, completed: true, icon: '✅', category: 'productivity', createdAt: '2025-01-20', notes: 'Task management' },
    { id: 9, name: 'No social media', streak: 6, goal: 30, completed: true, icon: '📵', category: 'productivity', createdAt: '2025-02-25', notes: 'Digital detox' },
    { id: 10, name: 'Meditation 20 mins', streak: 11, goal: 60, completed: false, icon: '🧠', category: 'mindfulness', createdAt: '2025-02-17', notes: 'Mental clarity' },
    
    // Financial Habits
    { id: 11, name: 'Track expenses', streak: 25, goal: 90, completed: true, icon: '💹', category: 'finance', createdAt: '2025-01-05', notes: 'Daily expense logging' },
    { id: 12, name: 'Save $20/day', streak: 14, goal: 90, completed: true, icon: '🏦', category: 'finance', createdAt: '2025-02-12', notes: 'Emergency fund' },
    { id: 13, name: 'Review budget', streak: 3, goal: 30, completed: false, icon: '📊', category: 'finance', createdAt: '2025-03-10', notes: 'Weekly review' },
    
    // Health & Nutrition
    { id: 14, name: 'Eat healthy', streak: 9, goal: 60, completed: true, icon: '🥗', category: 'health', createdAt: '2025-02-22', notes: 'Whole foods only' },
    { id: 15, name: 'Walk 10,000 steps', streak: 7, goal: 60, completed: false, icon: '🚶', category: 'health', createdAt: '2025-02-28', notes: 'Daily movement' },
  ]);

  // ===== EXPENSES DATA =====
  const [expenses, setExpenses] = useState([
    // March 2025
    { id: 1, name: 'Morning Coffee', amount: 5.50, category: 'food', date: '2025-03-15', icon: '☕', vendor: 'Starbucks' },
    { id: 2, name: 'Gym Membership', amount: 50, category: 'health', date: '2025-03-01', icon: '🏋️', vendor: 'Fitnes Plus' },
    { id: 3, name: 'Groceries - Whole Foods', amount: 82.30, category: 'food', date: '2025-03-14', icon: '🛒', vendor: 'Whole Foods' },
    { id: 4, name: 'Movie Tickets (2x)', amount: 28, category: 'entertainment', date: '2025-03-13', icon: '🎬', vendor: 'AMC Cinemas' },
    { id: 5, name: 'Uber ride to office', amount: 15.75, category: 'transport', date: '2025-03-15', icon: '🚗', vendor: 'Uber' },
    { id: 6, name: 'React Course (Udemy)', amount: 12.99, category: 'learning', date: '2025-03-10', icon: '📚', vendor: 'Udemy' },
    { id: 7, name: 'Phone bill', amount: 75, category: 'utilities', date: '2025-03-05', icon: '📱', vendor: 'Verizon' },
    { id: 8, name: 'Lunch with friends', amount: 45.20, category: 'food', date: '2025-03-13', icon: '🍽️', vendor: 'Local Restaurant' },
    
    // February 2025
    { id: 9, name: 'Netflix subscription', amount: 15.99, category: 'entertainment', date: '2025-03-01', icon: '📺', vendor: 'Netflix' },
    { id: 10, name: 'Gas', amount: 55, category: 'transport', date: '2025-02-28', icon: '⛽', vendor: 'Shell' },
    { id: 11, name: 'Book: Atomic Habits', amount: 16, category: 'learning', date: '2025-02-25', icon: '📖', vendor: 'Amazon' },
    { id: 12, name: 'Breakfast', amount: 8.50, category: 'food', date: '2025-02-24', icon: '🥐', vendor: 'Local Cafe' },
    { id: 13, name: 'Internet bill', amount: 80, category: 'utilities', date: '2025-02-20', icon: '🌐', vendor: 'Comcast' },
    { id: 14, name: 'Yoga class pack (10)', amount: 120, category: 'health', date: '2025-02-18', icon: '🧘', vendor: 'Yoga Studio' },
    { id: 15, name: 'Concert tickets', amount: 85, category: 'entertainment', date: '2025-02-15', icon: '🎵', vendor: 'Ticketmaster' },
    { id: 16, name: 'Dinner date', amount: 78.40, category: 'food', date: '2025-02-14', icon: '💑', vendor: 'Upscale Restaurant' },
    { id: 17, name: 'Uber Eats delivery', amount: 32.15, category: 'food', date: '2025-02-12', icon: '📦', vendor: 'Uber Eats' },
    { id: 18, name: 'New headphones', amount: 149.99, category: 'shopping', date: '2025-02-10', icon: '🎧', vendor: 'Best Buy' },
    
    // January 2025
    { id: 19, name: 'Haircut', amount: 35, category: 'personal', date: '2025-01-28', icon: '✂️', vendor: 'Barber Shop' },
    { id: 20, name: 'Groceries', amount: 95.60, category: 'food', date: '2025-01-25', icon: '🛒', vendor: 'Costco' },
    { id: 21, name: 'Flight to NYC', amount: 320, category: 'travel', date: '2025-01-20', icon: '✈️', vendor: 'Delta Airlines' },
    { id: 22, name: 'Hotel - 3 nights', amount: 450, category: 'travel', date: '2025-01-19', icon: '🏨', vendor: 'Marriott' },
    { id: 23, name: 'Dinner', amount: 55.80, category: 'food', date: '2025-01-18', icon: '🍜', vendor: 'Asian Fusion' },
    { id: 24, name: 'Steam games (3)', amount: 47.99, category: 'entertainment', date: '2025-01-15', icon: '🎮', vendor: 'Steam' },
    { id: 25, name: 'Dental cleaning', amount: 200, category: 'health', date: '2025-01-10', icon: '🦷', vendor: 'Dental Clinic' },
    { id: 26, name: 'Spotify premium', amount: 11.99, category: 'entertainment', date: '2025-01-01', icon: '🎵', vendor: 'Spotify' },
  ]);

  const [newHabit, setNewHabit] = useState('');
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', category: 'food', vendor: '' });
  const [activeTab, setActiveTab] = useState('overview');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // ===== FUNCTIONS =====
  const toggleHabit = (id) => {
    setHabits(habits.map(h =>
      h.id === id ? { ...h, completed: !h.completed, streak: !h.completed ? h.streak + 1 : Math.max(0, h.streak - 1) } : h
    ));
  };

  const addHabit = () => {
    if (newHabit.trim()) {
      setHabits([...habits, { 
        id: Date.now(), 
        name: newHabit, 
        streak: 0, 
        goal: 30, 
        completed: false, 
        icon: '⭐',
        category: 'general',
        createdAt: new Date().toISOString().split('T')[0],
        notes: ''
      }]);
      setNewHabit('');
    }
  };

  const addExpense = () => {
    if (newExpense.name.trim() && newExpense.amount) {
      setExpenses([...expenses, { 
        id: Date.now(), 
        name: newExpense.name, 
        amount: parseFloat(newExpense.amount), 
        category: newExpense.category,
        date: new Date().toISOString().split('T')[0],
        icon: '💸',
        vendor: newExpense.vendor || 'Other'
      }]);
      setNewExpense({ name: '', amount: '', category: 'food', vendor: '' });
    }
  };

  const deleteHabit = (id) => setHabits(habits.filter(h => h.id !== id));
  const deleteExpense = (id) => setExpenses(expenses.filter(e => e.id !== id));

  // ===== ANALYTICS CALCULATIONS =====
  const filteredExpenses = filterCategory === 'all' ? expenses : expenses.filter(e => e.category === filterCategory);
  
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'amount') return b.amount - a.amount;
    return a.name.localeCompare(b.name);
  });

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const avgExpense = expenses.length > 0 ? (totalExpenses / expenses.length).toFixed(2) : 0;
  const avgDailySpend = (totalExpenses / 30).toFixed(2);
  const completionRate = habits.length > 0 ? Math.round((habits.filter(h => h.completed).length / habits.length) * 100) : 0;
  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
  const longestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
  const totalHabitsCompleted = habits.filter(h => h.completed).length;

  const expensesByCategory = expenses.reduce((acc, e) => {
    const existing = acc.find(item => item.name === e.category);
    if (existing) {
      existing.value += e.amount;
    } else {
      acc.push({ name: e.category, value: e.amount });
    }
    return acc;
  }, []);

  const expensesByMonth = expenses.reduce((acc, e) => {
    const monthKey = e.date.substring(0, 7);
    const existing = acc.find(item => item.month === monthKey);
    if (existing) {
      existing.value += e.amount;
    } else {
      acc.push({ month: monthKey, value: e.amount });
    }
    return acc;
  }, []).sort((a, b) => a.month.localeCompare(b.month));

  const habitsByCategory = habits.reduce((acc, h) => {
    const existing = acc.find(item => item.category === h.category);
    if (existing) {
      existing.count += 1;
      existing.totalStreak += h.streak;
    } else {
      acc.push({ category: h.category, count: 1, totalStreak: h.streak });
    }
    return acc;
  }, []);

  const categoryEmojis = {
    health: '❤️',
    learning: '🎓',
    productivity: '⚡',
    mindfulness: '🧠',
    finance: '💰',
    food: '🍽️',
    entertainment: '🎬',
    transport: '🚗',
    shopping: '🛍️',
    utilities: '⚙️',
    travel: '✈️',
    personal: '👤',
    general: '📍'
  };

  // ===== CHART COMPONENTS =====
  const BarChart = ({ data, maxValue }) => {
    const max = maxValue || Math.max(...data.map(d => d.value), 1);
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '15px', height: '250px', justifyContent: 'center', overflow: 'auto' }}>
        {data.map((item, idx) => (
          <div key={idx} style={{ textAlign: 'center', minWidth: '50px' }}>
            <div style={{ height: `${(item.value / max) * 180}px`, width: '40px', background: 'linear-gradient(180deg, #06b6d4, #0891b2)', borderRadius: '8px 8px 0 0', marginBottom: '8px' }} title={item.value.toFixed(2)} />
            <div style={{ fontSize: '11px', color: '#94a3b8', maxWidth: '50px', wordBreak: 'break-word' }}>{item.month || item.name || 'N/A'}</div>
            <div style={{ fontSize: '12px', color: '#06b6d4', fontWeight: 'bold' }}>${item.value.toFixed(0)}</div>
          </div>
        ))}
      </div>
    );
  };

  const PieChart = ({ data }) => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    if (total === 0) return <div style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>No data available</div>;
    
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#A8E6CF', '#FFD3B6', '#FFAAA5'];
    let currentAngle = 0;

    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', width: '100%', height: '280px' }}>
        <svg width="200" height="200" style={{ position: 'absolute', left: '0' }}>
          {data.map((item, idx) => {
            const sliceAngle = (item.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + sliceAngle;
            currentAngle += sliceAngle;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            const x1 = 100 + 80 * Math.cos(startRad);
            const y1 = 100 + 80 * Math.sin(startRad);
            const x2 = 100 + 80 * Math.cos(endRad);
            const y2 = 100 + 80 * Math.sin(endRad);
            const largeArc = sliceAngle > 180 ? 1 : 0;

            const path = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;

            return <path key={idx} d={path} fill={colors[idx % colors.length]} />;
          })}
        </svg>
        <div style={{ position: 'absolute', marginLeft: '220px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto' }}>
          {data.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <div style={{ width: '12px', height: '12px', background: colors[idx % colors.length], borderRadius: '2px' }} />
              <span style={{ color: '#e2e8f0' }}>{item.name}: ${item.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e293b 0%, #312e81 50%, #1e293b 100%)', color: 'white', padding: '24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* ===== HEADER ===== */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '40px', fontWeight: 'bold', marginBottom: '8px', background: 'linear-gradient(90deg, #06b6d4, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                💎 Wellness & Wealth Dashboard
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '16px' }}>Enterprise-Grade Personal Finance & Health Tracker</p>
            </div>
          </div>

          {/* ===== QUICK STATS ===== */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '32px' }}>
            <div style={{ background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '12px', padding: '16px', backdropFilter: 'blur(10px)' }}>
              <p style={{ color: '#a5f3fc', fontSize: '13px', marginBottom: '8px' }}>✅ Completion Rate</p>
              <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{completionRate}%</p>
              <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{totalHabitsCompleted}/{habits.length} today</p>
            </div>
            <div style={{ background: 'rgba(249, 115, 22, 0.15)', border: '1px solid rgba(249, 115, 22, 0.3)', borderRadius: '12px', padding: '16px', backdropFilter: 'blur(10px)' }}>
              <p style={{ color: '#fed7aa', fontSize: '13px', marginBottom: '8px' }}>🔥 Total Streaks</p>
              <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{totalStreak}</p>
              <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Longest: {longestStreak} days</p>
            </div>
            <div style={{ background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: '12px', padding: '16px', backdropFilter: 'blur(10px)' }}>
              <p style={{ color: '#a7f3d0', fontSize: '13px', marginBottom: '8px' }}>💰 Total Spent</p>
              <p style={{ fontSize: '32px', fontWeight: 'bold' }}>${totalExpenses.toFixed(2)}</p>
              <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{expenses.length} transactions</p>
            </div>
            <div style={{ background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '12px', padding: '16px', backdropFilter: 'blur(10px)' }}>
              <p style={{ color: '#d8b4fe', fontSize: '13px', marginBottom: '8px' }}>📊 Avg Daily Spend</p>
              <p style={{ fontSize: '32px', fontWeight: 'bold' }}>${avgDailySpend}</p>
              <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Per transaction: ${avgExpense}</p>
            </div>
            <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '12px', padding: '16px', backdropFilter: 'blur(10px)' }}>
              <p style={{ color: '#bbf7d0', fontSize: '13px', marginBottom: '8px' }}>📈 Total Habits</p>
              <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{habits.length}</p>
              <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{habitsByCategory.length} categories</p>
            </div>
            <div style={{ background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '12px', padding: '16px', backdropFilter: 'blur(10px)' }}>
              <p style={{ color: '#c7d2fe', fontSize: '13px', marginBottom: '8px' }}>📅 Date Range</p>
              <p style={{ fontSize: '32px', fontWeight: 'bold' }}>Q1 2025</p>
              <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>3 months tracked</p>
            </div>
          </div>

          {/* ===== TABS ===== */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #475569', marginBottom: '24px', overflowX: 'auto' }}>
            {['overview', 'habits', 'expenses', 'analytics'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  textTransform: 'capitalize',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab ? '3px solid #06b6d4' : 'none',
                  color: activeTab === tab ? '#06b6d4' : '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab === 'overview' && '📊 Overview'}
                {tab === 'habits' && '💪 Habits'}
                {tab === 'expenses' && '💰 Expenses'}
                {tab === 'analytics' && '📈 Analytics'}
              </button>
            ))}
          </div>
        </div>

        {/* ===== OVERVIEW TAB ===== */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Habits Overview */}
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid #475569', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(10px)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>⚡ Top Habits</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '500px', overflowY: 'auto' }}>
                {habits.sort((a, b) => b.streak - a.streak).slice(0, 8).map(habit => (
                  <div key={habit.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(71, 85, 105, 0.3)', padding: '10px', borderRadius: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{habit.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '600', fontSize: '13px' }}>{habit.name}</p>
                      <p style={{ fontSize: '11px', color: '#94a3b8' }}>{categoryEmojis[habit.category]} {habit.category}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 'bold', color: '#34d399', fontSize: '13px' }}>🔥 {habit.streak}</p>
                      <p style={{ fontSize: '10px', color: '#64748b' }}>{habit.streak}/{habit.goal}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expenses Overview */}
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid #475569', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(10px)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>💳 Recent Expenses</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '500px', overflowY: 'auto' }}>
                {expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8).map(expense => (
                  <div key={expense.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(71, 85, 105, 0.3)', padding: '10px', borderRadius: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '600', fontSize: '13px' }}>{expense.name}</p>
                      <p style={{ fontSize: '11px', color: '#94a3b8' }}>{expense.vendor}</p>
                    </div>
                    <p style={{ fontWeight: 'bold', color: '#f87171', fontSize: '13px' }}>${expense.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Habits by Category */}
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid #475569', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(10px)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>🏷️ Habits by Category</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {habitsByCategory.map((cat, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(71, 85, 105, 0.3)', padding: '10px', borderRadius: '8px' }}>
                    <span>{categoryEmojis[cat.category]} {cat.category}</span>
                    <span>{cat.count} habits • 🔥 {cat.totalStreak}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== HABITS TAB ===== */}
        {activeTab === 'habits' && (
          <div>
            {/* Add Habit */}
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid #475569', borderRadius: '16px', padding: '20px', marginBottom: '24px', backdropFilter: 'blur(10px)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>➕ Add New Habit</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="e.g., Drink 8 glasses of water"
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addHabit()}
                  style={{ flex: 1, background: '#475569', border: '1px solid #64748b', borderRadius: '8px', padding: '10px 16px', color: 'white', fontSize: '14px' }}
                />
                <button
                  onClick={addHabit}
                  style={{ background: 'linear-gradient(90deg, #06b6d4, #0891b2)', border: 'none', borderRadius: '8px', padding: '10px 24px', color: 'white', fontWeight: '600', cursor: 'pointer' }}
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Habits Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {habits.map(habit => (
                <div key={habit.id} style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid #475569', borderRadius: '16px', padding: '16px', backdropFilter: 'blur(10px)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '28px' }}>{habit.icon}</span>
                      <div>
                        <p style={{ fontWeight: 'bold', fontSize: '14px' }}>{habit.name}</p>
                        <p style={{ fontSize: '11px', color: '#94a3b8' }}>{categoryEmojis[habit.category]} {habit.category}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                  <div style={{ background: 'rgba(71, 85, 105, 0.5)', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
                      <span style={{ color: '#94a3b8' }}>Goal: {habit.goal} days</span>
                      <span style={{ color: '#06b6d4', fontWeight: '600' }}>{habit.streak}/{habit.goal}</span>
                    </div>
                    <div style={{ width: '100%', background: '#475569', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
                      <div
                        style={{
                          background: 'linear-gradient(90deg, #06b6d4, #0891b2)',
                          height: '100%',
                          width: `${Math.min((habit.streak / habit.goal) * 100, 100)}%`,
                          transition: 'width 0.3s',
                        }}
                      />
                    </div>
                  </div>
                  {habit.notes && <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px', fontStyle: 'italic' }}>{habit.notes}</p>}
                  <button
                    onClick={() => toggleHabit(habit.id)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '8px',
                      border: habit.completed ? '1px solid #06b6d4' : 'none',
                      background: habit.completed ? 'rgba(6, 182, 212, 0.2)' : '#475569',
                      color: habit.completed ? '#06b6d4' : '#cbd5e1',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    {habit.completed ? '✓ Completed' : 'Mark Complete'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== EXPENSES TAB ===== */}
        {activeTab === 'expenses' && (
          <div>
            {/* Add Expense */}
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid #475569', borderRadius: '16px', padding: '20px', marginBottom: '24px', backdropFilter: 'blur(10px)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>➕ Add New Expense</h2>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Description"
                  value={newExpense.name}
                  onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                  style={{ flex: 1, minWidth: '140px', background: '#475569', border: '1px solid #64748b', borderRadius: '8px', padding: '10px 16px', color: 'white', fontSize: '14px' }}
                />
                <input
                  type="text"
                  placeholder="Vendor"
                  value={newExpense.vendor}
                  onChange={(e) => setNewExpense({ ...newExpense, vendor: e.target.value })}
                  style={{ flex: 1, minWidth: '140px', background: '#475569', border: '1px solid #64748b', borderRadius: '8px', padding: '10px 16px', color: 'white', fontSize: '14px' }}
                />
                <input
                  type="number"
                  placeholder="Amount"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  style={{ width: '100px', background: '#475569', border: '1px solid #64748b', borderRadius: '8px', padding: '10px 16px', color: 'white', fontSize: '14px' }}
                />
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  style={{ background: '#475569', border: '1px solid #64748b', borderRadius: '8px', padding: '10px 16px', color: 'white', fontSize: '14px', cursor: 'pointer' }}
                >
                  <option value="food">🍽️ Food</option>
                  <option value="health">❤️ Health</option>
                  <option value="entertainment">🎬 Entertainment</option>
                  <option value="transport">🚗 Transport</option>
                  <option value="shopping">🛍️ Shopping</option>
                  <option value="utilities">⚙️ Utilities</option>
                  <option value="travel">✈️ Travel</option>
                  <option value="learning">📚 Learning</option>
                </select>
                <button
                  onClick={addExpense}
                  style={{ background: 'linear-gradient(90deg, #34d399, #10b981)', border: 'none', borderRadius: '8px', padding: '10px 24px', color: 'white', fontWeight: '600', cursor: 'pointer' }}
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Filters & Sort */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>Filter:</div>
              {['all', ...new Set(expenses.map(e => e.category))].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: filterCategory === cat ? '1px solid #06b6d4' : '1px solid #475569',
                    background: filterCategory === cat ? 'rgba(6, 182, 212, 0.2)' : 'rgba(71, 85, 105, 0.3)',
                    color: filterCategory === cat ? '#06b6d4' : '#cbd5e1',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}
                >
                  {cat === 'all' ? 'All' : categoryEmojis[cat] + ' ' + cat}
                </button>
              ))}
              <div style={{ marginLeft: 'auto', fontSize: '13px', color: '#94a3b8' }}>Sort by:</div>
              {['date', 'amount', 'name'].map(sort => (
                <button
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: sortBy === sort ? '1px solid #06b6d4' : '1px solid #475569',
                    background: sortBy === sort ? 'rgba(6, 182, 212, 0.2)' : 'rgba(71, 85, 105, 0.3)',
                    color: sortBy === sort ? '#06b6d4' : '#cbd5e1',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}
                >
                  {sort}
                </button>
              ))}
            </div>

            {/* Expenses List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {sortedExpenses.map(expense => (
                <div key={expense.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid #475569', borderRadius: '12px', padding: '14px', backdropFilter: 'blur(10px)' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '600', fontSize: '14px' }}>{expense.name}</p>
                    <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{expense.vendor} • {expense.date}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '11px', background: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4', padding: '2px 8px', borderRadius: '4px', textTransform: 'capitalize' }}>{categoryEmojis[expense.category]} {expense.category}</span>
                    <p style={{ fontWeight: 'bold', fontSize: '14px', color: '#f87171' }}>${expense.amount.toFixed(2)}</p>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '16px', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== ANALYTICS TAB ===== */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
            {/* Monthly Spending */}
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid #475569', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(10px)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>📅 Monthly Spending</h2>
              {expensesByMonth.length > 0 ? <BarChart data={expensesByMonth} /> : <p style={{ color: '#94a3b8' }}>No data</p>}
            </div>

            {/* Expenses by Category */}
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid #475569', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(10px)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>🍰 Spending by Category</h2>
              {expensesByCategory.length > 0 ? <PieChart data={expensesByCategory} /> : <p style={{ color: '#94a3b8' }}>No data</p>}
            </div>

            {/* Habit Streaks */}
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid #475569', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(10px)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>🔥 Top Habit Streaks</h2>
              <BarChart data={habits.sort((a, b) => b.streak - a.streak).slice(0, 10).map(h => ({ name: h.name.substring(0, 10), value: h.streak }))} />
            </div>

            {/* Summary Statistics */}
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid #475569', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(10px)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>📊 Summary Statistics</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: 'rgba(71, 85, 105, 0.3)', borderRadius: '8px', padding: '12px' }}>
                  <p style={{ color: '#94a3b8', fontSize: '12px' }}>Total Habits</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#06b6d4' }}>{habits.length}</p>
                </div>
                <div style={{ background: 'rgba(71, 85, 105, 0.3)', borderRadius: '8px', padding: '12px' }}>
                  <p style={{ color: '#94a3b8', fontSize: '12px' }}>Completion Rate</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#34d399' }}>{completionRate}%</p>
                </div>
                <div style={{ background: 'rgba(71, 85, 105, 0.3)', borderRadius: '8px', padding: '12px' }}>
                  <p style={{ color: '#94a3b8', fontSize: '12px' }}>Total Expenses</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#f87171' }}>${totalExpenses.toFixed(0)}</p>
                </div>
                <div style={{ background: 'rgba(71, 85, 105, 0.3)', borderRadius: '8px', padding: '12px' }}>
                  <p style={{ color: '#94a3b8', fontSize: '12px' }}>Avg Expense</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#fbbf24' }}>${avgExpense}</p>
                </div>
                <div style={{ background: 'rgba(71, 85, 105, 0.3)', borderRadius: '8px', padding: '12px' }}>
                  <p style={{ color: '#94a3b8', fontSize: '12px' }}>Total Streaks</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#f97316' }}>{totalStreak}</p>
                </div>
                <div style={{ background: 'rgba(71, 85, 105, 0.3)', borderRadius: '8px', padding: '12px' }}>
                  <p style={{ color: '#94a3b8', fontSize: '12px' }}>Longest Streak</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#a78bfa' }}>{longestStreak} days</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}