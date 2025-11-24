import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  Hotel, 
  Car, 
  ShoppingBag, 
  Camera, 
  Coffee, 
  MapPin, 
  Mountain, 
  CheckCircle2, 
  Circle,
  CalendarDays,
  Utensils,
  Wallet,
  Plus,
  Trash2,
  TrendingUp,
  Receipt,
  ChevronRight
} from 'lucide-react';

const TripApp = () => {
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' or 'wallet'
  const [activeDay, setActiveDay] = useState(1);
  
  // 行程狀態
  const [completedItems, setCompletedItems] = useState({});
  
  // 記帳狀態
  const [expenses, setExpenses] = useState([]);
  const [expenseForm, setExpenseForm] = useState({
    item: '',
    amount: '',
    category: 'shopping'
  });

  // 初始化讀取 (防止 SSR 錯誤，加強檢查)
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('japanTripProgress');
      const savedExpenses = localStorage.getItem('japanTripExpenses');
      
      if (savedProgress) setCompletedItems(JSON.parse(savedProgress));
      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    } catch (e) {
      console.error("讀取儲存資料失敗", e);
    }
  }, []);

  // 儲存狀態
  useEffect(() => {
    localStorage.setItem('japanTripProgress', JSON.stringify(completedItems));
  }, [completedItems]);

  useEffect(() => {
    localStorage.setItem('japanTripExpenses', JSON.stringify(expenses));
  }, [expenses]);

  // 行程邏輯
  const toggleItem = (dayIndex, itemIndex) => {
    const key = `${dayIndex}-${itemIndex}`;
    setCompletedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // 記帳邏輯
  const addExpense = (e) => {
    e.preventDefault();
    if (!expenseForm.item || !expenseForm.amount) return;

    const newExpense = {
      id: Date.now(),
      day: activeDay,
      item: expenseForm.item,
      amount: parseInt(expenseForm.amount),
      category: expenseForm.category,
      date: new Date().toLocaleDateString()
    };

    setExpenses([newExpense, ...expenses]);
    setExpenseForm({ item: '', amount: '', category: 'shopping' });
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(ex => ex.id !== id));
  };

  const getTotalExpenses = () => {
    return expenses.reduce((acc, curr) => acc + curr.amount, 0);
  };

  const categories = {
    food: { label: '飲食', icon: Utensils, color: 'text-orange-500 bg-orange-50' },
    shopping: { label: '購物', icon: ShoppingBag, color: 'text-pink-500 bg-pink-50' },
    transport: { label: '交通', icon: Car, color: 'text-blue-500 bg-blue-50' },
    stay: { label: '住宿', icon: Hotel, color: 'text-purple-500 bg-purple-50' },
    other: { label: '其他', icon: Receipt, color: 'text-gray-500 bg-gray-50' }
  };

  // 行程資料
  const itinerary = [
    {
      day: 1, date: "3/7 (五)", title: "抵達日本・成田", highlight: "準備開始旅程",
      items: [
        { icon: Plane, text: "抵達成田機場 (NRT)", location: "Narita Airport" },
        { icon: Hotel, text: "入住：成田日航酒店 或 ART 成田酒店", location: "Hotel Nikko Narita" }
      ]
    },
    {
      day: 2, date: "3/8 (六)", title: "自駕啟程・河口湖", highlight: "Outlet 購物與溫泉",
      items: [
        { icon: Car, text: "成田取車" },
        { icon: ShoppingBag, text: "酒酒井 Premium Outlets", location: "Shisui Premium Outlets" },
        { icon: Car, text: "開車前往河口湖" },
        { icon: Hotel, text: "河口湖住宿 ＋ 溫泉", location: "Kawaguchiko Onsen" }
      ]
    },
    {
      day: 3, date: "3/9 (日)", title: "富士山下・絕景", highlight: "新倉富士淺間神社",
      items: [
        { icon: Coffee, text: "河口湖 Café 探店", location: "Kawaguchiko Cafe" },
        { icon: Camera, text: "河口湖周邊拍照" },
        { icon: Mountain, text: "新倉富士淺間神社 (必拍)", location: "Arakurayama Sengen Park" },
        { icon: Utensils, text: "享受溫泉旅館晚餐" }
      ]
    },
    {
      day: 4, date: "3/10 (一)", title: "御殿場・返回東京", highlight: "最大的 Outlet",
      items: [
        { icon: Car, text: "離開河口湖" },
        { icon: ShoppingBag, text: "御殿場 Premium Outlets", location: "Gotemba Premium Outlets" },
        { icon: Car, text: "開車前往東京" },
        { icon: Hotel, text: "東京市區入住", location: "Tokyo Hotel" }
      ]
    },
    {
      day: 5, date: "3/11 (二)", title: "東京 Chill 此刻", highlight: "代官山 / 中目黑",
      items: [
        { icon: Coffee, text: "代官山 散策 & Café", location: "Daikanyama" },
        { icon: Camera, text: "中目黑 散步", location: "Nakameguro" },
        { icon: ShoppingBag, text: "市區逛街" }
      ]
    },
    {
      day: 6, date: "3/12 (三)", title: "藝術與休閒", highlight: "teamLab / 美術館",
      items: [
        { icon: Camera, text: "teamLab Planets / Borderless", location: "teamLab Planets Tokyo" },
        { icon: MapPin, text: "美術館或公園野餐" },
        { icon: Coffee, text: "下午茶 Café Time" }
      ]
    },
    {
      day: 7, date: "3/13 (四)", title: "最後衝刺", highlight: "自由購物行程",
      items: [
        { icon: ShoppingBag, text: "東京最後行街購物", location: "Shinjuku" },
        { icon: MapPin, text: "自選自由行程" },
        { icon: Utensils, text: "享用最後的晚餐" }
      ]
    },
    {
      day: 8, date: "3/14 (五)", title: "再見日本", highlight: "還車與返港",
      items: [
        { icon: Car, text: "前往成田機場還車", location: "Narita Airport Car Rental" },
        { icon: Plane, text: "UO871 航班回港" }
      ]
    }
  ];

  const openMap = (location) => {
    if (!location) return;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
  };

  const calculateProgress = () => {
    const totalItems = itinerary.reduce((acc, curr) => acc + curr.items.length, 0);
    const completedCount = Object.values(completedItems).filter(Boolean).length;
    return Math.round((completedCount / totalItems) * 100);
  };

  // --- Render Functions ---

  const renderSchedule = () => {
    const currentDayData = itinerary.find(d => d.day === activeDay);
    return (
      <div className="space-y-4 pb-24">
        {/* Day Header */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-slate-800">{currentDayData.title}</h2>
          <p className="text-pink-500 font-medium flex items-center gap-1 mt-1">
            <Mountain size={16} />
            {currentDayData.highlight}
          </p>
        </div>

        {/* Timeline Items */}
        {currentDayData.items.map((item, index) => {
          const isCompleted = completedItems[`${activeDay}-${index}`];
          const Icon = item.icon;
          return (
            <div key={index} className={`group relative bg-white rounded-2xl p-4 shadow-sm border transition-all ${isCompleted ? "border-green-200 bg-green-50/30" : "border-slate-100"}`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl shrink-0 ${isCompleted ? "bg-green-100 text-green-600" : "bg-indigo-50 text-indigo-600"}`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg leading-tight mb-1 ${isCompleted ? "text-slate-500 line-through decoration-slate-400" : "text-slate-800"}`}>
                    {item.text}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button onClick={() => toggleItem(activeDay, index)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${isCompleted ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                      {isCompleted ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                      {isCompleted ? "已完成" : "標記完成"}
                    </button>
                    {item.location && (
                      <button onClick={() => openMap(item.location)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                        <MapPin size={14} /> 導航
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWallet = () => (
    <div className="space-y-6 pb-24">
      {/* Total Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200">
        <div className="flex items-center justify-between mb-2 opacity-80">
          <span className="text-sm font-medium">目前總花費 (JPY)</span>
          <TrendingUp size={20} />
        </div>
        <div className="text-4xl font-bold tracking-tight">
          ¥ {getTotalExpenses().toLocaleString()}
        </div>
        <div className="mt-4 flex gap-2 text-xs opacity-70">
          <span className="bg-white/20 px-2 py-1 rounded-md">{expenses.length} 筆紀錄</span>
          <span className="bg-white/20 px-2 py-1 rounded-md">目前紀錄至 Day {activeDay}</span>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">新增消費 (Day {activeDay})</h3>
        <form onSubmit={addExpense} className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <input 
              type="text" 
              placeholder="項目名稱" 
              value={expenseForm.item}
              onChange={e => setExpenseForm({...expenseForm, item: e.target.value})}
              className="col-span-2 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input 
              type="number" 
              placeholder="¥ 金額" 
              value={expenseForm.amount}
              onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})}
              className="col-span-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto py-1 no-scrollbar">
            {Object.entries(categories).map(([key, cat]) => (
              <button
                key={key}
                type="button"
                onClick={() => setExpenseForm({...expenseForm, category: key})}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  expenseForm.category === key 
                    ? cat.color + ' ring-2 ring-offset-1 ring-slate-200' 
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
            <Plus size={18} /> 加入記帳
          </button>
        </form>
      </div>

      {/* Expense List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-500 ml-1">最近消費紀錄</h3>
        {expenses.length === 0 ? (
          <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-2xl border-dashed border-2 border-slate-200">
            <Receipt className="mx-auto mb-2 opacity-50" size={32} />
            <p>還沒有消費紀錄</p>
          </div>
        ) : (
          expenses.map((ex) => {
            const CatIcon = categories[ex.category]?.icon || Receipt;
            const catStyle = categories[ex.category]?.color || 'bg-gray-100 text-gray-500';
            
            return (
              <div key={ex.id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${catStyle}`}>
                    <CatIcon size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{ex.item}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded">Day {ex.day}</span>
                      <span>{categories[ex.category]?.label}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-700">¥ {ex.amount.toLocaleString()}</span>
                  <button onClick={() => deleteExpense(ex.id)} className="text-slate-300 hover:text-red-500 p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header Area */}
      <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 L50 20 L100 100 Z" fill="white" />
          </svg>
        </div>
        <div className="absolute bottom-4 left-6 text-white">
          <p className="text-sm font-medium opacity-90 tracking-widest uppercase mb-1">2025 日本之旅</p>
          <h1 className="text-3xl font-bold">東京・河口湖・自駕遊</h1>
          <div className="flex items-center gap-2 mt-2 text-sm opacity-90">
            <CalendarDays size={16} />
            <span>3/7 - 3/14 (8天)</span>
          </div>
        </div>
      </div>

      {/* Day Selector (Sticky) */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="flex overflow-x-auto py-3 px-4 gap-3 no-scrollbar scroll-smooth">
          {itinerary.map((day) => (
            <button
              key={day.day}
              onClick={() => setActiveDay(day.day)}
              className={`flex-shrink-0 flex flex-col items-center justify-center min-w-[4.5rem] h-16 rounded-xl transition-all duration-200 ${
                activeDay === day.day
                  ? "bg-indigo-600 text-white shadow-md scale-105"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              <span className="text-xs font-medium">Day {day.day}</span>
              <span className={`text-sm font-bold ${activeDay === day.day ? "text-white" : "text-slate-700"}`}>
                {day.date.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
        {/* Progress Bar (Only show in Schedule tab) */}
        {activeTab === 'schedule' && (
          <div className="w-full bg-slate-100 h-1">
            <div 
              className="bg-pink-500 h-1 transition-all duration-500"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 max-w-md mx-auto min-h-[calc(100vh-250px)]">
        {activeTab === 'schedule' ? renderSchedule() : renderWallet()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 pb-safe z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto flex justify-around">
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'schedule' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <CalendarDays size={24} strokeWidth={activeTab === 'schedule' ? 2.5 : 2} />
            <span className="text-[10px] font-bold">行程</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('wallet')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'wallet' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <Wallet size={24} strokeWidth={activeTab === 'wallet' ? 2.5 : 2} />
            <span className="text-[10px] font-bold">記帳</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripApp;