import React, { useState, useEffect } from 'react';
import { World, UserSession } from '../types';
import { getWorldStatus } from '../utils/time';
import { NotificationPopover } from './NotificationPopover';
import {
  Bell,
  Volume2,
  VolumeX,
  Plus,
  LogOut,
  Clock,
  Sparkles,
} from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface HeaderProps {
  worlds: World[];
  userSession: UserSession;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenAddWorld: () => void;
  onSelectWorld: (world: World) => void;
  onHarvestWorld: (world: World) => void;
  onNavigateToWorlds: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  worlds,
  userSession,
  soundEnabled,
  onToggleSound,
  onOpenAddWorld,
  onSelectWorld,
  onHarvestWorld,
  onNavigateToWorlds,
  onLogout,
}) => {
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      setCurrentTimeStr(`${hours}:${minutes}:${seconds} WIB`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const now = Date.now();
  const readyWorlds = worlds.filter((w) => {
    const s = getWorldStatus(w, now);
    return s === 'ready' || s === 'overdue';
  });

  return (
    <header className="sticky top-0 z-30 bg-[#090e1c]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-3">
        {/* Mobile Brand / Left Info */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-0.5 shadow-md shadow-emerald-500/20">
            <div className="w-full h-full bg-[#080d1a] rounded-[10px] flex items-center justify-center text-base">
              🌱
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-pixel text-[9px] text-amber-400">GROWTOPIA</span>
            </div>
            <span className="font-bold text-xs text-slate-100 font-game tracking-wider block">
              FARM MANAGER
            </span>
          </div>
        </div>

        {/* Desktop Left: Live Clock & GT Server indicator */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">{currentTimeStr || '16:00:00 WIB'}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Server Farming Aktif</span>
          </div>
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Add Button (Desktop & Mobile) */}
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              onOpenAddWorld();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tambah World</span>
            <span className="sm:hidden">Tambah</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              playClickSound(!soundEnabled);
            }}
            title={soundEnabled ? 'Matikan Suara SFX' : 'Nyalakan Suara SFX'}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Notification Bell with Dropdown Popover */}
          <div className="relative">
            <button
              onClick={() => {
                playClickSound(soundEnabled);
                setIsNotifOpen(!isNotifOpen);
              }}
              title="Notifikasi World Siap Panen"
              className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer relative ${
                readyWorlds.length > 0
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 shadow-md shadow-emerald-500/10'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              <Bell className="w-4 h-4" />
              {readyWorlds.length > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-4 text-[10px] font-black rounded-full bg-emerald-500 text-slate-950 text-center animate-bounce shadow-sm">
                  {readyWorlds.length}
                </span>
              )}
            </button>

            {/* Notification Popover Dropdown */}
            <NotificationPopover
              worlds={worlds}
              isOpen={isNotifOpen}
              onClose={() => setIsNotifOpen(false)}
              onSelectWorld={onSelectWorld}
              onHarvestWorld={onHarvestWorld}
              onNavigateToWorlds={onNavigateToWorlds}
            />
          </div>

          {/* User Profile Chip & Logout */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#121c33] border border-slate-800">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-xs font-bold text-slate-950 font-game">
                {userSession.growId.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <span className="text-xs font-bold text-slate-200 block leading-tight">
                  {userSession.growId}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium block leading-none">
                  Petani Aktif
                </span>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Keluar / Ganti Akun"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
