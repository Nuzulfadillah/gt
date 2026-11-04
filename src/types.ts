export type CropPreset = {
  name: string;
  category: string;
  days: number;
  hours: number;
  minutes: number;
  icon: string;
  color: string;
  description: string;
};

export type WorldStatus = 'growing' | 'ready' | 'overdue';

export interface World {
  id: string;
  name: string;
  cropType: string;
  treeCount: number;
  plantedAt: string; // ISO date string
  durationDays: number;
  durationHours: number;
  durationMinutes: number;
  harvestAt: string; // ISO date string
  accountId: string; // reference to GrowAccount.id
  notes?: string;
  harvestCount: number;
  lastHarvestedAt?: string;
}

export interface GrowAccount {
  id: string;
  growId: string;
  label: string; // e.g. "Akun Utama", "Holder Seed", "BFG Farm"
  notes?: string;
  level?: number;
  createdAt: string;
}

export interface FarmFile {
  id: string;
  name: string;
  type: 'pdf' | 'xlsx' | 'xls' | 'csv' | 'other';
  size: number;
  uploadDate: string;
  tags: string[];
  dataUrl?: string;
  notes?: string;
}

export interface UserSession {
  isLoggedIn: boolean;
  username: string;
  growId: string;
  avatarSeed: string;
}
