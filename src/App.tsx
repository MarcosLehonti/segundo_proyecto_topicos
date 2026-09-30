import { useState, useEffect } from 'react';
import { loadState, saveState, INITIAL_STATE } from './services/storage';
import { AppState } from './types';
import { Header } from './components/Header';
import { Sidebar, NavigationTab } from './components/Sidebar';
import { NetWorthCard } from './components/NetWorthCard';
import { AccountsList } from './components/AccountsList';
import { BudgetTable } from './components/BudgetTable';
import { TransactionsHistory } from './components/TransactionsHistory';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { BudgetPlansView } from './components/BudgetPlansView';
import { recalculateAccountBalances } from './utils/balance';

export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [activeTab, setActiveTab] = useState<NavigationTab>('budget');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Recalcular saldos de cuentas de manera determinista ante cambios en transacciones
  const derivedAccounts = recalculateAccountBalances(
    state.accounts,
    state.transactions,
    state.currencyConfig
  );

  const effectiveState: AppState = {
    ...state,
    accounts: derivedAccounts,
  };

  useEffect(() => {
    saveState(effectiveState);
  }, [state]);

  const handleResetData = () => {
    if (confirm('¿Deseas restablecer todos los datos a la configuración de demostración inicial?')) {
      setState(INITIAL_STATE);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased selection:bg-emerald-500 selection:text-slate-950">
      {/* Barra Lateral de Navegación (Sidebar) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        state={effectiveState}
        onResetData={handleResetData}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Contenedor Principal / Contenido */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Barra superior y selector de moneda con soporte para abrir menú móvil */}
        <Header
          state={effectiveState}
          onUpdateState={setState}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Tarjetas Superiores de Métricas Financieras */}
          <NetWorthCard state={effectiveState} />

          {/* Contenido según la pestaña activa del Sidebar */}
          <div className="space-y-6 animate-in fade-in duration-150">
            {activeTab === 'budget' && (
              <>
                {/* Listado de Cuentas */}
                <AccountsList state={effectiveState} onUpdateState={setState} />

                {/* Tabla de Presupuesto por Categorías */}
                <BudgetTable state={effectiveState} onUpdateState={setState} />
              </>
            )}

            {activeTab === 'accounts' && (
              <div className="space-y-6">
                <AccountsList state={effectiveState} onUpdateState={setState} />
              </div>
            )}

            {activeTab === 'transactions' && (
              <TransactionsHistory state={effectiveState} onUpdateState={setState} />
            )}

            {activeTab === 'plans' && (
              <BudgetPlansView
                state={effectiveState}
                onUpdateState={setState}
                onNavigateToBudget={() => setActiveTab('budget')}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsCharts state={effectiveState} />
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-900/30 py-6 px-4 text-center text-xs text-slate-500 space-y-1 mt-auto">
          <p className="font-medium text-slate-400">
            MiBilletera Inteligente • Proyecto de Finanzas Personales (Estilo YNAB)
          </p>
          <p className="text-[11px] text-slate-600">
            Desarrollado bajo metodología <span className="text-emerald-500/80 font-semibold">Spec-Driven Development (SDD)</span> con OpenSpec
          </p>
        </footer>
      </div>
    </div>
  );
}

