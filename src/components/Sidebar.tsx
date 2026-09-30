import React from 'react';
import { 
  LayoutDashboard, 
  Landmark, 
  Receipt, 
  Target, 
  BarChart3, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Sparkles,
  Download,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { AppState } from '../types';
import { exportStateAsJson } from '../services/storage';

export type NavigationTab = 'budget' | 'accounts' | 'transactions' | 'plans' | 'analytics';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  state: AppState;
  onResetData: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  state,
  onResetData,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const activePlan = state.budgetPlans?.find((p) => p.id === state.activePlanId) || state.budgetPlans?.[0];

  const navItems = [
    {
      id: 'budget' as NavigationTab,
      label: 'Presupuesto',
      subtitle: 'Asignación mensual & YNAB',
      icon: LayoutDashboard,
      badge: `${state.categories.length} cat.`,
    },
    {
      id: 'accounts' as NavigationTab,
      label: 'Cuentas',
      subtitle: 'Saldos y patrimonio',
      icon: Landmark,
      badge: `${state.accounts.length}`,
    },
    {
      id: 'transactions' as NavigationTab,
      label: 'Movimientos',
      subtitle: 'Ingresos, gastos y envíos',
      icon: Receipt,
      badge: `${state.transactions.length}`,
    },
    {
      id: 'plans' as NavigationTab,
      label: 'Planes de Presupuesto',
      subtitle: 'Metas y plantillas YNAB',
      icon: Target,
      badge: state.budgetPlans ? `${state.budgetPlans.length}` : '0',
      highlight: true,
    },
    {
      id: 'analytics' as NavigationTab,
      label: 'Reportes & Gráficos',
      subtitle: 'Desglose y analítica visual',
      icon: BarChart3,
    },
  ];

  const handleItemClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 text-slate-200 select-none">
      {/* Top Header / Branding */}
      <div>
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <Sparkles className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5 truncate">
                  MiBilletera <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">YNAB</span>
                </span>
                <span className="text-[11px] text-slate-400 truncate">Finanzas Conscientes</span>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop Collapse toggle button */}
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title={isCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 relative ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/25'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div
                  className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                    isActive
                      ? 'bg-slate-950/20 text-slate-950'
                      : 'bg-slate-800/60 text-emerald-400 group-hover:bg-slate-800 group-hover:text-emerald-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold truncate leading-tight">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                            isActive
                              ? 'bg-slate-950/30 text-slate-950'
                              : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-[10px] truncate ${
                        isActive ? 'text-slate-900/80' : 'text-slate-500'
                      }`}
                    >
                      {item.subtitle}
                    </p>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Summary & Actions */}
      <div className="p-3 border-t border-slate-800/80 space-y-3">
        {/* Active Plan Widget (when expanded) */}
        {!isCollapsed && activePlan && (
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Plan Activo
              </span>
              <button
                onClick={() => handleItemClick('plans')}
                className="text-[10px] text-slate-400 hover:text-emerald-400 hover:underline"
              >
                Cambiar
              </button>
            </div>
            <p className="text-xs font-semibold text-white truncate">{activePlan.name}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Meta Ingreso: ${activePlan.targetMonthlyIncome.toLocaleString()}
            </p>
          </div>
        )}

        {/* Quick Utilities */}
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => exportStateAsJson(state)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-700/50 transition-colors"
            title="Exportar copia de seguridad en JSON"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            {!isCollapsed && <span className="truncate">Exportar Respaldo</span>}
          </button>

          <button
            onClick={onResetData}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800/40 hover:bg-rose-950/30 text-slate-400 hover:text-rose-300 text-xs font-medium border border-transparent hover:border-rose-800/50 transition-colors"
            title="Restablecer datos demo"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            {!isCollapsed && <span className="truncate">Restablecer Demo</span>}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block shrink-0 transition-all duration-300 ease-in-out sticky top-0 h-screen z-30 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="md:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 w-72 z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
