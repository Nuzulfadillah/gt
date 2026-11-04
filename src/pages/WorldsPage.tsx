import React, { useState, useMemo } from 'react';
import { World, GrowAccount } from '../types';
import { CROP_PRESETS } from '../data/presets';
import { getWorldStatus, getCountdownInfo, formatDateTime } from '../utils/time';
import { EmptyState } from '../components/EmptyState';
import {
  Search,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  RotateCcw,
  Edit2,
  Trash2,
  Sparkles,
  AlertTriangle,
  Clock,
  ArrowUpDown,
  Filter,
  CheckCircle,
} from 'lucide-react';

interface WorldsPageProps {
  worlds: World[];
  accounts: GrowAccount[];
  currentTimeMs: number;
  initialFilterStatus?: string;
  onOpenAddWorld: () => void;
  onEditWorld: (world: World) => void;
  onDeleteWorld: (worldId: string) => void;
  onHarvestWorld: (world: World) => void;
}

export const WorldsPage: React.FC<WorldsPageProps> = ({
  worlds,
  accounts,
  currentTimeMs,
  initialFilterStatus,
  onOpenAddWorld,
  onEditWorld,
  onDeleteWorld,
  onHarvestWorld,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialFilterStatus || 'all');
  const [cropFilter, setCropFilter] = useState<string>('all');
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('soonest');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

  const getAccountName = (accountId: string) => {
    const acc = accounts.find((a) => a.id === accountId);
    return acc ? acc.growId : 'Umum';
  };

  const getCropIcon = (cropType: string) => {
    const p = CROP_PRESETS.find((c) => c.name === cropType);
    return p ? p.icon : '🌱';
  };

  // Distinct crop types
  const cropTypes = useMemo(() => {
    const set = new Set<string>();
    worlds.forEach((w) => set.add(w.cropType));
    return Array.from(set);
  }, [worlds]);

  // Filtering & Sorting
  const filteredWorlds = useMemo(() => {
    return worlds
      .filter((w) => {
        const status = getWorldStatus(w, currentTimeMs);

        // Status Filter
        if (statusFilter === 'ready' && status !== 'ready' && status !== 'overdue') return false;
        if (statusFilter === 'growing' && status !== 'growing') return false;
        if (statusFilter === 'overdue' && status !== 'overdue') return false;

        // Crop filter
        if (cropFilter !== 'all' && w.cropType !== cropFilter) return false;

        // Account filter
        if (accountFilter !== 'all' && w.accountId !== accountFilter) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = w.name.toLowerCase().includes(q);
          const matchCrop = w.cropType.toLowerCase().includes(q);
          const matchNotes = (w.notes || '').toLowerCase().includes(q);
          const accName = getAccountName(w.accountId).toLowerCase();
          const matchAcc = accName.includes(q);
          if (!matchName && !matchCrop && !matchNotes && !matchAcc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'soonest') {
          return new Date(a.harvestAt).getTime() - new Date(b.harvestAt).getTime();
        }
        if (sortBy === 'latest') {
          return new Date(b.harvestAt).getTime() - new Date(a.harvestAt).getTime();
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'trees') {
          return b.treeCount - a.treeCount;
        }
        return 0;
      });
  }, [worlds, currentTimeMs, statusFilter, cropFilter, accountFilter, searchQuery, sortBy]);

  const renderStatusBadge = (world: World) => {
    const status = getWorldStatus(world, currentTimeMs);
    const countdown = getCountdownInfo(world, currentTimeMs);

    if (status === 'ready') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Siap Panen</span>
        </span>
      );
    }
    if (status === 'overdue') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
          <AlertTriangle className="w-3 h-3" />
          <span>Terlambat</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
        <Clock className="w-3 h-3" />
        <span>Tumbuh ({countdown.progressPercent}%)</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 font-game tracking-wider uppercase flex items-center gap-2">
            <span>DAFTAR WORLD FARMING</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
              {filteredWorlds.length} World
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Daftar lengkap world Growtopia, status bibit, dan waktu panen otomatis
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Tampilan Tabel"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Tampilan Kartu"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenAddWorld}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah World</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-3">
        {/* Row 1: Search & Quick Status Tabs */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama world, tanaman, akun, catatan..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#142038] border border-slate-700/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-100 text-xs placeholder:text-slate-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'ready', label: 'Siap Panen', color: 'text-emerald-400' },
              { id: 'growing', label: 'Tumbuh', color: 'text-amber-400' },
              { id: 'overdue', label: 'Terlambat', color: 'text-rose-400' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Secondary Dropdowns (Crop, Account, Sort) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80 text-xs">
          {/* Crop Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 shrink-0 font-medium">Tanaman:</span>
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl bg-[#142038] border border-slate-700/80 text-slate-200 text-xs focus:border-emerald-500"
            >
              <option value="all">Semua Tanaman ({cropTypes.length})</option>
              {cropTypes.map((crop) => (
                <option key={crop} value={crop}>
                  {getCropIcon(crop)} {crop}
                </option>
              ))}
            </select>
          </div>

          {/* Account Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 shrink-0 font-medium">Akun:</span>
            <select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl bg-[#142038] border border-slate-700/80 text-slate-200 text-xs focus:border-emerald-500"
            >
              <option value="all">Semua Akun ({accounts.length})</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.growId} ({acc.label})
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 shrink-0 font-medium flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-amber-400" />
              Urutkan:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl bg-[#142038] border border-slate-700/80 text-slate-200 text-xs focus:border-emerald-500 font-medium"
            >
              <option value="soonest">⏳ Sisa Waktu (Tercepat Panen)</option>
              <option value="latest">⏱️ Sisa Waktu (Terlama Panen)</option>
              <option value="name">🔤 Nama World (A - Z)</option>
              <option value="trees">🌳 Jumlah Pohon (Terbanyak)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main World List Content */}
      {filteredWorlds.length === 0 ? (
        <EmptyState
          title="Tidak Ada World Ditemukan"
          description={
            searchQuery || statusFilter !== 'all' || cropFilter !== 'all'
              ? 'Tidak ada world yang cocok dengan filter atau kata kunci pencarian Anda.'
              : 'Anda belum memiliki world farming yang terdaftar. Tambahkan world pertama Anda!'
          }
          actionText={
            searchQuery || statusFilter !== 'all' || cropFilter !== 'all'
              ? 'Reset Filter'
              : 'Tambah World Baru'
          }
          onAction={() => {
            if (searchQuery || statusFilter !== 'all' || cropFilter !== 'all') {
              setSearchQuery('');
              setStatusFilter('all');
              setCropFilter('all');
              setAccountFilter('all');
            } else {
              onOpenAddWorld();
            }
          }}
        />
      ) : viewMode === 'table' ? (
        /* TABLE VIEW (as requested with all specific columns) */
        <div className="rounded-2xl border border-slate-800 bg-[#0f172a] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#121c33] text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Nama World</th>
                  <th className="py-3 px-4">Jenis Tanaman</th>
                  <th className="py-3 px-4 text-right">Jumlah Pohon</th>
                  <th className="py-3 px-4">Tanggal & Jam Tanam</th>
                  <th className="py-3 px-4">Waktu Panen</th>
                  <th className="py-3 px-4">Countdown</th>
                  <th className="py-3 px-4">Badge Status</th>
                  <th className="py-3 px-4">Akun Terkait</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredWorlds.map((world) => {
                  const countdown = getCountdownInfo(world, currentTimeMs);
                  const isReady = countdown.isReady;

                  return (
                    <tr
                      key={world.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isReady ? 'bg-emerald-500/5' : ''
                      }`}
                    >
                      {/* Nama World */}
                      <td className="py-3 px-4 font-bold text-slate-100 font-game text-sm tracking-wide">
                        <div className="flex items-center gap-1.5">
                          <span>{world.name}</span>
                          {world.notes && (
                            <span
                              className="text-slate-500 hover:text-slate-300 cursor-help"
                              title={world.notes}
                            >
                              💬
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Jenis Tanaman */}
                      <td className="py-3 px-4 text-slate-200">
                        <div className="flex items-center gap-1.5">
                          <span>{getCropIcon(world.cropType)}</span>
                          <span className="font-semibold">{world.cropType}</span>
                        </div>
                      </td>

                      {/* Jumlah Pohon */}
                      <td className="py-3 px-4 text-right font-bold text-amber-400 font-mono">
                        {world.treeCount.toLocaleString()}
                      </td>

                      {/* Tanggal & Jam Tanam */}
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {formatDateTime(world.plantedAt)}
                      </td>

                      {/* Waktu Panen */}
                      <td className="py-3 px-4 text-slate-300 font-mono text-[11px] font-semibold">
                        {formatDateTime(world.harvestAt)}
                      </td>

                      {/* Countdown */}
                      <td className="py-3 px-4">
                        <span
                          className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                            isReady
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : 'text-amber-400 bg-amber-500/10'
                          }`}
                        >
                          {countdown.formatted}
                        </span>
                      </td>

                      {/* Badge Status */}
                      <td className="py-3 px-4">{renderStatusBadge(world)}</td>

                      {/* Akun Terkait */}
                      <td className="py-3 px-4">
                        <span className="text-slate-300 font-medium bg-[#142038] px-2 py-0.5 rounded text-[11px] border border-slate-700/60">
                          {getAccountName(world.accountId)}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onHarvestWorld(world)}
                            title="Panen & Tanam Ulang"
                            className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditWorld(world)}
                            title="Edit Data World"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus world ${world.name}?`)) {
                                onDeleteWorld(world.id);
                              }
                            }}
                            title="Hapus World"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorlds.map((world) => {
            const countdown = getCountdownInfo(world, currentTimeMs);
            const isReady = countdown.isReady;

            return (
              <div
                key={world.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between shadow-lg ${
                  isReady
                    ? 'bg-gradient-to-b from-[#0a1e1b] to-[#0c1622] border-emerald-500/50'
                    : 'bg-[#0f172a] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getCropIcon(world.cropType)}</span>
                      <div>
                        <h3 className="font-extrabold text-base text-slate-100 font-game tracking-wider">
                          {world.name}
                        </h3>
                        <span className="text-[11px] text-slate-400">{world.cropType}</span>
                      </div>
                    </div>
                    {renderStatusBadge(world)}
                  </div>

                  {/* Countdown Box */}
                  <div className="p-3 my-3 rounded-xl bg-[#121c33] border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Hitung Mundur Panen
                    </span>
                    <span
                      className={`text-lg font-black font-mono mt-0.5 block ${
                        isReady ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {countdown.formatted}
                    </span>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full transition-all"
                        style={{ width: `${countdown.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="text-xs text-slate-400 space-y-1 mb-3">
                    <div className="flex justify-between">
                      <span>Pohon:</span>
                      <span className="font-bold text-amber-400">
                        {world.treeCount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Waktu Panen:</span>
                      <span className="text-slate-300 font-mono">
                        {formatDateTime(world.harvestAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Akun:</span>
                      <span className="text-slate-300">{getAccountName(world.accountId)}</span>
                    </div>
                    {world.notes && (
                      <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-800/80">
                        "{world.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => onHarvestWorld(world)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Panen / Replant</span>
                  </button>

                  <button
                    onClick={() => onEditWorld(world)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Yakin ingin menghapus world ${world.name}?`)) {
                        onDeleteWorld(world.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
