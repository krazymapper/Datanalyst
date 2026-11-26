import React, { useState, useRef, useEffect } from 'react';
import { 
  Globe, 
  Thermometer, 
  Layers, 
  Sparkles, 
  Check, 
  Copy, 
  Info, 
  Calendar, 
  Compass, 
  Droplets,
  Sliders,
  ChevronDown,
  ChevronUp,
  Leaf,
  Scale,
  Flame,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import type { CMIP6ClimateConfig, CMIP6Scenario, CMIP6Model, CMIP6ScenarioId } from '../types';
import { ClimateMapPreview } from './ClimateMapPreview';
import { ClimateLegend } from './ClimateLegend';
import { RecentlyUsedConfigs, saveRecentClimateConfig } from './RecentlyUsedConfigs';
import { useLanguage } from '../translations';

export { saveRecentClimateConfig };

export const CMIP6_SCENARIOS: CMIP6Scenario[] = [
  {
    id: 'ssp126',
    code: 'SSP1-2.6',
    name: 'Sustainability',
    description: 'Low GHG emissions, stringent mitigation, and Paris Agreement targets (+1.5°C to 1.8°C by 2100).',
    forcing: '2.6 W/m²',
    tempRise2100: '+1.5°C – 1.8°C',
    color: 'emerald',
  },
  {
    id: 'ssp245',
    code: 'SSP2-4.5',
    name: 'Middle of the Road',
    description: 'Intermediate emissions; socioeconomic trends follow historical patterns (+2.7°C by 2100).',
    forcing: '4.5 W/m²',
    tempRise2100: '+2.7°C',
    color: 'blue',
  },
  {
    id: 'ssp370',
    code: 'SSP3-7.0',
    name: 'Regional Rivalry',
    description: 'Medium-to-high emissions with regional conflicts, slow technological progress (+3.6°C by 2100).',
    forcing: '7.0 W/m²',
    tempRise2100: '+3.6°C',
    color: 'amber',
  },
  {
    id: 'ssp585',
    code: 'SSP5-8.5',
    name: 'Fossil-fueled Development',
    description: 'High emissions, rapid energy-intensive growth, unconstrained fossil fuel usage (+4.4°C by 2100).',
    forcing: '8.5 W/m²',
    tempRise2100: '+4.4°C',
    color: 'rose',
  },
];

export const CMIP6_MODELS: CMIP6Model[] = [
  {
    id: 'CanESM5',
    name: 'CanESM5',
    institution: 'Canadian Centre for Climate Modelling and Analysis',
    country: 'Canada',
    characteristics: 'High climate sensitivity, dynamic ocean and terrestrial carbon cycle.',
    sensitivity: 'High (ECS 5.6°C)',
  },
  {
    id: 'GFDL-ESM4',
    name: 'GFDL-ESM4',
    institution: 'NOAA Geophysical Fluid Dynamics Laboratory',
    country: 'USA',
    characteristics: 'Comprehensive Earth System model with interactive aerosol chemistry.',
    sensitivity: 'Moderate (ECS 2.7°C)',
  },
  {
    id: 'CNRM-CM6-1',
    name: 'CNRM-CM6-1',
    institution: 'CNRM-CERFACS (Météo-France)',
    country: 'France',
    characteristics: 'Atmospheric circulation and European extreme weather fidelity.',
    sensitivity: 'Intermediate (ECS 4.9°C)',
  },
  {
    id: 'CNRM-ESM2-1',
    name: 'CNRM-ESM2-1',
    institution: 'CNRM-CERFACS Earth System Model',
    country: 'France',
    characteristics: 'Full biogeochemical cycles, ocean dynamics, and carbon feedbacks.',
    sensitivity: 'Intermediate (ECS 4.8°C)',
  },
  {
    id: 'IPSL-CM6A-LR',
    name: 'IPSL-CM6A-LR',
    institution: 'Institut Pierre-Simon Laplace',
    country: 'France',
    characteristics: 'Detailed polar amplification and ocean-ice coupling.',
    sensitivity: 'Intermediate (ECS 4.8°C)',
  },
  {
    id: 'MIROC6',
    name: 'MIROC6',
    institution: 'Atmosphere and Ocean Research Institute (Univ. of Tokyo)',
    country: 'Japan',
    characteristics: 'Refined troposphere-stratosphere coupling and Asian monsoon mechanics.',
    sensitivity: 'Moderate (ECS 2.6°C)',
  },
  {
    id: 'MIROC-ES2L',
    name: 'MIROC-ES2L',
    institution: 'MIROC Earth System Model Team',
    country: 'Japan',
    characteristics: 'Land-ecosystem dynamics and detailed marine nitrogen cycle.',
    sensitivity: 'Moderate (ECS 2.7°C)',
  },
  {
    id: 'MRI-ESM2-0',
    name: 'MRI-ESM2-0',
    institution: 'Meteorological Research Institute',
    country: 'Japan',
    characteristics: 'Ozone layer chemistry, aerosol radiation effects, and typhoons.',
    sensitivity: 'Moderate (ECS 3.2°C)',
  },
  {
    id: 'UKESM1-0-LL',
    name: 'UKESM1-0-LL',
    institution: 'Met Office Hadley Centre / NERC',
    country: 'United Kingdom',
    characteristics: 'High-order Earth system feedbacks and cloud microphysics.',
    sensitivity: 'High (ECS 5.4°C)',
  },
  {
    id: 'BCC-CSM2-MR',
    name: 'BCC-CSM2-MR',
    institution: 'Beijing Climate Center',
    country: 'China',
    characteristics: 'Medium resolution with strong performance in East Asian climate dynamics.',
    sensitivity: 'Moderate (ECS 3.0°C)',
  },
  {
    id: 'MPI-ESM1-2-HR',
    name: 'MPI-ESM1-2-HR',
    institution: 'Max Planck Institute for Meteorology',
    country: 'Germany',
    characteristics: 'High-resolution ocean eddies and mid-latitude weather variability.',
    sensitivity: 'Moderate (ECS 3.0°C)',
  },
  {
    id: 'EC-Earth3-Veg',
    name: 'EC-Earth3-Veg',
    institution: 'EC-Earth Consortium',
    country: 'Europe',
    characteristics: 'Dynamic vegetation and interactive land surface processes.',
    sensitivity: 'Intermediate (ECS 4.3°C)',
  },
];

export const CMIP6_PERIODS = [
  { id: '2021-2040', label: '2021–2040', tag: 'Near-term' },
  { id: '2041-2060', label: '2041–2060', tag: 'Mid-century' },
  { id: '2061-2080', label: '2061–2080', tag: 'Late-century' },
  { id: '2081-2100', label: '2081–2100', tag: 'End-of-century' },
];

export const CMIP6_RESOLUTIONS = [
  { id: '2.5m', label: '2.5 minutes', area: '~21 km²', desc: 'Landscape scale (Standard)' },
  { id: '30s', label: '30 seconds', area: '~1 km²', desc: 'High resolution' },
  { id: '5m', label: '5 minutes', area: '~85 km²', desc: 'Regional scale' },
  { id: '10m', label: '10 minutes', area: '~340 km²', desc: 'Continental scale' },
];

export const CMIP6_VARIABLES = [
  { id: 'bioc', label: '19 Bioclimatic Variables', icon: Droplets, desc: 'BIO1-BIO19 (Annual Temp, Seasonality, Diurnal Range, Extreme Rain)' },
  { id: 'tmin', label: 'Min Temperature (tmin)', icon: Thermometer, desc: 'Monthly minimum temperature downscaled' },
  { id: 'tmax', label: 'Max Temperature (tmax)', icon: Thermometer, desc: 'Monthly maximum temperature downscaled' },
  { id: 'prec', label: 'Precipitation (prec)', icon: Droplets, desc: 'Monthly cumulative rainfall & precipitation' },
];

export const CLIMATE_SAMPLE_QUESTIONS = [
  {
    label: 'SSP2-4.5 Mid-Century Projection',
    query: 'Analyze temperature anomalies and precipitation variance under SSP2-4.5 using CanESM5 downscaled projections for 2041-2060.',
  },
  {
    label: 'High Emission Risk (SSP5-8.5)',
    query: 'Assess vulnerable regions and severe bioclimatic shifts under SSP5-8.5 using GFDL-ESM4 end-of-century data.',
  },
  {
    label: 'Paris Agreement Target (SSP1-2.6)',
    query: 'Evaluate mitigation outcomes and thermal stress abatement under SSP1-2.6 using UKESM1-0-LL projections.',
  },
];

export function buildMetadataIdentifier(
  resolution: string,
  variable: string,
  model: string,
  scenario: string,
  period: string
): string {
  return `wc2.1_${resolution}_${variable}_${model}_${scenario}_${period}`;
}

export function getDefaultClimateConfig(): CMIP6ClimateConfig {
  return {
    enabled: true,
    scenario: 'ssp245',
    scenarioName: 'SSP2-4.5 (Middle of the Road)',
    model: 'CanESM5',
    modelName: 'CanESM5 (CCCma, Canada)',
    period: '2041-2060',
    resolution: '2.5m',
    variable: 'bioc',
    variableLabel: '19 Bioclimatic Variables (BIO1-BIO19)',
    datasetVersion: 'WorldClim v2.1',
    metadataIdentifier: 'wc2.1_2.5m_bioc_CanESM5_ssp245_2041-2060',
    notes: 'WorldClim v2.1 downscaled CMIP6 projection with 19 bioclimatic variables at 2.5m resolution.',
  };
}

/* ─────────────────────────── Informational Tooltip Component ─────────────────────────── */

interface InfoTooltipProps {
  id: string;
  title: string;
  buttonLabel?: string;
  widthClass?: string;
  align?: 'left' | 'right' | 'center';
  children: React.ReactNode;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  id,
  title,
  buttonLabel = 'More information',
  widthClass = 'w-80 sm:w-[440px]',
  align = 'left',
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 250);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, [isOpen]);

  const alignClass = align === 'right' 
    ? 'right-0' 
    : align === 'center' 
    ? 'left-1/2 -translate-x-1/2' 
    : 'left-0';

  return (
    <div 
      ref={containerRef}
      className="relative inline-flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        id={`${id}-trigger`}
        aria-describedby={isOpen ? id : undefined}
        aria-expanded={isOpen}
        aria-label={buttonLabel}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className="p-1 rounded-full text-neutral-400 hover:text-io-blue hover:bg-blue-50 dark:hover:bg-blue-950/40 focus:outline-none focus:ring-1 focus:ring-io-blue transition cursor-pointer"
      >
        <Info className="h-3.5 w-3.5" />
      </button>

      {isOpen && (
        <div
          id={id}
          role="tooltip"
          className={`absolute top-full mt-1.5 ${alignClass} ${widthClass} z-50 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/98 dark:bg-neutral-900/98 backdrop-blur-md p-3.5 shadow-2xl text-neutral-800 dark:text-neutral-200 text-xs max-h-[80vh] overflow-y-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800 mb-2.5">
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-io-blue shrink-0" />
              <span>{title}</span>
            </h4>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-0.5 rounded text-xs leading-none cursor-pointer"
              aria-label="Close tooltip"
            >
              ✕
            </button>
          </div>
          <div className="text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-300 space-y-2.5">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────── Main Section Component ─────────────────────────── */

interface ClimateSetupSectionProps {
  config: CMIP6ClimateConfig;
  onChange: (newConfig: CMIP6ClimateConfig) => void;
  onApplyQuestion?: (question: string) => void;
  disabled?: boolean;
}

export const ClimateSetupSection: React.FC<ClimateSetupSectionProps> = ({
  config,
  onChange,
  onApplyQuestion,
  disabled = false,
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [showModelDetails, setShowModelDetails] = useState(false);
  const [showScenarioComparison, setShowScenarioComparison] = useState(false);

  const selectedScenario = CMIP6_SCENARIOS.find((s) => s.id === config.scenario) || CMIP6_SCENARIOS[1];
  const selectedModel = CMIP6_MODELS.find((m) => m.id === config.model) || CMIP6_MODELS[0];

  const updateField = <K extends keyof CMIP6ClimateConfig>(field: K, value: CMIP6ClimateConfig[K]) => {
    const updated = { ...config, [field]: value };
    
    // Auto sync scenarioName or modelName or identifier
    if (field === 'scenario') {
      const sc = CMIP6_SCENARIOS.find((s) => s.id === value);
      if (sc) updated.scenarioName = `${sc.code} (${sc.name})`;
    }
    if (field === 'model') {
      const md = CMIP6_MODELS.find((m) => m.id === value);
      if (md) updated.modelName = `${md.name} (${md.institution})`;
    }
    if (field === 'variable') {
      const vr = CMIP6_VARIABLES.find((v) => v.id === value);
      if (vr) updated.variableLabel = vr.label;
    }

    updated.metadataIdentifier = buildMetadataIdentifier(
      updated.resolution,
      updated.variable,
      updated.model,
      updated.scenario,
      updated.period
    );

    onChange(updated);
  };

  const handleCopyTag = () => {
    navigator.clipboard.writeText(config.metadataIdentifier);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (
    scenario: CMIP6ScenarioId,
    model: string,
    period: string,
    resolution: string = '2.5m',
    variable: string = 'bioc'
  ) => {
    const sc = CMIP6_SCENARIOS.find((s) => s.id === scenario);
    const md = CMIP6_MODELS.find((m) => m.id === model);
    const vr = CMIP6_VARIABLES.find((v) => v.id === variable);

    onChange({
      ...config,
      enabled: true,
      scenario,
      scenarioName: sc ? `${sc.code} (${sc.name})` : scenario,
      model,
      modelName: md ? `${md.name} (${md.institution})` : model,
      period,
      resolution,
      variable,
      variableLabel: vr?.label || variable,
      metadataIdentifier: buildMetadataIdentifier(resolution, variable, model, scenario, period),
    });
  };

  return (
    <section 
      id="worldclim-cmip6-setup" 
      className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-sm transition-all text-neutral-900 dark:text-neutral-100"
    >
      {/* Header & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-start gap-2.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 dark:bg-neutral-100 text-[11px] text-white dark:text-neutral-900 shrink-0 mt-0.5 font-bold">
            2
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-io-blue" />
                {t.climateHeaderTitle}
              </h2>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-io-blue border border-blue-100 dark:border-blue-900/50">
                {t.climateHeaderBadge}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              {t.climateHeaderDesc}
            </p>
          </div>
        </div>

        {/* Enable / Disable switch */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <label 
            htmlFor="climate-metadata-toggle" 
            className="text-xs font-medium text-neutral-600 dark:text-neutral-400 cursor-pointer select-none"
          >
            {t.climateToggleLabel}
          </label>
          <button
            id="climate-metadata-toggle"
            type="button"
            role="switch"
            aria-checked={config.enabled}
            disabled={disabled}
            onClick={() => updateField('enabled', !config.enabled)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-io-blue focus:ring-offset-2 ${
              config.enabled ? 'bg-io-blue' : 'bg-neutral-200 dark:bg-neutral-700'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                config.enabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {config.enabled ? (
        <div className="mt-5 space-y-5">
          {/* Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                Quick Climate Presets
              </span>
              <span className="text-[11px] text-neutral-400 dark:text-neutral-500">Standard WorldClim v2.1 baselines</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={disabled}
                onClick={() => applyPreset('ssp126', 'UKESM1-0-LL', '2041-2060')}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition cursor-pointer"
              >
                🌱 Paris 1.5°C (SSP1-2.6 • UKESM1)
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={() => applyPreset('ssp245', 'CanESM5', '2041-2060')}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-200 dark:border-blue-800/70 bg-blue-50/60 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition cursor-pointer"
              >
                ⚖️ Moderate 2050 (SSP2-4.5 • CanESM5)
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={() => applyPreset('ssp370', 'CNRM-CM6-1', '2041-2060')}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-amber-200 dark:border-amber-800/70 bg-amber-50/60 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition cursor-pointer"
              >
                ⚠️ Regional Rivalry (SSP3-7.0 • CNRM-CM6)
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={() => applyPreset('ssp585', 'GFDL-ESM4', '2081-2100')}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-rose-200 dark:border-rose-800/70 bg-rose-50/60 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition cursor-pointer"
              >
                🔥 Worst-Case 2100 (SSP5-8.5 • GFDL)
              </button>
            </div>
          </div>

          {/* Recently Used Configurations List */}
          <RecentlyUsedConfigs 
            currentConfig={config}
            onSelectConfig={onChange}
            disabled={disabled}
          />

          {/* Scenarios Selection (SSPs) with Dropdown & Detailed Tooltip */}
          <div className="space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <label 
                  htmlFor="cmip6-scenario-select" 
                  className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5"
                >
                  <Sliders className="h-3.5 w-3.5 text-io-blue" />
                  CMIP6 Climate Scenario (Shared Socioeconomic Pathway - SSP)
                </label>
                
                {/* Informational Tooltip explaining SSP1-2.6, SSP2-4.5, SSP5-8.5 */}
                <InfoTooltip
                  id="cmip6-scenario-tooltip"
                  title="Comparing CMIP6 Scenarios: SSP1-2.6 vs SSP2-4.5 vs SSP5-8.5"
                  buttonLabel="Scenario explanation and differences tooltip"
                  widthClass="w-80 sm:w-[460px]"
                >
                  <p className="text-neutral-700 dark:text-neutral-300 font-medium">
                    Shared Socioeconomic Pathways (SSPs) combine future atmospheric greenhouse gas concentrations with distinct socioeconomic trajectories:
                  </p>

                  {/* SSP1-2.6 */}
                  <div className="p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/60 dark:bg-emerald-950/40 space-y-1">
                    <div className="flex items-center justify-between text-emerald-950 dark:text-emerald-200 font-semibold">
                      <span className="flex items-center gap-1">
                        <Leaf className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        SSP1-2.6: Sustainability ("Taking the Green Road")
                      </span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold">2.6 W/m²</span>
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-300">
                      <strong className="text-emerald-950 dark:text-emerald-300">Emissions:</strong> Drastic, immediate decarbonization. Net-zero greenhouse gases achieved between 2050 and 2075.
                    </p>
                    <p className="text-neutral-700 dark:text-neutral-300">
                      <strong className="text-emerald-950 dark:text-emerald-300">2100 Warming:</strong> <strong>+1.5°C to +1.8°C</strong> above pre-industrial levels (consistent with the Paris Agreement target).
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400 text-[10px]">
                      <em>Characteristics:</em> Global cooperation, accelerated renewable energy adoption, low resource intensity, shift toward sustainable consumption, and minimal adaptation hurdles.
                    </p>
                  </div>

                  {/* SSP2-4.5 */}
                  <div className="p-2.5 rounded-lg border border-blue-200 dark:border-blue-800/80 bg-blue-50/60 dark:bg-blue-950/40 space-y-1">
                    <div className="flex items-center justify-between text-blue-950 dark:text-blue-200 font-semibold">
                      <span className="flex items-center gap-1">
                        <Scale className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        SSP2-4.5: Middle of the Road ("Current Policy Trajectory")
                      </span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-bold">4.5 W/m²</span>
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-300">
                      <strong className="text-blue-950 dark:text-blue-300">Emissions:</strong> Historical socioeconomic trends continue. Global CO₂ emissions peak around 2040 before declining gradually.
                    </p>
                    <p className="text-neutral-700 dark:text-neutral-300">
                      <strong className="text-blue-950 dark:text-blue-300">2100 Warming:</strong> <strong>~+2.7°C</strong> above pre-industrial levels.
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400 text-[10px]">
                      <em>Characteristics:</em> Moderate mitigation efforts, uneven progress across regions, standard baseline benchmark for current national pledges.
                    </p>
                  </div>

                  {/* SSP5-8.5 */}
                  <div className="p-2.5 rounded-lg border border-rose-200 dark:border-rose-800/80 bg-rose-50/60 dark:bg-rose-950/40 space-y-1">
                    <div className="flex items-center justify-between text-rose-950 dark:text-rose-200 font-semibold">
                      <span className="flex items-center gap-1">
                        <Flame className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                        SSP5-8.5: Fossil-Fueled Development ("Worst-Case High Emissions")
                      </span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 font-bold">8.5 W/m²</span>
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-300">
                      <strong className="text-rose-950 dark:text-rose-300">Emissions:</strong> Rapid, unconstrained economic expansion powered by intensive fossil fuel exploitation. No climate mitigation policies.
                    </p>
                    <p className="text-neutral-700 dark:text-neutral-300">
                      <strong className="text-rose-950 dark:text-rose-300">2100 Warming:</strong> <strong>~+4.4°C</strong> above pre-industrial levels (severe, catastrophic planetary shifts).
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400 text-[10px]">
                      <em>Characteristics:</em> Tripling of coal/oil usage, extreme vulnerability to thermal stress, severe climate hazards, and maximum adaptation challenges.
                    </p>
                  </div>

                  <div className="pt-1.5 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
                    <span>WorldClim v2.1 downscaled CMIP6</span>
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">IPCC AR6 Working Group I</span>
                  </div>
                </InfoTooltip>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowScenarioComparison(!showScenarioComparison)}
                  className="text-[11px] text-io-blue dark:text-blue-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Sparkles className="h-3 w-3" />
                  {showScenarioComparison ? 'Hide comparison' : 'Compare SSP1 vs SSP2 vs SSP5'}
                </button>
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-mono hidden sm:inline">
                  Radiative forcing: {selectedScenario.forcing}
                </span>
              </div>
            </div>

            {/* Scenario Dropdown */}
            <div className="flex gap-2">
              <select
                id="cmip6-scenario-select"
                value={config.scenario}
                disabled={disabled}
                onChange={(e) => updateField('scenario', e.target.value as CMIP6ScenarioId)}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:border-io-blue focus:ring-1 focus:ring-blue-100 dark:focus:ring-blue-900/40 outline-none transition cursor-pointer"
              >
                {CMIP6_SCENARIOS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} — {s.name} ({s.forcing}, {s.tempRise2100} by 2100)
                  </option>
                ))}
              </select>
            </div>

            {/* Expandable Side-by-Side Comparison Table */}
            {showScenarioComparison && (
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-850 p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200/70 dark:border-neutral-800">
                  <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5 text-xs">
                    <Scale className="h-3.5 w-3.5 text-io-blue" />
                    Key Differences: SSP1-2.6 vs SSP2-4.5 vs SSP5-8.5
                  </h4>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400">WorldClim v2.1 Benchmarks</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-750 text-neutral-600 dark:text-neutral-300">
                        <th className="py-1.5 pr-2 font-semibold">Attribute</th>
                        <th className="py-1.5 px-2 font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50/40 dark:bg-emerald-950/30 rounded-t">SSP1-2.6 (Sustainability)</th>
                        <th className="py-1.5 px-2 font-semibold text-blue-800 dark:text-blue-300 bg-blue-50/40 dark:bg-blue-950/30 rounded-t">SSP2-4.5 (Middle of Road)</th>
                        <th className="py-1.5 pl-2 font-semibold text-rose-800 dark:text-rose-300 bg-rose-50/40 dark:bg-rose-950/30 rounded-t">SSP5-8.5 (Fossil Development)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200/70 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                      <tr>
                        <td className="py-1.5 pr-2 font-medium text-neutral-900 dark:text-neutral-200">Radiative Forcing</td>
                        <td className="py-1.5 px-2 font-mono text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50/20 dark:bg-emerald-950/20">2.6 W/m²</td>
                        <td className="py-1.5 px-2 font-mono text-blue-700 dark:text-blue-400 font-bold bg-blue-50/20 dark:bg-blue-950/20">4.5 W/m²</td>
                        <td className="py-1.5 pl-2 font-mono text-rose-700 dark:text-rose-400 font-bold bg-rose-50/20 dark:bg-rose-950/20">8.5 W/m²</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2 font-medium text-neutral-900 dark:text-neutral-200">2100 Temperature</td>
                        <td className="py-1.5 px-2 font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50/20 dark:bg-emerald-950/20">+1.5°C to 1.8°C</td>
                        <td className="py-1.5 px-2 font-semibold text-blue-800 dark:text-blue-300 bg-blue-50/20 dark:bg-blue-950/20">+2.7°C</td>
                        <td className="py-1.5 pl-2 font-semibold text-rose-800 dark:text-rose-300 bg-rose-50/20 dark:bg-rose-950/20">+4.4°C</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2 font-medium text-neutral-900 dark:text-neutral-200">CO₂ Peak Year</td>
                        <td className="py-1.5 px-2 bg-emerald-50/20 dark:bg-emerald-950/20">~2025 (Net-zero by ~2050–2075)</td>
                        <td className="py-1.5 px-2 bg-blue-50/20 dark:bg-blue-950/20">~2040 (Gradual slow decline)</td>
                        <td className="py-1.5 pl-2 bg-rose-50/20 dark:bg-rose-950/20">No peak (Steep rise past 2100)</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2 font-medium text-neutral-900 dark:text-neutral-200">Policy Ambition</td>
                        <td className="py-1.5 px-2 bg-emerald-50/20 dark:bg-emerald-950/20">Paris Agreement stringent targets</td>
                        <td className="py-1.5 px-2 bg-blue-50/20 dark:bg-blue-950/20">Current moderate commitments</td>
                        <td className="py-1.5 pl-2 bg-rose-50/20 dark:bg-rose-950/20">No climate mitigation policy</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2 font-medium text-neutral-900 dark:text-neutral-200">Best Used For</td>
                        <td className="py-1.5 px-2 bg-emerald-50/20 dark:bg-emerald-950/20">Decarbonization target assessments</td>
                        <td className="py-1.5 px-2 bg-blue-50/20 dark:bg-blue-950/20">Standard planning & business baseline</td>
                        <td className="py-1.5 pl-2 bg-rose-50/20 dark:bg-rose-950/20">Worst-case stress tests & hazards</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-2 font-medium text-neutral-900 dark:text-neutral-200">Select</td>
                        <td className="py-2 px-2 bg-emerald-50/20 dark:bg-emerald-950/20">
                          <button
                            type="button"
                            onClick={() => updateField('scenario', 'ssp126')}
                            className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[10px] transition cursor-pointer"
                          >
                            Apply SSP1-2.6
                          </button>
                        </td>
                        <td className="py-2 px-2 bg-blue-50/20 dark:bg-blue-950/20">
                          <button
                            type="button"
                            onClick={() => updateField('scenario', 'ssp245')}
                            className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-[10px] transition cursor-pointer"
                          >
                            Apply SSP2-4.5
                          </button>
                        </td>
                        <td className="py-2 pl-2 bg-rose-50/20 dark:bg-rose-950/20">
                          <button
                            type="button"
                            onClick={() => updateField('scenario', 'ssp585')}
                            className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-medium text-[10px] transition cursor-pointer"
                          >
                            Apply SSP5-8.5
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Quick-Access Cards Grid (synced with scenario dropdown) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {CMIP6_SCENARIOS.map((sc) => {
                const isSelected = config.scenario === sc.id;
                const borderClass = isSelected
                  ? sc.color === 'emerald'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-1 ring-emerald-400 dark:ring-emerald-500/50'
                    : sc.color === 'blue'
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-400 dark:ring-blue-500/50'
                    : sc.color === 'amber'
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 ring-1 ring-amber-400 dark:ring-amber-500/50'
                    : 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/40 ring-1 ring-rose-400 dark:ring-rose-500/50'
                  : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-850 hover:border-neutral-300 dark:hover:border-neutral-700';

                const badgeBg = 
                  sc.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300' :
                  sc.color === 'blue' ? 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300' :
                  sc.color === 'amber' ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300' :
                  'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300';

                return (
                  <button
                    key={sc.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => updateField('scenario', sc.id)}
                    className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${borderClass}`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-mono font-bold text-xs text-neutral-900 dark:text-neutral-100">
                          {sc.code}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${badgeBg}`}>
                          {sc.forcing}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 line-clamp-1">{sc.name}</p>
                      <p className="mt-1 text-[11px] text-neutral-600 dark:text-neutral-400 leading-snug line-clamp-2">
                        {sc.description}
                      </p>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-neutral-100/80 dark:border-neutral-800 flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400">
                      <span>2100 rise:</span>
                      <span className="font-semibold text-neutral-700 dark:text-neutral-300">{sc.tempRise2100}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Visual Map Preview Component for Selected CMIP6 Scenario */}
          <ClimateMapPreview
            config={config}
            onSelectScenario={(sc) => updateField('scenario', sc)}
            disabled={disabled}
          />

          {/* Dynamic Toggleable Legend for Selected Climate Scenario & Variable */}
          <ClimateLegend
            config={config}
          />

          {/* Model Selection & Parameters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CMIP6 Global Climate Model (GCM) with Tooltip */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <label 
                    htmlFor="cmip6-model-select" 
                    className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5"
                  >
                    <Compass className="h-3.5 w-3.5 text-io-blue" />
                    CMIP6 Global Climate Model (GCM)
                  </label>

                  {/* Informational Tooltip on Model Dropdown */}
                  <InfoTooltip
                    id="cmip6-model-tooltip"
                    title="WorldClim v2.1 Downscaled CMIP6 Climate Models (GCMs)"
                    buttonLabel="Model explanation and sensitivity tooltip"
                    widthClass="w-80 sm:w-[440px]"
                  >
                    <p className="text-neutral-700 dark:text-neutral-300 font-medium">
                      WorldClim v2.1 provides monthly downscaled projections from 12 General Circulation Models (GCMs) from international modeling groups:
                    </p>

                    <div className="space-y-2">
                      <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-1">
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center justify-between text-[11px]">
                          <span>🌡️ Climate Sensitivity (ECS)</span>
                          <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-normal">Warming per 2× CO₂</span>
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-300 text-[10px] leading-snug">
                          • <strong>High Sensitivity (&gt;5.0°C):</strong> <em>CanESM5 (5.6°C)</em> & <em>UKESM1-0-LL (5.4°C)</em>. Feature strong positive cloud-radiation feedbacks, simulating more rapid warming and sharper hydrological shifts.<br />
                          • <strong>Intermediate Sensitivity (4.0–4.9°C):</strong> <em>CNRM-CM6-1 (4.9°C)</em>, <em>IPSL-CM6A-LR (4.8°C)</em>, <em>EC-Earth3-Veg (4.3°C)</em>.<br />
                          • <strong>Moderate Sensitivity (&lt;3.5°C):</strong> <em>GFDL-ESM4 (2.7°C)</em>, <em>MIROC6 (2.6°C)</em>, <em>MPI-ESM1-2-HR (3.0°C)</em>, <em>BCC-CSM2-MR (3.0°C)</em>. Offer more conservative, stable temperature trajectories.
                        </p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-1">
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100 text-[11px]">
                          🗺️ Regional Modeling Highlights
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-300 text-[10px] leading-snug">
                          • <strong>Americas:</strong> CanESM5 (CCCma, Canada) & GFDL-ESM4 (NOAA, USA)<br />
                          • <strong>Europe:</strong> CNRM-CM6-1 (Météo-France) & MPI-ESM1-2-HR (Max Planck)<br />
                          • <strong>Asia & Monsoons:</strong> MIROC6, BCC-CSM2-MR, MRI-ESM2-0<br />
                          • <strong>Global Earth System Feedbacks:</strong> UKESM1-0-LL & EC-Earth3-Veg
                        </p>
                      </div>

                      <div className="p-2 rounded-lg bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 text-[10px] text-blue-900 dark:text-blue-300 space-y-0.5">
                        <span className="font-semibold">Downscaling Method:</span>
                        <p className="text-blue-800 dark:text-blue-300 leading-snug">
                          Projections are bias-corrected using the delta method against WorldClim baseline climatology (1970–2000), producing continuous high-resolution surfaces down to 30 arc-seconds (~1 km²).
                        </p>
                      </div>
                    </div>
                  </InfoTooltip>
                </div>

                <button
                  type="button"
                  onClick={() => setShowModelDetails(!showModelDetails)}
                  className="text-[11px] text-io-blue dark:text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  {showModelDetails ? (
                    <>Hide details <ChevronUp className="h-3 w-3" /></>
                  ) : (
                    <>Model info <ChevronDown className="h-3 w-3" /></>
                  )}
                </button>
              </div>

              {/* Model Dropdown */}
              <select
                id="cmip6-model-select"
                value={config.model}
                disabled={disabled}
                onChange={(e) => updateField('model', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:border-io-blue focus:ring-1 focus:ring-blue-100 dark:focus:ring-blue-900/40 outline-none transition cursor-pointer"
              >
                {CMIP6_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} — {m.country} ({m.sensitivity || m.institution})
                  </option>
                ))}
              </select>

              {/* Model institution & characteristics card */}
              <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center justify-between text-neutral-800 dark:text-neutral-200 font-medium">
                  <span>{selectedModel.name} ({selectedModel.country})</span>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">{selectedModel.sensitivity || 'WorldClim Verified'}</span>
                </div>
                <p className="mt-0.5 text-neutral-500 dark:text-neutral-400 text-[11px] truncate">{selectedModel.institution}</p>
                {showModelDetails && (
                  <p className="mt-1.5 pt-1.5 border-t border-neutral-200 dark:border-neutral-750 text-neutral-700 dark:text-neutral-300 text-[11px] leading-relaxed">
                    <span className="font-semibold">Characteristics:</span> {selectedModel.characteristics}
                  </p>
                )}
              </div>
            </div>

            {/* Time Horizon (Period) & Spatial Resolution */}
            <div className="grid grid-cols-2 gap-3">
              {/* Projection Period */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="cmip6-period-select" 
                  className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
                >
                  <Calendar className="h-3.5 w-3.5 text-io-blue" />
                  Time Horizon
                </label>
                <select
                  id="cmip6-period-select"
                  value={config.period}
                  disabled={disabled}
                  onChange={(e) => updateField('period', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:border-io-blue focus:ring-1 focus:ring-blue-100 dark:focus:ring-blue-900/40 outline-none transition cursor-pointer"
                >
                  {CMIP6_PERIODS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label} ({p.tag})
                    </option>
                  ))}
                </select>
                <div className="text-[10px] text-neutral-400 dark:text-neutral-500">
                  Averaged over 20-year future window
                </div>
              </div>

              {/* Spatial Resolution */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="cmip6-resolution-select" 
                  className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
                >
                  <Layers className="h-3.5 w-3.5 text-io-blue" />
                  Resolution
                </label>
                <select
                  id="cmip6-resolution-select"
                  value={config.resolution}
                  disabled={disabled}
                  onChange={(e) => updateField('resolution', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:border-io-blue focus:ring-1 focus:ring-blue-100 dark:focus:ring-blue-900/40 outline-none transition cursor-pointer"
                >
                  {CMIP6_RESOLUTIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label} ({r.area})
                    </option>
                  ))}
                </select>
                <div className="text-[10px] text-neutral-400 dark:text-neutral-500">
                  {CMIP6_RESOLUTIONS.find((r) => r.id === config.resolution)?.desc}
                </div>
              </div>
            </div>
          </div>

          {/* Climate Variable Target */}
          <div>
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-1.5">
              <Thermometer className="h-3.5 w-3.5 text-io-blue" />
              WorldClim v2.1 Variable Target
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {CMIP6_VARIABLES.map((v) => {
                const isSelected = config.variable === v.id;
                const IconComponent = v.icon;
                return (
                  <button
                    key={v.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => updateField('variable', v.id)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-xs'
                        : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100/80 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-medium text-xs">
                      <IconComponent className={`h-3.5 w-3.5 ${isSelected ? 'text-blue-300 dark:text-blue-600' : 'text-neutral-500 dark:text-neutral-400'}`} />
                      <span className="truncate">{v.label}</span>
                    </div>
                    <p className={`mt-1 text-[10px] leading-tight line-clamp-2 ${isSelected ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-500 dark:text-neutral-400'}`}>
                      {v.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live WorldClim Metadata Tag & Summary Card */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-850 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                  Generated WorldClim v2.1 Identifier:
                </span>
                <code className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 truncate max-w-full">
                  {config.metadataIdentifier}
                </code>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-600 dark:text-neutral-400 flex-wrap">
                <span className="font-medium text-neutral-900 dark:text-neutral-200">{selectedScenario.code}</span>
                <span>•</span>
                <span>{selectedModel.name}</span>
                <span>•</span>
                <span>{config.period}</span>
                <span>•</span>
                <span>{config.resolution} (~{CMIP6_RESOLUTIONS.find(r => r.id === config.resolution)?.area})</span>
                <span>•</span>
                <span className="text-neutral-500 dark:text-neutral-400">{config.variableLabel}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyTag}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-750 hover:text-neutral-900 dark:hover:text-white transition shrink-0 cursor-pointer self-start sm:self-auto"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-neutral-400" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>

          {/* Climate Analysis Question Suggestions */}
          {onApplyQuestion && (
            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3">
              <span className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 flex items-center gap-1 mb-2">
                <Info className="h-3 w-3 text-io-blue" />
                Click to apply climate-focused analysis prompts:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CLIMATE_SAMPLE_QUESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={disabled}
                    onClick={() => onApplyQuestion(item.query)}
                    className="text-left text-[11px] px-2.5 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-io-blue dark:hover:border-blue-400 hover:text-io-blue dark:hover:text-blue-400 transition cursor-pointer"
                  >
                    💡 {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-dashed border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
          <span>{t.climateEnabledNotice}</span>
          <button
            type="button"
            onClick={() => updateField('enabled', true)}
            className="text-xs text-io-blue dark:text-blue-400 font-medium hover:underline cursor-pointer ml-2 shrink-0"
          >
            {t.climateToggleLabel}
          </button>
        </div>
      )}
    </section>
  );
};
