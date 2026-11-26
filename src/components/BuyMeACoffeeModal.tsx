import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coffee, 
  Heart, 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  Server, 
  Cpu, 
  Globe2,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../translations';

interface BuyMeACoffeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultHandle?: string;
}

interface DonationTier {
  id: string;
  coffees: number;
  amount: number;
  label: string;
  badge?: string;
  description: string;
}

const getDonationTiers = (lang: string): DonationTier[] => [
  {
    id: 'tier-1',
    coffees: 1,
    amount: 5,
    label: lang === 'fr' ? '1 Café' : '1 Coffee',
    description: lang === 'fr' ? 'Un coup de pouce rapide pour nos développements' : 'A quick boost to power code updates',
  },
  {
    id: 'tier-3',
    coffees: 3,
    amount: 15,
    label: lang === 'fr' ? '3 Cafés' : '3 Coffees',
    badge: lang === 'fr' ? 'Le Plus Populaire' : 'Most Popular',
    description: lang === 'fr' ? 'Couvre le traitement des données climatiques CMIP6' : 'Covers CMIP6 climate data processing & storage',
  },
  {
    id: 'tier-5',
    coffees: 5,
    amount: 25,
    label: lang === 'fr' ? '5 Cafés' : '5 Coffees',
    badge: lang === 'fr' ? 'Mécène Recherche' : 'Research Patron',
    description: lang === 'fr' ? 'Finance le calcul IA étendu & les améliorations' : 'Sponsors extended AI compute & continuous improvements',
  },
];

export const BuyMeACoffeeModal: React.FC<BuyMeACoffeeModalProps> = ({
  isOpen,
  onClose,
  defaultHandle = 'aidataanalyst',
}) => {
  const { t, language } = useLanguage();
  const [selectedTier, setSelectedTier] = useState<string>('tier-3');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [supporterName, setSupporterName] = useState<string>('');
  const [supporterMessage, setSupporterMessage] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [hasDonated, setHasDonated] = useState<boolean>(false);

  const tiers = getDonationTiers(language);
  const currentTier = tiers.find((t) => t.id === selectedTier);
  const finalAmount = isCustom ? Number(customAmount) || 5 : currentTier?.amount || 15;
  const finalCoffees = isCustom ? Math.max(1, Math.round(finalAmount / 5)) : currentTier?.coffees || 3;

  const donationUrl = `https://buymeacoffee.com/${defaultHandle}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(donationUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleProceedDonation = () => {
    try {
      window.open(donationUrl, '_blank', 'noopener,noreferrer');
    } catch {
      window.location.href = donationUrl;
    }
    setHasDonated(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          id="buy-me-coffee-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-900/60 backdrop-blur-xs overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden my-8 text-neutral-900 dark:text-neutral-100"
          >
            {/* Header with Warm Theme */}
            <div className="relative bg-gradient-to-br from-amber-400 via-amber-300 to-yellow-400 dark:from-amber-500 dark:via-amber-400 dark:to-yellow-500 p-6 text-neutral-900">
              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900/10 hover:bg-neutral-900/20 text-neutral-800 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-white dark:bg-neutral-900 shadow-md flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Coffee className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] uppercase tracking-wider font-bold bg-neutral-900 text-amber-300 px-2 py-0.5 rounded-md">
                      {t.coffeeFundraisingBadge}
                    </span>
                    <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1">
                      <Heart className="h-3 w-3 fill-rose-500 text-rose-500 inline" /> {t.supportOurWork}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900 mt-1">
                    {t.coffeeSupportTitle}
                  </h2>
                </div>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-neutral-800 leading-relaxed font-medium">
                {t.coffeeSupportDesc}
              </p>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-5">
              {hasDonated ? (
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-5 text-center space-y-3 animate-fade-in">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                    {t.coffeeThankYouTitle}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 max-w-sm mx-auto">
                    {t.coffeeThankYouDesc}
                  </p>
                  <div className="pt-2 flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setHasDonated(false)}
                      className="text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                    >
                      {t.coffeeAnotherContribution}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-xs font-semibold text-white px-4 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white"
                    >
                      {t.coffeeDoneBtn}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Select Tiers */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 block mb-2">
                      {t.coffeeSelectAmount}
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {tiers.map((tier) => {
                        const isSelected = !isCustom && selectedTier === tier.id;
                        return (
                          <button
                            key={tier.id}
                            type="button"
                            onClick={() => {
                              setIsCustom(false);
                              setSelectedTier(tier.id);
                            }}
                            className={`relative p-3 rounded-xl border text-center transition flex flex-col items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 dark:border-amber-500 ring-2 ring-amber-400/40 shadow-xs'
                                : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-850 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50/50 dark:hover:bg-neutral-800'
                            }`}
                          >
                            {tier.badge && (
                              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white font-bold text-[9px] px-1.5 py-0.5 rounded-full shadow-2xs whitespace-nowrap">
                                {tier.badge}
                              </span>
                            )}
                            <div className="text-lg mt-1 font-bold text-neutral-900 dark:text-neutral-100">
                              <span className="text-amber-600 dark:text-amber-400 font-mono mr-0.5">$</span>{tier.amount}
                            </div>
                            <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1 mt-0.5">
                              <Coffee className="h-3 w-3 text-amber-500" />
                              <span>{tier.label}</span>
                            </div>
                            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 leading-tight line-clamp-2">
                              {tier.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Amount option */}
                    <div className="mt-2.5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsCustom(!isCustom)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                            isCustom 
                              ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100' 
                              : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                          }`}
                        >
                          {t.coffeeCustomAmount}
                        </button>
                        {isCustom && (
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-sm">
                              $
                            </span>
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={customAmount}
                              onChange={(e) => setCustomAmount(e.target.value)}
                              placeholder={t.coffeeEnterCustom}
                              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 pl-7 pr-3 py-1.5 text-xs text-neutral-900 dark:text-neutral-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Optional message / supporter name */}
                  <div className="space-y-2 pt-1">
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
                        {t.coffeeYourNameOptional}
                      </label>
                      <input
                        type="text"
                        value={supporterName}
                        onChange={(e) => setSupporterName(e.target.value)}
                        placeholder={t.coffeeYourNamePlaceholder}
                        className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-1.5 text-xs text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-neutral-400 dark:focus:border-neutral-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
                        {t.coffeeNoteOptional}
                      </label>
                      <input
                        type="text"
                        value={supporterMessage}
                        onChange={(e) => setSupporterMessage(e.target.value)}
                        placeholder={t.coffeeNotePlaceholder}
                        className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-1.5 text-xs text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-neutral-400 dark:focus:border-neutral-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Where the funds go */}
                  <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200/80 dark:border-neutral-750 p-3 text-xs space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      {t.coffeeHowHelps}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[11px] text-neutral-600 dark:text-neutral-300">
                      <div className="flex items-center gap-1.5">
                        <Cpu className="h-3 w-3 text-io-blue shrink-0" />
                        <span>{t.coffeeHelpCompute}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Server className="h-3 w-3 text-amber-600 shrink-0" />
                        <span>{t.coffeeHelpStorage}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Globe2 className="h-3 w-3 text-emerald-600 shrink-0" />
                        <span>{t.coffeeHelpClimate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 space-y-2">
                    <button
                      type="button"
                      id="proceed-buy-coffee-button"
                      onClick={handleProceedDonation}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-900 font-bold px-6 py-3 text-sm shadow-md hover:shadow-lg transition-all transform active:scale-[0.99] cursor-pointer"
                    >
                      <Coffee className="h-4 w-4" />
                      <span>{t.coffeeProceedBtn(finalAmount, finalCoffees)}</span>
                      <ExternalLink className="h-3.5 w-3.5 ml-0.5 opacity-70" />
                    </button>

                    <div className="flex items-center justify-between pt-1 text-xs text-neutral-500 dark:text-neutral-400 px-1">
                      <span className="flex items-center gap-1 text-[11px]">
                        {t.coffeeSecureDirect}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition hover:underline cursor-pointer"
                      >
                        {copiedLink ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-emerald-700 dark:text-emerald-400">{t.coffeeLinkCopied}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>{t.coffeeCopyLink}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const BuyMeCoffeeButton: React.FC<{
  onClick: () => void;
  variant?: 'header' | 'compact' | 'callout';
  className?: string;
}> = ({ onClick, variant = 'header', className = '' }) => {
  const { t } = useLanguage();

  if (variant === 'callout') {
    return (
      <div 
        id="buy-me-coffee-callout-banner"
        className={`rounded-2xl border border-amber-200/80 dark:border-amber-500/30 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/25 dark:via-neutral-900 dark:to-orange-950/20 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs ${className}`}
      >
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-amber-400 text-neutral-900 flex items-center justify-center shadow-xs shrink-0">
            <Coffee className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {t.coffeeCalloutTitle}
              </h4>
              <span className="text-[10px] font-bold bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full">
                {t.coffeeFundraisingBadge}
              </span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-0.5">
              {t.coffeeCalloutDesc}
            </p>
          </div>
        </div>

        <button
          type="button"
          id="callout-buy-coffee-btn"
          onClick={onClick}
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-900 text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all cursor-pointer"
        >
          <Coffee className="h-4 w-4" />
          <span>{t.buyMeCoffee}</span>
          <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
        </button>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        id="compact-buy-coffee-btn"
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-400 hover:bg-amber-500 text-neutral-900 shadow-xs hover:shadow transition cursor-pointer ${className}`}
        title={t.buyMeCoffee}
      >
        <Coffee className="h-3.5 w-3.5" />
        <span>{t.buyMeCoffee}</span>
      </button>
    );
  }

  // Default: Header button
  return (
    <button
      type="button"
      id="header-buy-coffee-btn"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-400 hover:bg-amber-500 text-neutral-900 border border-amber-500/40 shadow-xs hover:shadow transition-all transform active:scale-95 cursor-pointer ${className}`}
      title={t.buyMeCoffee}
    >
      <Coffee className="h-3.5 w-3.5 text-neutral-900" />
      <span>{t.buyMeCoffee}</span>
      <span className="flex h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
    </button>
  );
};

