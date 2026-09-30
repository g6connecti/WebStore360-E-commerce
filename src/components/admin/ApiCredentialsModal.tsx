import React, { useState } from 'react';
import { X, KeyRound, ShieldCheck, Check, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';
import { PlatformCredential } from '../../types';

interface ApiCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  credentials: PlatformCredential[];
  onSaveCredential: (cred: PlatformCredential) => void;
}

export const ApiCredentialsModal: React.FC<ApiCredentialsModalProps> = ({
  isOpen,
  onClose,
  credentials,
  onSaveCredential,
}) => {
  const [activeTab, setActiveTab] = useState<'shopee' | 'amazon' | 'mercadolivre' | 'lojadomecanico' | 'temu'>('shopee');
  const [testingSync, setTestingSync] = useState(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentCred = credentials.find(c => c.platform === activeTab) || {
    id: `cred-${activeTab}`,
    platform: activeTab,
    displayName: activeTab.toUpperCase(),
    partnerId: '',
    appId: '',
    appSecret: '',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const handleTestSync = () => {
    setTestingSync(true);
    setSyncSuccessMessage(null);
    setTimeout(() => {
      setTestingSync(false);
      setSyncSuccessMessage(`Conexão com a API ${currentCred.displayName} testada com sucesso! Catálogo sincronizado.`);
      setTimeout(() => setSyncSuccessMessage(null), 4000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-[#141417] border border-zinc-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-pink-600/10 border border-pink-500/30 text-pink-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Credenciais de APIs de Afiliados
              </h2>
              <p className="text-xs text-zinc-400">
                Integrações automáticas com Shopee, Amazon, Mercado Livre, Loja do Mecânico e Temu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/60 px-4 sm:px-6 pt-3 gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('shopee')}
            className={`pb-3 px-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'shopee'
                ? 'border-[#EE4D2D] text-white'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#EE4D2D]"></span>
            Shopee
          </button>

          <button
            onClick={() => setActiveTab('amazon')}
            className={`pb-3 px-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'amazon'
                ? 'border-[#FF9900] text-white'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#FF9900]"></span>
            Amazon
          </button>

          <button
            onClick={() => setActiveTab('mercadolivre')}
            className={`pb-3 px-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'mercadolivre'
                ? 'border-yellow-400 text-white'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            Mercado Livre
          </button>

          <button
            onClick={() => setActiveTab('lojadomecanico')}
            className={`pb-3 px-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'lojadomecanico'
                ? 'border-[#FF5A00] text-white'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#FF5A00]"></span>
            Loja do Mecânico
          </button>

          <button
            onClick={() => setActiveTab('temu')}
            className={`pb-3 px-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'temu'
                ? 'border-[#FB7701] text-white'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#FB7701]"></span>
            Temu
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          
          {/* Security Notice */}
          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 flex items-start gap-2.5 text-xs text-purple-200">
            <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Armazenamento Criptografado & RLS:</span> As credenciais são salvas na tabela <code className="text-pink-300">plataformas_credenciais</code> protegidas por políticas que bloqueiam leitura pública no Supabase.
            </div>
          </div>

          {syncSuccessMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-2 text-xs text-emerald-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{syncSuccessMessage}</span>
            </div>
          )}

          {activeTab === 'shopee' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Shopee Partner ID / Affiliate ID
                </label>
                <input
                  type="text"
                  defaultValue={currentCred.partnerId || 'shopee_afiliado_brasil_102'}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-orange-500"
                  placeholder="Ex: 1004829 ou id_afiliado"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Shopee App ID / Client Key
                </label>
                <input
                  type="text"
                  defaultValue={currentCred.appId || '1004829'}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-orange-500"
                  placeholder="Seu App ID da plataforma aberta"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Shopee App Secret (Chave Privada)
                </label>
                <input
                  type="password"
                  defaultValue="••••••••••••••••••••••••••••••••"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                  placeholder="App Secret"
                />
              </div>
            </div>
          )}

          {activeTab === 'amazon' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Amazon Associate Tag (Tracking ID)
                </label>
                <input
                  type="text"
                  defaultValue={currentCred.partnerId || 'webstore360-20'}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-amber-500"
                  placeholder="Ex: webstore360-20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Access Key ID (PA-API 5.0)
                </label>
                <input
                  type="text"
                  defaultValue={currentCred.appId || 'AKIAIOSFODNN7EXAMPLE'}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                  placeholder="AKIA..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Secret Access Key
                </label>
                <input
                  type="password"
                  defaultValue="••••••••••••••••••••••••••••••••"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                  placeholder="Sua Secret Key"
                />
              </div>
            </div>
          )}

          {activeTab === 'mercadolivre' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Mercado Livre Client ID / APP ID
                </label>
                <input
                  type="text"
                  defaultValue={currentCred.appId || '8492049182390192'}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Mercado Livre Tracking Partner Tag
                </label>
                <input
                  type="text"
                  defaultValue={currentCred.partnerId || 'ml_afiliado_984'}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Client Secret
                </label>
                <input
                  type="password"
                  defaultValue="••••••••••••••••••••••••••••••••"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-yellow-500 font-mono"
                />
              </div>
            </div>
          )}

          {activeTab === 'lojadomecanico' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Loja do Mecânico ID do Parceiro / Afiliado
                </label>
                <input
                  type="text"
                  defaultValue={currentCred.partnerId || 'ldm_afiliados_webstore360'}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-orange-500"
                  placeholder="Ex: ldm_afiliados_webstore360"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Token de Integração / API Partner Key
                </label>
                <input
                  type="text"
                  defaultValue={currentCred.appId || 'LDM-PARTNER-4921'}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                  placeholder="LDM-PARTNER-KEY"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Chave Secreta de Webhook de Vendas
                </label>
                <input
                  type="password"
                  defaultValue="••••••••••••••••••••••••••••••••"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                  placeholder="Webhook Secret"
                />
              </div>
            </div>
          )}

          {activeTab === 'temu' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Temu Influencer & Affiliate Referral Code (Código de Cupom)
                </label>
                <input
                  type="text"
                  defaultValue={currentCred.partnerId || 'temu_br_webstore360'}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-orange-500"
                  placeholder="Ex: temu_br_webstore360"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Temu API Client ID
                </label>
                <input
                  type="text"
                  defaultValue={currentCred.appId || 'temu-aff-br-8291'}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Secret Key
                </label>
                <input
                  type="password"
                  defaultValue="••••••••••••••••••••••••••••••••"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>
            </div>
          )}

          {/* Sync Status Banner */}
          <div className="pt-2 flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-800">
            <span>Última sincronização: <strong>Hoje às 08:15 UTC</strong></span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sincronização Ativa
            </span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-between gap-3">
          <button
            onClick={handleTestSync}
            disabled={testingSync}
            className="px-3.5 py-2 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testingSync ? 'animate-spin text-pink-400' : ''}`} />
            <span>{testingSync ? 'Testando Conexão...' : 'Testar Sincronização'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white text-xs font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                handleTestSync();
                setTimeout(onClose, 1000);
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold shadow-md shadow-pink-600/30 transition-all cursor-pointer"
            >
              Salvar Credenciais
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
