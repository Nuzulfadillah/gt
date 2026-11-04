/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { World, GrowAccount, FarmFile, UserSession } from './types';
import {
  INITIAL_WORLDS,
  INITIAL_ACCOUNTS,
  INITIAL_FILES,
} from './data/presets';
import { calculateHarvestTime } from './utils/time';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { WorldModal } from './components/WorldModal';
import { AccountModal } from './components/AccountModal';
import { FileUploadModal } from './components/FileUploadModal';
import { HarvestModal } from './components/HarvestModal';
import { DashboardPage } from './pages/DashboardPage';
import { WorldsPage } from './pages/WorldsPage';
import { AccountsPage } from './pages/AccountsPage';
import { FilesPage } from './pages/FilesPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { LoginPage } from './pages/LoginPage';

const STORAGE_KEYS = {
  WORLDS: 'gt_farm_worlds_v1',
  ACCOUNTS: 'gt_farm_accounts_v1',
  FILES: 'gt_farm_files_v1',
  SESSION: 'gt_farm_session_v1',
  SOUND: 'gt_farm_sound_v1',
};

export default function App() {
  // Session State
  const [session, setSession] = useState<UserSession>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      isLoggedIn: true,
      username: 'NuzulFarmer',
      growId: 'NuzulFarmer',
      avatarSeed: 'nuzulfarmer',
    };
  });

  // Data States with LocalStorage Persistence
  const [worlds, setWorlds] = useState<World[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WORLDS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_WORLDS;
  });

  const [accounts, setAccounts] = useState<GrowAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_ACCOUNTS;
  });

  const [files, setFiles] = useState<FarmFile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FILES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_FILES;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOUND);
      if (saved !== null) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return true;
  });

  // Current active navigation tab
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [worldStatusFilter, setWorldStatusFilter] = useState<string>('all');

  // Realtime clock ticker (ticks every 1000ms for smooth live countdown)
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeMs(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WORLDS, JSON.stringify(worlds));
    } catch {
      // ignore
    }
  }, [worlds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    } catch {
      // ignore
    }
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));
    } catch {
      // ignore
    }
  }, [files]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    } catch {
      // ignore
    }
  }, [session]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND, JSON.stringify(soundEnabled));
    } catch {
      // ignore
    }
  }, [soundEnabled]);

  // Modal States
  const [isWorldModalOpen, setIsWorldModalOpen] = useState(false);
  const [worldToEdit, setWorldToEdit] = useState<World | null>(null);

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<GrowAccount | null>(null);

  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  const [isHarvestModalOpen, setIsHarvestModalOpen] = useState(false);
  const [worldToHarvest, setWorldToHarvest] = useState<World | null>(null);

  // Handlers for World
  const handleOpenAddWorld = () => {
    setWorldToEdit(null);
    setIsWorldModalOpen(true);
  };

  const handleEditWorld = (world: World) => {
    setWorldToEdit(world);
    setIsWorldModalOpen(true);
  };

  const handleSaveWorld = (
    worldData: Omit<World, 'id' | 'harvestCount'> & { id?: string }
  ) => {
    if (worldData.id) {
      // Update
      setWorlds((prev) =>
        prev.map((w) =>
          w.id === worldData.id
            ? {
                ...w,
                ...worldData,
                id: worldData.id!,
              }
            : w
        )
      );
    } else {
      // Create
      const newWorld: World = {
        ...worldData,
        id: `world-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        harvestCount: 0,
      };
      setWorlds((prev) => [newWorld, ...prev]);
    }
  };

  const handleDeleteWorld = (worldId: string) => {
    setWorlds((prev) => prev.filter((w) => w.id !== worldId));
  };

  // Quick Harvest & Replant action
  const handleTriggerHarvest = (world: World) => {
    setWorldToHarvest(world);
    setIsHarvestModalOpen(true);
  };

  const handleReplantWorld = (worldId: string) => {
    const target = worlds.find((w) => w.id === worldId);
    if (!target) return;

    const nowISO = new Date().toISOString();
    const newHarvestISO = calculateHarvestTime(
      nowISO,
      target.durationDays,
      target.durationHours,
      target.durationMinutes
    );

    setWorlds((prev) =>
      prev.map((w) =>
        w.id === worldId
          ? {
              ...w,
              plantedAt: nowISO,
              harvestAt: newHarvestISO,
              harvestCount: (w.harvestCount || 0) + 1,
              lastHarvestedAt: nowISO,
            }
          : w
      )
    );

    setIsHarvestModalOpen(false);
    setWorldToHarvest(null);
  };

  const handleMarkHarvestedOnly = (worldId: string) => {
    const nowISO = new Date().toISOString();
    setWorlds((prev) =>
      prev.map((w) =>
        w.id === worldId
          ? {
              ...w,
              harvestCount: (w.harvestCount || 0) + 1,
              lastHarvestedAt: nowISO,
            }
          : w
      )
    );
    setIsHarvestModalOpen(false);
    setWorldToHarvest(null);
  };

  // Handlers for Account
  const handleOpenAddAccount = () => {
    setAccountToEdit(null);
    setIsAccountModalOpen(true);
  };

  const handleEditAccount = (acc: GrowAccount) => {
    setAccountToEdit(acc);
    setIsAccountModalOpen(true);
  };

  const handleSaveAccount = (
    accountData: Omit<GrowAccount, 'id' | 'createdAt'> & { id?: string }
  ) => {
    if (accountData.id) {
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === accountData.id
            ? {
                ...a,
                ...accountData,
                id: accountData.id!,
              }
            : a
        )
      );
    } else {
      const newAcc: GrowAccount = {
        ...accountData,
        id: `acc-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setAccounts((prev) => [...prev, newAcc]);
    }
  };

  const handleDeleteAccount = (accId: string) => {
    if (accounts.length <= 1) {
      alert('Minimal harus ada 1 akun Growtopia yang tersimpan.');
      return;
    }
    setAccounts((prev) => prev.filter((a) => a.id !== accId));
  };

  // Handlers for Files
  const handleUploadFile = (fileData: Omit<FarmFile, 'id' | 'uploadDate'>) => {
    const newFile: FarmFile = {
      ...fileData,
      id: `file-${Date.now()}`,
      uploadDate: new Date().toISOString(),
    };
    setFiles((prev) => [newFile, ...prev]);
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  // Auth Handlers
  const handleLogin = (newSession: UserSession) => {
    setSession(newSession);
  };

  const handleLogout = () => {
    setSession({
      isLoggedIn: false,
      username: '',
      growId: '',
      avatarSeed: '',
    });
  };

  // If not logged in, render game Login Page
  if (!session.isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
      <div className="flex flex-1 min-h-screen">
        {/* Desktop Sidebar Navigation */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          worlds={worlds}
          accounts={accounts}
          onOpenAddWorld={handleOpenAddWorld}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
          {/* Top Header */}
          <Header
            worlds={worlds}
            userSession={session}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
            onOpenAddWorld={handleOpenAddWorld}
            onSelectWorld={(world) => {
              setWorldToEdit(world);
              setIsWorldModalOpen(true);
            }}
            onHarvestWorld={handleTriggerHarvest}
            onNavigateToWorlds={() => {
              setCurrentTab('worlds');
              setWorldStatusFilter('ready');
            }}
            onLogout={handleLogout}
          />

          {/* Page Routing */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {currentTab === 'dashboard' && (
              <DashboardPage
                worlds={worlds}
                accounts={accounts}
                currentTimeMs={currentTimeMs}
                onOpenAddWorld={handleOpenAddWorld}
                onSelectWorld={(world) => {
                  setWorldToEdit(world);
                  setIsWorldModalOpen(true);
                }}
                onHarvestWorld={handleTriggerHarvest}
                onNavigateToWorlds={(statusFilter) => {
                  if (statusFilter) setWorldStatusFilter(statusFilter);
                  setCurrentTab('worlds');
                }}
                onNavigateToAccounts={() => setCurrentTab('accounts')}
                onNavigateToCalculator={() => setCurrentTab('calculator')}
              />
            )}

            {currentTab === 'worlds' && (
              <WorldsPage
                worlds={worlds}
                accounts={accounts}
                currentTimeMs={currentTimeMs}
                initialFilterStatus={worldStatusFilter}
                onOpenAddWorld={handleOpenAddWorld}
                onEditWorld={handleEditWorld}
                onDeleteWorld={handleDeleteWorld}
                onHarvestWorld={handleTriggerHarvest}
              />
            )}

            {currentTab === 'calculator' && (
              <CalculatorPage
                onApplyToNewWorld={(cropData) => {
                  const nowISO = new Date().toISOString();
                  const harvestISO = calculateHarvestTime(
                    nowISO,
                    cropData.days,
                    cropData.hours,
                    cropData.minutes
                  );
                  const newWorldObj: World = {
                    id: '',
                    name: `${cropData.cropType.replace(/\s+/g, '').toUpperCase()}_FARM`,
                    cropType: cropData.cropType,
                    treeCount: cropData.treeCount,
                    plantedAt: nowISO,
                    durationDays: cropData.days,
                    durationHours: cropData.hours,
                    durationMinutes: cropData.minutes,
                    harvestAt: harvestISO,
                    accountId: accounts[0]?.id || 'acc-1',
                    notes: 'Dibuat otomatis dari Kalkulator Farm',
                    harvestCount: 0,
                  };
                  setWorldToEdit(newWorldObj);
                  setIsWorldModalOpen(true);
                }}
              />
            )}

            {currentTab === 'accounts' && (
              <AccountsPage
                accounts={accounts}
                worlds={worlds}
                onOpenAddAccount={handleOpenAddAccount}
                onEditAccount={handleEditAccount}
                onDeleteAccount={handleDeleteAccount}
                onViewWorldsForAccount={(accId) => {
                  setCurrentTab('worlds');
                  setWorldStatusFilter('all');
                }}
              />
            )}

            {currentTab === 'files' && (
              <FilesPage
                files={files}
                onOpenUploadModal={() => setIsFileModalOpen(true)}
                onDirectUpload={handleUploadFile}
                onDeleteFile={handleDeleteFile}
              />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Tab Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        worlds={worlds}
      />

      {/* Modals */}
      <WorldModal
        isOpen={isWorldModalOpen}
        worldToEdit={worldToEdit}
        accounts={accounts}
        onClose={() => {
          setIsWorldModalOpen(false);
          setWorldToEdit(null);
        }}
        onSave={handleSaveWorld}
        onHarvestAndReplant={(worldId) => handleReplantWorld(worldId)}
      />

      <AccountModal
        isOpen={isAccountModalOpen}
        accountToEdit={accountToEdit}
        onClose={() => {
          setIsAccountModalOpen(false);
          setAccountToEdit(null);
        }}
        onSave={handleSaveAccount}
      />

      <FileUploadModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        onUpload={handleUploadFile}
      />

      <HarvestModal
        world={worldToHarvest}
        isOpen={isHarvestModalOpen}
        soundEnabled={soundEnabled}
        onClose={() => {
          setIsHarvestModalOpen(false);
          setWorldToHarvest(null);
        }}
        onReplant={(worldId) => handleReplantWorld(worldId)}
        onMarkHarvestedOnly={(worldId) => handleMarkHarvestedOnly(worldId)}
      />
    </div>
  );
}
