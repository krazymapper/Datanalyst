import React, { useState, useEffect } from 'react';
import { 
  History, 
  ArrowRightLeft, 
  Check, 
  Bookmark, 
  Trash2, 
  Clock, 
  Calendar, 
  Thermometer, 
  Droplets, 
  Layers,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import type { CMIP6ClimateConfig, RecentClimateConfig, CMIP6ScenarioId } from '../types';
import { CMIP6_SCENARIOS, CMIP6_MODELS, CMIP6_VARIABLES, CMIP6_RESOLUTIONS, buildMetadataIdentifier } from './ClimateSetupSection';
import { useLanguage } from '../translations';

const STORAGE_KEY = 'echo_radio_recent_climate_configs';
const EVENT_NAME = 'recent-climate-configs-updated';

export const DEFAULT_RECENT_CONFIGS: RecentClimateConfig[] = [
  {
    id: 'recent-ssp245-canesm5',
    scenario: 'ssp245',
    scenarioName: 'SSP2-4.5 (Middle of the Road)',
    model: 'CanESM5',
    modelName: 'CanESM5 (CCCma, Canada)',
    variable: 'bioc',
    variableLabel: '19 Bioclimatic Variables (BIO1-BIO19)',
    period: '2041-2060',
    resolution: '2.5m',
    datasetVersion: 'WorldClim v2.1',
    metadataIdentifier: 'wc2.1_2.5m_bioc_CanESM5_ssp245_2041-2060',
    runAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    label: 'Mid-Century Baseline (Moderate Policy)',
  },
  {
    id: 'recent-ssp585-gfdl',
    scenario: 'ssp585',
    scenarioName: 'SSP5-8.5 (Fossil-fueled Development)',
    model: 'GFDL-ESM4',
    modelName: 'GFDL-ESM4 (NOAA-GFDL, USA)',
    variable: 'tmax',
    variableLabel: 'Max Temperature (tmax)',
    period: '2081-2100',
    resolution: '2.5m',
    datasetVersion: 'WorldClim v2.1',
    metadataIdentifier: 'wc2.1_2.5m_tmax_GFDL-ESM4_ssp585_2081-2100',
    runAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    label: 'End-Century Thermal Extremes Stress Test',
  },
  {
    id: 'recent-ssp126-ukesm1',
    scenario: 'ssp126',
    scenarioName: 'SSP1-2.6 (Sustainability)',
    model: 'UKESM1-0-LL',
    modelName: 'UKESM1-0-LL (Met Office, UK)',
    variable: 'prec',
    variableLabel: 'Precipitation (prec)',
    period: '2041-2060',
    resolution: '30s',
    datasetVersion: 'WorldClim v2.1',
    metadataIdentifier: 'wc2.1_30s_prec_UKESM1-0-LL_ssp126_2041-2060',
    runAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    label: 'Paris Agreement 1.5°C Hydrological Resilience',
  },
  {
    id: 'recent-ssp370-cnrm',
    scenario: 'ssp370',
    scenarioName: 'SSP3-7.0 (Regional Rivalry)',
    model: 'CNRM-CM6-1',
    modelName: 'CNRM-CM6-1 (Météo-France, France)',
    variable: 'bioc',
    variableLabel: '19 Bioclimatic Variables (BIO1-BIO19)',
    period: '2061-2080',
    resolution: '5m',
    datasetVersion: 'WorldClim v2.1',
    metadataIdentifier: 'wc2.1_5m_bioc_CNRM-CM6-1_ssp370_2061-2080',
    runAt: new Date(Date.now() - 1000 * 60 * 1300).toISOString(),
    label: 'Regional Rivalry & Food Security Shift',
  },
];

export function getStoredRecentConfigs(): RecentClimateConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // Premier passage : aucun historique (l'ancienne version affichait 4 faux
    // historiques « il y a 1 h, 4 h, 21 h »).
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to load recent climate configs from localStorage:', err);
  }
  return [];
}

export function saveRecentClimateConfig(
  config: CMIP6ClimateConfig, 
  customLabel?: string
): void {
  try {
    const current = getStoredRecentConfigs();
    
    // Check if matching combination already exists
    const existingIndex = current.findIndex(
      (c) =>
        c.scenario === config.scenario &&
        c.model === config.model &&
        c.variable === config.variable &&
        c.period === config.period &&
        c.resolution === config.resolution
    );

    const sc = CMIP6_SCENARIOS.find((s) => s.id === config.scenario);
    const md = CMIP6_MODELS.find((m) => m.id === config.model);
    const vr = CMIP6_VARIABLES.find((v) => v.id === config.variable);

    const newItem: RecentClimateConfig = {
      id: existingIndex >= 0 ? current[existingIndex].id : `recent-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      scenario: config.scenario,
      scenarioName: config.scenarioName || (sc ? `${sc.code} (${sc.name})` : config.scenario),
      model: config.model,
      modelName: config.modelName || (md ? `${md.name} (${md.institution})` : config.model),
      variable: config.variable,
      variableLabel: config.variableLabel || vr?.label || config.variable,
      period: config.period,
      resolution: config.resolution,
      datasetVersion: config.datasetVersion || 'WorldClim v2.1',
      metadataIdentifier: config.metadataIdentifier || buildMetadataIdentifier(
        config.resolution,
        config.variable,
        config.model,
        config.scenario,
        config.period
      ),
      runAt: new Date().toISOString(),
      label: customLabel || (existingIndex >= 0 ? current[existingIndex].label : undefined),
    };

    let updated: RecentClimateConfig[];
    if (existingIndex >= 0) {
      // Move existing to top
      updated = [newItem, ...current.filter((_, idx) => idx !== existingIndex)];
    } else {
      updated = [newItem, ...current];
    }

    // Keep up to 8 recent combinations
    updated = updated.slice(0, 8);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch (err) {
    console.error('Failed to save recent climate configuration:', err);
  }
}

function formatRelativeTime(isoString: string): string {
  try {
    const time = new Date(isoString).getTime();
    if (isNaN(time)) return 'Recently';
    const diff = Math.max(0, Date.now() - time);
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return new Date(time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
}

interface RecentlyUsedConfigsProps {
  currentConfig: CMIP6ClimateConfig;
  onSelectConfig: (config: CMIP6ClimateConfig) => void;
  disabled?: boolean;
}

export const RecentlyUsedConfigs: React.FC<RecentlyUsedConfigsProps> = ({
  currentConfig,
  onSelectConfig,
  disabled = false,
}) => {
  const { t, language } = useLanguage();
  const [recentConfigs, setRecentConfigs] = useState<RecentClimateConfig[]>(getStoredRecentConfigs);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setRecentConfigs(getStoredRecentConfigs());
    };
    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleSwap = (item: RecentClimateConfig) => {
    if (disabled) return;

    const sc = CMIP6_SCENARIOS.find((s) => s.id === item.scenario);
    const md = CMIP6_MODELS.find((m) => m.id === item.model);
    const vr = CMIP6_VARIABLES.find((v) => v.id === item.variable);

    const swapped: CMIP6ClimateConfig = {
      enabled: true,
      scenario: item.scenario,
      scenarioName: item.scenarioName || (sc ? `${sc.code} (${sc.name})` : item.scenario),
      model: item.model,
      modelName: item.modelName || (md ? `${md.name} (${md.institution})` : item.model),
      variable: item.variable,
      variableLabel: item.variableLabel || vr?.label || item.variable,
      period: item.period,
      resolution: item.resolution,
      datasetVersion: item.datasetVersion || 'WorldClim v2.1',
      metadataIdentifier: item.metadataIdentifier || buildMetadataIdentifier(
        item.resolution,
        item.variable,
        item.model,
        item.scenario,
        item.period
      ),
      notes: `Swapped from recently used configuration (${item.scenarioName} • ${item.modelName}).`,
    };

    onSelectConfig(swapped);
    setFeedbackMsg(language === 'fr' ? `Basculé vers ${sc?.code || item.scenario}` : `Swapped to ${sc?.code || item.scenario} / ${md?.name || item.model}`);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleSaveCurrent = () => {
    saveRecentClimateConfig(currentConfig, `Custom Saved (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`);
    setRecentConfigs(getStoredRecentConfigs());
    setFeedbackMsg(language === 'fr' ? 'Configuration enregistrée' : 'Saved current configuration to recents');
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentConfigs.filter((c) => c.id !== id);
    setRecentConfigs(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(EVENT_NAME));
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetDefaults = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_RECENT_CONFIGS));
    setRecentConfigs(DEFAULT_RECENT_CONFIGS);
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
    setFeedbackMsg(language === 'fr' ? 'Configurations par défaut restaurées' : 'Restored default scenario combinations');
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const isCurrentActive = (item: RecentClimateConfig) => {
    return (
      currentConfig.scenario === item.scenario &&
      currentConfig.model === item.model &&
      currentConfig.variable === item.variable &&
      currentConfig.period === item.period &&
      currentConfig.resolution === item.resolution
    );
  };

  return (
    <div 
      id="recently-used-climate-configs" 
      className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 space-y-3 transition-all"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200/70 pb-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="p-1 rounded-md bg-blue-100/70 text-io-blue">
            <History className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                {t.climateRecentConfigsTitle}
              </h3>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white border border-neutral-200 text-neutral-600">
                {recentConfigs.length} {language === 'fr' ? (recentConfigs.length === 1 ? 'combinaison' : 'combinaisons') : (recentConfigs.length === 1 ? 'combination' : 'combinations')}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500">
              {t.climateRecentConfigsSubtitle}
            </p>
          </div>
        </div>

        {/* Action Controls (Save Current / Restore Defaults) */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          {feedbackMsg && (
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 animate-fade-in flex items-center gap-1">
              <Check className="h-3 w-3" />
              {feedbackMsg}
            </span>
          )}

          <button
            type="button"
            onClick={handleSaveCurrent}
            disabled={disabled}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100 hover:text-neutral-900 transition shadow-xs cursor-pointer disabled:opacity-50"
            title="Snapshot current configuration into recently used list"
          >
            <Bookmark className="h-3 w-3 text-io-blue" />
            <span>{t.climateRecentSaveBtn}</span>
          </button>
        </div>
      </div>

      {/* Configurations List */}
      {recentConfigs.length === 0 ? (
        <div className="p-4 rounded-lg bg-white border border-dashed border-neutral-300 text-center space-y-2">
          <p className="text-xs text-neutral-500">{t.climateRecentEmpty}</p>
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-io-blue text-white hover:bg-blue-600 transition cursor-pointer shadow-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{t.climateRecentRestoreDefaults}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {recentConfigs.map((item) => {
            const active = isCurrentActive(item);
            const sc = CMIP6_SCENARIOS.find((s) => s.id === item.scenario);
            const md = CMIP6_MODELS.find((m) => m.id === item.model);
            const vr = CMIP6_VARIABLES.find((v) => v.id === item.variable);
            const res = CMIP6_RESOLUTIONS.find((r) => r.id === item.resolution);

            const badgeColor = 
              item.scenario === 'ssp126' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
              item.scenario === 'ssp245' ? 'bg-blue-100 text-blue-800 border-blue-200' :
              item.scenario === 'ssp370' ? 'bg-amber-100 text-amber-800 border-amber-200' :
              'bg-rose-100 text-rose-800 border-rose-200';

            const activeCardClasses = active
              ? 'border-blue-500 bg-white ring-2 ring-blue-500/20 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-xs';

            return (
              <div
                key={item.id}
                onClick={() => !active && handleSwap(item)}
                className={`relative p-3 rounded-xl border transition-all text-left group flex flex-col justify-between ${activeCardClasses} ${
                  active ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                {/* Top Row: Scenario Badge, Relative Time, and Status */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${badgeColor}`}>
                        {sc?.code || item.scenario.toUpperCase()}
                      </span>

                      {active ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          <Check className="h-2.5 w-2.5" />
                          {t.climateRecentActiveBadge}
                        </span>
                      ) : (
                        <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {formatRelativeTime(item.runAt)}
                        </span>
                      )}
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteItem(item.id, e)}
                      className="text-neutral-400 hover:text-rose-600 p-1 rounded hover:bg-neutral-100 transition opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Remove this configuration from recents"
                      aria-label="Remove from recents"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Main Combo Headline: Scenario & Model */}
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-neutral-900 truncate">
                        {md?.name || item.model}
                        <span className="font-normal text-neutral-500 text-[11px] ml-1.5">
                          ({md?.country || 'GCM'})
                        </span>
                      </div>
                      {item.label && (
                        <p className="text-[10px] text-neutral-500 truncate italic">
                          {item.label}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Parameter Tags: Variable, Period, Resolution */}
                  <div className="mt-2 flex flex-wrap items-center gap-1 text-[10px] text-neutral-600">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700 font-medium">
                      {item.variable === 'prec' ? (
                        <Droplets className="h-3 w-3 text-blue-500" />
                      ) : (
                        <Thermometer className="h-3 w-3 text-amber-500" />
                      )}
                      {vr?.label?.split('(')[0]?.trim() || item.variable}
                    </span>

                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700">
                      <Calendar className="h-3 w-3 text-neutral-400" />
                      {item.period}
                    </span>

                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 font-mono">
                      <Layers className="h-3 w-3 text-neutral-400" />
                      {item.resolution}
                    </span>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-neutral-400 truncate max-w-[180px]">
                    {item.metadataIdentifier}
                  </span>

                  {active ? (
                    <span className="text-[11px] font-medium text-io-blue flex items-center gap-1">
                      {language === 'fr' ? 'Actuellement chargé' : 'Currently loaded'}
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSwap(item);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-io-blue hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      <ArrowRightLeft className="h-3 w-3" />
                      <span>{language === 'fr' ? 'Basculer' : 'Swap to this'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
