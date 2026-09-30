import React, { useState } from 'react';
import { Wallet, Globe, Download, Upload, SlidersHorizontal, RefreshCcw, Menu } from 'lucide-react';
import { AppState } from '../types';
import { exportStateAsJson } from '../services/storage';

interface HeaderProps {
  state: AppState;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
  onOpenMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ state, onUpdateState, onOpenMobileSidebar }) => {
  const [showRatesModal, setShowRatesModal] = useState(false);
  const [ratesForm, setRatesForm] = useState(state.currencyConfig.rates);

  const handleCurrencyChange = (curr: string) => {
    onUpdateState(prev => ({
      ...prev,
      currencyConfig: {
        ...prev.currencyConfig,
        selectedCurrency: curr,
      },
    }));
  };

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateState(prev => ({
      ...prev,
      currencyConfig: {
        ...prev.currencyConfig,
        rates: ratesForm,
      },
    }));
    setShowRatesModal(false);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.accounts && parsed.categories) {
          onUpdateState(() => parsed);
          alert('¡Datos importados con éxito!');
        } else {
          alert('El archivo no tiene el formato válido de respaldo de MiBilletera.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <>
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Mobile Menu Toggle & Brand */}
        <div className="flex items-center gap-3">
          {onOpenMobileSidebar && (
            <button
              onClick={onOpenMobileSidebar}
              className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              title="Abrir menú"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base text-white tracking-tight">MiBilletera</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                SDD YNAB
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Presupuesto Inteligente & Billetera Personal</p>
          </div>
        </div>

        {/* Currency & Actions */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Currency Selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1">
            <div className="flex items-center gap-1.5 px-2 text-xs text-slate-400">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline font-medium">Moneda:</span>
            </div>
            {Object.keys(state.currencyConfig.rates).map((curr) => {
              const isSelected = state.currencyConfig.selectedCurrency === curr;
              return (
                <button
                  key={curr}
                  onClick={() => handleCurrencyChange(curr)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {curr}
                </button>
              );
            })}
            <button
              onClick={() => {
                setRatesForm(state.currencyConfig.rates);
                setShowRatesModal(true);
              }}
              title="Ajustar tasas de cambio"
              className="p-1 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors ml-0.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Backup & Restore */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => exportStateAsJson(state)}
              title="Exportar respaldo JSON"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline">Exportar</span>
            </button>

            <label
              title="Importar respaldo JSON"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Importar</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
          </div>
        </div>
      </header>

      {/* Modal de Tasas de Cambio */}
      {showRatesModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <RefreshCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Tasas de Cambio de Monedas</h3>
                  <p className="text-xs text-slate-400">Base de conversión relativa a 1 USD ($)</p>
                </div>
              </div>
              <button
                onClick={() => setShowRatesModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRates} className="space-y-4">
              <div className="space-y-3">
                {Object.entries(ratesForm).map(([curr, rate]) => (
                  <div key={curr} className="flex items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-sm font-bold text-slate-200">{curr}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">1 USD =</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0.0001"
                        disabled={curr === 'USD'}
                        value={rate}
                        onChange={(e) =>
                          setRatesForm({ ...ratesForm, [curr]: parseFloat(e.target.value) || 0 })
                        }
                        className="w-28 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm text-right text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRatesModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20"
                >
                  Guardar Tasas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
