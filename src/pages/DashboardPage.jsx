import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { TrendingUp, Users, DollarSign, CheckCircle, Target, Award, LogOut } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data - will be replaced with Google Sheets data
const mockMemberData = {
  clients: 35,
  approved: 23,
  declined: 12,
  applications: 23,
  commissionRate: "10%",
  fundedAmount: 890000,
  earned: 89000,
  paid: 73000,
  targetRemaining: 27000,
  memberLevel: "Champion"
};

export default function DashboardPage() {
  const { member, logout } = useAuth();
  const navigate = useNavigate();
  const [memberData] = useState(mockMemberData);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Calculate derived metrics
  const approvalRate = ((memberData.approved / memberData.clients) * 100).toFixed(1);
  const unpaidCommissions = memberData.earned - memberData.paid;
  const progressToTarget = ((memberData.earned / 100000) * 100).toFixed(1);

  // Chart data
  const performanceData = [
    { name: 'Total Clients', value: memberData.clients },
    { name: 'Approved', value: memberData.approved },
    { name: 'Declined', value: memberData.declined },
  ];

  const earningsData = [
    { name: 'Earned', amount: memberData.earned },
    { name: 'Paid', amount: memberData.paid },
    { name: 'Pending', amount: unpaidCommissions },
  ];

  const monthlyData = [
    { month: 'Jan', earnings: 12000 },
    { month: 'Feb', earnings: 15000 },
    { month: 'Mar', earnings: 18000 },
    { month: 'Apr', earnings: 14000 },
    { month: 'May', earnings: 16000 },
    { month: 'Jun', earnings: 14000 },
  ];

  const statusData = [
    { name: 'Approved', value: memberData.approved, color: '#B8FF3C' },
    { name: 'Declined', value: memberData.declined, color: '#1B2B4D' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">The $100K CPA Club</h1>
              <p className="text-primary-foreground/80 mt-1">Performance Dashboard</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-primary-foreground/80">Welcome back,</p>
              <p className="text-xl font-semibold">{member?.name || 'Member'}</p>
              <div className="mt-2 flex items-center gap-2 justify-end">
                <span className="inline-flex items-center gap-1 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                  <Award className="w-4 h-4" />
                  {memberData.memberLevel}
                </span>
                {member?.isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/admin')}
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                  >
                    Admin
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Clients */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{memberData.clients}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {memberData.applications} applications submitted
              </p>
            </CardContent>
          </Card>

          {/* Approved Deals */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Deals</CardTitle>
              <CheckCircle className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{memberData.approved}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {approvalRate}% approval rate
              </p>
            </CardContent>
          </Card>

          {/* Total Funded */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Funded</CardTitle>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                ${(memberData.fundedAmount / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all approved deals
              </p>
            </CardContent>
          </Card>

          {/* Total Earned */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              <TrendingUp className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                ${(memberData.earned / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ${(memberData.paid / 1000).toFixed(0)}K paid, ${(unpaidCommissions / 1000).toFixed(0)}K pending
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress to $100K Target */}
        <Card className="mb-8 border-2 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Target className="w-6 h-6 text-accent" />
                  Progress to $100K Club Target
                </CardTitle>
                <CardDescription className="mt-1">
                  You're {progressToTarget}% of the way to your annual goal
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-accent">${(memberData.earned / 1000).toFixed(0)}K</div>
                <div className="text-sm text-muted-foreground">${(memberData.targetRemaining / 1000).toFixed(0)}K remaining</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-muted rounded-full h-6 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-accent to-primary h-full flex items-center justify-center text-sm font-semibold text-primary transition-all duration-500"
                style={{ width: `${progressToTarget}%` }}
              >
                {progressToTarget}%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Earnings Trend */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Monthly Earnings Trend</CardTitle>
              <CardDescription>Commission earnings over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    formatter={(value) => `$${(value / 1000).toFixed(1)}K`}
                    contentStyle={{ backgroundColor: '#fff', border: '2px solid #1B2B4D' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="#B8FF3C" 
                    strokeWidth={3}
                    dot={{ fill: '#1B2B4D', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Approval vs Declined */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Deal Status Distribution</CardTitle>
              <CardDescription>Breakdown of approved vs declined applications</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Earnings Breakdown */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Earnings Breakdown</CardTitle>
              <CardDescription>Total earned, paid, and pending commissions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    formatter={(value) => `$${(value / 1000).toFixed(1)}K`}
                    contentStyle={{ backgroundColor: '#fff', border: '2px solid #1B2B4D' }}
                  />
                  <Bar dataKey="amount" fill="#1B2B4D" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Client referral and conversion metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#6B7280" />
                  <YAxis dataKey="name" type="category" stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #1B2B4D' }} />
                  <Bar dataKey="value" fill="#B8FF3C" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Summary */}
        <Card className="border-2 bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl">Your Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">{approvalRate}%</div>
                <div className="text-sm text-primary-foreground/80">Approval Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">${(memberData.earned / memberData.approved / 1000).toFixed(1)}K</div>
                <div className="text-sm text-primary-foreground/80">Avg Commission per Deal</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">{memberData.commissionRate}</div>
                <div className="text-sm text-primary-foreground/80">Commission Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-muted mt-12 py-6">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2025 The $100K CPA Club. All rights reserved.</p>
          <p className="mt-1">Questions? Email us at support@fundinginsidersshow.com</p>
        </div>
      </footer>
    </div>
  );
}

