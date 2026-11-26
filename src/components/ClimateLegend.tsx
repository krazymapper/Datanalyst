import React, { useState } from 'react';
import { 
  Thermometer, 
  Droplets, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  Sliders, 
  Sparkles,
  Layers,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import type { CMIP6ClimateConfig, CMIP6ScenarioId } from '../types';
import { CMIP6_SCENARIOS, CMIP6_VARIABLES } from './ClimateSetupSection';
import { useLanguage } from '../translations';

interface ClimateLegendProps {
  config: CMIP6ClimateConfig;
  className?: string;
}

interface LegendScaleData {
  title: string;
  variableLabel: string;
  unit: string;
  unitSymbol: string;
  gradientCss: string;
  minVal: string;
  maxVal: string;
  meanVal: string;
  ticks: Array<{ label: string; positionPercent: number }>;
  categories: Array<{
    range: string;
    label: string;
    color: string;
    bgBadge: string;
    impact: string;
  }>;
  interpretation: string;
}

// Helper to derive dynamically calibrated scales based on scenario and variable
function getDynamicLegendData(scenarioId: CMIP6ScenarioId, variableId: string): LegendScaleData {
  const scenario = CMIP6_SCENARIOS.find((s) => s.id === scenarioId) || CMIP6_SCENARIOS[1];

  if (variableId === 'tmax') {
    switch (scenarioId) {
      case 'ssp126':
        return {
          title: 'Maximum Temperature (tmax) Anomaly',
          variableLabel: 'Monthly Maximum Daytime Temperature',
          unit: 'Degrees Celsius',
          unitSymbol: '°C',
          gradientCss: 'from-amber-200 via-orange-400 via-rose-500 to-red-700',
          minVal: '+0.5°C',
          maxVal: '+3.8°C',
          meanVal: '+1.9°C',
          ticks: [
            { label: '+0.5°C', positionPercent: 0 },
            { label: '+1.5°C', positionPercent: 30 },
            { label: '+2.5°C', positionPercent: 60 },
            { label: '+3.8°C', positionPercent: 100 },
          ],
          categories: [
            { range: '+0.5°C – +1.2°C', label: 'Mild Peak Warming', color: '#fde68a', bgBadge: 'bg-amber-100 text-amber-900', impact: 'Moderate heat stress; manageable cooling demands' },
            { range: '+1.3°C – +2.2°C', label: 'Elevated Summer Peaks', color: '#fb923c', bgBadge: 'bg-orange-100 text-orange-900', impact: 'Agricultural heat days increase; minor wildfire risk' },
            { range: '+2.3°C – +3.8°C', label: 'Local High Extremes', color: '#e11d48', bgBadge: 'bg-rose-100 text-rose-900', impact: 'Localized extreme heatwaves in continental interiors' },
          ],
          interpretation: 'Under SSP1-2.6, daytime maximum temperatures stabilize below critical ecological thresholds with minimal severe heat dome occurrences.',
        };
      case 'ssp370':
        return {
          title: 'Maximum Temperature (tmax) Anomaly',
          variableLabel: 'Monthly Maximum Daytime Temperature',
          unit: 'Degrees Celsius',
          unitSymbol: '°C',
          gradientCss: 'from-yellow-300 via-orange-500 via-red-600 to-purple-900',
          minVal: '+1.2°C',
          maxVal: '+8.2°C',
          meanVal: '+4.1°C',
          ticks: [
            { label: '+1.2°C', positionPercent: 0 },
            { label: '+3.0°C', positionPercent: 25 },
            { label: '+5.0°C', positionPercent: 55 },
            { label: '+8.2°C', positionPercent: 100 },
          ],
          categories: [
            { range: '+1.2°C – +3.0°C', label: 'Chronic Warming', color: '#fde047', bgBadge: 'bg-yellow-100 text-yellow-900', impact: 'Substantial lengthening of warm seasons' },
            { range: '+3.1°C – +5.5°C', label: 'Severe Thermal Load', color: '#f97316', bgBadge: 'bg-orange-100 text-orange-900', impact: 'Widespread crop yield decline; intense urban heat islands' },
            { range: '+5.6°C – +8.2°C', label: 'Critical Heat Shock', color: '#7e22ce', bgBadge: 'bg-purple-100 text-purple-900', impact: 'Repeated dangerous wet-bulb events in tropical regions' },
          ],
          interpretation: 'Under SSP3-7.0, high emissions drive sharp regional daytime temperature spikes and prolonged dry season heating.',
        };
      case 'ssp585':
        return {
          title: 'Maximum Temperature (tmax) Anomaly',
          variableLabel: 'Monthly Maximum Daytime Temperature',
          unit: 'Degrees Celsius',
          unitSymbol: '°C',
          gradientCss: 'from-amber-300 via-rose-500 via-red-700 to-purple-950',
          minVal: '+1.8°C',
          maxVal: '+10.5°C+',
          meanVal: '+5.2°C',
          ticks: [
            { label: '+1.8°C', positionPercent: 0 },
            { label: '+4.0°C', positionPercent: 25 },
            { label: '+7.0°C', positionPercent: 60 },
            { label: '+10.5°C+', positionPercent: 100 },
          ],
          categories: [
            { range: '+1.8°C – +3.9°C', label: 'Substantial Baseline Shift', color: '#fcd34d', bgBadge: 'bg-amber-100 text-amber-900', impact: 'Significant tropical summer extension' },
            { range: '+4.0°C – +6.9°C', label: 'Hazardous Thermal Stress', color: '#f43f5e', bgBadge: 'bg-rose-100 text-rose-900', impact: 'Extensive ecosystem collapse and grid power stress' },
            { range: '+7.0°C – +10.5°C+', label: 'Catastrophic Extreme Heat', color: '#581c87', bgBadge: 'bg-purple-200 text-purple-950', impact: 'Unprecedented multi-week lethality thresholds exceeded' },
          ],
          interpretation: 'Under SSP5-8.5, unconstrained fossil fuel usage triggers extreme summer daytime anomalies exceeding +10°C in mid-to-high latitudes.',
        };
      case 'ssp245':
      default:
        return {
          title: 'Maximum Temperature (tmax) Anomaly',
          variableLabel: 'Monthly Maximum Daytime Temperature',
          unit: 'Degrees Celsius',
          unitSymbol: '°C',
          gradientCss: 'from-amber-200 via-orange-400 via-rose-600 to-red-800',
          minVal: '+1.0°C',
          maxVal: '+6.2°C',
          meanVal: '+3.1°C',
          ticks: [
            { label: '+1.0°C', positionPercent: 0 },
            { label: '+2.5°C', positionPercent: 30 },
            { label: '+4.2°C', positionPercent: 62 },
            { label: '+6.2°C', positionPercent: 100 },
          ],
          categories: [
            { range: '+1.0°C – +2.4°C', label: 'Moderate Warming', color: '#fde68a', bgBadge: 'bg-amber-100 text-amber-900', impact: 'Gradual increase in air-conditioning demand' },
            { range: '+2.5°C – +4.4°C', label: 'Substantial Heat Increase', color: '#fb923c', bgBadge: 'bg-orange-100 text-orange-900', impact: 'Doubling of extreme heatwave frequencies' },
            { range: '+4.5°C – +6.2°C', label: 'High Thermal Disruption', color: '#991b1b', bgBadge: 'bg-red-100 text-red-900', impact: 'Severe agricultural stress during peak summer months' },
          ],
          interpretation: 'Under SSP2-4.5, maximum temperatures follow intermediate trajectory with continental interiors experiencing +4°C to +6°C summer peaks.',
        };
    }
  }

  if (variableId === 'tmin') {
    switch (scenarioId) {
      case 'ssp126':
        return {
          title: 'Minimum Temperature (tmin) Anomaly',
          variableLabel: 'Monthly Minimum Nighttime Temperature',
          unit: 'Degrees Celsius',
          unitSymbol: '°C',
          gradientCss: 'from-cyan-300 via-emerald-400 via-yellow-300 to-orange-500',
          minVal: '+0.4°C',
          maxVal: '+3.2°C',
          meanVal: '+1.6°C',
          ticks: [
            { label: '+0.4°C', positionPercent: 0 },
            { label: '+1.2°C', positionPercent: 30 },
            { label: '+2.0°C', positionPercent: 60 },
            { label: '+3.2°C', positionPercent: 100 },
          ],
          categories: [
            { range: '+0.4°C – +1.1°C', label: 'Mild Winter Warming', color: '#67e8f9', bgBadge: 'bg-cyan-100 text-cyan-900', impact: 'Slight reduction in frost days' },
            { range: '+1.2°C – +2.1°C', label: 'Moderate Nighttime Shift', color: '#fde047', bgBadge: 'bg-yellow-100 text-yellow-900', impact: 'Preserved winter dormancy for temperate plants' },
            { range: '+2.2°C – +3.2°C', label: 'Subpolar Minimum Rise', color: '#f97316', bgBadge: 'bg-orange-100 text-orange-900', impact: 'Arctic and alpine seasonal freezing preserved' },
          ],
          interpretation: 'Under SSP1-2.6, nighttime minimum temperatures show modest elevation, curbing ecological disruption in frost-dependent biomes.',
        };
      case 'ssp585':
        return {
          title: 'Minimum Temperature (tmin) Anomaly',
          variableLabel: 'Monthly Minimum Nighttime Temperature',
          unit: 'Degrees Celsius',
          unitSymbol: '°C',
          gradientCss: 'from-teal-300 via-amber-400 via-rose-600 to-red-950',
          minVal: '+1.5°C',
          maxVal: '+9.8°C+',
          meanVal: '+5.0°C',
          ticks: [
            { label: '+1.5°C', positionPercent: 0 },
            { label: '+3.8°C', positionPercent: 28 },
            { label: '+6.5°C', positionPercent: 62 },
            { label: '+9.8°C+', positionPercent: 100 },
          ],
          categories: [
            { range: '+1.5°C – +3.7°C', label: 'Tropical Lows Rise', color: '#5eead4', bgBadge: 'bg-teal-100 text-teal-900', impact: 'Lack of nocturnal relief in tropical megacities' },
            { range: '+3.8°C – +6.4°C', label: 'Disappearing Frost', color: '#f59e0b', bgBadge: 'bg-amber-100 text-amber-900', impact: 'Massive reduction in temperate snowfall and freezing cycles' },
            { range: '+6.5°C – +9.8°C+', label: 'Polar Minimum Collapse', color: '#7f1d1d', bgBadge: 'bg-red-200 text-red-950', impact: 'Profound Arctic winter warming preventing sea-ice regrowth' },
          ],
          interpretation: 'Under SSP5-8.5, winter minimums and tropical night temperatures warm rapidly, with Arctic winter lows surging by up to +10°C.',
        };
      case 'ssp370':
      case 'ssp245':
      default:
        return {
          title: 'Minimum Temperature (tmin) Anomaly',
          variableLabel: 'Monthly Minimum Nighttime Temperature',
          unit: 'Degrees Celsius',
          unitSymbol: '°C',
          gradientCss: 'from-sky-300 via-emerald-300 via-amber-300 to-rose-600',
          minVal: '+0.8°C',
          maxVal: '+5.5°C',
          meanVal: '+2.8°C',
          ticks: [
            { label: '+0.8°C', positionPercent: 0 },
            { label: '+2.2°C', positionPercent: 30 },
            { label: '+3.8°C', positionPercent: 65 },
            { label: '+5.5°C', positionPercent: 100 },
          ],
          categories: [
            { range: '+0.8°C – +2.0°C', label: 'Slight Frost Reduction', color: '#7dd3fc', bgBadge: 'bg-sky-100 text-sky-900', impact: 'Extended agricultural growing season' },
            { range: '+2.1°C – +3.7°C', label: 'Warm Night Escalation', color: '#fcd34d', bgBadge: 'bg-amber-100 text-amber-900', impact: 'Reduced overnight cooling; pest overwintering increase' },
            { range: '+3.8°C – +5.5°C', label: 'High Latitude Winter Thaw', color: '#e11d48', bgBadge: 'bg-rose-100 text-rose-900', impact: 'Permafrost thaw acceleration in boreal regions' },
          ],
          interpretation: 'Minimum temperatures rise faster than maximums, narrowing the diurnal temperature range across global continents.',
        };
    }
  }

  if (variableId === 'prec') {
    switch (scenarioId) {
      case 'ssp126':
        return {
          title: 'Precipitation (prec) Anomaly',
          variableLabel: 'Monthly Cumulative Precipitation Shifts',
          unit: 'Percentage Deviation / mm Shift',
          unitSymbol: '% (mm/mo)',
          gradientCss: 'from-amber-600 via-neutral-100 to-emerald-600',
          minVal: '-15%',
          maxVal: '+18%',
          meanVal: '+3%',
          ticks: [
            { label: '-15%', positionPercent: 0 },
            { label: '-5%', positionPercent: 30 },
            { label: '0%', positionPercent: 45 },
            { label: '+8%', positionPercent: 70 },
            { label: '+18%', positionPercent: 100 },
          ],
          categories: [
            { range: '-15% to -5%', label: 'Moderate Drying', color: '#d97706', bgBadge: 'bg-amber-100 text-amber-900', impact: 'Subtle regional precipitation deficits; manageable irrigation buffers' },
            { range: '-4% to +5%', label: 'Stable Rainfall Pattern', color: '#e5e7eb', bgBadge: 'bg-neutral-100 text-neutral-800', impact: 'Near-historical precipitation regimes maintained' },
            { range: '+6% to +18%', label: 'Slight Moistening', color: '#059669', bgBadge: 'bg-emerald-100 text-emerald-900', impact: 'Beneficial moisture in high latitudes and equatorial coasts' },
          ],
          interpretation: 'SSP1-2.6 limits global hydrological disruptions with regional changes generally contained within natural baseline variability.',
        };
      case 'ssp585':
        return {
          title: 'Precipitation (prec) Anomaly',
          variableLabel: 'Monthly Cumulative Precipitation Shifts',
          unit: 'Percentage Deviation / mm Shift',
          unitSymbol: '% (mm/mo)',
          gradientCss: 'from-amber-700 via-amber-300 via-neutral-100 via-cyan-400 to-blue-800',
          minVal: '-45%',
          maxVal: '+55%',
          meanVal: '+8%',
          ticks: [
            { label: '-45%', positionPercent: 0 },
            { label: '-20%', positionPercent: 25 },
            { label: '0%', positionPercent: 45 },
            { label: '+25%', positionPercent: 72 },
            { label: '+55%', positionPercent: 100 },
          ],
          categories: [
            { range: '-45% to -20%', label: 'Severe Aridification', color: '#b45309', bgBadge: 'bg-amber-200 text-amber-950', impact: 'Major Mediterranean, Sahel & Amazon drought hazards' },
            { range: '-19% to +9%', label: 'Intermediate Fluctuations', color: '#f3f4f6', bgBadge: 'bg-neutral-100 text-neutral-800', impact: 'High seasonal unpredictability and altered monsoonal onset' },
            { range: '+10% to +55%+', label: 'Deluges & Extreme Downpours', color: '#1d4ed8', bgBadge: 'bg-blue-200 text-blue-950', impact: 'Severe flash flooding and intensified tropical cyclones' },
          ],
          interpretation: 'Under SSP5-8.5, intense Clausius-Clapeyron atmospheric moisture loading triggers extreme hydrological polarization (wet get wetter, dry get drier).',
        };
      case 'ssp370':
      case 'ssp245':
      default:
        return {
          title: 'Precipitation (prec) Anomaly',
          variableLabel: 'Monthly Cumulative Precipitation Shifts',
          unit: 'Percentage Deviation / mm Shift',
          unitSymbol: '% (mm/mo)',
          gradientCss: 'from-amber-600 via-yellow-100 to-teal-600',
          minVal: '-25%',
          maxVal: '+30%',
          meanVal: '+4%',
          ticks: [
            { label: '-25%', positionPercent: 0 },
            { label: '-10%', positionPercent: 28 },
            { label: '0%', positionPercent: 45 },
            { label: '+12%', positionPercent: 70 },
            { label: '+30%', positionPercent: 100 },
          ],
          categories: [
            { range: '-25% to -10%', label: 'Substantial Drying', color: '#d97706', bgBadge: 'bg-amber-100 text-amber-900', impact: 'Increased summer drought frequencies in subtropical belts' },
            { range: '-9% to +7%', label: 'Moderate Variations', color: '#fef08a', bgBadge: 'bg-neutral-100 text-neutral-800', impact: 'Shifts in storm tracks and river catchment discharge' },
            { range: '+8% to +30%', label: 'Intensified Precipitation', color: '#0d9488', bgBadge: 'bg-teal-100 text-teal-900', impact: 'Elevated extreme 1-day rainfall risks in monsoon zones' },
          ],
          interpretation: 'Moderate precipitation shifts with amplified seasonality, resulting in sharper contrasts between rainy and dry periods.',
        };
    }
  }

  // Default: bioc (19 Bioclimatic Variables - BIO1 Annual Mean Temperature)
  switch (scenarioId) {
    case 'ssp126':
      return {
        title: 'Bioclimatic Thermal Scale (BIO1 Annual Mean Temperature Anomaly)',
        variableLabel: 'BIO1 Annual Mean Temperature & 19 Bioclimatic Derivatives',
        unit: 'Degrees Celsius',
        unitSymbol: '°C',
        gradientCss: 'from-emerald-400 via-lime-400 via-amber-400 to-orange-500',
        minVal: '+0.0°C',
        maxVal: '+3.5°C',
        meanVal: '+1.6°C',
        ticks: [
          { label: '0.0°C', positionPercent: 0 },
          { label: '+1.0°C', positionPercent: 28 },
          { label: '+1.8°C', positionPercent: 51 },
          { label: '+2.6°C', positionPercent: 75 },
          { label: '+3.5°C', positionPercent: 100 },
        ],
        categories: [
          { range: '+0.0°C – +1.2°C', label: 'Low Ecological Disruption', color: '#34d399', bgBadge: 'bg-emerald-100 text-emerald-900', impact: 'Species ranges remain largely intact; minimal biome turnover' },
          { range: '+1.3°C – +2.0°C', label: 'Paris Target Alignment', color: '#facc15', bgBadge: 'bg-yellow-100 text-yellow-900', impact: 'Manageable adaptation for agricultural and forestry zones' },
          { range: '+2.1°C – +3.5°C', label: 'Moderate High-Latitude Shift', color: '#f97316', bgBadge: 'bg-orange-100 text-orange-900', impact: 'Contained Arctic warming; moderate alpine biome retreat' },
        ],
        interpretation: 'WorldClim v2.1 bioclimatic indicators under SSP1-2.6 indicate manageable habitat disruption consistent with international mitigation targets.',
      };
    case 'ssp370':
      return {
        title: 'Bioclimatic Thermal Scale (BIO1 Annual Mean Temperature Anomaly)',
        variableLabel: 'BIO1 Annual Mean Temperature & 19 Bioclimatic Derivatives',
        unit: 'Degrees Celsius',
        unitSymbol: '°C',
        gradientCss: 'from-emerald-400 via-amber-400 via-orange-500 via-rose-600 to-purple-900',
        minVal: '+0.5°C',
        maxVal: '+7.5°C',
        meanVal: '+3.6°C',
        ticks: [
          { label: '+0.5°C', positionPercent: 0 },
          { label: '+2.0°C', positionPercent: 22 },
          { label: '+3.6°C', positionPercent: 44 },
          { label: '+5.5°C', positionPercent: 73 },
          { label: '+7.5°C', positionPercent: 100 },
        ],
        categories: [
          { range: '+0.5°C – +2.4°C', label: 'Oceanic & Coastal Buffer', color: '#34d399', bgBadge: 'bg-emerald-100 text-emerald-900', impact: 'Moderate marine thermal buffering in island systems' },
          { range: '+2.5°C – +4.5°C', label: 'Widespread Continental Shift', color: '#fb923c', bgBadge: 'bg-orange-100 text-orange-900', impact: 'Broad restructuring of temperate forests and savanna frontiers' },
          { range: '+4.6°C – +7.5°C', label: 'Critical Biome Destabilization', color: '#7e22ce', bgBadge: 'bg-purple-100 text-purple-900', impact: 'Extensive permafrost degradation and high species extinction risk' },
        ],
        interpretation: 'BIO1-BIO19 indicators show marked displacement of bioclimatic envelopes, stressing terrestrial biodiversity and water balances.',
      };
    case 'ssp585':
      return {
        title: 'Bioclimatic Thermal Scale (BIO1 Annual Mean Temperature Anomaly)',
        variableLabel: 'BIO1 Annual Mean Temperature & 19 Bioclimatic Derivatives',
        unit: 'Degrees Celsius',
        unitSymbol: '°C',
        gradientCss: 'from-emerald-400 via-yellow-400 via-orange-500 via-red-600 to-purple-950',
        minVal: '+0.8°C',
        maxVal: '+9.5°C+',
        meanVal: '+4.4°C',
        ticks: [
          { label: '+0.8°C', positionPercent: 0 },
          { label: '+2.5°C', positionPercent: 20 },
          { label: '+4.4°C', positionPercent: 42 },
          { label: '+7.0°C', positionPercent: 72 },
          { label: '+9.5°C+', positionPercent: 100 },
        ],
        categories: [
          { range: '+0.8°C – +2.9°C', label: 'Moderate Marine Warming', color: '#4ade80', bgBadge: 'bg-emerald-100 text-emerald-900', impact: 'Severe coral reef bleaching and pelagic fishery displacement' },
          { range: '+3.0°C – +5.9°C', label: 'Severe Continental Disruption', color: '#f97316', bgBadge: 'bg-orange-100 text-orange-900', impact: 'Profound agricultural disruption across temperate breadbaskets' },
          { range: '+6.0°C – +9.5°C+', label: 'Extreme Cryosphere Collapse', color: '#581c87', bgBadge: 'bg-purple-200 text-purple-950', impact: 'Virtually irreversible loss of Arctic sea-ice and alpine glaciers' },
        ],
        interpretation: 'Worst-case high emission bioclimatic surface indicates profound dislocation of historical climatic belts and critical biodiversity collapse.',
      };
    case 'ssp245':
    default:
      return {
        title: 'Bioclimatic Thermal Scale (BIO1 Annual Mean Temperature Anomaly)',
        variableLabel: 'BIO1 Annual Mean Temperature & 19 Bioclimatic Derivatives',
        unit: 'Degrees Celsius',
        unitSymbol: '°C',
        gradientCss: 'from-emerald-400 via-amber-300 via-orange-400 to-rose-600',
        minVal: '+0.2°C',
        maxVal: '+5.5°C',
        meanVal: '+2.7°C',
        ticks: [
          { label: '+0.2°C', positionPercent: 0 },
          { label: '+1.5°C', positionPercent: 25 },
          { label: '+2.7°C', positionPercent: 48 },
          { label: '+4.0°C', positionPercent: 72 },
          { label: '+5.5°C', positionPercent: 100 },
        ],
        categories: [
          { range: '+0.2°C – +1.8°C', label: 'Mild to Moderate Shift', color: '#34d399', bgBadge: 'bg-emerald-100 text-emerald-900', impact: 'Minor shifts in flowering dates and seasonal migratory paths' },
          { range: '+1.9°C – +3.5°C', label: 'Standard Climate Disruption', color: '#f59e0b', bgBadge: 'bg-amber-100 text-amber-900', impact: 'Substantial water balance shifts; heightened forest fire frequencies' },
          { range: '+3.6°C – +5.5°C', label: 'High Elevation & Polar Stress', color: '#e11d48', bgBadge: 'bg-rose-100 text-rose-900', impact: 'Severe shrinkage of alpine tundra and mountain water towers' },
        ],
        interpretation: 'Under SSP2-4.5, WorldClim bioclimatic variables model an average +2.7°C global mean warming with northern latitudes absorbing the greatest thermal delta.',
      };
  }
}

export const ClimateLegend: React.FC<ClimateLegendProps> = ({ config, className = '' }) => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);

  const scenarioId = config.scenario as CMIP6ScenarioId;
  const variableId = config.variable || 'bioc';
  const legendData = getDynamicLegendData(scenarioId, variableId);
  const scenarioObj = CMIP6_SCENARIOS.find((s) => s.id === scenarioId) || CMIP6_SCENARIOS[1];
  const variableObj = CMIP6_VARIABLES.find((v) => v.id === variableId) || CMIP6_VARIABLES[0];

  const isTempVariable = variableId === 'tmin' || variableId === 'tmax' || variableId === 'bioc';

  return (
    <div
      id="climate-dynamic-legend"
      className={`rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-xs transition-all ${className}`}
    >
      {/* Header with Expand / Collapse Toggle */}
      <div className="px-4 py-3 bg-neutral-50/90 border-b border-neutral-200/80 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="p-1 rounded-lg bg-blue-50 text-io-blue border border-blue-200">
            {isTempVariable ? (
              <Thermometer className="h-4 w-4 text-rose-500" />
            ) : (
              <Droplets className="h-4 w-4 text-blue-500" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-xs font-semibold text-neutral-900 flex items-center gap-1.5">
                {language === 'fr' ? 'Légende cartographique dynamique & échelle' : 'Dynamic Map Legend & Gradient Scale'}
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200">
                {language === 'fr' ? 'Unité' : 'Unit'}: {legendData.unitSymbol} ({legendData.unit})
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {scenarioObj.code}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500">
              {language === 'fr' 
                ? `Calibré pour ${variableObj.label} • Référence WorldClim v2.1 (delta 1970–2000)` 
                : `Calibrated for ${variableObj.label} • WorldClim v2.1 baseline (1970–2000 delta)`}
            </p>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          type="button"
          id="toggle-climate-legend-btn"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition cursor-pointer shadow-2xs shrink-0"
        >
          {isOpen ? (
            <>
              <EyeOff className="h-3.5 w-3.5 text-neutral-500" />
              <span>{t.climateLegendToggleHide}</span>
              <ChevronUp className="h-3 w-3 text-neutral-400" />
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5 text-io-blue" />
              <span>{t.climateLegendToggleShow}</span>
              <ChevronDown className="h-3 w-3 text-neutral-400" />
            </>
          )}
        </button>
      </div>

      {/* Expandable Legend Body */}
      {isOpen && (
        <div className="p-4 space-y-4 text-xs">
          {/* Main Gradient Bar & Numerical Ticks */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-neutral-600">
              <span className="font-semibold text-neutral-800 flex items-center gap-1">
                <Sliders className="h-3.5 w-3.5 text-io-blue" />
                {legendData.title}
              </span>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span>Min: <strong className="text-neutral-900">{legendData.minVal}</strong></span>
                <span>•</span>
                <span>Global Mean: <strong className="text-io-blue">{legendData.meanVal}</strong></span>
                <span>•</span>
                <span>Max: <strong className="text-neutral-900">{legendData.maxVal}</strong></span>
              </div>
            </div>

            {/* Continuous Color Gradient Bar */}
            <div className="relative pt-1 pb-4">
              <div
                className={`h-4 w-full rounded-md shadow-inner border border-neutral-300 bg-gradient-to-r ${legendData.gradientCss}`}
                role="img"
                aria-label={`Color gradient legend ranging from ${legendData.minVal} to ${legendData.maxVal}`}
              />

              {/* Ticks and Numerical Labels */}
              <div className="relative w-full h-4 mt-1">
                {legendData.ticks.map((tick, index) => {
                  return (
                    <div
                      key={index}
                      className="absolute -translate-x-1/2 flex flex-col items-center"
                      style={{ left: `${tick.positionPercent}%` }}
                    >
                      <div className="w-0.5 h-1.5 bg-neutral-400 mb-0.5" />
                      <span className="font-mono text-[10px] text-neutral-700 font-semibold whitespace-nowrap">
                        {tick.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Categorical Classifications Grid */}
          <div className="pt-2 border-t border-neutral-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-neutral-700">
                Calibrated Impact Bins & Thermal Thresholds:
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                Metric: {legendData.unit} ({legendData.unitSymbol})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {legendData.categories.map((cat, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl border border-neutral-200/90 bg-neutral-50/70 space-y-1"
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="font-mono text-[11px] font-bold text-neutral-900 flex items-center gap-1.5">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.range}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium truncate ${cat.bgBadge}`}>
                      {cat.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-600 leading-tight">
                    {cat.impact}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Scientific Interpretation Footer Note */}
          <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-2 text-[11px] text-neutral-600">
            <Info className="h-3.5 w-3.5 text-io-blue shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-neutral-800 font-medium leading-snug">
                {legendData.interpretation}
              </p>
              <p className="text-neutral-500 text-[10px]">
                Downscaled projections represent anomaly offsets relative to the WorldClim 1970–2000 historical baseline using the delta bias-correction method.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
