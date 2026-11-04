import React, { useState } from 'react';
import { UserSession } from '../types';
import {
  Lock,
  User,
  Sparkles,
  Zap,
  ShieldCheck,
  Trees,
  Gem,
  ArrowRight,
  Clock,
  CheckCircle,
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (session: UserSession) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('NuzulFarmer');
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin({
        isLoggedIn: true,
        username: username.trim() || 'NuzulFarmer',
        growId: username.trim() || 'NuzulFarmer',
        avatarSeed: username.toLowerCase(),
      });
      setLoading(false);
    }, 400);
  };

  const handleQuickDemoLogin = (growId: string = 'NuzulFarmer') => {
    setLoading(true);
    setTimeout(() => {
      onLogin({
        isLoggedIn: true,
        username: growId,
        growId: growId,
        avatarSeed: growId.toLowerCase(),
      });
      setLoading(false);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto w-full z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#080d1a] rounded-[14px] flex items-center justify-center text-xl">
              🌱
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-pixel text-[10px] text-amber-400">GROWTOPIA</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded font-bold">
                FARM
              </span>
            </div>
            <span className="font-bold text-xs text-slate-100 font-game tracking-wider uppercase">
              Manager
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Status Sistem:
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Online & Siap Pakai
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Game Brand & Highlights */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101b33] border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wider uppercase">
              <Gem className="w-3.5 h-3.5 text-amber-400" />
              <span>Personal Farm Tracker & Scheduler</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-50 font-game tracking-wider leading-tight">
              PANTAU WORLD FARMING <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                TIDAK PERNAH TERLAMBAT
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Catat rotasi Laser Grid, Pepper Tree, dan Chandelier Anda. Dapatkan hitung mundur detik, notifikasi siap panen, dan simpan dokumen strategi farming dalam satu tempat.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 gap-3 pt-2 max-w-md mx-auto lg:mx-0 text-left">
              <div className="p-3 rounded-2xl bg-[#0f172a]/80 border border-slate-800 flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Countdown Presisi</span>
                  <span className="text-[10px] text-slate-500">Preset jam panen GT</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#0f172a]/80 border border-slate-800 flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                  <Trees className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Multi World & Akun</span>
                  <span className="text-[10px] text-slate-500">Kelompokkan GrowID</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Game Login Card */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-[#0e1628] border-2 border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/80 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 mx-auto mb-3 shadow-lg shadow-emerald-500/20">
                  <div className="w-full h-full bg-[#090f1f] rounded-[14px] flex items-center justify-center text-emerald-400">
                    <Lock className="w-6 h-6" />
                  </div>
                </div>
                <h2 className="text-xl font-black text-slate-100 font-game tracking-wider uppercase">
                  MASUK PETANI
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Akses dashboard farming Growtopia Anda
                </p>
              </div>

              {/* Quick Demo Login Button - Highly convenient! */}
              <div className="mb-5">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('NuzulFarmer')}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 hover:from-amber-400 hover:to-yellow-200 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>⚡ Masuk Cepat Demo (NuzulFarmer)</span>
                </button>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-center">
                    <span className="px-3 bg-[#0e1628] text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      atau masuk kustom
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Login */}
              <form onSubmit={handleCustomLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    GrowID / Nama Pengguna
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Contoh: NuzulFarmer"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#142038] border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-100 text-sm font-semibold transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    PIN / Sandi Aplikasi Pribadi
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sandi keamanan web..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#142038] border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-100 text-sm font-semibold transition-all"
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 w-3.5 h-3.5"
                    />
                    <span>Ingat sesi saya</span>
                  </label>
                  <span className="text-[11px] text-slate-500">Aman 100% lokal</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>{loading ? 'Memproses Masuk...' : 'Masuk ke Farm Manager'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Safety guarantee */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pencatatan pribadi tanpa risiko akun</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-slate-800/60 max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 z-10">
        <div>
          Growtopia Farm Manager © 2026 • Dibuat khusus untuk komunitas farmer Growtopia
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Tema Gelap Navy & Emas</span>
          <span>•</span>
          <span>Hitung Mundur Realtime</span>
        </div>
      </footer>
    </div>
  );
};
