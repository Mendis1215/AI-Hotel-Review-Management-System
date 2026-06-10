import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  PieChart, Pie, Cell, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
  BarChart, Bar
} from 'recharts';
import { BrainCircuit, Star, AlertTriangle, TrendingUp, ThumbsUp, ThumbsDown } from 'lucide-react';

// ── Parses Gemini's structured text into sections ───────────────────────
const parseRecommendation = (text) => {
  const result = { rootCause: '', actions: [], priority: '', priorityReason: '' };
  if (!text) return result;

  const rootCauseMatch = text.match(/ROOT_CAUSE:\s*(.+?)(?=\n\n|ACTIONS:|$)/s);
  if (rootCauseMatch) result.rootCause = rootCauseMatch[1].trim();

  const actionsMatch = text.match(/ACTIONS:([\s\S]+?)(?=\n\nPRIORITY:|PRIORITY:|$)/);
  if (actionsMatch) {
    result.actions = actionsMatch[1]
      .split('\n')
      .map(line => line.replace(/^[-*•\d.]+\s*/, '').trim())
      .filter(line => line.length > 0);
  }

  const priorityMatch = text.match(/PRIORITY:\s*(High|Medium|Low)\s*[-–]\s*(.+)/i);
  if (priorityMatch) {
    result.priority = priorityMatch[1];
    result.priorityReason = priorityMatch[2].trim();
  }

  return result;
};

const priorityStyles = {
  High:   { badge: 'bg-red-100 text-red-700 border-red-200',    icon: '🔴' },
  Medium: { badge: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: '🟡' },
  Low:    { badge: 'bg-green-100 text-green-700 border-green-200',  icon: '🟢' },
};

const AIRecommendationDisplay = ({ text }) => {
  const rec = parseRecommendation(text);
  const style = priorityStyles[rec.priority];

  if (!rec.rootCause && rec.actions.length === 0) {
    return <p className="text-sm text-text-muted italic">{text}</p>;
  }

  return (
    <div className="space-y-3">
      {rec.rootCause && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">🔍 Root Cause</p>
          <p className="text-sm text-text-main">{rec.rootCause}</p>
        </div>
      )}
      {rec.actions.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">✅ Actions</p>
          <ul className="space-y-1">
            {rec.actions.map((action, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-main">
                <span className="text-accent font-bold flex-shrink-0 mt-0.5">{i + 1}.</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {rec.priority && style && (
        <div>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${style.badge}`}>
            {style.icon} {rec.priority} Priority
          </span>
          {rec.priorityReason && (
            <p className="text-xs text-text-muted mt-1">{rec.priorityReason}</p>
          )}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────
const AIAnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/analytics/ai');
        setData(response.data);
      } catch (err) {
        setError('Failed to load AI analytics data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Colors mapping for charts
  const SENTIMENT_COLORS = { 'Positive': '#10B981', 'Negative': '#EF4444', 'Neutral': '#9CA3AF' };
  const CATEGORY_COLORS = ['#D4AF37', '#B8860B', '#F3E5AB', '#111827'];

  if (loading) return <div className="flex justify-center items-center h-screen bg-secondary"><p className="text-text-muted">Analyzing Data...</p></div>;
  if (error) return <div className="flex justify-center items-center h-screen bg-secondary"><p className="text-red-500">{error}</p></div>;
  if (!data) return null;

  const { kpis, sentimentSplit, categorySplit, clusterRanking, monthlyTrend, topIssue, recentRecommendations } = data;

  return (
    <div className="bg-secondary min-h-screen flex flex-col">
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 flex-grow">
        
        {/* Sidebar */}
        <aside className="bg-white border border-gray-100 rounded-lg shadow-luxury p-5 h-fit">
          <h2 className="text-xl font-serif text-text-main mb-5">Admin Panel</h2>
          <nav className="space-y-2">
            <Link to="/admin" className="block px-3 py-2 rounded-md text-text-muted hover:bg-secondary">Dashboard</Link>
            <Link to="/admin/analytics" className="block px-3 py-2 rounded-md bg-accent-light/60 text-accent-dark font-medium flex items-center gap-2"><BrainCircuit size={18} /> AI Analytics</Link>
            <Link to="/admin/reviews" className="block px-3 py-2 rounded-md text-text-muted hover:bg-secondary">Review Management</Link>
            <Link to="/admin/bookings" className="block px-3 py-2 rounded-md text-text-muted hover:bg-secondary">Booking Management</Link>
            <Link to="/admin/customers" className="block px-3 py-2 rounded-md text-text-muted hover:bg-secondary">Customer Management</Link>
          </nav>
        </aside>

        <main>
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-text-main flex items-center gap-3">
                <BrainCircuit className="text-accent h-8 w-8" /> 
                AI Intelligence Dashboard
              </h1>
              <p className="mt-2 text-text-muted">Real-time NLP sentiment analysis and complaint clustering overview.</p>
            </div>
            
            {/* Top Issue Alert Card */}
            {topIssue && (
              <div className="mt-4 md:mt-0 bg-red-50 border border-red-100 rounded-lg p-4 flex items-start gap-3 max-w-sm shadow-sm">
                <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="text-sm font-semibold text-red-800">Top Issue Alert</h3>
                  <p className="text-xs text-red-600 mt-1">
                    <span className="font-bold">{topIssue._id}</span> is the most complained about issue ({topIssue.count} mentions).
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <div className="luxury-card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-text-muted">Total Reviews Processed</p>
                  <p className="text-3xl font-semibold text-text-main mt-1">{kpis.totalReviews}</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-md text-blue-600"><Star size={20} /></div>
              </div>
            </div>
            <div className="luxury-card border-b-4 border-green-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-text-muted">Positive Sentiment</p>
                  <p className="text-3xl font-semibold text-text-main mt-1">{kpis.positiveReviews}</p>
                </div>
                <div className="p-2 bg-green-50 rounded-md text-green-600"><ThumbsUp size={20} /></div>
              </div>
            </div>
            <div className="luxury-card border-b-4 border-red-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-text-muted">Negative Sentiment</p>
                  <p className="text-3xl font-semibold text-text-main mt-1">{kpis.negativeReviews}</p>
                </div>
                <div className="p-2 bg-red-50 rounded-md text-red-600"><ThumbsDown size={20} /></div>
              </div>
            </div>
            <div className="luxury-card bg-accent text-white border-none shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-white/80">Overall Satisfaction</p>
                  <p className="text-3xl font-semibold mt-1">{kpis.satisfactionRate}%</p>
                </div>
                <div className="p-2 bg-white/20 rounded-md text-white"><TrendingUp size={20} /></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {/* Sentiment Pie Chart */}
            <div className="luxury-card xl:col-span-1 h-96 flex flex-col">
              <h3 className="text-lg font-serif text-text-main mb-4">Sentiment Distribution</h3>
              <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentSplit}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sentimentSplit.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[entry.name] || '#ccc'} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Trend Chart */}
            <div className="luxury-card lg:col-span-2 xl:col-span-2 h-96 flex flex-col">
              <h3 className="text-lg font-serif text-text-main mb-4">Monthly Sentiment Trend</h3>
              <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                    <RechartsTooltip cursor={{fill: '#F3F4F6'}} />
                    <Legend />
                    <Line type="monotone" dataKey="praises" stroke="#10B981" strokeWidth={3} dot={{r: 4}} name="Positive" />
                    <Line type="monotone" dataKey="complaints" stroke="#EF4444" strokeWidth={3} dot={{r: 4}} name="Negative" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Category Donut Chart */}
            <div className="luxury-card xl:col-span-1 h-96 flex flex-col">
              <h3 className="text-lg font-serif text-text-main mb-4">Complaint Categories</h3>
              <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categorySplit}
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {categorySplit.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cluster Ranking */}
            <div className="luxury-card xl:col-span-2 h-96 flex flex-col">
              <h3 className="text-lg font-serif text-text-main mb-4">AI Complaint Clustering (Top Issues)</h3>
              <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clusterRanking} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} tick={{fill: '#4B5563', fontSize: 12}} />
                    <RechartsTooltip cursor={{fill: '#F3F4F6'}} />
                    <Bar dataKey="count" fill="#D4AF37" radius={[0, 4, 4, 0]} barSize={24} name="Total Occurrences" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* AI Recommendations Table */}
          <div className="luxury-card overflow-hidden">
            <h3 className="text-lg font-serif text-text-main mb-6">Recent AI Actionable Recommendations</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Cluster Context</th>
                    <th className="px-6 py-3">AI Proposed Solution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {recentRecommendations.length > 0 ? recentRecommendations.map((rec) => (
                    <tr key={rec._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          {rec.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted font-medium">
                        {rec.clusterMeaning}
                      </td>
                      <td className="px-6 py-4">
                        <AIRecommendationDisplay text={rec.aiRecommendation} />
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-sm text-text-muted italic">
                        No recent AI recommendations available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AIAnalyticsDashboard;
