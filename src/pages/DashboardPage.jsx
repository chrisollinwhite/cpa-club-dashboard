import React, { useState } from 'react';
import { Users, CheckCircle, DollarSign, TrendingUp, Target, Plus } from 'lucide-react';

const DashboardPage = () => {
  const mockMemberData = {
    name: 'Chris White',
    email: 'preeminentroofer@gmail.com',
    referralLink: 'https://link.myfundingmachine.com/l/w8jTTOnQ5',
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

  const [memberData] = useState(mockMemberData );

  const handleReferralClick = () => {
    const referralLink = memberData?.referralLink || 'https://link.myfundingmachine.com/l/w8jTTOnQ5';
    window.open(referralLink, '_blank' );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">The $100K CPA Club</h1>
              <p className="text-blue-200 mt-1">Performance Dashboard</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-blue-200">Welcome back,</p>
                <p className="font-semibold">{memberData.name}</p>
              </div>
              
              <div className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
                🏆 {memberData.memberLevel}
              </div>
              
              <button
                onClick={handleReferralClick}
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-5 py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
                title="Click to submit a new referral"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">New Referral</span>
                <span className="sm:hidden">Refer</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 text-sm font-medium">Total Clients</h3>
              <Users className="text-gray-400" size={24} />
            </div>
            <div className="text-3xl font-bold text-gray-900">{memberData.clients}</div>
            <p className="text-sm text-gray-500 mt-2">{memberData.applications} applications submitted</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 text-sm font-medium">Approved Deals</h3>
              <CheckCircle className="text-yellow-400" size={24} />
            </div>
            <div className="text-3xl font-bold text-yellow-500">{memberData.approved}</div>
            <p className="text-sm text-gray-500 mt-2">
              {((memberData.approved / memberData.clients) * 100).toFixed(1)}% approval rate
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 text-sm font-medium">Total Funded</h3>
              <DollarSign className="text-gray-400" size={24} />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              ${(memberData.fundedAmount / 1000).toFixed(0)}K
            </div>
            <p className="text-sm text-gray-500 mt-2">Across all approved deals</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 text-sm font-medium">Total Earned</h3>
              <TrendingUp className="text-yellow-400" size={24} />
            </div>
            <div className="text-3xl font-bold text-yellow-500">
              ${(memberData.earned / 1000).toFixed(0)}K
            </div>
            <p className="text-sm text-gray-500 mt-2">
              ${(memberData.paid / 1000).toFixed(0)}K paid, ${((memberData.earned - memberData.paid) / 1000).toFixed(0)}K pending
            </p>
          </div>
        </div>

        <div className="mb-8">
          <button
            onClick={handleReferralClick}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-900 font-bold py-6 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            <div className="flex items-center justify-center gap-4">
              <Plus size={32} className="bg-blue-900 text-yellow-400 rounded-full p-1" />
              <div className="text-left">
                <div className="text-2xl font-bold">Submit New Referral</div>
                <div className="text-sm font-normal text-blue-800 mt-1">
                  Earn $2,500-$15,000 per approved deal
                </div>
              </div>
            </div>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Target className="text-yellow-400" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Progress to $100K Club Target</h2>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-500">
                ${(memberData.earned / 1000).toFixed(0)}K
              </div>
              <div className="text-sm text-gray-500">
                ${(memberData.targetRemaining / 1000).toFixed(0)}K remaining
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            You are {((memberData.earned / 100000) * 100).toFixed(1)}% of the way to your annual goal
          </p>
          
          <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 via-green-400 to-blue-900 flex items-center justify-center text-sm font-bold text-white"
              style={{ width: ((memberData.earned / 100000) * 100) + '%' }}
            >
              {((memberData.earned / 100000) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Monthly Earnings Trend</h3>
            <p className="text-sm text-gray-600 mb-4">Commission earnings over the last 6 months</p>
            <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded">
              [Chart Component Here]
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Deal Status Distribution</h3>
            <p className="text-sm text-gray-600 mb-4">Breakdown of approved vs declined applications</p>
            <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded">
              [Chart Component Here]
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Earnings Breakdown</h3>
          <p className="text-sm text-gray-600 mb-4">Total earned, paid, and pending commissions</p>
          <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded">
            [Chart Component Here]
          </div>
        </div>

      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            © 2025 Funding Insiders Show. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
