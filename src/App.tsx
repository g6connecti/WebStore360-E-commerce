/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DealOffer, OfferStatus, PlatformCredential } from './types';
import { getDeals, toggleOfferStatus, getCredentials, saveCredential } from './lib/supabase';
import { Navbar } from './components/layout/Navbar';
import { PublicShowcase } from './components/showcase/PublicShowcase';
import { Footer } from './components/layout/Footer';
import { SqlSchemaModal } from './components/admin/SqlSchemaModal';
import { ApiCredentialsModal } from './components/admin/ApiCredentialsModal';

export default function App() {
  const [deals, setDeals] = useState<DealOffer[]>([]);
  const [credentials, setCredentials] = useState<PlatformCredential[]>([]);
  const [currentStatusView, setCurrentStatusView] = useState<OfferStatus | 'all'>('publicado');
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [isCredsModalOpen, setIsCredsModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Load initial deals and credentials
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const loadedDeals = await getDeals({ status: 'all' });
    setDeals(loadedDeals);
    const loadedCreds = await getCredentials();
    setCredentials(loadedCreds);
  };

  const handleToggleStatus = async (id: string, newStatus: OfferStatus) => {
    const success = await toggleOfferStatus(id, newStatus);
    if (success) {
      setDeals(prev =>
        prev.map(d => (d.id === id ? { ...d, status: newStatus, updatedAt: new Date().toISOString() } : d))
      );
      setNotification(`Oferta alterada para "${newStatus === 'publicado' ? 'Publicado' : 'Rascunho'}" com sucesso!`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleSaveCredential = async (cred: PlatformCredential) => {
    await saveCredential(cred);
    setCredentials(prev => {
      const idx = prev.findIndex(c => c.platform === cred.platform);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = cred;
        return next;
      }
      return [...prev, cred];
    });
    setNotification(`Credencial da plataforma ${cred.displayName} atualizada!`);
    setTimeout(() => setNotification(null), 3000);
  };

  const draftsCount = deals.filter(d => d.status === 'rascunho').length;
  const publishedCount = deals.filter(d => d.status === 'publicado').length;

  return (
    <div className="min-h-screen bg-[#121214] text-slate-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl bg-zinc-900 border border-purple-500/50 shadow-2xl text-xs sm:text-sm text-purple-200 flex items-center gap-2 animate-in slide-in-from-bottom duration-300">
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
          <span>{notification}</span>
        </div>
      )}

      {/* Top Bar Navigation */}
      <Navbar
        currentStatusView={currentStatusView}
        onStatusChange={setCurrentStatusView}
        draftsCount={draftsCount}
        publishedCount={publishedCount}
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
        onOpenCredsModal={() => setIsCredsModalOpen(true)}
      />

      {/* Public Showcase Main View */}
      <PublicShowcase
        deals={deals}
        currentStatusView={currentStatusView}
        onToggleStatus={handleToggleStatus}
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
      />

      {/* Footer */}
      <Footer
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
        onOpenCredsModal={() => setIsCredsModalOpen(true)}
      />

      {/* Supabase SQL Schema Modal */}
      <SqlSchemaModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />

      {/* API Credentials Manager Modal */}
      <ApiCredentialsModal
        isOpen={isCredsModalOpen}
        onClose={() => setIsCredsModalOpen(false)}
        credentials={credentials}
        onSaveCredential={handleSaveCredential}
      />

    </div>
  );
}
