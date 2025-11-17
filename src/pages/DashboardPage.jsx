import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, DollarSign, TrendingUp, Target, Plus, Loader2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get email from URL parameter
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get email from URL query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');

        if (!email) {
          setError('No email parameter provided');
          setLoading(false);
          return;
        }

        // Fetch data from API
        const response = await fetch(`/api/dashboard-data?email=${encodeURIComponent(email)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to load dashboard data');
        }

        // Transform API data to match component structure
        const transformedData = {
          name: result.data.fullName,
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          email: result.data.email,
          referralLink: 'https://link.myfundingmachine.com/l/w8jTTOnQ5', // Default link
          clients: result.data.totalClients,
          approved: result.data.approved,
          declined: result.data.declined,
          pending: result.data.pending,
          applications: result.data.totalClients,
          commissionRate: `${(result.data.commissionRate * 100).toFixed(0)}%`,
          fundedAmount: result.data.totalFunded,
          earned: result.data.totalEarned,
          paid: result.data.paid,
          targetRemaining: result.data.clubTarget,
          memberLevel: result.data.memberLevel,
          approvalRate: result.data.approvalRate,
        };

        setMemberData(transformedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-destructive mb-2">Error Loading Dashboard</h2>
            <p className="text-muted-foreground">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!memberData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">No dashboard data available</p>
        </div>
      </div>
    );
  }

  // Monthly earnings data (mock data for now - can be enhanced later)
  const monthlyEarningsData = [
    { month: 'Jul', earnings: Math.round(memberData.earned * 0.15 / 1000) },
    { month: 'Aug', earnings: Math.round(memberData.earned * 0.18 / 1000) },
    { month: 'Sep', earnings: Math.round(memberData.earned * 0.20 / 1000) },
    { month: 'Oct', earnings: Math.round(memberData.earned * 0.16 / 1000) },
    { month: 'Nov', earnings: Math.round(memberData.earned * 0.18 / 1000) },
    { month: 'Dec', earnings: Math.round(memberData.earned * 0.13 / 1000) },
  ];

  // Deal status distribution data
  const dealStatusData = [
    { name: 'Approved', value: memberData.approved, color: '#B8FF3C' },
    { name: 'Declined', value: memberData.declined, color: '#1B2B4D' },
  ];

  // Earnings breakdown data
  const earningsBreakdownData = [
    { category: 'Total Earned', amount: memberData.earned / 1000 },
    { category: 'Paid', amount: memberData.paid / 1000 },
    { category: 'Pending', amount: (memberData.earned - memberData.paid) / 1000 },
  ];

  const handleReferralClick = () => {
    const referralLink = memberData?.referralLink || 'https://link.myfundingmachine.com/l/w8jTTOnQ5';
    window.open(referralLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold">100K CPA Club Dashboard</h1>
              <p className="text-primary-foreground/80 mt-1">Performance Dashboard</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-primary-foreground/80">Welcome back,</p>
              <p className="text-2xl font-semibold">{memberData.firstName} {memberData.lastName}</p>
              <div className="bg-secondary text-primary px-4 py-2 rounded-full inline-block mt-2 font-bold">
                {memberData.memberLevel}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Submit New Referral Button */}
        <div className="mb-8">
          <button 
            onClick={handleReferralClick}
            className="w-full bg-secondary hover:bg-secondary/90 text-primary px-8 py-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            <div className="flex items-center justify-center gap-4">
              <Plus size={32} className="bg-primary text-secondary rounded-full p-1" />
              <div className="text-left">
                <div className="text-2xl font-bold">Submit New Referral</div>
                <div className="text-sm font-normal text-primary/80 mt-1">
                  Earn $1,000-$2,000 per funded deal
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Clients */}
          <div className="bg-card p-6 rounded-xl shadow-md border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Clients</p>
                <p className="text-3xl font-bold text-foreground mt-2">{memberData.clients}</p>
              </div>
              <Users className="text-secondary" size={40} />
            </div>
          </div>

          {/* Approved Deals */}
          <div className="bg-card p-6 rounded-xl shadow-md border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Approved Deals</p>
                <p className="text-3xl font-bold text-foreground mt-2">{memberData.approved}</p>
                <p className="text-xs text-secondary mt-1">{memberData.approvalRate}% approval rate</p>
              </div>
              <CheckCircle className="text-secondary" size={40} />
            </div>
          </div>

          {/* Total Earned */}
          <div className="bg-card p-6 rounded-xl shadow-md border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Earned</p>
                <p className="text-3xl font-bold text-secondary mt-2">${(memberData.earned / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted-foreground mt-1">Commission: {memberData.commissionRate}</p>
              </div>
              <DollarSign className="text-secondary" size={40} />
            </div>
          </div>

          {/* 100K Club Progress */}
          <div className="bg-card p-6 rounded-xl shadow-md border border-border">
            <div className="flex items-center justify-between">
              <div className="w-full">
                <p className="text-sm text-muted-foreground font-medium">100K Club Progress</p>
                <p className="text-3xl font-bold text-foreground mt-2">${(memberData.targetRemaining / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted-foreground mt-1">to reach $100K</p>
                <div className="mt-3 bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-secondary via-green-400 to-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((memberData.earned / 100000) * 100).toFixed(0)}%` }}
                  ></div>
                </div>
              </div>
              <Target className="text-secondary ml-4" size={40} />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Earnings Trend */}
          <div className="bg-card p-6 rounded-xl shadow-md border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Earnings Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyEarningsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  formatter={(value) => `$${value}K`}
                />
                <Line type="monotone" dataKey="earnings" stroke="#B8FF3C" strokeWidth={3} dot={{ fill: '#B8FF3C', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Deal Status Distribution */}
          <div className="bg-card p-6 rounded-xl shadow-md border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Deal Status Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dealStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dealStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Earnings Breakdown */}
        <div className="bg-card p-6 rounded-xl shadow-md border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Earnings Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={earningsBreakdownData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                formatter={(value) => `$${value}K`}
              />
              <Bar dataKey="amount" fill="#B8FF3C" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-card p-6 rounded-xl shadow-md border border-border">
            <p className="text-sm text-muted-foreground font-medium">Total Funded Amount</p>
            <p className="text-2xl font-bold text-foreground mt-2">${(memberData.fundedAmount / 1000).toFixed(0)}K</p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-md border border-border">
            <p className="text-sm text-muted-foreground font-medium">Commissions Paid</p>
            <p className="text-2xl font-bold text-green-600 mt-2">${(memberData.paid / 1000).toFixed(0)}K</p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-md border border-border">
            <p className="text-sm text-muted-foreground font-medium">Pending Payment</p>
            <p className="text-2xl font-bold text-secondary mt-2">${((memberData.earned - memberData.paid) / 1000).toFixed(0)}K</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

