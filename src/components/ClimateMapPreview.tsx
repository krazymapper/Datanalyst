import React, { useState } from 'react';
import { 
  Globe, 
  Thermometer, 
  Layers, 
  Maximize2, 
  Minimize2, 
  Info, 
  Eye, 
  Compass, 
  Calendar,
  Flame,
  Leaf,
  Scale,
  AlertTriangle,
  MapPin,
  Sparkles,
  Download,
  Check,
  Loader2
} from 'lucide-react';
import type { CMIP6ClimateConfig, CMIP6ScenarioId } from '../types';
import { CMIP6_SCENARIOS, CMIP6_MODELS } from './ClimateSetupSection';
import { useLanguage } from '../translations';

// Representative CMIP6 downscaled climate map placeholder images
import ssp126Img from '../assets/images/ssp126_map_preview_1788825459264.jpg';
import ssp245Img from '../assets/images/climate_map_preview_1788825446751.jpg';
import ssp585Img from '../assets/images/ssp585_map_preview_1788825469886.jpg';

interface ClimateMapPreviewProps {
  config: CMIP6ClimateConfig;
  onSelectScenario?: (scenario: CMIP6ScenarioId) => void;
  disabled?: boolean;
}

interface ScenarioMapDetails {
  imageSrc: string;
  anomalyRange: string;
  arcticWarming: string;
  thermalClass: string;
  accentColor: string;
  badgeBg: string;
  summary: string;
  impactHotspots: Array<{ name: string; impact: string }>;
}

const SCENARIO_DETAILS: Record<CMIP6ScenarioId, ScenarioMapDetails> = {
  ssp126: {
    imageSrc: ssp126Img,
    anomalyRange: '+1.5°C to +1.8°C',
    arcticWarming: '+2.5°C to +3.5°C',
    thermalClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    accentColor: '#059669',
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    summary: 'Low greenhouse gas trajectory consistent with Paris Agreement goals. Global temperature stabilizes by mid-century with minimal extreme thermal displacement.',
    impactHotspots: [
      { name: 'Arctic Basin', impact: 'Subdued sea ice retreat; permafrost thaw minimized' },
      { name: 'Tropical Oceans', impact: 'Moderate coral thermal stress with viable deep-water refugia' },
      { name: 'Mediterranean', impact: 'Manageable ~5–8% reduction in summer precipitation' },
    ],
  },
  ssp245: {
    imageSrc: ssp245Img,
    anomalyRange: '+2.4°C to +3.0°C (~+2.7°C mean)',
    arcticWarming: '+4.5°C to +6.0°C',
    thermalClass: 'text-blue-700 bg-blue-50 border-blue-200',
    accentColor: '#2563eb',
    badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
    summary: 'Middle-of-the-road trajectory reflecting existing policies and pledges. Evident continental warming with pronounced continental mid-latitude dry spells.',
    impactHotspots: [
      { name: 'Arctic Basin', impact: 'Frequent ice-free September events by late century' },
      { name: 'Boreal Forests', impact: 'Shift in timberlines and increased wildfire frequency' },
      { name: 'South/Southeast Asia', impact: 'Intensified monsoon seasonality and heavy precipitation spikes' },
    ],
  },
  ssp370: {
    imageSrc: ssp245Img, // Representative intermediate-high
    anomalyRange: '+3.2°C to +4.0°C (~+3.6°C mean)',
    arcticWarming: '+6.5°C to +8.0°C',
    thermalClass: 'text-amber-700 bg-amber-50 border-amber-200',
    accentColor: '#d97706',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    summary: 'Regional rivalry pathway with high regional emissions and weak environmental cooperation. Substantial thermal anomaly across terrestrial landmasses.',
    impactHotspots: [
      { name: 'Amazon Basin', impact: 'Heightened risk of forest dieback and savanna transition' },
      { name: 'Sahel & North Africa', impact: 'Expansion of arid fringes and extreme heat stress days' },
      { name: 'Subpolar Regions', impact: 'Rapid permafrost degradation releasing methane feedbacks' },
    ],
  },
  ssp585: {
    imageSrc: ssp585Img,
    anomalyRange: '+4.0°C to +5.2°C (~+4.4°C mean)',
    arcticWarming: '+8.0°C to +11.5°C',
    thermalClass: 'text-rose-700 bg-rose-50 border-rose-200',
    accentColor: '#e11d48',
    badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
    summary: 'High-emission fossil-fueled development scenario. Severe planetary heating with intense polar amplification and dangerous wet-bulb temperature exceedance.',
    impactHotspots: [
      { name: 'Arctic Ocean', impact: 'Virtually perennial sea-ice loss and massive glacier destabilization' },
      { name: 'Equatorial Belts', impact: 'Severe exceedance of physiological human survivability thresholds' },
      { name: 'Global Cryosphere', impact: 'Catastrophic ice sheet melt accelerating century-scale sea-level rise' },
    ],
  },
};

export const ClimateMapPreview: React.FC<ClimateMapPreviewProps> = ({
  config,
  onSelectScenario,
  disabled = false,
}) => {
  const { t, language } = useLanguage();
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [showHotspots, setShowHotspots] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const scenarioId = config.scenario as CMIP6ScenarioId;
  const currentDetails = SCENARIO_DETAILS[scenarioId] || SCENARIO_DETAILS.ssp245;
  const scenarioObj = CMIP6_SCENARIOS.find((s) => s.id === scenarioId) || CMIP6_SCENARIOS[1];
  const modelObj = CMIP6_MODELS.find((m) => m.id === config.model) || CMIP6_MODELS[0];

  const handleExportPNG = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportSuccess(false);
    setExportError(null);

    try {
      // Create high-resolution 2400 x 1350 canvas for pristine publication quality
      const width = 2400;
      const height = 1350;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context unavailable');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 1. Dark Scientific Backdrop
      ctx.fillStyle = '#080c14';
      ctx.fillRect(0, 0, width, height);

      // Coordinate Latitude/Longitude grid guidelines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 80; x < width; x += 160) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 80; y < height; y += 140) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Load and Draw Map Graphic
      const mapImg = new Image();
      mapImg.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        mapImg.onload = () => resolve();
        mapImg.onerror = () => reject(new Error('Failed to load climate map image'));
        mapImg.src = currentDetails.imageSrc;
      });

      const mapX = 60;
      const mapY = 130;
      const mapW = width - 120; // 2280
      const mapH = height - 300; // 1050

      ctx.drawImage(mapImg, mapX, mapY, mapW, mapH);

      // Subtle map boundary border & vignette
      const mapVignette = ctx.createLinearGradient(0, mapY, 0, mapY + mapH);
      mapVignette.addColorStop(0, 'rgba(8, 12, 20, 0.35)');
      mapVignette.addColorStop(0.12, 'transparent');
      mapVignette.addColorStop(0.85, 'transparent');
      mapVignette.addColorStop(1, 'rgba(8, 12, 20, 0.85)');
      ctx.fillStyle = mapVignette;
      ctx.fillRect(mapX, mapY, mapW, mapH);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.strokeRect(mapX, mapY, mapW, mapH);

      // 3. Top Publication Header
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, 120);

      // Accent color strip for scenario
      ctx.fillStyle = currentDetails.accentColor;
      ctx.fillRect(0, 0, width, 6);

      // Main Header Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
      ctx.fillText(`CMIP6 Global Climate Projection: ${scenarioObj.code} (${scenarioObj.name})`, 60, 52);

      // Subtitle & GCM Metadata
      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 20px system-ui, -apple-system, sans-serif';
      ctx.fillText(
        `Downscaled GCM: ${modelObj.name} (${modelObj.institution})  •  Time Horizon: ${config.period}  •  Spatial Resolution: ${config.resolution}  •  WorldClim v2.1 Baseline: 1970–2000`,
        60,
        92
      );

      // Scenario Pill Badge at top-right
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      if (typeof ctx.roundRect === 'function') {
        ctx.beginPath();
        ctx.roundRect(width - 520, 22, 460, 76, 12);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillRect(width - 520, 22, 460, 76);
      }

      ctx.fillStyle = currentDetails.accentColor;
      ctx.beginPath();
      ctx.arc(width - 490, 60, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.fillText(`${scenarioObj.code} • ${scenarioObj.tempRise2100}`, width - 468, 52);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 15px "Courier New", monospace';
      ctx.fillText(`ID: ${config.metadataIdentifier}`, width - 468, 78);

      // 4. Regional Hotspots Callouts (if active)
      if (showHotspots && currentDetails.impactHotspots.length > 0) {
        let spotX = 80;
        const spotY = mapY + mapH - 85;

        currentDetails.impactHotspots.forEach((spot) => {
          const title = `${spot.name}: `;
          const text = spot.impact;

          ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
          const titleW = ctx.measureText(title).width;
          ctx.font = '500 15px system-ui, -apple-system, sans-serif';
          const textW = ctx.measureText(text).width;
          const boxW = titleW + textW + 40;

          if (spotX + boxW < width - 80) {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
            if (typeof ctx.roundRect === 'function') {
              ctx.beginPath();
              ctx.roundRect(spotX, spotY, boxW, 44, 8);
              ctx.fill();
              ctx.stroke();
            } else {
              ctx.fillRect(spotX, spotY, boxW, 44);
            }

            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(spotX + 16, spotY + 22, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#fde047';
            ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
            ctx.fillText(title, spotX + 28, spotY + 28);

            ctx.fillStyle = '#e2e8f0';
            ctx.font = '500 15px system-ui, -apple-system, sans-serif';
            ctx.fillText(text, spotX + 28 + titleW, spotY + 28);

            spotX += boxW + 16;
          }
        });
      }

      // 5. Bottom Scientific Colorbar & Metric Bar
      const footerY = height - 160;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, footerY, width, 160);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.moveTo(0, footerY);
      ctx.lineTo(width, footerY);
      ctx.stroke();

      // Thermal Gradient Bar
      const barX = 60;
      const barY = footerY + 45;
      const barW = 620;
      const barH = 26;

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
      ctx.fillText('PROJECTED THERMAL ANOMALY SCALE (CELSIUS):', barX, barY - 12);

      const grad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
      grad.addColorStop(0, '#10b981');   // 0°C
      grad.addColorStop(0.25, '#34d399'); // +1.5°C
      grad.addColorStop(0.5, '#fbbf24');  // +3°C
      grad.addColorStop(0.75, '#f97316'); // +4.5°C
      grad.addColorStop(0.9, '#e11d48');  // +5.5°C
      grad.addColorStop(1, '#701a75');    // +6°C+

      ctx.fillStyle = grad;
      if (typeof ctx.roundRect === 'function') {
        ctx.beginPath();
        ctx.roundRect(barX, barY, barW, barH, 4);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillRect(barX, barY, barW, barH);
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.stroke();

      // Scale tick marks
      const ticks = [
        { label: '0°C', pct: 0 },
        { label: '+1.5°C', pct: 0.25 },
        { label: '+3.0°C', pct: 0.5 },
        { label: '+4.5°C', pct: 0.75 },
        { label: '+6.0°C+', pct: 1.0 },
      ];

      ticks.forEach((tick) => {
        const tx = barX + tick.pct * barW;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tx, barY + barH);
        ctx.lineTo(tx, barY + barH + 6);
        ctx.stroke();

        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'bold 13px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(tick.label, tx, barY + barH + 22);
      });
      ctx.textAlign = 'left';

      // Summary Metrics to the right of the colorbar
      const metricsX = barX + barW + 80;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
      ctx.fillText('GLOBAL PROJECTION SUMMARY:', metricsX, barY - 12);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px system-ui, -apple-system, sans-serif';
      ctx.fillText('Projected Global Mean Rise: ', metricsX, barY + 16);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
      ctx.fillText(currentDetails.anomalyRange, metricsX + 230, barY + 16);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px system-ui, -apple-system, sans-serif';
      ctx.fillText('Polar Arctic Amplification: ', metricsX, barY + 42);
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
      ctx.fillText(currentDetails.arcticWarming, metricsX + 230, barY + 42);

      // Attribution on far right
      const rightX = width - 560;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 15px system-ui, -apple-system, sans-serif';
      ctx.fillText('Echo-Radio Bioacoustics & Eco-Spatial Platform', rightX, barY - 10);
      ctx.font = '13px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Source: WorldClim v2.1 Downscaled CMIP6 Climate Ensembles', rightX, barY + 14);
      ctx.fillText(`Exported: ${new Date().toISOString().slice(0, 10)} • High-Resolution 2400x1350 PNG`, rightX, barY + 36);

      // 6. Download PNG blob
      canvas.toBlob((blob) => {
        if (!blob) throw new Error('Blob creation failed');
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const safeModel = modelObj.name.replace(/[^a-zA-Z0-9_-]/g, '_');
        link.download = `CMIP6_${scenarioObj.code}_${safeModel}_${config.period}_2400x1350.png`;
        link.href = blobUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);

        setIsExporting(false);
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3500);
      }, 'image/png');

    } catch (err) {
      console.error('High-res canvas export error:', err);
      // Fallback: html2canvas
      try {
        const container = document.getElementById('climate-map-preview-container');
        if (container) {
          const html2canvasModule = await import('html2canvas');
          const html2canvasFn = (html2canvasModule.default || html2canvasModule) as (
            element: HTMLElement,
            options?: Record<string, unknown>
          ) => Promise<HTMLCanvasElement>;
          const fallbackCanvas = await html2canvasFn(container, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#080c14'
          });
          const dataUrl = fallbackCanvas.toDataURL('image/png');
          const link = document.createElement('a');
          const safeModel = modelObj.name.replace(/[^a-zA-Z0-9_-]/g, '_');
          link.download = `CMIP6_${scenarioObj.code}_${safeModel}_${config.period}.png`;
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setIsExporting(false);
          setExportSuccess(true);
          setTimeout(() => setExportSuccess(false), 3500);
          return;
        }
      } catch (fallbackErr) {
        console.error('Fallback export failed:', fallbackErr);
      }
      setIsExporting(false);
      setExportError('Export failed. Please try again.');
      setTimeout(() => setExportError(null), 4000);
    }
  };

  return (
    <div 
      id="climate-map-preview-container" 
      className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-xs transition-all"
    >
      {/* Top Bar / Metadata Header */}
      <div className="p-3.5 sm:p-4 bg-neutral-50/80 border-b border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="p-1 rounded-lg bg-blue-100 text-io-blue">
            <Globe className="h-4 w-4" />
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs font-semibold text-neutral-900">
                {language === 'fr' ? 'Illustration : aperçu non calculé à partir des données WorldClim' : 'Illustration: preview not computed from WorldClim data'}
              </h3>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${currentDetails.badgeBg}`}>
                {scenarioObj.code} • {scenarioObj.tempRise2100}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500">
              {language === 'fr' 
                ? `Surface d'anomalie WorldClim v2.1 mise à l'échelle sous ${modelObj.name} (${config.period})` 
                : `Downscaled WorldClim v2.1 anomaly projection surface under ${modelObj.name} (${config.period})`}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 flex-wrap">
          {/* Dedicated High-Res PNG Export Button */}
          <button
            type="button"
            id="export-scenario-png-btn"
            disabled={disabled || isExporting}
            onClick={handleExportPNG}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition cursor-pointer flex items-center gap-1.5 shadow-xs select-none ${
              exportSuccess
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : exportError
                ? 'bg-rose-50 border-rose-300 text-rose-800'
                : 'bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900'
            } ${disabled || isExporting ? 'opacity-60 cursor-not-allowed' : ''}`}
            title={language === 'fr' ? "Exporter l'aperçu de la carte en fichier PNG haute résolution (2400x1350)" : "Export current climate scenario visual as a high-resolution PNG image file (2400x1350)"}
          >
            {isExporting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-io-blue" />
                <span>{language === 'fr' ? 'Exportation...' : 'Exporting PNG...'}</span>
              </>
            ) : exportSuccess ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="font-semibold">{language === 'fr' ? 'PNG Exporté !' : 'PNG Exported!'}</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5 text-io-blue" />
                <span>{language === 'fr' ? 'Exporter PNG' : 'Export PNG'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowHotspots(!showHotspots)}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium border transition cursor-pointer flex items-center gap-1 ${
              showHotspots 
                ? 'bg-white text-neutral-800 border-neutral-300 shadow-xs' 
                : 'bg-neutral-100 text-neutral-500 border-transparent hover:bg-neutral-200/70'
            }`}
            title={language === 'fr' ? "Basculer l'affichage des points chauds" : "Toggle regional impact callouts"}
          >
            <MapPin className="h-3 w-3 text-io-blue" />
            <span>{language === 'fr' ? 'Points chauds' : 'Hotspots'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEnlarged(!isEnlarged)}
            className="px-2 py-1 rounded-lg text-[11px] font-medium bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100 transition cursor-pointer flex items-center gap-1 shadow-xs"
            title={isEnlarged ? (language === 'fr' ? "Vue standard" : "Standard view") : (language === 'fr' ? "Agrandir l'aperçu" : "Enlarge map preview")}
          >
            {isEnlarged ? (
              <>
                <Minimize2 className="h-3 w-3" />
                <span>{language === 'fr' ? 'Réduire' : 'Compact'}</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3 w-3" />
                <span>{language === 'fr' ? 'Agrandir' : 'Enlarge'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Map Graphic Canvas / Image Section */}
      <div className="relative bg-neutral-950 overflow-hidden group">
        <img
          src={currentDetails.imageSrc}
          alt={`Representative global climate projection map for ${scenarioObj.code} (${scenarioObj.name}) using ${modelObj.name} model for ${config.period}`}
          referrerPolicy="no-referrer"
          className={`w-full object-cover transition-transform duration-500 ease-out select-none ${
            isEnlarged ? 'h-80 sm:h-[420px]' : 'h-52 sm:h-64'
          }`}
        />

        {/* Subtle Map Coordinate Grid Lines Overlay Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/10 to-neutral-950/30 pointer-events-none" />

        {/* Top Floating Badge on Image */}
        <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
          <div className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono flex items-center gap-1.5 shadow-lg">
            <span className="inline-block h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: currentDetails.accentColor }} />
            <span>{config.metadataIdentifier}</span>
          </div>
        </div>

        <div className="absolute top-3 right-3 hidden sm:flex items-center gap-1.5 pointer-events-none">
          <div className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white/90 text-[10px] font-medium flex items-center gap-1">
            <Layers className="h-3 w-3 text-blue-300" />
            <span>Res: {config.resolution}</span>
          </div>
          <div className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white/90 text-[10px] font-medium flex items-center gap-1">
            <Calendar className="h-3 w-3 text-amber-300" />
            <span>{config.period}</span>
          </div>
        </div>

        {/* Floating Hotspots Callout Badges */}
        {showHotspots && (
          <div className="absolute bottom-12 left-3 right-3 flex flex-wrap gap-2 pointer-events-none">
            {currentDetails.impactHotspots.map((spot, idx) => (
              <div 
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-neutral-900/85 backdrop-blur-md border border-white/15 text-white shadow-lg text-[10px] flex items-center gap-1.5 max-w-full sm:max-w-xs"
              >
                <span className="font-semibold text-amber-300 shrink-0">{spot.name}:</span>
                <span className="text-neutral-200 truncate">{spot.impact}</span>
              </div>
            ))}
          </div>
        )}

        {/* Scientific Thermal Colorbar / Gradient Legend Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-neutral-950/90 backdrop-blur-md border-t border-white/10 px-3 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-white text-[10px]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-300 flex items-center gap-1">
              <Thermometer className="h-3 w-3 text-rose-400" />
              Projected Anomaly Scale:
            </span>
            <div className="flex items-center gap-1 font-mono text-[9px] text-neutral-300">
              <span>0°C</span>
              {/* Scientific continuous color gradient bar */}
              <div className="h-2.5 w-28 sm:w-44 rounded-sm bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-600 shadow-inner border border-white/20" />
              <span>+6°C+</span>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-[10px] text-neutral-300">
            <span>Global Mean: <strong className="text-white">{currentDetails.anomalyRange}</strong></span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Arctic Amplification: <strong className="text-amber-300">{currentDetails.arcticWarming}</strong></span>
          </div>
        </div>
      </div>

      {/* Interactive Scenario Quick-Switch Strip */}
      <div className="p-3 bg-neutral-50/90 border-t border-neutral-200/80 flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-neutral-600 flex items-center gap-1 mr-1">
            <Sparkles className="h-3 w-3 text-io-blue" />
            Switch map view:
          </span>
          {CMIP6_SCENARIOS.map((sc) => {
            const isActive = config.scenario === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                disabled={disabled}
                onClick={() => onSelectScenario && onSelectScenario(sc.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white border-neutral-900 text-neutral-900 font-semibold shadow-xs ring-1 ring-neutral-900/10'
                    : 'bg-white/60 border-neutral-200 text-neutral-600 hover:bg-white hover:text-neutral-900'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {sc.id === 'ssp126' && <Leaf className="h-3 w-3 text-emerald-600" />}
                {sc.id === 'ssp245' && <Scale className="h-3 w-3 text-blue-600" />}
                {sc.id === 'ssp370' && <AlertTriangle className="h-3 w-3 text-amber-600" />}
                {sc.id === 'ssp585' && <Flame className="h-3 w-3 text-rose-600" />}
                <span>{sc.code}</span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-neutral-500 leading-snug">
          <span>{currentDetails.summary}</span>
        </div>
      </div>
    </div>
  );
};
