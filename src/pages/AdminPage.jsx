import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Users, UserPlus, ArrowLeft, Trash2, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function AdminPage() {
  const { member, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // New member form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    email: '',
    password: '',
    name: '',
    isAdmin: false
  });

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  // Load members
  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/admin/members`, {
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        setMembers(data.members);
      } else {
        setError('Failed to load members');
      }
    } catch (err) {
      setError('Error loading members');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/api/admin/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(newMember)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Member added successfully!');
        setNewMember({ email: '', password: '', name: '', isAdmin: false });
        setShowAddForm(false);
        loadMembers();
      } else {
        setError(data.message || 'Failed to add member');
      }
    } catch (err) {
      setError('Error adding member');
    }
  };

  const handleToggleStatus = async (memberId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      const response = await fetch(`${API_URL}/api/admin/members/${memberId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Member ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
        loadMembers();
      } else {
        setError(data.message || 'Failed to update status');
      }
    } catch (err) {
      setError('Error updating status');
    }
  };

  const handleResetPassword = async (memberId) => {
    const newPassword = prompt('Enter new password (min 8 characters):');
    
    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/members/${memberId}/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ password: newPassword })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Password reset successfully');
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Error resetting password');
    }
  };

  const handleDeleteMember = async (memberId, memberName) => {
    if (!confirm(`Are you sure you want to delete ${memberName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/members/${memberId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Member deleted successfully');
        loadMembers();
      } else {
        setError(data.message || 'Failed to delete member');
      }
    } catch (err) {
      setError('Error deleting member');
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Users className="w-8 h-8" />
                Admin Panel
              </h1>
              <p className="text-primary-foreground/80 mt-1">Manage CPA Club Members</p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Alerts */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
            <p className="text-green-600">{success}</p>
          </div>
        )}

        {/* Add Member Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {showAddForm ? 'Cancel' : 'Add New Member'}
          </Button>
        </div>

        {/* Add Member Form */}
        {showAddForm && (
          <Card className="mb-8 border-2">
            <CardHeader>
              <CardTitle>Add New Member</CardTitle>
              <CardDescription>Create a new CPA Club member account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddMember} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newMember.password}
                      onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                      required
                      minLength={8}
                    />
                    <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
                  </div>

                  <div className="space-y-2 flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newMember.isAdmin}
                        onChange={(e) => setNewMember({ ...newMember, isAdmin: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Admin privileges</span>
                    </label>
                  </div>
                </div>

                <Button type="submit" className="bg-accent hover:bg-accent/90">
                  Create Member
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Members List */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Members ({members.length})</CardTitle>
            <CardDescription>Manage existing CPA Club members</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8 text-muted-foreground">Loading members...</p>
            ) : members.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No members found</p>
            ) : (
              <div className="space-y-4">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{m.name}</h3>
                        {m.isAdmin && (
                          <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                            Admin
                          </span>
                        )}
                        {m.status === 'active' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{m.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Joined: {new Date(m.createdAt).toLocaleDateString()}
                        {m.lastLogin && ` • Last login: ${new Date(m.lastLogin).toLocaleDateString()}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(m.id, m.status)}
                        disabled={m.id === member.id}
                      >
                        {m.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResetPassword(m.id)}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteMember(m.id, m.name)}
                        disabled={m.id === member.id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

