"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Award, Edit, Trash2, ChevronRight, CheckCircle2, Clock, Eye } from "lucide-react";
import BadgeModal from "@/components/customers/BadgeModal";
import api from "@/lib/axios";

export default function BadgesPage() {
  const [badges, setBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBadges = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/badges");
      if (res.data.data) {
        setBadges(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch badges", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  const handleSaveBadge = async (formData) => {
    try {
      if (selectedBadge) {
        await api.put(`/badges/${selectedBadge._id}`, formData);
      } else {
        await api.post("/badges", formData);
      }
      setIsModalOpen(false);
      fetchBadges();
    } catch (error) {
      console.error("Failed to save badge", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this badge?")) {
      try {
        await api.delete(`/badges/${id}`);
        fetchBadges();
      } catch (error) {
        console.error("Failed to delete badge", error);
      }
    }
  };

  const filteredBadges = badges.filter(b => 
    (b.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Badges</h1>
          <p className="text-sm text-sidebar-foreground">Manage customer achievement badges and reward loyalty.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedBadge(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-blue-600"
        >
          <Plus className="h-4 w-4" />
          Create Badge
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sidebar-foreground" />
          <input
            type="text"
            placeholder="Search badges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="flex-1 sm:w-40 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none">
            <option value="all">All Types</option>
            <option value="active">Active</option>
          </select>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBadges.map((badge) => (
          <div key={badge._id} className="group relative flex flex-col rounded-3xl border border-border bg-card overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20">
            {/* Top Section with Icon */}
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div 
                  className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-inner"
                  style={{ backgroundColor: `${badge.color}15`, color: badge.color }}
                >
                  <Award className="h-8 w-8" />
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${badge.status ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                  {badge.status ? 'Active' : 'Inactive'}
                </div>
              </div>

              <div className="mt-5">
                <h3 className="text-xl font-black text-foreground">{badge.name}</h3>
                <p className="text-xs font-bold text-sidebar-foreground/60 mt-1 line-clamp-1">{badge.description}</p>
              </div>

              {/* Reward Info */}
              <div className="mt-6 flex items-center gap-4 bg-sidebar-accent/30 rounded-2xl p-4 border border-border/50">
                <div className="text-center">
                   <p className="text-[10px] uppercase font-black text-sidebar-foreground/50 tracking-widest mb-1">Discount</p>
                   <p className="text-xl font-black text-primary">{badge.discount}%</p>
                </div>
                <div className="h-10 w-px bg-border mx-2"></div>
                <div className="flex-1">
                   <p className="text-[10px] uppercase font-black text-sidebar-foreground/50 tracking-widest mb-1">Conditions</p>
                   <p className="text-[11px] font-bold text-foreground">
                      {badge.conditions.minOrders > 0 && `Orders >= ${badge.conditions.minOrders}`}
                      {badge.conditions.minOrders > 0 && badge.conditions.minSpent > 0 && ' & '}
                      {badge.conditions.minSpent > 0 && `Spent >= ৳${badge.conditions.minSpent}`}
                      {badge.conditions.minOrders === 0 && badge.conditions.minSpent === 0 && 'No conditions'}
                   </p>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                 <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <div>
                       <p className="text-[9px] uppercase font-bold text-sidebar-foreground/60">Awarded</p>
                       <p className="text-xs font-black">{badge.customerCount || 0} Customers</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <div>
                       <p className="text-[9px] uppercase font-bold text-sidebar-foreground/60">Created</p>
                       <p className="text-xs font-black">{new Date(badge.createdAt).toLocaleDateString()}</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-auto flex border-t border-border bg-sidebar-accent/10">
               <button className="flex-1 flex items-center justify-center gap-2 py-3.5 text-[11px] font-bold text-sidebar-foreground hover:bg-sidebar-accent transition-colors border-r border-border">
                  <Eye className="h-3.5 w-3.5" /> View
               </button>
               <button 
                onClick={() => {
                   setSelectedBadge(badge);
                   setIsModalOpen(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 text-[11px] font-bold text-sidebar-foreground hover:bg-sidebar-accent transition-colors border-r border-border"
               >
                  <Edit className="h-3.5 w-3.5" /> Edit
               </button>
               <button 
                onClick={() => handleDelete(badge._id)}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 text-[11px] font-bold text-rose-500 hover:bg-rose-50 transition-colors"
               >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
               </button>
            </div>
          </div>
        ))}
      </div>

      <BadgeModal 
        key={selectedBadge?._id || 'new'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        badge={selectedBadge}
        onSave={handleSaveBadge}
      />

      {isLoading && (
        <div className="flex h-60 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}

      {!isLoading && filteredBadges.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-sidebar-foreground">
          <Award className="h-16 w-16 opacity-10 mb-4" />
          <p className="text-lg font-bold opacity-40">No badges found</p>
        </div>
      )}
    </div>
  );
}
