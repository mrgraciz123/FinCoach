import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { useNavigate, useLocation } from 'react-router';
import { doc, getDoc, collection, getDocs, setDoc } from 'firebase/firestore';
import { ShieldAlert, Lightbulb, ArrowRight, TrendingUp, Gamepad2, Search, TrendingDown, Activity, Loader2, Calculator, Target, Calendar, Plus, Briefcase, AlertTriangle, CheckCircle2, Wallet, ShoppingCart, Bot, BookOpen, ChevronDown, PieChart as PieChartIcon, Award, Flame, Sprout, Sun, Tractor, CloudRain, Trees } from 'lucide-react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { StateGraph, START, END, Annotation } from "@langchain/langgraph/web";
import { GoogleGenAI, Type } from "@google/genai";
import { useLanguage } from '../LanguageContext';
import confetti from 'canvas-confetti';
import CoachAvatar from '../components/CoachAvatar';

export function Home() {
  const [userName, setUserName] = useState('Investor');
  const [marketData, setMarketData] = useState<any>({ nifty: null, sensex: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists() && userDoc.data().displayName) {
          setUserName(userDoc.data().displayName);
        } else if (auth.currentUser.displayName) {
          setUserName(auth.currentUser.displayName);
        }
      }
    };
    fetchUser();

    const fetchMarket = async () => {
      try {
        const [niftyRes, sensexRes] = await Promise.all([
          fetch('/api/stock/^NSEI'),
          fetch('/api/stock/^BSESN')
        ]);
        
        const niftyData = niftyRes.ok ? await niftyRes.json() : null;
        const sensexData = sensexRes.ok ? await sensexRes.json() : null;
        
        setMarketData({
          nifty: niftyData?.quote,
          sensex: sensexData?.quote
        });
      } catch (e) {
        console.error("Error fetching market data", e);
      }
    };
    fetchMarket();
  }, []);

  return (
    <div className="p-5 space-y-8 pb-24 bg-gray-50 min-h-screen">
      <header className="pt-6 pb-2">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-extrabold text-brand-navy tracking-tight">Hi, {userName} <span className="inline-block origin-bottom-right hover:animate-bounce">🧑‍🌾</span></h1>
          <p className="text-gray-500 mt-2 font-medium text-lg">Ready to grow your farm today?</p>
        </motion.div>
      </header>

      {/* Risk Profile Summary */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative overflow-hidden bg-gradient-to-br from-brand-navy to-brand-navy-light rounded-[2rem] p-6 shadow-xl border border-white/10"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center tracking-tight">
              <CloudRain className="w-6 h-6 mr-2 text-brand-gold" />
              Weather Tolerance
            </h2>
            <span className="px-4 py-1.5 bg-brand-gold/20 text-brand-gold-light text-xs font-bold rounded-full uppercase tracking-widest border border-brand-gold/30 backdrop-blur-sm">
              Moderate
            </span>
          </div>
          <p className="text-sm text-gray-300 mb-6 leading-relaxed">
            You are comfortable with short-term weather fluctuations for higher long-term yields.
          </p>
          <div className="glass-card-dark rounded-2xl p-4 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-400">Suggested Land Allocation</span>
            <span className="text-sm font-bold text-white">60% Exotic / 40% Safe</span>
          </div>
        </div>
      </motion.div>

      {/* Live Market Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-xl font-bold text-brand-navy mb-4 px-1 tracking-tight">Live Crop Market</h3>
        <div className="grid grid-cols-2 gap-4">
          {['nifty', 'sensex'].map((idx, i) => {
            const data = marketData[idx];
            const name = idx === 'nifty' ? 'NIFTY 50' : 'SENSEX';
            if (!data) {
              return (
                <div key={idx} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center justify-center h-28">
                  <Loader2 className="w-6 h-6 animate-spin text-brand-emerald" />
                </div>
              );
            }
            const isPositive = data.regularMarketChange >= 0;
            return (
              <motion.div 
                key={idx} 
                whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 transition-all duration-300"
              >
                <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">{name}</p>
                <p className="text-xl font-extrabold text-brand-navy mb-2">{data.regularMarketPrice?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                <div className={`flex items-center text-sm font-bold ${isPositive ? 'text-brand-emerald' : 'text-red-500'}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {isPositive ? '+' : ''}{data.regularMarketChange?.toFixed(2)} ({data.regularMarketChangePercent?.toFixed(2)}%)
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Coach Tip */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-to-r from-brand-emerald to-brand-emerald-dark rounded-[2rem] p-6 text-white shadow-lg relative overflow-hidden"
      >
        <div className="absolute -right-4 -top-4 opacity-20 mix-blend-overlay">
          <Lightbulb className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center mb-3">
            <Sprout className="w-5 h-5 mr-2 text-green-200" />
            <h2 className="text-xs font-bold text-green-100 uppercase tracking-wider">Farmer Tip of the Day</h2>
          </div>
          <p className="text-lg font-medium leading-snug mb-5">
            "Time in the soil beats timing the weather. Start your first Seed Plan to build farming discipline."
          </p>
          <button 
            onClick={() => navigate('/app/sip')}
            className="inline-flex items-center text-sm font-semibold text-green-900 bg-white px-5 py-2.5 rounded-full hover:bg-green-50 transition-colors shadow-sm"
          >
            Calculate Seed Plan <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-3 px-1">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => navigate('/app/stocks')}
            className="flex flex-col items-center justify-center p-5 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="bg-blue-50 p-3.5 rounded-full mb-3">
              <Trees className="w-6 h-6 text-brand-emerald" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Find Crops</span>
          </button>
          <button 
            onClick={() => navigate('/app/simulations')}
            className="flex flex-col items-center justify-center p-5 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="bg-brand-gold/20 p-3.5 rounded-full mb-3">
              <Tractor className="w-6 h-6 text-brand-gold" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Paper Farming</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function StockPrices() {
  const [query, setQuery] = useState('RELIANCE');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchStock = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query) return;
    
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/stock/${query}`);
      if (!res.ok) throw new Error('Crop not found');
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      
      const chartData = json.history.map((item: any) => ({
        date: new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        price: item.close
      }));
      
      setData({ quote: json.quote, chartData });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchStock();
  }, []);

  return (
    <div className="p-5 space-y-8 pb-24 bg-gray-50 min-h-screen">
      <header className="pt-6 pb-2">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-extrabold text-brand-navy tracking-tight">Crop Market</h1>
          <p className="text-gray-500 mt-2 font-medium text-lg">Search live crop prices</p>
        </motion.div>
      </header>

      <form onSubmit={searchStock} className="relative">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full pl-14 pr-24 py-4 bg-white border border-gray-100 rounded-2xl text-brand-navy font-bold text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:border-transparent shadow-xl transition-all"
          placeholder="e.g. RELIANCE, TCS"
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute inset-y-2 right-2 px-6 bg-brand-navy hover:bg-brand-navy-light text-white rounded-xl font-bold transition-colors shadow-md disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
        </button>
      </form>

      {error && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 font-medium text-center shadow-sm flex items-center justify-center">
          <ShieldAlert className="w-6 h-6 mr-3 flex-shrink-0" />
          {error}
        </motion.div>
      )}

      {data && data.quote && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-emerald to-brand-navy"></div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-extrabold text-brand-navy tracking-tight">{data.quote.symbol}</h2>
                <p className="text-gray-500 font-medium mt-1 text-lg line-clamp-1">{data.quote.shortName || data.quote.longName}</p>
              </div>
              <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                <span className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">{data.quote.exchange || 'NSE'}</span>
              </div>
            </div>

            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">Current Price</p>
                <div className="text-5xl font-extrabold text-brand-navy tracking-tight">
                  ₹{data.quote.regularMarketPrice?.toFixed(2)}
                </div>
              </div>
              <div className={`flex items-center px-4 py-2 rounded-xl shadow-sm border ${data.quote.regularMarketChange >= 0 ? 'bg-green-50 text-brand-emerald border-green-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                {data.quote.regularMarketChange >= 0 ? <TrendingUp className="w-5 h-5 mr-2" /> : <TrendingDown className="w-5 h-5 mr-2" />}
                <span className="font-extrabold text-lg">
                  {data.quote.regularMarketChange >= 0 ? '+' : ''}{data.quote.regularMarketChange?.toFixed(2)} ({data.quote.regularMarketChangePercent?.toFixed(2)}%)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Previous Close</p>
                <p className="font-extrabold text-brand-navy text-lg">₹{data.quote.regularMarketPreviousClose?.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Volume</p>
                <p className="font-extrabold text-brand-navy text-lg">
                  {data.quote.regularMarketVolume ? (data.quote.regularMarketVolume / 100000).toFixed(2) + 'L' : 'N/A'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Crop Cap</p>
                <p className="font-extrabold text-brand-navy text-lg">
                  {data.quote.marketCap ? '₹' + (data.quote.marketCap / 10000000).toFixed(2) + 'Cr' : 'N/A'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Yield Ratio</p>
                <p className="font-extrabold text-brand-navy text-lg">
                  {data.quote.trailingPE?.toFixed(2) || 'N/A'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">52W High</p>
                <p className="font-extrabold text-brand-navy text-lg">₹{data.quote.fiftyTwoWeekHigh?.toFixed(2) || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">52W Low</p>
                <p className="font-extrabold text-brand-navy text-lg">₹{data.quote.fiftyTwoWeekLow?.toFixed(2) || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100">
            <div className="flex items-center mb-6">
              <Activity className="w-6 h-6 text-brand-emerald mr-3" />
              <h3 className="text-2xl font-extrabold text-brand-navy tracking-tight">1 Month Trend</h3>
            </div>
            <div className="h-72 w-full">
              {data.chartData && data.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.chartData}>
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 'bold' }}
                      minTickGap={30}
                    />
                    <YAxis 
                      domain={['auto', 'auto']} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 'bold' }}
                      tickFormatter={(value) => `₹${value}`}
                      width={60}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                      itemStyle={{ color: '#0f172a' }}
                      formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Price']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke={data.quote.regularMarketChange >= 0 ? '#10b981' : '#ef4444'} 
                      strokeWidth={4} 
                      dot={false}
                      activeDot={{ r: 8, fill: data.quote.regularMarketChange >= 0 ? '#10b981' : '#ef4444', strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 font-medium">
                  No chart data available
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export function SIPCalculator() {
  const [amount, setAmount] = useState<number>(5000);
  const [years, setYears] = useState<number>(10);
  const [rate, setRate] = useState<number>(12);
  const [sips, setSips] = useState<any[]>([]);
  const [loadingSips, setLoadingSips] = useState(true);

  useEffect(() => {
    const fetchSips = async () => {
      try {
        if (auth.currentUser) {
          const sipsRef = collection(db, 'users', auth.currentUser.uid, 'sips');
          const snapshot = await getDocs(sipsRef);
          
          if (!snapshot.empty) {
            setSips(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            return;
          }
        }
        
        // Fallback to mock data
        const mockSips = [
          { id: '0', name: 'Wheat Co-op', amount: 2500, date: '5th', return: '+14.2%' },
          { id: '1', name: 'Mixed Crop Co-op', amount: 3000, date: '12th', return: '+18.5%' }
        ];
        setSips(mockSips);
      } catch (error) {
        console.error("Error fetching SIPs:", error);
      } finally {
        setLoadingSips(false);
      }
    };
    fetchSips();
  }, []);

  const P = amount;
  const i = rate / 12 / 100;
  const n = years * 12;
  
  const futureValue = Math.round(P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i));
  const investedAmount = P * n;
  const estimatedReturns = futureValue - investedAmount;

  const pieData = [
    { name: 'Invested', value: investedAmount, color: '#93C5FD' },
    { name: 'Returns', value: estimatedReturns, color: '#16A34A' },
  ];

  const formatCurrency = (val: number) => '₹' + val.toLocaleString('en-IN');

  const plans = [
    { name: 'Safe Crop', rate: 8, desc: 'Wheat & Corn', color: 'bg-blue-50 border-blue-200 text-blue-800', badge: 'bg-blue-200' },
    { name: 'Mixed Crop', rate: 12, desc: 'Mixed Vegetables', color: 'bg-yellow-50 border-yellow-200 text-yellow-800', badge: 'bg-yellow-200' },
    { name: 'Exotic Crop', rate: 15, desc: 'Dragon Fruit/Avocado', color: 'bg-red-50 border-red-200 text-red-800', badge: 'bg-red-200' },
  ];

  return (
    <div className="p-5 space-y-8 pb-24 bg-gray-50 min-h-screen">
      <header className="pt-6 pb-2">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-extrabold text-brand-navy tracking-tight">Seed Planner</h1>
          <p className="text-gray-500 mt-2 font-medium text-lg">Calculate and track your harvest</p>
        </motion.div>
      </header>

      {/* Calculator Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 space-y-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-emerald to-brand-navy"></div>
        <div className="flex items-center mb-4">
          <Calculator className="w-6 h-6 text-brand-emerald mr-3" />
          <h2 className="text-2xl font-extrabold text-brand-navy tracking-tight">Yield Calculator</h2>
        </div>

        {/* Amount */}
        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
          <div className="flex justify-between mb-4 items-end">
            <label className="text-sm font-extrabold text-gray-400 uppercase tracking-wider">Monthly Seeds</label>
            <span className="text-xl font-extrabold text-brand-emerald bg-green-50 px-3 py-1 rounded-lg shadow-sm">{formatCurrency(amount)}</span>
          </div>
          <input 
            type="range" min="500" max="100000" step="500" 
            value={amount} onChange={(e) => setAmount(Number(e.target.value))} 
            className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-brand-emerald" 
          />
        </div>

        {/* Years */}
        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
          <div className="flex justify-between mb-4 items-end">
            <label className="text-sm font-extrabold text-gray-400 uppercase tracking-wider">Time Period</label>
            <span className="text-xl font-extrabold text-brand-navy bg-blue-50 px-3 py-1 rounded-lg shadow-sm">{years} Years</span>
          </div>
          <input 
            type="range" min="1" max="40" step="1" 
            value={years} onChange={(e) => setYears(Number(e.target.value))} 
            className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-brand-navy" 
          />
        </div>

        {/* Rate */}
        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
          <div className="flex justify-between mb-4 items-end">
            <label className="text-sm font-extrabold text-gray-400 uppercase tracking-wider">Expected Yield (p.a)</label>
            <span className="text-xl font-extrabold text-brand-gold bg-yellow-50 px-3 py-1 rounded-lg shadow-sm">{rate}%</span>
          </div>
          <input 
            type="range" min="1" max="30" step="0.5" 
            value={rate} onChange={(e) => setRate(Number(e.target.value))} 
            className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-brand-gold" 
          />
        </div>
      </motion.div>

      {/* Results Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-brand-navy to-brand-navy-light rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden border border-white/10"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-emerald rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3"></div>
        <p className="text-gray-300 text-sm font-bold uppercase tracking-widest mb-2">Estimated Harvest Value</p>
        <h3 className="text-5xl font-extrabold text-brand-emerald mb-8 tracking-tight">{formatCurrency(futureValue)}</h3>
        
        <div className="flex items-center justify-between bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
          <div className="w-1/2 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 space-y-4 pl-4">
            <div>
              <div className="flex items-center text-xs text-gray-300 font-bold uppercase tracking-wider mb-1">
                <div className="w-3 h-3 rounded-full bg-blue-300 mr-2 shadow-sm"></div>
                Seeds Planted
              </div>
              <p className="font-extrabold text-xl">{formatCurrency(investedAmount)}</p>
            </div>
            <div>
              <div className="flex items-center text-xs text-gray-300 font-bold uppercase tracking-wider mb-1">
                <div className="w-3 h-3 rounded-full bg-brand-emerald mr-2 shadow-sm"></div>
                Est. Yield
              </div>
              <p className="font-extrabold text-xl">{formatCurrency(estimatedReturns)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Suggested Plans */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center mb-4 px-2">
          <Target className="w-6 h-6 text-brand-navy mr-3" />
          <h3 className="text-2xl font-extrabold text-brand-navy tracking-tight">Suggested Plans</h3>
        </div>
        <div className="flex overflow-x-auto hide-scrollbar space-x-4 pb-4 px-2">
          {plans.map((plan) => (
            <button
              key={plan.name}
              onClick={() => setRate(plan.rate)}
              className={`flex-shrink-0 w-56 p-5 rounded-[1.5rem] border-2 text-left transition-all duration-300 active:scale-95 shadow-sm ${plan.color} ${rate === plan.rate ? 'ring-4 ring-offset-2 ring-current scale-105' : 'hover:scale-105'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="font-extrabold text-lg">{plan.name}</span>
                <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg shadow-sm ${plan.badge}`}>{plan.rate}%</span>
              </div>
              <p className="text-sm opacity-90 font-medium">{plan.desc}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 text-brand-navy mr-3" />
            <h3 className="text-2xl font-extrabold text-brand-navy tracking-tight">My Active Seed Plans</h3>
          </div>
          <button className="text-white bg-brand-emerald p-2 rounded-xl hover:bg-green-600 transition-colors shadow-md">
            <Plus className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          {loadingSips ? (
            <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-brand-emerald" /></div>
          ) : sips.length === 0 ? (
            <div className="text-center py-8 text-gray-500 font-medium bg-white rounded-3xl border border-gray-100 shadow-sm">No active Seed Plans found.</div>
          ) : (
            sips.map((sip) => (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                key={sip.id} 
                className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-center transition-transform"
              >
                <div>
                  <h4 className="font-extrabold text-brand-navy text-lg">{sip.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Every {sip.date} • {formatCurrency(sip.amount)} seeds/mo</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-lg">
                    <TrendingUp className="w-3 h-3 mr-1" /> {sip.return}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function Portfolio() {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        if (auth.currentUser) {
          const portRef = doc(db, 'users', auth.currentUser.uid, 'portfolio', 'summary');
          const snapshot = await getDoc(portRef);
          
          if (snapshot.exists()) {
            setPortfolio(snapshot.data());
            return;
          }
        }
        
        // Fallback to mock data
          let mockPortfolio = {
          totalValue: 124500,
          invested: 110000,
          daysChange: 1250,
          daysChangePercent: 1.01,
          allocationData: [
            { name: 'Exotic Crops', value: 75000, color: '#3B82F6' },
            { name: 'Safe Wheat', value: 35000, color: '#10B981' },
            { name: 'Golden Corn', value: 14500, color: '#F59E0B' },
          ],
          holdings: [
            { symbol: 'RELIANCE', name: 'Reliance Wheat', qty: 10, avgPrice: 2450, ltp: 2850, change: '+1.2%' },
            { symbol: 'TCS', name: 'Tata Corn', qty: 5, avgPrice: 3200, ltp: 3800, change: '-0.5%' },
            { symbol: 'HDFCBANK', name: 'HDFC Dragon Fruit', qty: 20, avgPrice: 1500, ltp: 1420, change: '+0.8%' },
          ]
        };

        try {
          const updatedHoldings = await Promise.all(mockPortfolio.holdings.map(async (h) => {
            try {
              const res = await fetch(`/api/stock/${h.symbol}`);
              if (res.ok) {
                const json = await res.json();
                if (json.quote) {
                  const ltp = json.quote.regularMarketPrice;
                  const changePercent = json.quote.regularMarketChangePercent;
                  const dayChange = json.quote.regularMarketChange;
                  return { ...h, ltp, change: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`, dayChange };
                }
              }
            } catch (e) {
              console.error(`Failed to fetch live price for ${h.symbol}`);
            }
            return { ...h, dayChange: 0 };
          }));
          
          let newEquityValue = 0;
          let newInvested = 0;
          let totalDayChange = 0;
          
          updatedHoldings.forEach(h => {
            newEquityValue += h.qty * h.ltp;
            newInvested += h.qty * h.avgPrice;
            totalDayChange += h.qty * h.dayChange;
          });
          
          const debtValue = 35000;
          const goldValue = 14500;
          const totalValue = newEquityValue + debtValue + goldValue;
          const totalInvested = newInvested + debtValue + goldValue;
          
          mockPortfolio = {
            ...mockPortfolio,
            holdings: updatedHoldings,
            totalValue: totalValue,
            invested: totalInvested,
            daysChange: totalDayChange,
            daysChangePercent: (totalDayChange / (totalValue - totalDayChange)) * 100,
            allocationData: [
              { name: 'Exotic Crops', value: newEquityValue, color: '#3B82F6' },
              { name: 'Safe Wheat', value: debtValue, color: '#10B981' },
              { name: 'Golden Corn', value: goldValue, color: '#F59E0B' },
            ]
          };
        } catch (e) {
          console.error("Error updating live prices", e);
        }

        setPortfolio(mockPortfolio);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const formatCurrency = (val: number) => '₹' + val.toLocaleString('en-IN');
  
  if (loading) {
    return <div className="p-5 flex justify-center items-center h-[calc(100vh-80px)]"><Loader2 className="w-10 h-10 animate-spin text-brand-emerald" /></div>;
  }

  if (!portfolio) {
    return <div className="p-5 text-center text-gray-500 font-medium">No portfolio data found.</div>;
  }

  const { totalValue, invested, daysChange, daysChangePercent, allocationData, holdings } = portfolio;
  const totalReturn = totalValue - invested;
  const returnPercent = (totalReturn / invested) * 100;

  let coachState: 'idle' | 'happy' | 'thinking' | 'concerned' | 'celebrate' = 'idle';
  let coachMessage = "Ready to review your harvest?";
  if (returnPercent > 5) {
    coachState = 'celebrate';
    coachMessage = "Fantastic yields! Your farm is doing great.";
  } else if (returnPercent > 0) {
    coachState = 'happy';
    coachMessage = "You're in the green! Keep up the good farming.";
  } else if (returnPercent < -5) {
    coachState = 'concerned';
    coachMessage = "Weather goes up and down. Focus on the long term.";
  } else if (returnPercent < 0) {
    coachState = 'thinking';
    coachMessage = "A slight drought. Stay calm and stick to your plan.";
  }

  return (
    <div className="p-5 space-y-8 pb-24 bg-gray-50 min-h-screen">
      <header className="pt-6 pb-2">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-extrabold text-brand-navy tracking-tight">Farm Portfolio</h1>
          <p className="text-gray-500 mt-2 font-medium text-lg">Your harvest overview</p>
        </motion.div>
      </header>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <CoachAvatar state={coachState} message={coachMessage} />
      </motion.div>

      {/* Main Balance Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative overflow-hidden bg-gradient-to-br from-brand-navy to-brand-navy-light rounded-[2rem] p-6 shadow-xl border border-white/10"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-emerald rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Trees className="w-24 h-24 text-white" />
        </div>
        <div className="relative z-10">
          <p className="text-brand-gold text-sm font-medium mb-1 uppercase tracking-wider">Current Harvest Value</p>
          <h2 className="text-4xl font-extrabold mb-4 text-white tracking-tight">{formatCurrency(totalValue)}</h2>
          
          <div className="flex items-center space-x-6">
            <div>
              <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider">Total Yield</p>
              <div className={`flex items-center font-bold ${totalReturn >= 0 ? 'text-brand-emerald' : 'text-red-400'}`}>
                {totalReturn >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {formatCurrency(Math.abs(totalReturn))} ({returnPercent.toFixed(2)}%)
              </div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div>
              <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider">1D Growth</p>
              <div className={`flex items-center font-bold ${daysChange >= 0 ? 'text-brand-emerald' : 'text-red-400'}`}>
                {daysChange >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {formatCurrency(Math.abs(daysChange))} ({daysChangePercent?.toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Risk Health Band */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-extrabold text-brand-navy tracking-tight">Farm Health</h3>
          <span className="flex items-center text-xs font-bold text-brand-emerald bg-brand-emerald/10 px-3 py-1.5 rounded-xl border border-brand-emerald/20">
            <CheckCircle2 className="w-4 h-4 mr-1.5" /> On Track
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
            <span>Safe</span>
            <span>Mixed</span>
            <span>Exotic</span>
          </div>
          <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
            <div className="h-full bg-blue-400 w-1/3"></div>
            <div className="h-full bg-brand-gold w-1/3"></div>
            <div className="h-full bg-red-400 w-1/3"></div>
            {/* Indicator */}
            <div className="absolute top-0 bottom-0 w-1.5 bg-brand-navy left-[50%] -ml-0.75 shadow-md rounded-full"></div>
          </div>
          <p className="text-sm text-gray-500 text-center mt-4 font-medium">
            Your farm is currently <strong className="text-brand-navy font-extrabold">Mixed</strong>. This matches your weather tolerance.
          </p>
        </div>
      </motion.div>

      {/* Asset Allocation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-xl font-extrabold text-brand-navy mb-6 tracking-tight">Crop Allocation</h3>
        <div className="flex items-center">
          <div className="w-1/2 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {allocationData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 space-y-4 pl-4">
            {allocationData.map((item: any) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center text-sm font-bold text-gray-600">
                  <div className="w-3 h-3 rounded-full mr-3 shadow-sm" style={{ backgroundColor: item.color }}></div>
                  {item.name}
                </div>
                <span className="text-sm font-extrabold text-brand-navy">
                  {((item.value / totalValue) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Holdings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-xl font-extrabold text-brand-navy mb-4 px-1 tracking-tight">Your Crops</h3>
        <div className="space-y-4">
          {holdings.map((stock: any) => {
            const currentValue = stock.qty * stock.ltp;
            const investedValue = stock.qty * stock.avgPrice;
            const isPositive = currentValue >= investedValue;
            
            return (
              <motion.div 
                key={stock.symbol} 
                whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
                className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-extrabold text-lg text-brand-navy">{stock.symbol}</h4>
                    <p className="text-xs text-gray-500 font-medium line-clamp-1">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-brand-navy">{formatCurrency(currentValue)}</p>
                    <p className={`text-xs font-bold flex items-center justify-end ${isPositive ? 'text-brand-emerald' : 'text-red-500'}`}>
                      {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {formatCurrency(Math.abs(currentValue - investedValue))}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 pt-3 border-t border-gray-50 font-medium">
                  <span>Qty: {stock.qty} • Avg: ₹{stock.avgPrice}</span>
                  <span>LTP: ₹{stock.ltp} <span className={stock.change.startsWith('+') ? 'text-brand-emerald font-bold' : 'text-red-500 font-bold'}>({stock.change})</span></span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

export function Simulations() {
  const navigate = useNavigate();
  const [cash, setCash] = useState(10000);
  const [holdings, setHoldings] = useState<{symbol: string, name: string, qty: number, avgPrice: number, currentPrice: number}[]>([]);
  const [tradeHistory, setTradeHistory] = useState<{type: string, symbol: string, qty: number, price: number, total: number}[]>([]);
  const [query, setQuery] = useState('');
  const [searchData, setSearchData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tradeQty, setTradeQty] = useState<number>(1);
  const [showGrowth, setShowGrowth] = useState(false);

  const formatCurrency = (val: number) => '₹' + val.toLocaleString('en-IN', { maximumFractionDigits: 2 });

  const portfolioValue = holdings.reduce((acc, h) => acc + (h.qty * h.currentPrice), 0);
  const totalValue = cash + portfolioValue;

  const searchStock = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query) return;
    setLoading(true); setError(''); setSearchData(null);
    try {
      const res = await fetch(`/api/stock/${query}`);
      if (!res.ok) throw new Error('Crop not found');
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setSearchData(json.quote);
      setTradeQty(1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const triggerGrowth = () => {
    setShowGrowth(true);
    setTimeout(() => setShowGrowth(false), 1000);
  };

  const handleBuy = () => {
    if (!searchData) return;
    const price = searchData.regularMarketPrice;
    const cost = price * tradeQty;
    if (cash < cost) {
      setError('Not enough seeds!');
      return;
    }
    
    setCash(prev => prev - cost);
    setHoldings(prev => {
      const existing = prev.find(h => h.symbol === searchData.symbol);
      if (existing) {
        const newQty = existing.qty + tradeQty;
        const newAvg = ((existing.qty * existing.avgPrice) + cost) / newQty;
        return prev.map(h => h.symbol === searchData.symbol ? { ...h, qty: newQty, avgPrice: newAvg, currentPrice: price } : h);
      }
      return [...prev, { symbol: searchData.symbol, name: searchData.shortName || searchData.longName, qty: tradeQty, avgPrice: price, currentPrice: price }];
    });
    setTradeHistory(prev => [...prev, { type: 'BUY', symbol: searchData.symbol, qty: tradeQty, price, total: cost }]);
    setSearchData(null);
    setQuery('');
    setError('');
    triggerGrowth();
  };

  const handleSell = () => {
    if (!searchData) return;
    const existing = holdings.find(h => h.symbol === searchData.symbol);
    if (!existing || existing.qty < tradeQty) {
      setError('Not enough crops to harvest!');
      return;
    }

    const price = searchData.regularMarketPrice;
    const revenue = price * tradeQty;
    
    setCash(prev => prev + revenue);
    setHoldings(prev => {
      if (existing.qty === tradeQty) {
        return prev.filter(h => h.symbol !== searchData.symbol);
      }
      return prev.map(h => h.symbol === searchData.symbol ? { ...h, qty: h.qty - tradeQty } : h);
    });
    setTradeHistory(prev => [...prev, { type: 'SELL', symbol: searchData.symbol, qty: tradeQty, price, total: revenue }]);
    setSearchData(null);
    setQuery('');
    setError('');
    triggerGrowth();
  };

  const handleSellAll = (symbol: string, currentPrice: number, qty: number) => {
    const revenue = currentPrice * qty;
    setCash(c => c + revenue);
    setHoldings(prev => prev.filter(h => h.symbol !== symbol));
    setTradeHistory(prev => [...prev, { type: 'SELL', symbol, qty, price: currentPrice, total: revenue }]);
    triggerGrowth();
  };

  const endSession = () => {
    navigate('/app/ai-review', { state: { startingCash: 10000, endingValue: totalValue, holdings, tradeHistory } });
  };

  let coachState: 'idle' | 'happy' | 'concerned' | 'celebrate' | 'thinking' = 'idle';
  let coachMessage = "Ready to plant some seeds? Search for a crop to begin.";

  if (error) {
    coachState = 'concerned';
    coachMessage = "Oops! " + error;
  } else if (loading) {
    coachState = 'thinking';
    coachMessage = "Looking up that crop...";
  } else if (searchData) {
    coachState = 'thinking';
    coachMessage = `Found ${searchData.symbol}. Plant or Harvest?`;
  } else if (tradeHistory.length > 0) {
    coachState = 'happy';
    coachMessage = "Great job! Keep growing that farm.";
  }

  return (
    <div className="p-5 space-y-8 pb-24 bg-gray-50 min-h-screen relative overflow-hidden">
      {/* Subtle soil texture background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#8B5A2B 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

      {showGrowth && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{ scale: [0, 1.5, 2, 0], opacity: [0, 1, 1, 0], y: [50, 0, -50, -100] }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Sprout className="w-32 h-32 text-brand-emerald" />
          </motion.div>
        </div>
      )}

      <header className="pt-6 pb-2 relative z-10">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-extrabold text-brand-navy tracking-tight">Paper Farming</h1>
          <p className="text-gray-500 mt-2 font-medium text-lg">Practice with ₹10,000 virtual seeds</p>
        </motion.div>
      </header>

      <div className="relative z-10">
        <CoachAvatar state={coachState} message={coachMessage} />
      </div>

      {/* Balance Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative overflow-hidden bg-gradient-to-br from-brand-navy to-brand-navy-light rounded-[2rem] p-6 shadow-xl border border-white/10 group hover:shadow-[0_0_40px_rgba(66,32,6,0.5)] transition-all duration-500 z-10"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-emerald rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3 group-hover:opacity-40 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <p className="text-brand-gold text-sm font-medium mb-1 uppercase tracking-wider flex items-center">
            <Tractor className="w-4 h-4 mr-2" /> Farm Value
          </p>
          <h2 className="text-4xl font-extrabold mb-4 text-white tracking-tight">{formatCurrency(totalValue)}</h2>
          
          <div className="flex items-center space-x-6">
            <div>
              <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider flex items-center">
                <Sun className="w-3 h-3 mr-1" /> Available Seeds
              </p>
              <p className="font-bold text-white">{formatCurrency(cash)}</p>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div>
              <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider flex items-center">
                <Sprout className="w-3 h-3 mr-1" /> Planted
              </p>
              <p className="font-bold text-white">{formatCurrency(portfolioValue)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10"
      >
        <form onSubmit={searchStock} className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-gray-400 group-focus-within:text-brand-emerald transition-colors" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            className="block w-full pl-12 pr-24 py-4 bg-white border border-gray-200 rounded-2xl text-brand-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-emerald/50 focus:border-brand-emerald shadow-sm font-medium transition-all group-hover:shadow-md"
            placeholder="Search crop to plant..."
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute inset-y-2 right-2 px-5 bg-brand-navy text-white font-bold rounded-xl hover:bg-brand-navy-light disabled:opacity-50 transition-colors shadow-md hover:shadow-lg"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
          </button>
        </form>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 bg-red-50 text-red-600 p-4 rounded-2xl text-sm border border-red-100 flex items-center font-medium shadow-sm">
            <ShieldAlert className="w-5 h-5 mr-2 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </motion.div>

      {/* Search Result */}
      {searchData && !loading && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100 relative z-10 group hover:border-brand-emerald/30 transition-colors"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-extrabold text-brand-navy flex items-center">
                <Sprout className="w-5 h-5 mr-2 text-brand-emerald" /> {searchData.symbol}
              </h3>
              <p className="text-sm text-gray-500 font-medium line-clamp-1">{searchData.shortName || searchData.longName}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-brand-navy">₹{searchData.regularMarketPrice?.toFixed(2)}</p>
              <p className={`text-sm font-bold flex items-center justify-end ${searchData.regularMarketChange >= 0 ? 'text-brand-emerald' : 'text-red-500'}`}>
                {searchData.regularMarketChange >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {searchData.regularMarketChange?.toFixed(2)} ({searchData.regularMarketChangePercent?.toFixed(2)}%)
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-gray-50">
            <div>
              <p className="text-xs text-gray-500 mb-1 font-medium">Previous Close</p>
              <p className="font-bold text-brand-navy">₹{searchData.regularMarketPreviousClose?.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1 font-medium">Day's Range</p>
              <p className="font-bold text-brand-navy">₹{searchData.regularMarketDayLow?.toFixed(2)} - ₹{searchData.regularMarketDayHigh?.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1 font-medium">52W Range</p>
              <p className="font-bold text-brand-navy">₹{searchData.fiftyTwoWeekLow?.toFixed(2)} - ₹{searchData.fiftyTwoWeekHigh?.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1 font-medium">Volume</p>
              <p className="font-bold text-brand-navy">
                {searchData.regularMarketVolume ? (searchData.regularMarketVolume / 100000).toFixed(2) + 'L' : 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 pt-6 border-t border-gray-50">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 shadow-inner">
              <button type="button" onClick={() => setTradeQty(Math.max(1, tradeQty - 1))} className="px-4 py-3 text-gray-600 hover:bg-gray-200 font-bold transition-colors">-</button>
              <input type="number" value={tradeQty} onChange={(e) => setTradeQty(Math.max(1, parseInt(e.target.value) || 1))} className="w-16 text-center py-3 focus:outline-none font-bold text-brand-navy bg-transparent" />
              <button type="button" onClick={() => setTradeQty(tradeQty + 1)} className="px-4 py-3 text-gray-600 hover:bg-gray-200 font-bold transition-colors">+</button>
            </div>
            <div className="flex-1 flex space-x-3">
              <button onClick={handleBuy} className="flex-1 py-3 bg-brand-emerald text-white font-bold rounded-xl hover:bg-brand-emerald-dark transition-all shadow-md shadow-brand-emerald/20 flex justify-center items-center hover:scale-[1.02]">
                Plant
              </button>
              <button onClick={handleSell} className="flex-1 py-3 bg-brand-gold text-brand-navy font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-md shadow-brand-gold/20 flex justify-center items-center hover:scale-[1.02]">
                Harvest
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Holdings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-xl font-bold text-brand-navy mb-4 px-1 tracking-tight">Current Positions</h3>
        {holdings.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No active positions. Search and plant crops to start farming!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {holdings.map((h) => {
              const currentValue = h.qty * h.currentPrice;
              const investedValue = h.qty * h.avgPrice;
              const isPositive = currentValue >= investedValue;
              
              return (
                <motion.div 
                  key={h.symbol} 
                  whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
                  className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-extrabold text-lg text-brand-navy">{h.symbol}</h4>
                      <p className="text-xs text-gray-500 font-medium">Qty: {h.qty} • Avg: ₹{h.avgPrice.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-brand-navy">{formatCurrency(currentValue)}</p>
                      <p className={`text-xs font-bold flex items-center justify-end ${isPositive ? 'text-brand-emerald' : 'text-red-500'}`}>
                        {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {formatCurrency(Math.abs(currentValue - investedValue))}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleSellAll(h.symbol, h.currentPrice, h.qty)}
                    className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors"
                  >
                    Sell All
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* End Session */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="pt-6"
      >
        <button 
          onClick={endSession}
          className="w-full py-4 bg-gradient-to-r from-brand-navy to-brand-navy-light text-white font-bold rounded-2xl shadow-lg shadow-brand-navy/20 hover:shadow-xl transition-all duration-300 flex items-center justify-center text-lg"
        >
          <Bot className="w-6 h-6 mr-2 text-brand-gold" /> End Session & Get AI Review
        </button>
      </motion.div>
    </div>
  );
}

const MICRO_LESSONS = [
  {
    id: 'lesson-1',
    title: 'What is a Seed Plan?',
    category: 'Farming Basics',
    content: 'A Systematic Seed Plan allows you to plant a fixed amount of seeds regularly. It helps you grow your farm over time without worrying about timing the weather.',
    icon: 'Calendar',
    color: 'bg-blue-500'
  },
  {
    id: 'lesson-2',
    title: 'Power of Cross-Pollination',
    category: 'Farm Growth',
    content: 'Cross-pollination is when your crops yield seeds that grow into more crops. The earlier you plant, the more your farm multiplies!',
    icon: 'TrendingUp',
    color: 'bg-green-500'
  },
  {
    id: 'lesson-3',
    title: 'Crop Rotation',
    category: 'Weather Management',
    content: 'Don\'t plant only one type of crop. Crop rotation means spreading your seeds across different crops to reduce the risk of a bad harvest.',
    icon: 'Briefcase',
    color: 'bg-purple-500'
  },
  {
    id: 'lesson-4',
    title: 'Weather vs. Yield',
    category: 'Farming Basics',
    content: 'Generally, higher potential yields come with higher weather risks. Exotic crops offer high yields but are fragile, while wheat is safe but offers lower yields. Balance them based on your farm goals.',
    icon: 'Activity',
    color: 'bg-orange-500'
  },
  {
    id: 'lesson-5',
    title: 'Winter Silo',
    category: 'Farm Finance',
    content: 'Before expanding your farm, build a winter silo covering 3-6 months of feed. Keep it in a safe place to survive harsh winters.',
    icon: 'ShieldAlert',
    color: 'bg-teal-500'
  },
  {
    id: 'lesson-6',
    title: 'Pests: The Silent Thief',
    category: 'Farm Economics',
    content: 'Pests reduce the yield of your crops over time. If your seeds are just sitting in a barn, pests will eat them, and you are actually losing seeds.',
    icon: 'TrendingDown',
    color: 'bg-red-500'
  },
  {
    id: 'lesson-7',
    title: 'Co-op Farming vs Solo Farming',
    category: 'Farming Options',
    content: 'Co-op farming is managed by professionals and offers instant crop variety. Solo farming requires you to do your own research and carries higher risk for individual crops.',
    icon: 'Target',
    color: 'bg-indigo-500'
  },
  {
    id: 'lesson-8',
    title: 'Common Scams: Fake Fertilizer',
    category: 'Scam Alert',
    content: 'Scammers sell fake fertilizer by spreading false positive news, then disappear when your crops fail, leaving honest farmers with huge losses.',
    icon: 'AlertTriangle',
    color: 'bg-rose-500'
  },
  {
    id: 'lesson-9',
    title: 'Foxes & Barn Break-ins',
    category: 'Farm Security',
    content: 'Never leave your barn door open. Foxes may pretend to be friendly dogs. Always verify who is entering your farm before sharing your harvest.',
    icon: 'ShieldAlert',
    color: 'bg-red-600'
  },
  {
    id: 'lesson-10',
    title: 'Land Allocation',
    category: 'Farm Strategy',
    content: 'Your land allocation (how much for risky crops vs safe crops) should depend on your experience. A common rule of thumb is: 100 minus your age = % to plant exotic crops.',
    icon: 'PieChart',
    color: 'bg-cyan-500'
  },
  {
    id: 'lesson-11',
    title: 'Taxes on Harvest',
    category: 'Taxes',
    content: 'Profits from selling crops are taxed. Short-Term Harvest Gains apply if sold within a season, while Long-Term Harvest Gains apply after a year.',
    icon: 'Calculator',
    color: 'bg-emerald-500'
  },
  {
    id: 'lesson-12',
    title: 'Emotional Farming (FOMO)',
    category: 'Farming Psychology',
    content: 'Fear Of Missing Out (FOMO) makes you plant when seeds are most expensive. Panic makes you harvest too early. Stick to your farming plan and ignore the weather noise.',
    icon: 'Lightbulb',
    color: 'bg-amber-500'
  }
];

export function Learn() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'lessons'));
        if (querySnapshot.empty) {
          // Seed lessons if empty
          console.log('Seeding lessons...');
          const promises = MICRO_LESSONS.map(lesson => 
            setDoc(doc(db, 'lessons', lesson.id), lesson)
          );
          await Promise.all(promises);
          setLessons(MICRO_LESSONS);
        } else {
          const loadedLessons = querySnapshot.docs.map(doc => doc.data());
          // Sort by id to maintain order
          loadedLessons.sort((a, b) => a.id.localeCompare(b.id));
          setLessons(loadedLessons);
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
        // Fallback to local data if firestore fails
        setLessons(MICRO_LESSONS);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen pb-20 bg-brand-navy">
        <Loader2 className="w-10 h-10 animate-spin text-brand-emerald" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] overflow-y-scroll snap-y snap-mandatory hide-scrollbar bg-brand-navy relative">
      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-emerald rounded-full mix-blend-overlay filter blur-[100px] opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-gold rounded-full mix-blend-overlay filter blur-[100px] opacity-10"></div>
      </div>

      <div className="relative z-10">
        {lessons.map((lesson, index) => {
          const isLast = index === lessons.length - 1;
          
          // Map icon string to actual component
          let IconComponent = Lightbulb;
          if (lesson.icon === 'Calendar') IconComponent = Calendar;
          if (lesson.icon === 'TrendingUp') IconComponent = TrendingUp;
          if (lesson.icon === 'Briefcase') IconComponent = Briefcase;
          if (lesson.icon === 'Activity') IconComponent = Activity;
          if (lesson.icon === 'ShieldAlert') IconComponent = ShieldAlert;
          if (lesson.icon === 'TrendingDown') IconComponent = TrendingDown;
          if (lesson.icon === 'Target') IconComponent = Target;
          if (lesson.icon === 'AlertTriangle') IconComponent = AlertTriangle;
          if (lesson.icon === 'Calculator') IconComponent = Calculator;
          if (lesson.icon === 'PieChart') IconComponent = PieChartIcon;
          
          return (
            <div key={lesson.id} className="h-[calc(100vh-80px)] w-full snap-start snap-always flex flex-col justify-center items-center p-6 relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                
                <div className="p-10 flex flex-col items-center justify-center text-white min-h-[250px] relative">
                  <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-30 ${lesson.color || 'bg-brand-emerald'}`}></div>
                    <div className={`absolute -bottom-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-20 ${lesson.color || 'bg-brand-gold'}`}></div>
                  </div>
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="bg-white/10 p-5 rounded-2xl mb-6 backdrop-blur-md border border-white/20 shadow-lg"
                    >
                      <IconComponent className="w-10 h-10 text-white" />
                    </motion.div>
                    <span className="px-4 py-1.5 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md mb-4 border border-white/10 text-brand-gold">
                      {lesson.category}
                    </span>
                    <h2 className="text-3xl font-extrabold text-center leading-tight tracking-tight text-white">{lesson.title}</h2>
                  </div>
                </div>
                
                <div className="p-8 bg-white/10 backdrop-blur-md border-t border-white/10">
                  <p className="text-gray-200 text-lg leading-relaxed font-medium">
                    {lesson.content}
                  </p>
                </div>
              </motion.div>
              
              {!isLast && (
                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="absolute bottom-12 text-white/50 flex flex-col items-center"
                >
                  <span className="text-xs font-bold mb-2 tracking-widest uppercase text-brand-gold/70">Swipe</span>
                  <ChevronDown className="w-8 h-8 text-brand-gold/50" />
                </motion.div>
              )}
              
              {isLast && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="absolute bottom-12 text-white/80 flex flex-col items-center"
                >
                  <div className="bg-brand-emerald/20 p-3 rounded-full mb-2 border border-brand-emerald/30">
                    <CheckCircle2 className="w-8 h-8 text-brand-emerald" />
                  </div>
                  <span className="text-sm font-bold tracking-wide">You've caught up!</span>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const PUZZLES = [
  {
    id: 1,
    scenario: "You have 50,000 seeds planted in a diversified farm. A sudden drought hits and 20% of crops wither. What is the best course of action?",
    options: [
      { text: "Harvest everything immediately to stop further losses." },
      { text: "Plant more hardy crops while seeds are cheap." },
      { text: "Stop looking at your fields and do nothing." }
    ]
  },
  {
    id: 2,
    scenario: "Your neighbor tells you about a 'magic fertilizer' that doubles your crop yield in 6 days. What should you do?",
    options: [
      { text: "Buy a small amount to test it out." },
      { text: "Ask for more details and their past harvest records." },
      { text: "Ignore it completely. If it sounds too good to be true, it probably is." }
    ]
  },
  {
    id: 3,
    scenario: "You just had your first harvest of 30,000 crops. What should be your first farming step?",
    options: [
      { text: "Start planting 10,000 seeds in exotic crops." },
      { text: "Build a winter silo covering 3-6 months of feed." },
      { text: "Buy the latest shiny tractor on loan." }
    ]
  },
  {
    id: 4,
    scenario: "You want to expand your farm but don't have seeds. A merchant offers you a seed loan at 12% interest. Should you take it to plant?",
    options: [
      { text: "Yes, if my yield is 15%, I profit 3%." },
      { text: "No, planting with borrowed seeds is extremely risky and can lead to a debt trap." },
      { text: "Yes, but only plant safe wheat crops." }
    ]
  },
  {
    id: 5,
    scenario: "You are deciding between buying a barn on a 20-year mortgage or renting and planting the difference. What is the most financially sound approach?",
    options: [
      { text: "Always buy a barn. Renting is throwing seeds away." },
      { text: "Always rent. Barns are a bad investment." },
      { text: "It depends on the rental cost, loan interest rate, and your long-term harvest plans. Run the numbers first." }
    ]
  },
  {
    id: 6,
    scenario: "You have 100,000 seeds to plant. You hear about a new exotic fruit that is expected to yield 10x. How should you allocate?",
    options: [
      { text: "Plant all 100,000 seeds in the exotic fruit to maximize yield." },
      { text: "Plant 5,000 seeds in the exotic fruit and diversify the rest across different crops." },
      { text: "Don't plant it at all. Stick to safe wheat." }
    ]
  },
  {
    id: 7,
    scenario: "Everyone in the village is talking about a new 'miracle bean' that has gone up 300% in price in a week. What is your move?",
    options: [
      { text: "Buy immediately before it goes up another 300%." },
      { text: "Short sell the bean because it has to crash." },
      { text: "Stay away. It's driven by hype, not fundamentals, and the risk of a crash is very high." }
    ]
  },
  {
    id: 8,
    scenario: "It's the end of the season, and you haven't done any tax saving harvests. What should you do?",
    options: [
      { text: "Quickly buy a bad insurance policy from the village elder." },
      { text: "Invest 1.5 Lakh seeds in a tax-saving crop to save tax and build wealth." },
      { text: "Pay the tax. It's too late to make a good decision." }
    ]
  }
];

export function Puzzles() {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{isCorrect: boolean, explanation: string, correctOptionIndex: number} | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleOptionClick = async (index: number) => {
    if (showFeedback || isScoring) return;
    setSelectedOption(index);
    setIsScoring(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const puzzle = PUZZLES[currentPuzzle];
      const selectedText = puzzle.options[index].text;
      
      const prompt = `
        You are an expert farming coach. 
        Scenario: "${puzzle.scenario}"
        Options:
        ${puzzle.options.map((opt, i) => `${i}: ${opt.text}`).join('\n')}
        
        User chose option ${index}: "${selectedText}"
        
        Evaluate this farming decision.
        Return a JSON object with:
        - isCorrect: boolean (true if the user chose the best farming decision, false otherwise)
        - explanation: string (A brief, encouraging explanation of why it's correct or incorrect, max 2 sentences)
        - correctOptionIndex: number (The index of the best option. If the user is correct, this should be ${index})
      `;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isCorrect: { type: Type.BOOLEAN },
              explanation: { type: Type.STRING },
              correctOptionIndex: { type: Type.NUMBER }
            },
            required: ["isCorrect", "explanation", "correctOptionIndex"]
          }
        }
      });
      
      const result = JSON.parse(response.text || '{}');
      setAiFeedback(result);
      if (result.isCorrect) {
        setScore(s => s + 1);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#F59E0B', '#ffffff']
        });
      }
    } catch (error) {
      console.error("Error scoring puzzle:", error);
      // Fallback
      setAiFeedback({
        isCorrect: false,
        explanation: "Unable to get AI feedback at the moment. Please try again.",
        correctOptionIndex: 0
      });
    } finally {
      setIsScoring(false);
      setShowFeedback(true);
    }
  };

  const nextPuzzle = () => {
    if (currentPuzzle < PUZZLES.length - 1) {
      setCurrentPuzzle(c => c + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setAiFeedback(null);
    } else {
      setIsFinished(true);
    }
  };

  const resetPuzzles = () => {
    setCurrentPuzzle(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setAiFeedback(null);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="p-5 flex flex-col items-center justify-center h-[80vh] text-center space-y-6 bg-gray-50 min-h-screen">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ type: "spring", bounce: 0.5 }}
          className="bg-brand-emerald/10 p-8 rounded-full border-4 border-brand-emerald/20 shadow-xl shadow-brand-emerald/10"
        >
          <Target className="w-20 h-20 text-brand-emerald" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-4xl font-extrabold text-brand-navy mb-3 tracking-tight">Farming Training Complete!</h2>
          <p className="text-xl text-gray-600 font-medium">You scored <span className="font-extrabold text-brand-emerald text-2xl">{score}</span> out of {PUZZLES.length}</p>
        </motion.div>
        <motion.button 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          onClick={resetPuzzles}
          className="px-10 py-4 bg-gradient-to-r from-brand-navy to-brand-navy-light text-white font-bold rounded-2xl shadow-lg shadow-brand-navy/20 hover:shadow-xl transition-all duration-300 text-lg"
        >
          Try Again
        </motion.button>
      </div>
    );
  }

  const puzzle = PUZZLES[currentPuzzle];

  return (
    <div className="p-5 space-y-8 pb-24 bg-gray-50 min-h-screen">
      <header className="pt-6 pb-2">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex justify-between items-end mb-2">
          <h1 className="text-4xl font-extrabold text-brand-navy tracking-tight">Farming Scenarios</h1>
          <span className="text-sm font-bold text-brand-gold bg-brand-navy px-4 py-1.5 rounded-full shadow-sm">
            {currentPuzzle + 1} / {PUZZLES.length}
          </span>
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-500 font-medium text-lg">Test your financial decision-making skills.</motion.p>
      </header>

      <motion.div 
        key={currentPuzzle}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-emerald rounded-full mix-blend-overlay filter blur-3xl opacity-10 -translate-y-1/2 translate-x-1/3"></div>
        
        <h2 className="text-2xl font-extrabold text-brand-navy leading-snug mb-8 relative z-10">
          {puzzle.scenario}
        </h2>

        <div className="space-y-4 relative z-10">
          {puzzle.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = aiFeedback?.correctOptionIndex === idx;
            
            let buttonClass = "w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 flex items-start ";
            let iconClass = "flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center mr-4 mt-0.5 transition-colors ";
            
            if (!showFeedback && !isScoring) {
              buttonClass += "border-gray-100 bg-gray-50 hover:border-brand-emerald/30 hover:bg-brand-emerald/5 text-gray-700 hover:shadow-md";
              iconClass += "border-gray-300 text-transparent";
            } else if (isScoring && isSelected) {
              buttonClass += "border-brand-emerald bg-brand-emerald/5 text-brand-navy shadow-md";
              iconClass += "border-brand-emerald bg-brand-emerald text-white";
            } else if (isScoring && !isSelected) {
              buttonClass += "border-gray-100 bg-gray-50 text-gray-400 opacity-50";
              iconClass += "border-gray-200 text-transparent";
            } else if (showFeedback && isSelected && aiFeedback?.isCorrect) {
              buttonClass += "border-brand-emerald bg-brand-emerald/10 text-brand-navy shadow-md";
              iconClass += "border-brand-emerald bg-brand-emerald text-white";
            } else if (showFeedback && isSelected && !aiFeedback?.isCorrect) {
              buttonClass += "border-red-500 bg-red-50 text-red-900 shadow-md";
              iconClass += "border-red-500 bg-red-500 text-white";
            } else if (showFeedback && !isSelected && isCorrectOption) {
              buttonClass += "border-brand-emerald border-dashed bg-brand-emerald/5 text-brand-navy opacity-70";
              iconClass += "border-brand-emerald text-brand-emerald";
            } else {
              buttonClass += "border-gray-100 bg-gray-50 text-gray-400 opacity-40";
              iconClass += "border-gray-200 text-transparent";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={showFeedback || isScoring}
                className={buttonClass}
              >
                <div className={iconClass}>
                  {showFeedback && isSelected && aiFeedback?.isCorrect && <CheckCircle2 className="w-4 h-4" />}
                  {showFeedback && isSelected && !aiFeedback?.isCorrect && <AlertTriangle className="w-4 h-4" />}
                  {showFeedback && !isSelected && isCorrectOption && <CheckCircle2 className="w-4 h-4" />}
                  {isScoring && isSelected && <Loader2 className="w-4 h-4 animate-spin" />}
                </div>
                <span className="font-bold text-lg leading-relaxed">{option.text}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {showFeedback && selectedOption !== null && aiFeedback && (
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className={`p-6 rounded-[2rem] border-2 shadow-lg ${aiFeedback.isCorrect ? 'bg-brand-emerald/10 border-brand-emerald/20 text-brand-navy' : 'bg-red-50 border-red-200 text-red-900'}`}
        >
          <div className="flex items-start">
            <div className={`p-3 rounded-full mr-4 flex-shrink-0 ${aiFeedback.isCorrect ? 'bg-brand-emerald text-white shadow-md shadow-brand-emerald/30' : 'bg-red-500 text-white shadow-md shadow-red-500/30'}`}>
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <p className={`font-extrabold text-xl mb-2 ${aiFeedback.isCorrect ? 'text-brand-emerald' : 'text-red-600'}`}>
                {aiFeedback.isCorrect ? 'Brilliant Move!' : 'Learning Opportunity'}
              </p>
              <p className="text-base leading-relaxed font-medium opacity-90">{aiFeedback.explanation}</p>
            </div>
          </div>
        </motion.div>
      )}

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="pt-4"
        >
          <button 
            onClick={nextPuzzle}
            className="w-full py-4 bg-gradient-to-r from-brand-navy to-brand-navy-light text-white font-bold rounded-2xl shadow-lg shadow-brand-navy/20 hover:shadow-xl transition-all duration-300 flex justify-center items-center text-lg"
          >
            {currentPuzzle < PUZZLES.length - 1 ? 'Next Scenario' : 'See Final Score'} <ArrowRight className="w-6 h-6 ml-2" />
          </button>
        </motion.div>
      )}
    </div>
  );
}

const ReviewStateAnnotation = Annotation.Root({
  tradeHistory: Annotation<any[]>(),
  startingCash: Annotation<number>(),
  endingValue: Annotation<number>(),
  fraudAnalysis: Annotation<any>(),
  scoredTrades: Annotation<any[]>(),
  mentorMessage: Annotation<string>(),
  educationLesson: Annotation<string>(),
});

const fraudAndRiskAgent = async (state: typeof ReviewStateAnnotation.State) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `You are a strict but helpful Risk & Fraud AI agent for a beginner farming app. Analyze the following crop history for a single season.
Look for dangerous patterns such as:
- Gambling behavior (planting and harvesting the same crop rapidly)
- Penny crop chasing (planting very low-priced, highly volatile crops)
- Lack of diversification (planting all seeds in one crop)
- FOMO planting (planting after a massive yield run-up)

Provide an overall summary (2-3 sentences).
Then, provide granular risk analysis for EACH crop, identifying if it's a 'penny crop', if there's 'over-concentration' (e.g., >40% of farm), and suggest a 'weather-loss' price/percentage if the crop is risky or heading for a loss.

Starting Seeds: ₹${state.startingCash}
Crops: ${JSON.stringify(state.tradeHistory)}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          tradeRisks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                symbol: { type: Type.STRING },
                isPennyStock: { type: Type.BOOLEAN },
                isOverConcentrated: { type: Type.BOOLEAN },
                stopLossSuggestion: { type: Type.STRING, description: "Suggested weather-loss price or percentage, or empty string if not applicable" }
              },
              required: ["symbol", "isPennyStock", "isOverConcentrated", "stopLossSuggestion"]
            }
          }
        },
        required: ["summary", "tradeRisks"]
      }
    }
  });
  const fraudAnalysis = JSON.parse(response.text || '{"summary": "", "tradeRisks": []}');
  return { fraudAnalysis };
};

const reviewAndScoringAgent = async (state: typeof ReviewStateAnnotation.State) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `Analyze these crops. Categorize each as 'Strong', 'Risky', or 'Blunder'. Provide a reason and a 'better move'. Crops: ${JSON.stringify(state.tradeHistory)}`;
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            symbol: { type: Type.STRING },
            type: { type: Type.STRING },
            label: { type: Type.STRING, enum: ['Strong', 'Risky', 'Blunder'] },
            reason: { type: Type.STRING },
            betterMove: { type: Type.STRING },
          },
          required: ['symbol', 'type', 'label', 'reason', 'betterMove']
        }
      }
    }
  });
  const scoredTrades = JSON.parse(response.text || "[]");
  return { scoredTrades };
};

const mentorAgent = async (state: typeof ReviewStateAnnotation.State) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `You are a friendly, encouraging farming mentor for a beginner farmer in India.
Summarize their recent paper farming season based on the following data:
- Starting seeds: ₹${state.startingCash}
- Ending yield: ₹${state.endingValue}
- Risk Analysis: "${JSON.stringify(state.fraudAnalysis)}"
- Scored Crops: ${JSON.stringify(state.scoredTrades)}

Provide a warm, encouraging 2-3 sentence summary. Acknowledge their yield or loss, highlight one key takeaway from the risk analysis or scored crops, and end with a motivating thought. Do not use markdown formatting like bolding.`;
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
  });
  return { mentorMessage: response.text };
};

const educationAgent = async (state: typeof ReviewStateAnnotation.State) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `You are a farming education agent for a beginner farming app.
Based on the user's recent crops and risk analysis, provide a short 2-sentence educational lesson about a relevant farming concept (e.g., crop rotation, weather-loss, market orders vs limit orders, FOMO).
Risk Analysis: ${JSON.stringify(state.fraudAnalysis)}
Scored Crops: ${JSON.stringify(state.scoredTrades)}

Keep it simple, educational, and directly related to their mistakes or successes.`;
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
  });
  return { educationLesson: response.text };
};

const workflow = new StateGraph(ReviewStateAnnotation)
  .addNode("fraudAndRiskAgent", fraudAndRiskAgent)
  .addNode("reviewAndScoringAgent", reviewAndScoringAgent)
  .addNode("mentorAgent", mentorAgent)
  .addNode("educationAgent", educationAgent)
  .addEdge(START, "fraudAndRiskAgent")
  .addEdge("fraudAndRiskAgent", "reviewAndScoringAgent")
  .addEdge("reviewAndScoringAgent", "mentorAgent")
  .addEdge("mentorAgent", "educationAgent")
  .addEdge("educationAgent", END);

const reviewApp = workflow.compile();

export function AIReview() {
  const location = useLocation();
  const sessionData = location.state;
  const navigate = useNavigate();
  const [reviewState, setReviewState] = useState<typeof ReviewStateAnnotation.State | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionData || !sessionData.tradeHistory || sessionData.tradeHistory.length === 0) {
      setLoading(false);
      return;
    }

    const runAgents = async () => {
      try {
        const initialState = {
          tradeHistory: sessionData.tradeHistory,
          startingCash: sessionData.startingCash,
          endingValue: sessionData.endingValue,
          fraudAnalysis: { summary: "", tradeRisks: [] },
          scoredTrades: [],
          mentorMessage: "",
          educationLesson: ""
        };
        const finalState = await reviewApp.invoke(initialState);
        setReviewState(finalState);
      } catch (error) {
        console.error("Agent error:", error);
      } finally {
        setLoading(false);
      }
    };

    runAgents();
  }, [sessionData]);

  if (!sessionData) {
    return (
      <div className="p-5 flex flex-col items-center justify-center h-[80vh] text-center space-y-4">
        <Bot className="w-16 h-16 text-gray-300" />
        <h2 className="text-xl font-bold text-gray-900">No Active Session</h2>
        <p className="text-gray-500">Complete a paper farming simulation to get an AI review of your performance.</p>
        <button onClick={() => navigate('/app/simulations')} className="px-6 py-2 bg-brand-emerald text-white rounded-full font-bold shadow-md hover:shadow-lg transition-all">Start Farming</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen pb-20 space-y-6">
        <div className="relative">
          <Bot className="w-16 h-16 text-purple-600 animate-pulse" />
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin absolute -bottom-2 -right-2 bg-white rounded-full" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">AI Farmers Analyzing...</h2>
          <p className="text-gray-500 text-sm mt-2">Farmer, Risk, and Scoring agents are reviewing your crops.</p>
        </div>
      </div>
    );
  }

  const profit = sessionData.endingValue - sessionData.startingCash;
  const isProfit = profit >= 0;

  const strongCount = reviewState?.scoredTrades?.filter(t => t.label === 'Strong').length || 0;
  const riskyCount = reviewState?.scoredTrades?.filter(t => t.label === 'Risky').length || 0;
  const blunderCount = reviewState?.scoredTrades?.filter(t => t.label === 'Blunder').length || 0;

  useEffect(() => {
    if (reviewState && strongCount > 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#F59E0B', '#FCD34D']
      });
    }
  }, [reviewState, strongCount]);

  let coachState: 'idle' | 'happy' | 'concerned' | 'celebrate' | 'thinking' = 'idle';
  let coachMessage = "Every season is a learning opportunity. Let's analyze your harvest.";

  if (blunderCount > 0) {
    coachState = 'concerned';
    coachMessage = "I noticed some withered crops. Let's review them together.";
  } else if (strongCount > 0 && blunderCount === 0) {
    coachState = 'celebrate';
    coachMessage = "Incredible farming! You grew some really bumper crops.";
  } else if (isProfit) {
    coachState = 'happy';
    coachMessage = "Good job making a harvest profit! Let's see how we can improve.";
  }

  return (
    <div className="p-5 space-y-8 pb-24 bg-gray-50 min-h-screen">
      <header className="pt-6 pb-2">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-extrabold text-brand-navy tracking-tight">Season Review</h1>
          <p className="text-gray-500 mt-2 font-medium text-lg">Analysis of your recent farming season</p>
        </motion.div>
      </header>

      <CoachAvatar state={coachState} message={coachMessage} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative overflow-hidden bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 text-center"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-emerald to-brand-navy"></div>
        <div className={`inline-flex p-5 rounded-full mb-6 shadow-inner ${isProfit ? 'bg-green-50 text-brand-emerald' : 'bg-red-50 text-red-500'}`}>
          {isProfit ? <Sprout className="w-10 h-10" /> : <TrendingDown className="w-10 h-10" />}
        </div>
        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Harvest Value</p>
        <h2 className="text-5xl font-extrabold text-brand-navy mb-2 tracking-tight">₹{sessionData.endingValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h2>
        <p className={`text-lg font-bold ${isProfit ? 'text-brand-emerald' : 'text-red-500'}`}>
          {isProfit ? '+' : ''}₹{profit.toLocaleString('en-IN', { maximumFractionDigits: 2 })} Yield
        </p>
      </motion.div>

      {reviewState ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-8"
        >
          <div className="bg-gradient-to-br from-brand-navy to-brand-navy-light rounded-[2rem] p-8 shadow-xl relative overflow-hidden border border-white/10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold rounded-full mix-blend-overlay filter blur-3xl opacity-10 -translate-y-1/2 translate-x-1/3"></div>
            <Bot className="absolute -right-6 -bottom-6 w-40 h-40 text-white opacity-5" />
            <div className="relative z-10">
              <h3 className="text-xl font-extrabold text-brand-gold mb-4 flex items-center tracking-tight">
                <Tractor className="w-6 h-6 mr-3" /> Farmer Summary
              </h3>
              <p className="text-white/90 leading-relaxed font-medium text-lg">
                {reviewState.mentorMessage}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100">
            <h3 className="text-2xl font-extrabold text-brand-navy mb-2 tracking-tight">Season's Performance</h3>
            <p className="text-gray-500 font-medium mb-8">
              Based on your farming decisions
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                <div className="text-3xl font-extrabold text-brand-emerald mb-1">{strongCount}</div>
                <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Bumper</div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                <div className="text-3xl font-extrabold text-orange-500 mb-1">{riskyCount}</div>
                <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Risky</div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                <div className="text-3xl font-extrabold text-red-500 mb-1">{blunderCount}</div>
                <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Withered</div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs mb-4">Crop Breakdown</h4>
              {reviewState.scoredTrades?.map((trade, idx) => {
                const isStrong = trade.label === 'Strong';
                const isRisky = trade.label === 'Risky';
                const isBlunder = trade.label === 'Blunder';
                
                const riskData = reviewState.fraudAnalysis?.tradeRisks?.find((r: any) => r.symbol === trade.symbol);
                
                return (
                  <motion.div 
                    key={idx} 
                    whileHover={{ scale: 1.01 }}
                    className={`p-6 rounded-3xl border ${isStrong ? 'bg-green-50/50 border-green-100' : isRisky ? 'bg-orange-50/50 border-orange-100' : 'bg-red-50/50 border-red-100'} transition-transform`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="font-extrabold text-xl text-brand-navy">
                        {trade.type} {trade.symbol}
                      </div>
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider shadow-sm ${isStrong ? 'bg-brand-emerald text-white' : isRisky ? 'bg-orange-500 text-white' : 'bg-red-500 text-white'}`}>
                        {trade.label}
                      </span>
                    </div>
                    
                    {riskData && (riskData.isPennyStock || riskData.isOverConcentrated) && (
                      <div className="flex gap-2 mb-4 flex-wrap">
                        {riskData.isPennyStock && <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider rounded-md border border-red-200">Penny Stock</span>}
                        {riskData.isOverConcentrated && <span className="px-2 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider rounded-md border border-orange-200">Over-Concentrated</span>}
                      </div>
                    )}

                    <p className="text-gray-700 mb-5 font-medium leading-relaxed">{trade.reason}</p>
                    
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                      <div>
                        <span className="font-extrabold text-brand-navy block mb-1 text-sm uppercase tracking-wider">Better Move</span>
                        <span className="text-gray-600 font-medium">{trade.betterMove}</span>
                      </div>
                      {riskData?.stopLossSuggestion && riskData.stopLossSuggestion.trim() !== "" && (
                        <div className="pt-3 border-t border-gray-50">
                          <span className="font-extrabold text-red-500 block mb-1 text-sm uppercase tracking-wider">Stop-Loss Suggestion</span>
                          <span className="text-gray-600 font-medium">{riskData.stopLossSuggestion}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100">
            <h3 className="text-xl font-extrabold text-brand-navy mb-4 flex items-center tracking-tight">
              <ShieldAlert className="w-6 h-6 mr-3 text-red-500" /> Fraud & Risk Analysis
            </h3>
            <p className="text-gray-600 font-medium leading-relaxed mb-8 bg-gray-50 p-5 rounded-2xl border border-gray-100">
              {reviewState.fraudAnalysis?.summary || "No risk analysis available."}
            </p>

            <h3 className="text-xl font-extrabold text-brand-navy mb-4 flex items-center pt-6 border-t border-gray-100 tracking-tight">
              <BookOpen className="w-6 h-6 mr-3 text-brand-emerald" /> Education Lesson
            </h3>
            <p className="text-gray-600 font-medium leading-relaxed bg-brand-emerald/5 p-5 rounded-2xl border border-brand-emerald/10">
              {reviewState.educationLesson}
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200 text-center">
          <p className="text-gray-500">No trades were made during this session to analyze.</p>
        </div>
      )}
      
      <div className="pt-4">
        <button 
          onClick={() => navigate('/app/simulations')}
          className="w-full py-3 bg-white border border-gray-200 text-gray-900 font-bold rounded-xl hover:bg-gray-50 flex justify-center items-center"
        >
          Start New Session
        </button>
      </div>
    </div>
  );
}

export function Profile() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="p-5 flex justify-center items-center h-screen pb-24">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  // Mock stats if not present in DB
  const farmLevel = userData?.skillScore ? Math.floor(userData.skillScore / 100) + 1 : 7;
  const skillScore = userData?.skillScore || 742;
  const streak = userData?.streak || 14;
  const progress = (skillScore % 100);

  return (
    <div className="p-5 space-y-8 pb-24 bg-gray-50 min-h-screen">
      <header className="pt-6 pb-2">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-extrabold text-brand-navy tracking-tight">Farm Stats</h1>
          <p className="text-gray-500 mt-2 font-medium text-lg">Manage your farm and progress</p>
        </motion.div>
      </header>

      {/* User Info Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 flex items-center space-x-6 relative overflow-hidden group hover:shadow-2xl hover:border-brand-emerald/30 transition-all duration-300"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-emerald rounded-full mix-blend-overlay filter blur-3xl opacity-10 -translate-y-1/2 translate-x-1/3 group-hover:opacity-20 transition-opacity"></div>
        <div className="w-20 h-20 bg-gradient-to-br from-brand-emerald to-brand-navy-light rounded-full flex items-center justify-center text-white font-extrabold text-3xl shadow-inner border-4 border-white">
          🧑‍🌾
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-extrabold text-brand-navy flex items-center tracking-tight">
            {userData?.displayName || 'Farmer'}
            {userData?.isGuest && (
              <span className="ml-3 text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-md font-bold uppercase tracking-wider border border-gray-200 shadow-sm">
                Guest
              </span>
            )}
          </h2>
          <p className="text-gray-500 mt-1 font-medium">
            {userData?.email || userData?.phoneNumber || 'No contact info'}
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-2 gap-5"
      >
        <div className="bg-gradient-to-br from-brand-navy to-brand-navy-light rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden border border-white/10 group hover:shadow-[0_0_30px_rgba(66,32,6,0.4)] transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold rounded-full mix-blend-overlay filter blur-2xl opacity-20 -translate-y-1/2 translate-x-1/3 group-hover:opacity-40 transition-opacity"></div>
          <div className="flex items-center space-x-3 mb-4 opacity-90">
            <Sprout className="w-6 h-6 text-brand-emerald" />
            <span className="text-sm font-bold uppercase tracking-wider text-brand-emerald">Farm Level</span>
          </div>
          <div className="flex items-end space-x-2">
            <div className="text-4xl font-extrabold tracking-tight">{farmLevel}</div>
            <div className="text-sm mb-1 opacity-80 font-medium">Lvl</div>
          </div>
          
          {/* Progress Ring / Bar */}
          <div className="mt-4 w-full bg-black/20 rounded-full h-2 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-gradient-to-r from-brand-emerald to-green-400 h-full rounded-full"
            />
          </div>
          <div className="text-[10px] mt-1 opacity-70 text-right">{progress}/100 to next level</div>
        </div>
        
        <div className="bg-gradient-to-br from-brand-emerald to-green-600 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden border border-white/10 group hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full mix-blend-overlay filter blur-2xl opacity-20 -translate-y-1/2 translate-x-1/3 group-hover:opacity-40 transition-opacity"></div>
          <div className="flex items-center space-x-3 mb-4 opacity-90">
            <Sun className="w-6 h-6 text-yellow-300" />
            <span className="text-sm font-bold uppercase tracking-wider text-yellow-300">Harvest Streak</span>
          </div>
          <div className="text-4xl font-extrabold tracking-tight">{streak}</div>
          <div className="text-xs mt-2 opacity-80 font-medium">Days growing!</div>
        </div>
      </motion.div>

      {/* Badges Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100"
      >
        <h3 className="text-xl font-extrabold text-brand-navy mb-5 tracking-tight flex items-center">
          <Award className="w-6 h-6 mr-2 text-brand-gold" /> Farm Badges
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center text-center space-y-2 group">
            <div className="w-16 h-16 bg-brand-emerald/10 rounded-full flex items-center justify-center border-2 border-brand-emerald/30 group-hover:scale-110 group-hover:bg-brand-emerald/20 transition-all duration-300 shadow-sm">
              <Sprout className="w-8 h-8 text-brand-emerald" />
            </div>
            <span className="text-xs font-bold text-brand-navy">First Seed</span>
          </div>
          <div className="flex flex-col items-center text-center space-y-2 group">
            <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center border-2 border-brand-gold/30 group-hover:scale-110 group-hover:bg-brand-gold/20 transition-all duration-300 shadow-sm">
              <Sun className="w-8 h-8 text-brand-gold" />
            </div>
            <span className="text-xs font-bold text-brand-navy">Golden Harvest</span>
          </div>
          <div className="flex flex-col items-center text-center space-y-2 group">
            <div className="w-16 h-16 bg-brand-navy-light/10 rounded-full flex items-center justify-center border-2 border-brand-navy-light/30 group-hover:scale-110 group-hover:bg-brand-navy-light/20 transition-all duration-300 shadow-sm">
              <Tractor className="w-8 h-8 text-brand-navy-light" />
            </div>
            <span className="text-xs font-bold text-brand-navy">Master Farmer</span>
          </div>
          <div className="flex flex-col items-center text-center space-y-2 group opacity-50 grayscale">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200 transition-all duration-300">
              <CloudRain className="w-8 h-8 text-gray-400" />
            </div>
            <span className="text-xs font-bold text-gray-500">Bumper Crop</span>
          </div>
          <div className="flex flex-col items-center text-center space-y-2 group opacity-50 grayscale">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200 transition-all duration-300">
              <Trees className="w-8 h-8 text-gray-400" />
            </div>
            <span className="text-xs font-bold text-gray-500">Fertile Land</span>
          </div>
        </div>
      </motion.div>

      {/* Settings */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 space-y-8"
      >
        <div>
          <h3 className="text-xl font-extrabold text-brand-navy mb-5 tracking-tight">{t('profile.language')}</h3>
          <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
            <button
              onClick={() => setLanguage('en')}
              className={`flex-1 py-4 text-sm font-extrabold rounded-xl transition-all duration-300 ${language === 'en' ? 'bg-white shadow-md text-brand-navy scale-[1.02]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`flex-1 py-4 text-sm font-extrabold rounded-xl transition-all duration-300 ${language === 'hi' ? 'bg-white shadow-md text-brand-navy scale-[1.02]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
