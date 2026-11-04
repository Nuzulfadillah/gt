import React from 'react';
import { World, GrowAccount } from '../types';
import { CROP_PRESETS } from '../data/presets';
import { getWorldStatus, getCountdownInfo, formatDateTime } from '../utils/time';
import { EmptyState } from '../components/EmptyState';
import {
  Globe2,
  Sparkles,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  TrendingUp,
  ArrowRight,
  PlusCircle,
  Gem,
  ExternalLink,
  Calculator,
} from 'lucide-react';

interface DashboardPageProps {
  worlds: World[];
  accounts: GrowAccount[];
  currentTimeMs: number;
  onOpenAddWorld: () => void;
  onSelectWorld: (world: World) => void;
  onHarvestWorld: (world: World) => void;
  onNavigateToWorlds: (filterStatus?: string) => void;
  onNavigateToAccounts: () => void;
  onNavigateToCalculator?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  worlds,
  accounts,
  currentTimeMs,
  onOpenAddWorld,
  onSelectWorld,
  onHarvestWorld,
  onNavigateToWorlds,
  onNavigateToAccounts,
  onNavigateToCalculator,
}) => {
  // Categorize worlds
  const readyWorlds = worlds.filter((w) => {
    const s = getWorldStatus(w, currentTimeMs);
    return s === 'ready' || s === 'overdue';
  });

  const growingWorlds = worlds.filter((w) => {
    return getWorldStatus(w, currentTimeMs) === 'growing';
  });

  // Top 5 worlds closest to harvest
  const soonestWorlds = [...growingWorlds]
    .sort((a, b) => new Date(a.harvestAt).getTime() - new Date(b.harvestAt).getTime())
    .slice(0, 5);

  const totalTrees = worlds.reduce((acc, w) => acc + (w.treeCount || 0), 0);

  const getAccountName = (accountId: string) => {
    const acc = accounts.find((a) => a.id === accountId);
    return acc ? acc.growId : 'Umum';
  };

  const getCropIcon = (cropType: string) => {
    const p = CROP_PRESETS.find((c) => c.name === cropType);
    return p ? p.icon : '🌱';
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#0d1c2d] via-[#10223b] to-[#0c182a] border border-slate-700/80 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Monitoring Realtime</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-50 font-game tracking-wider">
              DASHBOARD FARMING GROWTOPIA
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Pantau siklus panen pohon, hitung mundur detik, dan optimalkan rotasi world farm Anda tanpa ketinggalan waktu panen.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {onNavigateToCalculator && (
              <button
                onClick={onNavigateToCalculator}
                className="px-3.5 py-2.5 rounded-xl bg-[#142038] hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-amber-400" />
                <span>Kalkulator Farm</span>
              </button>
            )}

            <button
              onClick={onOpenAddWorld}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tambah World Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards as requested */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Total World */}
        <div
          onClick={() => onNavigateToWorlds('all')}
          className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total World
            </span>
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 group-hover:scale-110 transition-transform">
              <Globe2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-100 font-game tracking-tight">
            {worlds.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>{totalTrees.toLocaleString()} total pohon</span>
            <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-blue-400 transition-colors" />
          </div>
        </div>

        {/* World Siap Panen Sekarang */}
        <div
          onClick={() => onNavigateToWorlds('ready')}
          className={`p-4 sm:p-5 rounded-2xl transition-all cursor-pointer group shadow-lg ${
            readyWorlds.length > 0
              ? 'bg-gradient-to-b from-[#0e2723] to-[#0c1c20] border-2 border-emerald-500/60 shadow-emerald-500/10'
              : 'bg-[#0f172a] border border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Siap Panen
            </span>
            <div
              className={`p-2.5 rounded-xl ${
                readyWorlds.length > 0
                  ? 'bg-emerald-500/30 text-emerald-300 animate-pulse'
                  : 'bg-emerald-500/10 text-emerald-400'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-game tracking-tight">
            {readyWorlds.length}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1 flex items-center justify-between font-medium">
            <span>{readyWorlds.length > 0 ? 'Perlu dipanen sekarang!' : 'Belum ada yang siap'}</span>
            <ArrowRight className="w-3 h-3 text-emerald-500" />
          </div>
        </div>

        {/* World Sedang Tumbuh */}
        <div
          onClick={() => onNavigateToWorlds('growing')}
          className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Sedang Tumbuh
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-game tracking-tight">
            {growingWorlds.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Hitung mundur aktif</span>
            <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 transition-colors" />
          </div>
        </div>

        {/* Total Akun */}
        <div
          onClick={onNavigateToAccounts}
          className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Akun
            </span>
            <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-100 font-game tracking-tight">
            {accounts.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>GrowID terhubung</span>
            <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-purple-400 transition-colors" />
          </div>
        </div>
      </div>

      {/* Bagian "Siap Panen" yang disorot warna hijau (Highlighted section) */}
      <section className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#0a231d] via-[#0b1e1b] to-[#0a151b] border-2 border-emerald-500/50 shadow-2xl shadow-emerald-950/40 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-emerald-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-lg shadow-lg shadow-emerald-500/30">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-emerald-300 font-game tracking-wider uppercase">
                  WORLD SIAP PANEN SEKARANG
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-xs font-black">
                  {readyWorlds.length} SIAP
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">
                Segera panen untuk mengumpulkan gems dan replant kembali!
              </p>
            </div>
          </div>

          {readyWorlds.length > 0 && (
            <button
              onClick={() => onNavigateToWorlds('ready')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <span>Lihat Semua ({readyWorlds.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {readyWorlds.length === 0 ? (
          <div className="py-8 px-4 text-center rounded-2xl bg-emerald-950/20 border border-emerald-500/20">
            <CheckCircle2 className="w-10 h-10 text-emerald-400/80 mx-auto mb-2" />
            <h4 className="text-base font-bold text-emerald-200 font-game tracking-wide">
              Semua Tanaman Masih Dalam Pertumbuhan!
            </h4>
            <p className="text-xs text-emerald-300/70 max-w-md mx-auto mt-1">
              Tidak ada world yang siap panen saat ini. Silakan periksa bagian hitung mundur di bawah untuk jadwal panen terdekat.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {readyWorlds.map((world) => {
              const status = getWorldStatus(world, currentTimeMs);
              const isOverdue = status === 'overdue';
              const countdown = getCountdownInfo(world, currentTimeMs);
              const estGems = Math.round(world.treeCount * 11.5);

              return (
                <div
                  key={world.id}
                  className="rounded-2xl p-4 bg-[#0a1820]/90 border border-emerald-500/40 hover:border-emerald-400 transition-all flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getCropIcon(world.cropType)}</span>
                        <span className="font-extrabold text-base text-slate-50 font-game tracking-wider group-hover:text-emerald-300 transition-colors">
                          {world.name}
                        </span>
                      </div>
                      {isOverdue ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/25 text-rose-300 border border-rose-500/40 animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          Terlambat
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-500/50">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          Siap Panen
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-300 space-y-1 mb-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Tanaman:</span>
                        <span className="font-bold text-slate-200">{world.cropType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Jumlah Pohon:</span>
                        <span className="font-bold text-amber-400">
                          {world.treeCount.toLocaleString()} pohon
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Estimasi Gems:</span>
                        <span className="font-bold text-amber-300">~{estGems.toLocaleString()} 💎</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Akun Petani:</span>
                        <span className="font-medium text-slate-300">
                          {getAccountName(world.accountId)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Harvest Action Button */}
                  <button
                    onClick={() => onHarvestWorld(world)}
                    className="w-full mt-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Panen & Tanam Ulang</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Bagian "Sedang Tumbuh" dengan Hitung Mundur & 5 World Tercepat Siap Panen */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 font-game tracking-wider flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>5 WORLD PALING CEPAT SIAP PANEN</span>
            </h2>
            <p className="text-xs text-slate-400">
              Urutan pohon yang paling dekat dengan waktu panen berikutnya
            </p>
          </div>

          <button
            onClick={() => onNavigateToWorlds('growing')}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Semua World Tumbuh ({growingWorlds.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {soonestWorlds.length === 0 ? (
          <EmptyState
            title="Tidak Ada World yang Sedang Tumbuh"
            description="Semua world Anda mungkin sudah siap panen atau belum ada world yang ditambahkan."
            actionText="Tambah World Baru"
            onAction={onOpenAddWorld}
          />
        ) : (
          <div className="space-y-3">
            {soonestWorlds.map((world, idx) => {
              const countdown = getCountdownInfo(world, currentTimeMs);

              return (
                <div
                  key={world.id}
                  onClick={() => onSelectWorld(world)}
                  className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-slate-700 hover:bg-[#121c33] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-md"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-sm text-slate-400 group-hover:text-amber-400 group-hover:bg-amber-500/10 transition-colors shrink-0 font-pixel">
                      #{idx + 1}
                    </div>

                    <div className="text-2xl shrink-0">{getCropIcon(world.cropType)}</div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm sm:text-base text-slate-100 font-game tracking-wider group-hover:text-amber-300 transition-colors truncate">
                          {world.name}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                          {world.cropType}
                        </span>
                      </div>

                      <div className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                        <span>{world.treeCount.toLocaleString()} pohon</span>
                        <span>•</span>
                        <span>Akun: {getAccountName(world.accountId)}</span>
                        <span className="hidden md:inline">•</span>
                        <span className="hidden md:inline">
                          Panen: {formatDateTime(world.harvestAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Countdown timer & progress bar */}
                  <div className="sm:w-64 shrink-0 flex flex-col justify-end">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[11px] font-semibold text-slate-400">Sisa Waktu:</span>
                      <span className="font-bold text-amber-400 font-mono text-sm bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                        ⏳ {countdown.formatted}
                      </span>
                    </div>

                    <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${countdown.progressPercent}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                      <span>Proses Tumbuh</span>
                      <span className="text-emerald-400 font-semibold">
                        {countdown.progressPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
