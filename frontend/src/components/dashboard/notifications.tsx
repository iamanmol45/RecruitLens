"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Bell, Trophy, Sparkles, ShieldAlert, CheckCircle2, Trash2, CheckSquare
} from "lucide-react";

interface NotificationItem {
  id: string;
  type: "recommendation" | "gem" | "risk" | "system";
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      type: "recommendation",
      title: "Top Recommendation",
      message: "CAND_0071974 score updated to 96.1 matching your JD parameters.",
      time: "12m ago",
      unread: true
    },
    {
      id: "2",
      type: "gem",
      title: "Hidden Gem Flagged",
      message: "CAND_0018499 matches High Growth trajectory patterns.",
      time: "35m ago",
      unread: true
    },
    {
      id: "3",
      type: "risk",
      title: "Risk Profiler Complete",
      message: "CAND_0002025 classified as Low Risk / High Potential.",
      time: "1h ago",
      unread: true
    },
    {
      id: "4",
      type: "system",
      title: "Pipeline Reranked",
      message: "100 candidates successfully parsed and sorted against new JD.",
      time: "3h ago",
      unread: false
    }
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => n.unread).length;

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "recommendation":
        return <Trophy className="w-3.5 h-3.5 text-brand-primary" />;
      case "gem":
        return <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />;
      case "risk":
        return <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-9 h-9 rounded-xl border flex items-center justify-center relative cursor-pointer transition-all duration-200 ${
          isOpen
            ? "border-brand-primary bg-brand-primary/10 text-brand-primary shadow-[0_0_12px_var(--brand-dim)]"
            : "border-[var(--border-main)] hover:border-[var(--border-hover)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]"
        }`}
        aria-label="Toggle notifications dropdown"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-primary text-white text-[9px] font-black flex items-center justify-center border-2 border-[var(--bg-app)] animate-orange-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[310px] bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl shadow-[var(--shadow-card)] z-[100] flex flex-col p-4 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-main)] mb-3 flex-shrink-0">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-main)]">
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[9px] font-bold text-brand-primary hover:text-brand-primary/80 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <CheckSquare className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[260px] overflow-y-auto pr-0.5 space-y-2 flex-1 min-h-0">
            {notifications.length === 0 ? (
              <div className="py-6 text-center text-[11px] font-semibold text-[var(--text-muted)]">
                All caught up! 🎉
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => {
                    setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item));
                  }}
                  className={`p-2.5 rounded-xl border transition-all duration-200 relative group cursor-pointer ${
                    n.unread
                      ? "bg-brand-primary/5 border-brand-primary/20 hover:border-brand-primary/45"
                      : "bg-[var(--bg-card-hover)]/40 border-[var(--border-main)] hover:border-[var(--border-hover)]"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {/* Icon Container */}
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      n.unread ? "bg-brand-primary/10 border border-brand-primary/25" : "bg-[var(--bg-card-hover)] border border-[var(--border-main)]"
                    }`}>
                      {getIcon(n.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-[11px] font-bold truncate ${n.unread ? "text-[var(--text-main)]" : "text-[var(--text-muted)]"}`}>
                          {n.title}
                        </span>
                        <span className="text-[9px] text-[var(--text-muted-light)] font-semibold">{n.time}</span>
                      </div>
                      <p className="text-[10px] text-[var(--text-muted)] leading-normal font-medium">
                        {n.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={(e) => deleteNotification(n.id, e)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--bg-card-hover)] rounded text-[var(--text-muted)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-150 cursor-pointer"
                    aria-label={`Delete notification ${n.title}`}
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>

                  {/* Unread Orange Dot */}
                  {n.unread && (
                    <span className="absolute top-2.5 right-2 w-1.5 h-1.5 rounded-full bg-brand-primary" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
