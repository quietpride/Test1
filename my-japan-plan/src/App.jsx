import React, { useState, useEffect, useRef } from 'react';
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
  Building,
  Link as LinkIcon,
  ClipboardList,
  CheckSquare,
  List,
  Download,
  Upload,
  RefreshCw,
  Users
} from 'lucide-react';

const TripApp = () => {
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule', 'overview', 'wallet', or 'todo'
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
  const [splitCount, setSplitCount] = useState(1);
  const EXCHANGE_RATE = 0.052; // 簡單匯率設定 (JPY -> HKD)

  // To-Do List 預設項目
  const defaultTodos = [
    { id: 'fixed-1', text: '第一晚食咩', completed: false },
    { id: 'fixed-2', text: '第二日LUNCH', completed: false },
    { id: 'fixed-3', text: '第三晚搵超市買燒肉煮', completed: false },
    { id: 'fixed-4', text: '第四日LUNCH', completed: false },
    { id: 'fixed-5', text: '第四晚晚餐', completed: false },
  ];

  // To-Do List 狀態 (初始值設為預設項目)
  const [todos, setTodos] = useState(defaultTodos);
  const [todoInput, setTodoInput] = useState('');
  
  // 檔案上傳 Ref
  const fileInputRef = useRef(null);

  // 初始化讀取
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('japanTripProgress');
      const savedExpenses = localStorage.getItem('japanTripExpenses');
      const savedTodos = localStorage.getItem('japanTripTodos');
      
      if (savedProgress) setCompletedItems(JSON.parse(savedProgress));
      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
      
      if (savedTodos) {
        const parsedTodos = JSON.parse(savedTodos);
        if (parsedTodos.length > 0) {
          setTodos(parsedTodos);
        }
      }
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

  useEffect(() => {
    localStorage.setItem('japanTripTodos', JSON.stringify(todos));
  }, [todos]);

  // --- 資料備份與還原功能 ---
  const handleExportData = () => {
    const data = {
      japanTripProgress: completedItems,
      japanTripExpenses: expenses,
      japanTripTodos: todos,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `japan_trip_backup_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('備份檔案已下載！請妥善保存。');
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (data.japanTripProgress) setCompletedItems(data.japanTripProgress);
        if (data.japanTripExpenses) setExpenses(data.japanTripExpenses);
        if (data.japanTripTodos) setTodos(data.japanTripTodos);
        
        alert('資料還原成功！');
      } catch (error) {
        console.error('Import error:', error);
        alert('檔案格式錯誤，無法還原。');
      }
    };
    reader.readAsText(file);
    // 重置 input 以便重複選擇同一檔案
    event.target.value = ''; 
  };

  // --- 邏輯函數 ---
  const toggleItem = (dayIndex, itemIndex) => {
    const key = `${dayIndex}-${itemIndex}`;
    setCompletedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

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

  const addTodo = (e) => {
    e.preventDefault();
    if (!todoInput.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: todoInput,
      completed: false
    };
    setTodos([newTodo, ...todos]);
    setTodoInput('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const categories = {
    food: { label: '飲食', icon: Utensils, color: 'text-orange-500 bg-orange-50' },
    shopping: { label: '購物', icon: ShoppingBag, color: 'text-pink-500 bg-pink-50' },
    transport: { label: '交通', icon: Car, color: 'text-blue-500 bg-blue-50' },
    stay: { label: '住宿', icon: Hotel, color: 'text-purple-500 bg-purple-50' },
    other: { label: '其他', icon: Receipt, color: 'text-gray-500 bg-gray-50' }
  };

  // --- 行程資料 ---
  const itinerary = [
    {
      day: 1, date: "3/7 (五)", title: "抵達日本・成田", highlight: "準備開始旅程",
      items: [
        { icon: Plane, text: "抵達成田機場 (NRT) 14:00~19:05 UO650", location: "Narita Airport" },
        { icon: Hotel, text: "入住：ART 成田酒店 (已BOOK)", location: "ART Hotel Narita" },
        { icon: Utensils, text: "晚餐 Option 1：機場內餐廳" },
        { icon: Utensils, text: "晚餐 Option 2：酒店餐廳 NARITA BOLD KITCHEN", note: "LAST CALL 21:00" },
        { icon: Utensils, text: "晚餐 Option 3：酒店中日料理「櫻」Soh", note: "LAST CALL 20:00/20:30" },
        { icon: ShoppingBag, text: "晚餐 Option 4：酒店內便利店 24 小時 FamilyMart (本館 2樓)" },
        { 
          icon: Utensils, 
          text: "宵夜 Option：磯丸水産 24HRS (成田店)", 
          link: "https://maps.app.goo.gl/xf7cUAaELEWEGB7B7",
          note: "宵夜好去處"
        }
      ]
    },
    {
      day: 2, date: "3/8 (六)", title: "自駕啟程・河口湖", highlight: "Outlet 購物與溫泉",
      items: [
        { icon: Car, text: "成田取車：辦理手續，檢查車況", location: "Narita Airport Car Rental" },
        { icon: ShoppingBag, text: "酒酒井 Premium Outlets", location: "Shisui Premium Outlets" },
        { icon: Car, text: "開車前往河口湖 (享受風景)" },
        { icon: Hotel, text: "河口湖住宿 ＋ 溫泉", location: "Kawaguchiko Onsen" },
        { icon: ShoppingBag, text: "夾公仔 Option 1：河口湖 (收20:00)", location: "2986 Funatsu, Fujikawaguchiko, Minamitsuru District, Yamanashi 401-0301", note: "MAPCODE: 184 562 866" },
        { icon: ShoppingBag, text: "夾公仔 Option 2：富士市 Round 1 (收24:00)", location: "4-15 Yashirocho, Fuji, Shizuoka 417-0024", note: "MAPCODE: 72 233 889" }
      ]
    },
    {
      day: 3, date: "3/9 (日)", title: "富士山下・絕景", highlight: "金山テラス & Airbnb",
      items: [
        { 
          icon: Coffee, 
          text: "河口湖 Café：金山テラス", 
          link: "https://maps.app.goo.gl/h8VdVtr5AvJwH8Nw9"
        },
        { 
          icon: Camera, 
          text: "拍照：道の駅 朝霧高原", 
          link: "https://maps.app.goo.gl/LaMFeU74X4yokKLr7"
        },
        { 
          icon: Mountain, 
          text: "景點：馬飼野牧場", 
          link: "https://maps.app.goo.gl/BzrU4gtfa7UyANno8"
        },
        { 
          icon: Camera, 
          text: "拍照：田貫湖展望台", 
          link: "https://maps.app.goo.gl/VN6YhcNT3BF7rgaj7"
        },
        { 
          icon: Camera, 
          text: "拍照：鳴沢村活き活き広場", 
          link: "https://maps.app.goo.gl/DkdNguPXo722J4yj7",
          note: "REMARKS: 先睇 GOOGLE MAP"
        },
        { icon: Hotel, text: "住宿：Airbnb (富士山 河口湖城市渡假別墅)", location: "Kawaguchiko" },
        { icon: ShoppingBag, text: "夾公仔 Option 1：河口湖 (收20:00)", location: "2986 Funatsu, Fujikawaguchiko, Minamitsuru District, Yamanashi 401-0301", note: "MAPCODE: 184 562 866" },
        { icon: ShoppingBag, text: "夾公仔 Option 2：富士市 Round 1 (收24:00)", location: "4-15 Yashirocho, Fuji, Shizuoka 417-0024", note: "MAPCODE: 72 233 889" }
      ]
    },
    {
      day: 4, date: "3/10 (一)", title: "富士市・Chill", highlight: "夢之大橋 / 箱根",
      items: [
        { icon: Camera, text: "影相：富士山夢之大橋", location: "Fujisan Yumeno Ohashi Bridge" },
        { 
          icon: Coffee, 
          text: "(Optional) 休息：星巴克 富士川服務區(下行)店", 
          location: "Starbucks Fujikawa Service Area Down Line" 
        },
        { icon: Car, text: "Optional: 箱根感受髮夾灣" },
        { icon: Hotel, text: "住宿：Airbnb (富士山 河口湖城市渡假別墅)", location: "Kawaguchiko" },
        { icon: ShoppingBag, text: "夾公仔 Option 1：河口湖 (收20:00)", location: "2986 Funatsu, Fujikawaguchiko, Minamitsuru District, Yamanashi 401-0301", note: "MAPCODE: 184 562 866" },
        { icon: ShoppingBag, text: "夾公仔 Option 2：富士市 Round 1 (收24:00)", location: "4-15 Yashirocho, Fuji, Shizuoka 417-0024", note: "MAPCODE: 72 233 889" }
      ]
    },
    {
      day: 5, date: "3/11 (二)", title: "御殿場・返回東京", highlight: "中目黑 / 表參道",
      items: [
        { icon: Car, text: "Check-out 離開河口湖" },
        { icon: ShoppingBag, text: "OPTION: 御殿場 Premium Outlets", location: "Gotemba Premium Outlets" },
        { icon: Car, text: "開車前往東京市區 (留意塞車)" },
        { 
          icon: Utensils, 
          text: "晚餐: Miko Sushi Ginza 海膽 (已BOOK 17:00)", 
          link: "https://www.threads.com/@k.a.l.o/post/DR4MJbOAfY6",
          note: "預約時間: 17:00"
        },
        { 
          icon: MapPin, 
          text: "散策：中目黑 (Nakameguro) - 目黑川/特色店", 
          location: "Nakameguro" 
        },
        { 
          icon: ShoppingBag, 
          text: "逛街：表參道 (Omotesando) - 精品/建築", 
          location: "Omotesando" 
        },
        { 
          icon: Hotel, 
          text: "住宿：東京 Airbnb (墨田區) (MAPCODE: 531 032 866)", 
          link: "https://maps.app.goo.gl/DAPKH9U57F2xV4kQA" 
        },
        {
          icon: Car,
          text: "泊車 OPTION 1：本所3丁目 (MAPCODE: 741 200 000)",
          location: "3 Chome Honjo, Sumida City, Tokyo 130-0004",
          note: "近 Airbnb，可點擊直接導航"
        },
        {
          icon: Car,
          text: "泊車 OPTION 2：石原3-32-8 (MAPCODE: 531 032 866)",
          location: "3 Chome-32-8 Ishiwara, Sumida City, Tokyo 130-0011",
          note: "備用停車場，可點擊直接導航"
        }
      ]
    },
    {
      day: 6, date: "3/12 (三)", title: "藝術與休閒", highlight: "木更津 Outlet / 居酒屋",
      items: [
        { icon: ShoppingBag, text: "三井 OUTLET PARK 木更津", location: "Mitsui Outlet Park Kisarazu" },
        { icon: MapPin, text: "東京市區行程" },
        { 
          icon: Utensils, 
          text: "晚餐: ビストロ ミートマン (Bistro Meat Man) (已BOOK 19:00)", 
          link: "https://tabelog.com/tw/tokyo/A1303/A130301/13229352/",
          note: "預約時間: 19:00"
        },
        { 
          icon: Hotel, 
          text: "住宿：東京 Airbnb (墨田區) (MAPCODE: 531 032 866)", 
          link: "https://maps.app.goo.gl/DAPKH9U57F2xV4kQA" 
        },
        {
          icon: Car,
          text: "泊車 OPTION 1：本所3丁目 (MAPCODE: 741 200 000)",
          location: "3 Chome Honjo, Sumida City, Tokyo 130-0004",
          note: "近 Airbnb，可點擊直接導航"
        },
        {
          icon: Car,
          text: "泊車 OPTION 2：石原3-32-8 (MAPCODE: 531 032 866)",
          location: "3 Chome-32-8 Ishiwara, Sumida City, Tokyo 130-0011",
          note: "備用停車場，可點擊直接導航"
        }
      ]
    },
    {
      day: 7, date: "3/13 (四)", title: "最後衝刺", highlight: "購物與美食",
      items: [
        { icon: ShoppingBag, text: "最後購物：新宿 / 銀座 / 澀谷", location: "Shibuya Crossing" },
        { icon: MapPin, text: "自選自由行程" },
        { 
          icon: Utensils, 
          text: "晚餐: Peter Luger Steak House (已BOOK 19:15)", 
          note: "預約時間: 19:15"
        },
        { 
          icon: Hotel, 
          text: "住宿：東京 Airbnb (墨田區) (MAPCODE: 531 032 866)", 
          link: "https://maps.app.goo.gl/DAPKH9U57F2xV4kQA" 
        },
        {
          icon: Car,
          text: "泊車 OPTION 1：本所3丁目 (MAPCODE: 741 200 000)",
          location: "3 Chome Honjo, Sumida City, Tokyo 130-0004",
          note: "近 Airbnb，可點擊直接導航"
        },
        {
          icon: Car,
          text: "泊車 OPTION 2：石原3-32-8 (MAPCODE: 531 032 866)",
          location: "3 Chome-32-8 Ishiwara, Sumida City, Tokyo 130-0011",
          note: "備用停車場，可點擊直接導航"
        }
      ]
    },
    {
      day: 8, date: "3/14 (五)", title: "再見日本", highlight: "還車與返港",
      items: [
        { icon: Car, text: "前往成田機場還車 (預留入油時間)", location: "Narita Airport Car Rental Return" },
        { icon: Plane, text: "回程航班：16:55~21:25 UO871", location: "Narita Airport" },
        { icon: Plane, text: "回港：平安回家" }
      ]
    }
  ];

  const openMap = (location) => {
    if (!location) return;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
  };
  
  const openLink = (url) => {
    if (!url) return;
    window.open(url, '_blank');
  };

  const calculateProgress = () => {
    const totalItems = itinerary.reduce((acc, curr) => acc + curr.items.length, 0);
    const completedCount = Object.values(completedItems).filter(Boolean).length;
    return Math.round((completedCount / totalItems) * 100);
  };

  // --- Render Functions ---

  const renderOverview = () => (
    <div className="space-y-6 pb-24">
      {/* Overview Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl p-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2 opacity-80 relative z-10">
          <span className="text-sm font-medium">行程總覽</span>
          <List size={20} />
        </div>
        <div className="flex items-end gap-2 relative z-10">
          <h2 className="text-3xl font-bold">8 天 7 夜</h2>
          <span className="text-lg opacity-90 mb-1">之旅</span>
        </div>
        <p className="text-sm opacity-90 mt-2 flex items-center gap-1 relative z-10">
          <MapPin size={14} /> 東京・河口湖・自駕遊
        </p>
      </div>

      {/* Backup Actions */}
      <div className="flex gap-3">
        <button 
          onClick={handleExportData}
          className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-all"
        >
          <Download size={16} /> 備份資料
        </button>
        <button 
          onClick={() => fileInputRef.current.click()}
          className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-all"
        >
          <Upload size={16} /> 還原資料
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImportData} 
          accept=".json" 
          className="hidden" 
        />
      </div>

      {/* Daily Summary */}
      <div className="space-y-4">
        {itinerary.map((day) => (
          <div key={day.day} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-50">
              <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg text-xs font-bold">Day {day.day}</span>
              <span className="font-bold text-slate-800 text-sm">{day.date.split(' ')[0]}</span>
              <span className="text-slate-500 text-xs ml-auto truncate max-w-[120px]">{day.title}</span>
            </div>
            <div className="space-y-3">
              {day.items.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                      <div key={idx} className="flex gap-3 text-sm group">
                          <div className="mt-0.5 text-slate-400 shrink-0 group-hover:text-indigo-500 transition-colors">
                            <Icon size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                              <div className="text-slate-700 font-medium leading-tight">
                                  {item.text}
                                  {item.note && <span className="text-orange-500 text-xs ml-2 inline-block">({item.note})</span>}
                              </div>
                              {/* Links row */}
                              {(item.link || item.location) && (
                                <div className="flex gap-3 mt-1.5">
                                    {item.link && (
                                        <button 
                                          onClick={() => openLink(item.link)} 
                                          className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded hover:bg-blue-100 transition-colors"
                                        >
                                            <LinkIcon size={10} /> 連結
                                        </button>
                                    )}
                                    {item.location && (
                                        <button 
                                          onClick={() => openMap(item.location)} 
                                          className="flex items-center gap-1 text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded hover:bg-slate-100 transition-colors"
                                        >
                                            <MapPin size={10} /> 地圖
                                        </button>
                                    )}
                                </div>
                              )}
                          </div>
                      </div>
                  );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

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
                  {item.note && (
                    <p className="text-xs text-orange-500 font-bold mt-1">{item.note}</p>
                  )}
                  
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
                    {item.link && (
                      <button onClick={() => openLink(item.link)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-orange-50 text-orange-600">
                        <LinkIcon size={14} /> 連結/地圖
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

        {/* AA制除開功能 */}
        <div className="mt-4 border-t border-white/20 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium flex items-center gap-1 opacity-90">
              <Users size={14} /> 除開幾份？(AA制)
            </span>
            <div className="flex gap-1 bg-black/20 p-1 rounded-lg">
              {[1, 2, 3, 4].map(num => (
                <button
                  key={num}
                  onClick={() => setSplitCount(num)}
                  className={`w-6 h-6 text-xs rounded-md flex items-center justify-center transition-colors ${
                    splitCount === num 
                      ? 'bg-white text-indigo-600 font-bold' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
          
          {splitCount > 1 && (
            <div className="mt-2 flex justify-between items-end bg-black/10 p-3 rounded-xl">
              <span className="text-sm font-medium opacity-90">每人平均：</span>
              <div className="text-right">
                <div className="text-xl font-bold text-emerald-300">
                  ¥ {Math.round(getTotalExpenses() / splitCount).toLocaleString()}
                </div>
                <div className="text-[10px] opacity-70">
                  ~HKD {Math.round((getTotalExpenses() * EXCHANGE_RATE) / splitCount)}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-3 text-xs opacity-70">
          <span className="bg-white/20 px-2 py-1 rounded-md">{expenses.length} 筆紀錄</span>
          <span className="bg-white/20 px-2 py-1 rounded-md flex items-center gap-1">
            <RefreshCw size={10} />
            總計約 HKD ${(getTotalExpenses() * EXCHANGE_RATE).toLocaleString(undefined, {maximumFractionDigits: 0})}
          </span>
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
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <div className="font-bold text-slate-700">¥ {ex.amount.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400">~HKD {Math.round(ex.amount * EXCHANGE_RATE)}</div>
                  </div>
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

  const renderTodo = () => (
    <div className="space-y-6 pb-24">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-lg shadow-emerald-200">
        <div className="flex items-center justify-between mb-2 opacity-80">
          <span className="text-sm font-medium">待辦事項清單</span>
          <ClipboardList size={20} />
        </div>
        <div className="text-2xl font-bold tracking-tight">
          {todos.filter(t => !t.completed).length} 項未完成
        </div>
        <div className="mt-4 flex gap-2 text-xs opacity-70">
          <span className="bg-white/20 px-2 py-1 rounded-md">總共 {todos.length} 項</span>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <form onSubmit={addTodo} className="flex gap-3">
          <input 
            type="text" 
            placeholder="新增待辦事項 (e.g. 買藥妝、借Wi-Fi)" 
            value={todoInput}
            onChange={e => setTodoInput(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button type="submit" className="bg-slate-900 text-white font-bold p-3 rounded-xl hover:bg-slate-800 transition-colors">
            <Plus size={24} />
          </button>
        </form>
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-500 ml-1">清單項目</h3>
        {todos.length === 0 ? (
          <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-2xl border-dashed border-2 border-slate-200">
            <CheckSquare className="mx-auto mb-2 opacity-50" size={32} />
            <p>目前沒有待辦事項</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div 
              key={todo.id} 
              className={`flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border transition-all ${
                todo.completed ? 'border-slate-100 opacity-60' : 'border-slate-200'
              }`}
            >
              <button 
                onClick={() => toggleTodo(todo.id)}
                className={`shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                  todo.completed 
                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                    : 'border-slate-300 text-transparent hover:border-emerald-400'
                }`}
              >
                <CheckSquare size={14} fill="currentColor" />
              </button>
              
              <span className={`flex-1 font-medium ${todo.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                {todo.text}
              </span>

              <button onClick={() => deleteTodo(todo.id)} className="text-slate-300 hover:text-red-500 p-2">
                <Trash2 size={18} />
              </button>
            </div>
          ))
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

      {/* Day Selector (Sticky) - Only show in Schedule tab */}
      {activeTab === 'schedule' && (
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
          <div className="w-full bg-slate-100 h-1">
            <div 
              className="bg-pink-500 h-1 transition-all duration-500"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="px-4 py-6 max-w-md mx-auto min-h-[calc(100vh-250px)]">
        {activeTab === 'schedule' && renderSchedule()}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'wallet' && renderWallet()}
        {activeTab === 'todo' && renderTodo()}
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
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'overview' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <List size={24} strokeWidth={activeTab === 'overview' ? 2.5 : 2} />
            <span className="text-[10px] font-bold">總覽</span>
          </button>

          <button 
            onClick={() => setActiveTab('todo')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'todo' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <ClipboardList size={24} strokeWidth={activeTab === 'todo' ? 2.5 : 2} />
            <span className="text-[10px] font-bold">待辦</span>
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