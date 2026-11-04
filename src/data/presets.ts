import { CropPreset, GrowAccount, World, FarmFile } from '../types';

export const CROP_PRESETS: CropPreset[] = [
  {
    name: 'Laser Grid',
    category: 'High Profit / Popular',
    days: 3,
    hours: 15,
    minutes: 0,
    icon: '⚡',
    color: '#38bdf8', // cyan
    description: 'Paling populer untuk BFG dan gems'
  },
  {
    name: 'Pepper Tree',
    category: 'Quick Rotate',
    days: 1,
    hours: 10,
    minutes: 0,
    icon: '🌶️',
    color: '#ef4444', // red
    description: 'Panen cepat, cocok untuk rotasi harian'
  },
  {
    name: 'Chandelier',
    category: 'Max Gems',
    days: 7,
    hours: 8,
    minutes: 0,
    icon: '💎',
    color: '#a855f7', // purple
    description: 'Gems tinggi per harvest, waktu tumbuh lama'
  },
  {
    name: 'Fish Tank',
    category: 'Beginner Friendly',
    days: 2,
    hours: 14,
    minutes: 0,
    icon: '🐠',
    color: '#06b6d4', // cyan-blue
    description: 'Mudah di-break dan modal terjangkau'
  },
  {
    name: 'Pinball',
    category: 'Classic Farming',
    days: 2,
    hours: 10,
    minutes: 0,
    icon: '🔴',
    color: '#f97316', // orange
    description: 'Farmable klasik dengan drop gems stabil'
  },
  {
    name: 'Sorcerer Stone',
    category: 'Mid tier',
    days: 5,
    hours: 0,
    minutes: 0,
    icon: '🔮',
    color: '#8b5cf6', // violet
    description: 'Block ungu mistis dengan gems mantap'
  },
  {
    name: 'Venus Guytrap',
    category: 'Special',
    days: 3,
    hours: 6,
    minutes: 0,
    icon: '🌱',
    color: '#22c55e', // green
    description: 'Tanaman karnivora berharga'
  },
  {
    name: 'High Tech Block',
    category: 'Advanced',
    days: 4,
    hours: 18,
    minutes: 0,
    icon: '💾',
    color: '#6366f1', // indigo
    description: 'Blok futuristik untuk builder & farmer'
  }
];

export const INITIAL_ACCOUNTS: GrowAccount[] = [
  {
    id: 'acc-1',
    growId: 'NuzulFarmer',
    label: 'Akun Utama (Main)',
    notes: 'Level 58, punya Rayman & Magplant. World farming utama.',
    level: 58,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString()
  },
  {
    id: 'acc-2',
    growId: 'FarmHolder01',
    label: 'Holder Seed / Storage',
    notes: 'Level 35, khusus simpan stock 50k seed Laser Grid & Pepper.',
    level: 35,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 'acc-3',
    growId: 'BFGWorker99',
    label: 'Sub-Farm & BFG',
    notes: 'Level 42, dipakai untuk rotasi BFG harian.',
    level: 42,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
  }
];

// Helper to create dates relative to now for dynamic preview
const now = Date.now();
const hour = 3600000;
const day = 86400000;

export const INITIAL_WORLDS: World[] = [
  {
    id: 'w-1',
    name: 'BUYFARM_LGRID01',
    cropType: 'Laser Grid',
    treeCount: 2650,
    plantedAt: new Date(now - (3 * day + 16 * hour)).toISOString(), // Planted over 3d 16h ago -> READY / OVERDUE
    durationDays: 3,
    durationHours: 15,
    durationMinutes: 0,
    harvestAt: new Date(now - 1 * hour).toISOString(), // Ready 1 hour ago
    accountId: 'acc-1',
    notes: 'World full platform wood, BFG ready di pojok kiri bawah.',
    harvestCount: 14,
    lastHarvestedAt: new Date(now - (3 * day + 16 * hour)).toISOString()
  },
  {
    id: 'w-2',
    name: 'PEPPERCITY_77',
    cropType: 'Pepper Tree',
    treeCount: 2600,
    plantedAt: new Date(now - (1 * day + 10 * hour + 30 * 60000)).toISOString(),
    durationDays: 1,
    durationHours: 10,
    durationMinutes: 0,
    harvestAt: new Date(now - 30 * 60000).toISOString(), // Ready 30 mins ago
    accountId: 'acc-1',
    notes: 'Rotasi cepat untuk suplai gems harian.',
    harvestCount: 22
  },
  {
    id: 'w-3',
    name: 'CHAND_GEMS_HQ',
    cropType: 'Chandelier',
    treeCount: 2580,
    plantedAt: new Date(now - 6 * day).toISOString(),
    durationDays: 7,
    durationHours: 8,
    durationMinutes: 0,
    harvestAt: new Date(now + 1 * day + 8 * hour).toISOString(), // Still growing: 1 day 8h left
    accountId: 'acc-2',
    notes: 'Simpan seed hasil panen langsung ke storage.',
    harvestCount: 8
  },
  {
    id: 'w-4',
    name: 'LGRID_PRO_02',
    cropType: 'Laser Grid',
    treeCount: 2700,
    plantedAt: new Date(now - 2 * day).toISOString(),
    durationDays: 3,
    durationHours: 15,
    durationMinutes: 0,
    harvestAt: new Date(now + 1 * day + 15 * hour).toISOString(), // Growing: 1d 15h left
    accountId: 'acc-1',
    notes: 'Pintu masuk dikunci World Lock di jam 12 malam.',
    harvestCount: 11
  },
  {
    id: 'w-5',
    name: 'FISHTANK_FARM8',
    cropType: 'Fish Tank',
    treeCount: 2500,
    plantedAt: new Date(now - (2 * day + 10 * hour)).toISOString(),
    durationDays: 2,
    durationHours: 14,
    durationMinutes: 0,
    harvestAt: new Date(now + 4 * hour).toISOString(), // Growing: ready in 4 hours!
    accountId: 'acc-3',
    notes: 'Sebentar lagi siap panen sore ini.',
    harvestCount: 5
  },
  {
    id: 'w-6',
    name: 'PINBALL_FARM_X',
    cropType: 'Pinball',
    treeCount: 2450,
    plantedAt: new Date(now - (3 * day + 5 * hour)).toISOString(), // Way past due -> Terlambat
    durationDays: 2,
    durationHours: 10,
    durationMinutes: 0,
    harvestAt: new Date(now - 25 * hour).toISOString(), // Ready 25 hours ago -> Overdue!
    accountId: 'acc-3',
    notes: 'Lupa dipanen kemarin karena sibuk event Halloween.',
    harvestCount: 9
  }
];

export const INITIAL_FILES: FarmFile[] = [
  {
    id: 'file-1',
    name: 'Daftar_Harga_Seed_Farming_2026.xlsx',
    type: 'xlsx',
    size: 42560, // ~42 KB
    uploadDate: new Date(now - 2 * day).toISOString(),
    tags: ['daftar harga', 'kalkulasi profit', 'seed stock'],
    notes: 'Tabel perbandingan rasio WL per seed dan gems rata-rata per pohon'
  },
  {
    id: 'file-2',
    name: 'Rencana_Farming_10_World_LaserGrid.pdf',
    type: 'pdf',
    size: 245800, // ~240 KB
    uploadDate: new Date(now - 5 * day).toISOString(),
    tags: ['rencana farming', 'rotasi mingguan'],
    notes: 'Panduan tata letak platform kayu dan slot BFG otomatis'
  },
  {
    id: 'file-3',
    name: 'Catatan_Modal_World_Lock.xlsx',
    type: 'xlsx',
    size: 18900,
    uploadDate: new Date(now - 7 * day).toISOString(),
    tags: ['daftar harga', 'keuangan'],
    notes: 'Pengeluaran beli seed dan hasil penjualan WL'
  }
];
