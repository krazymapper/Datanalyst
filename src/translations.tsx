import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'fr';

export interface Translations {
  // Navigation & Header
  appTitle: string;
  workspaceSubtitle: string;
  languageSelect: string;
  buyMeCoffee: string;
  supportOurWork: string;

  // Setup Step 1
  heroTitle1: string;
  heroTitle2: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDesc: string;
  heroDescription: string;
  heroSubdesc: string;
  step1Title: string;
  dropCsvPrompt: string;
  dropCsvSubprompt: string;
  dropzoneUploading: string;
  dropzonePrompt: string;
  dropzoneSubtext: string;
  uploadingDataset: string;
  orPasteGcs: string;
  gcsUriTitle: string;
  gcsUriSubtitle: string;
  pasteGcsPlaceholder: string;
  addGcsBtn: string;
  gcsAddButton: string;
  gcsErrorPrefix: string;
  fileLimitWarning: string;
  removeFileTooltip: string;
  removeFile: string;

  // Climate Section
  climateHeaderTitle: string;
  climateHeaderBadge: string;
  climateHeaderDesc: string;
  climateToggleLabel: string;
  climateEnabledNotice: string;
  climateScenarioLabel: string;
  climateModelLabel: string;
  climateVariableLabel: string;
  climatePeriodLabel: string;
  climateResolutionLabel: string;
  climateLegendToggleShow: string;
  climateLegendToggleHide: string;
  climateExportPng: string;
  climateExportingPng: string;
  climateRecentConfigsTitle: string;
  climateRecentConfigsSubtitle: string;
  climateRecentActiveBadge: string;
  climateRecentSaveBtn: string;
  climateRecentRestoreDefaults: string;
  climateRecentEmpty: string;

  // Setup Step 3 (Questions)
  step3Title: string;
  questionPlaceholder: string;
  exampleQuestions: string[];
  analyzeBtn: string;
  analyzingBtn: string;
  analyzeButton: string;

  // Run Header & Status
  runDatasetLabel: string;
  runHeaderDataset: string;
  stopBtn: string;
  stopAnalysis: string;
  newAnalysisBtn: string;
  newAnalysis: string;
  workingStage: string;
  reportPendingTitle: string;
  reportPendingDesc: string;

  // Agent Panel
  chatTab: string;
  activityTab: string;
  agentPanelTitle: string;
  agentTabChat: string;
  agentTabActivity: string;
  agentViewExecution: string;
  waitingActivityTitle: string;
  waitingActivityDesc: string;
  agentTypingPlaceholder: string;
  agentFollowUpPlaceholder: string;
  agentSendBtn: string;
  agentSessionTitle: string;
  agentSessionDesc: string;
  agentNameBadge: string;
  showingOnDashboard: string;
  clickToView: string;
  proposedUpdateTitle: string;
  activeOnDashboardNotice: string;
  clickToApplyNotice: string;
  askFollowUpPlaceholder: string;
  sendBtn: string;
  suggestionsTitle: string;

  // Report & Dashboard
  tabOverview: string;
  tabCharts: string;
  tabTables: string;
  tabRecommendations: string;
  tabPrint: string;
  exportPdfBtn: string;
  exportingPdfBtn: string;
  renderingPdfBtn: string;
  downloadJsonBtn: string;
  executiveSummaryTitle: string;
  kpiTitle: string;
  visualAnalyticsTitle: string;
  featuredVisualizations: string;
  priorityActionsTitle: string;
  allVisualizationsTitle: string;
  supportingTablesTitle: string;
  tableSearchPlaceholder: string;
  recommendationsTitle: string;
  insightsTitle: string;
  inquiryPrefix: string;
  zoomChartBtn: string;
  closeModalBtn: string;
  searchTablesPlaceholder: string;
  tableRowsLabel: string;
  tableRowSingular: string;
  tableTopRowsNotice: string;
  noMatchingRows: string;
  businessInquiryLabel: string;
  methodologyLabel: string;
  confidentialLabel: string;

  // Buy Me A Coffee
  coffeeFundraisingBadge: string;
  coffeeSupportTitle: string;
  coffeeSupportDesc: string;
  coffeeCalloutTitle: string;
  coffeeCalloutDesc: string;
  coffeeSelectAmount: string;
  coffeeCustomAmount: string;
  coffeeEnterCustom: string;
  coffeeYourNameOptional: string;
  coffeeYourNamePlaceholder: string;
  coffeeNoteOptional: string;
  coffeeNotePlaceholder: string;
  coffeeHowHelps: string;
  coffeeHelpCompute: string;
  coffeeHelpStorage: string;
  coffeeHelpClimate: string;
  coffeeProceedBtn: (amount: number, count: number) => string;
  coffeeSecureDirect: string;
  coffeeCopyLink: string;
  coffeeLinkCopied: string;
  coffeeThankYouTitle: string;
  coffeeThankYouDesc: string;
  coffeeAnotherContribution: string;
  coffeeDoneBtn: string;

  // Footer
  footerTitle: string;
  footerSubtitle: string;
  footerCoffeeLink: string;

  // Theme
  themeToggleDark: string;
  themeToggleLight: string;
  themeToggleSystem: string;
  themeModeLabel: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Navigation & Header
    appTitle: 'AI Data Analyst',
    workspaceSubtitle: 'Data Analyst Workspace',
    languageSelect: 'Language',
    buyMeCoffee: 'Buy me a coffee',
    supportOurWork: 'Support our work',

    // Setup Step 1
    heroTitle1: 'Ask anything',
    heroTitle2: 'about your data',
    heroTitle: 'Ask anything',
    heroSubtitle: 'about your data',
    heroDesc: 'AI Data Analyst delivers interactive data intelligence, analytics, and actionable insights.',
    heroDescription: 'AI Data Analyst delivers interactive data intelligence, analytics, and actionable insights.',
    heroSubdesc: 'Upload one or more CSVs, ask a business question, and let the agent autonomously analyze it.',
    step1Title: '1. Choose a dataset',
    dropCsvPrompt: 'Drop CSV file(s) here or click to browse (≤ 1MB)',
    dropCsvSubprompt: 'Multiple related CSVs are supported for inline agent analysis',
    dropzoneUploading: 'Uploading and preparing dataset...',
    dropzonePrompt: 'Drop CSV file(s) here or click to browse (≤ 1MB)',
    dropzoneSubtext: 'Multiple related CSVs are supported for inline agent analysis',
    uploadingDataset: 'Uploading and preparing dataset...',
    orPasteGcs: 'Or paste a Google Cloud Storage URI',
    gcsUriTitle: 'Or paste a Google Cloud Storage URI',
    gcsUriSubtitle: 'Google Cloud Storage files are securely loaded directly',
    pasteGcsPlaceholder: 'gs://bucket-name/path/to/dataset.csv',
    addGcsBtn: 'Add GCS File',
    gcsAddButton: 'Add GCS File',
    gcsErrorPrefix: 'GCS URI must start with gs://',
    fileLimitWarning: 'File size exceeds 1MB limit. For larger files, please use the GCS URI option.',
    removeFileTooltip: 'Remove file',
    removeFile: 'Remove file',

    // Climate Section
    climateHeaderTitle: 'WorldClim v2.1 — CMIP6 Climate Scenario Modeling',
    climateHeaderBadge: 'CMIP6 Projections',
    climateHeaderDesc: 'Integrate high-resolution CMIP6 future climate projections directly into your datasets and predictive models.',
    climateToggleLabel: 'Enable Climate Modeling Context',
    climateEnabledNotice: 'Climate projections active: Downscaled CMIP6 datasets will ground your autonomous analysis.',
    climateScenarioLabel: 'Shared Socioeconomic Pathway (SSP)',
    climateModelLabel: 'Global Climate Model (GCM)',
    climateVariableLabel: 'Bioclimatic Variable',
    climatePeriodLabel: 'Time Period',
    climateResolutionLabel: 'Spatial Resolution',
    climateLegendToggleShow: 'Show Legend',
    climateLegendToggleHide: 'Hide Legend',
    climateExportPng: 'Export Map Preview as PNG',
    climateExportingPng: 'Rendering High-Res PNG...',
    climateRecentConfigsTitle: 'Recently Used Configurations',
    climateRecentConfigsSubtitle: 'Click any configuration to restore its climate projection settings immediately.',
    climateRecentActiveBadge: 'Active',
    climateRecentSaveBtn: 'Save Current',
    climateRecentRestoreDefaults: 'Reset to Defaults',
    climateRecentEmpty: 'No recent configurations yet.',

    // Setup Step 3 (Questions)
    step3Title: '3. Ask a business question',
    questionPlaceholder: 'e.g. Which product categories drive the most revenue, and how is it trending?',
    exampleQuestions: [
      'Summarize the key trends and the most important drivers in this data.',
      'What are the top segments by value, and how do they differ?',
      'Are there any anomalies or outliers I should investigate?',
      'Analyze temperature and precipitation trends across periods.',
    ],
    analyzeBtn: 'Analyze',
    analyzingBtn: 'Analyzing Data...',
    analyzeButton: 'Analyze',

    // Run Header & Status
    runDatasetLabel: 'Dataset',
    runHeaderDataset: 'Dataset',
    stopBtn: 'Stop',
    stopAnalysis: 'Stop',
    newAnalysisBtn: 'New analysis',
    newAnalysis: 'New analysis',
    workingStage: 'Working...',
    reportPendingTitle: 'Report will be generated here',
    reportPendingDesc: 'The agent is exploring the data and running your analysis in the background. Your final report and charts will appear in this space when complete.',

    // Agent Panel
    chatTab: 'Chat',
    activityTab: 'Agent Activity',
    agentPanelTitle: 'Agent Session',
    agentTabChat: 'Chat',
    agentTabActivity: 'Agent Activity',
    agentViewExecution: 'Execution Steps',
    waitingActivityTitle: 'Waiting for Agent Activity',
    waitingActivityDesc: 'Agent execution steps, data checks, and internal reasoning will appear here in real-time.',
    agentTypingPlaceholder: 'Agent is thinking...',
    agentFollowUpPlaceholder: 'Ask a follow-up question or request new charts...',
    agentSendBtn: 'Send',
    agentSessionTitle: 'Agent Session',
    agentSessionDesc: 'Start your analysis to chat with the agent and drill down into insights.',
    agentNameBadge: 'AI DATA ANALYST',
    showingOnDashboard: 'Showing on Dashboard',
    clickToView: 'Click to view',
    proposedUpdateTitle: 'Proposed Dashboard Update',
    activeOnDashboardNotice: 'Currently active on dashboard and PDF',
    clickToApplyNotice: 'Click to apply these new insights to the active report',
    askFollowUpPlaceholder: 'Ask a follow-up question or request new charts...',
    sendBtn: 'Send',
    suggestionsTitle: 'Suggested follow-up inquiries:',

    // Report & Dashboard
    tabOverview: 'Overview',
    tabCharts: 'Charts',
    tabTables: 'Tables',
    tabRecommendations: 'Recommendations',
    tabPrint: 'Print Preview',
    exportPdfBtn: 'Export PDF',
    exportingPdfBtn: 'Generating PDF...',
    renderingPdfBtn: 'Generating PDF...',
    downloadJsonBtn: 'Download JSON',
    executiveSummaryTitle: 'Executive Summary',
    kpiTitle: 'Key Performance Indicators',
    visualAnalyticsTitle: 'Visualizations & Analytics',
    featuredVisualizations: 'Featured Visualizations',
    priorityActionsTitle: 'Priority Strategic Actions',
    allVisualizationsTitle: 'All Analytical Visualizations',
    supportingTablesTitle: 'Supporting Data Tables',
    tableSearchPlaceholder: 'Search across table records...',
    recommendationsTitle: 'Strategic Recommendations Roadmap',
    insightsTitle: 'Key Analytical Findings',
    inquiryPrefix: 'Business Inquiry:',
    zoomChartBtn: 'Zoom',
    closeModalBtn: 'Close',
    searchTablesPlaceholder: 'Search across table records...',
    tableRowsLabel: 'rows',
    tableRowSingular: 'row',
    tableTopRowsNotice: 'Showing top 20 rows of {total} total rows.',
    noMatchingRows: 'No matching rows found.',
    businessInquiryLabel: 'Business Inquiry:',
    methodologyLabel: 'Autonomous AI Data Analyst Agent',
    confidentialLabel: 'Confidential BI Intelligence Dashboard',

    // Buy Me A Coffee
    coffeeFundraisingBadge: 'Fundraising',
    coffeeSupportTitle: 'Buy Us a Coffee',
    coffeeSupportDesc: 'We develop open-source intelligence tools, autonomous analytics pipelines, and CMIP6 climate modeling modules. Your contribution keeps our servers running and compute free for researchers worldwide!',
    coffeeCalloutTitle: 'Support Our Open Research & Analytics',
    coffeeCalloutDesc: 'Help us cover cloud hosting, CMIP6 climate models, and autonomous AI data tools.',
    coffeeSelectAmount: 'Select Amount',
    coffeeCustomAmount: 'Custom Amount',
    coffeeEnterCustom: 'Enter custom $ USD',
    coffeeYourNameOptional: 'Your Name or Organization (Optional)',
    coffeeYourNamePlaceholder: 'e.g. Marie Curie / EcoLab Research',
    coffeeNoteOptional: 'Note / Encouragement (Optional)',
    coffeeNotePlaceholder: 'Say something nice to the development team...',
    coffeeHowHelps: 'How your contribution helps',
    coffeeHelpCompute: 'Cloud AI compute',
    coffeeHelpStorage: 'Data ingestion & GCS',
    coffeeHelpClimate: 'WorldClim CMIP6',
    coffeeProceedBtn: (amount, count) => `Support with $${amount} (${count} ${count === 1 ? 'Coffee' : 'Coffees'})`,
    coffeeSecureDirect: 'Secure direct fundraising via BuyMeACoffee',
    coffeeCopyLink: 'Copy Link',
    coffeeLinkCopied: 'Link Copied!',
    coffeeThankYouTitle: 'Thank You So Much for Your Support!',
    coffeeThankYouDesc: 'Your patronage makes a huge difference in sustaining our cloud infrastructure, dataset hosting, and AI research agent development.',
    coffeeAnotherContribution: 'Make another contribution',
    coffeeDoneBtn: 'Done',

    // Footer
    footerTitle: 'AI Data Analyst & Climate Modeling',
    footerSubtitle: 'Autonomous Business Intelligence',
    footerCoffeeLink: 'Support our work — Buy us a coffee',

    // Theme
    themeToggleDark: 'Switch to Dark mode',
    themeToggleLight: 'Switch to Light mode',
    themeToggleSystem: 'Use System theme',
    themeModeLabel: 'Theme',
  },

  fr: {
    // Navigation & Header
    appTitle: 'Analyste de Données IA',
    workspaceSubtitle: 'Espace Analyste de Données',
    languageSelect: 'Langue',
    buyMeCoffee: 'Offrir un café',
    supportOurWork: 'Soutenir nos travaux',

    // Setup Step 1
    heroTitle1: 'Posez n\'importe quelle',
    heroTitle2: 'question sur vos données',
    heroTitle: 'Posez n\'importe quelle',
    heroSubtitle: 'question sur vos données',
    heroDesc: 'L\'Analyste de Données IA fournit une intelligence décisionnelle interactive, des visualisations avancées et des recommandations exploitables.',
    heroDescription: 'L\'Analyste de Données IA fournit une intelligence décisionnelle interactive, des visualisations avancées et des recommandations exploitables.',
    heroSubdesc: 'Importez un ou plusieurs fichiers CSV, posez une question métier, et laissez l\'agent autonome explorer et analyser vos données.',
    step1Title: '1. Choisissez un jeu de données',
    dropCsvPrompt: 'Déposez vos fichiers CSV ici ou cliquez pour parcourir (≤ 1 Mo)',
    dropCsvSubprompt: 'Plusieurs fichiers CSV reliés sont acceptés pour une analyse conjointe par l\'agent',
    dropzoneUploading: 'Téléversement et préparation du jeu de données...',
    dropzonePrompt: 'Déposez vos fichiers CSV ici ou cliquez pour parcourir (≤ 1 Mo)',
    dropzoneSubtext: 'Plusieurs fichiers CSV reliés sont acceptés pour une analyse conjointe par l\'agent',
    uploadingDataset: 'Téléversement et préparation du jeu de données...',
    orPasteGcs: 'Ou collez une URL Google Cloud Storage',
    gcsUriTitle: 'Ou collez une URL Google Cloud Storage',
    gcsUriSubtitle: 'Les fichiers Google Cloud Storage sont chargés de manière sécurisée',
    pasteGcsPlaceholder: 'gs://nom-du-bucket/chemin/dataset.csv',
    addGcsBtn: 'Ajouter fichier GCS',
    gcsAddButton: 'Ajouter fichier GCS',
    gcsErrorPrefix: 'L\'URI GCS doit commencer par gs://',
    fileLimitWarning: 'La taille du fichier dépasse la limite de 1 Mo. Pour les fichiers plus volumineux, veuillez utiliser l\'option URI GCS.',
    removeFileTooltip: 'Supprimer le fichier',
    removeFile: 'Supprimer le fichier',

    // Climate Section
    climateHeaderTitle: 'Modélisation des Scénarios Climatiques WorldClim v2.1 — CMIP6',
    climateHeaderBadge: 'Projections CMIP6',
    climateHeaderDesc: 'Intégrez directement des projections climatiques futures CMIP6 haute résolution à vos jeux de données et modèles prédictifs.',
    climateToggleLabel: 'Activer le Contexte de Modélisation Climatique',
    climateEnabledNotice: 'Projections climatiques actives : les données CMIP6 spatialisées enrichiront automatiquement votre analyse.',
    climateScenarioLabel: 'Trajectoire Socio-Économique Partagée (SSP)',
    climateModelLabel: 'Modèle de Circulation Générale (GCM)',
    climateVariableLabel: 'Variable Bioclimatique',
    climatePeriodLabel: 'Horizon Temporel',
    climateResolutionLabel: 'Résolution Spatiale',
    climateLegendToggleShow: 'Afficher la Légende',
    climateLegendToggleHide: 'Masquer la Légende',
    climateExportPng: 'Exporter l\'aperçu de la carte en PNG',
    climateExportingPng: 'Génération du PNG Haute Résolution...',
    climateRecentConfigsTitle: 'Configurations Récemment Utilisées',
    climateRecentConfigsSubtitle: 'Cliquez sur une configuration pour rétablir immédiatement ses paramètres de projection climatique.',
    climateRecentActiveBadge: 'Actif',
    climateRecentSaveBtn: 'Sauvegarder l\'Actuel',
    climateRecentRestoreDefaults: 'Rétablir par Défaut',
    climateRecentEmpty: 'Aucune configuration récente enregistrée.',

    // Setup Step 3 (Questions)
    step3Title: '3. Posez une question métier',
    questionPlaceholder: 'ex. Quelles catégories de produits génèrent le plus de revenus, et quelle est leur tendance ?',
    exampleQuestions: [
      'Résumez les principales tendances et les facteurs déterminants de ces données.',
      'Quels sont les segments prioritaires en valeur, et comment se distinguent-ils ?',
      'Y a-t-il des anomalies ou des valeurs aberrantes à examiner en priorité ?',
      'Analysez les tendances de température et de précipitations selon les périodes.',
    ],
    analyzeBtn: 'Analyser',
    analyzingBtn: 'Analyse en cours...',
    analyzeButton: 'Analyser',

    // Run Header & Status
    runDatasetLabel: 'Jeu de données',
    runHeaderDataset: 'Jeu de données',
    stopBtn: 'Arrêter',
    stopAnalysis: 'Arrêter',
    newAnalysisBtn: 'Nouvelle analyse',
    newAnalysis: 'Nouvelle analyse',
    workingStage: 'Traitement en cours...',
    reportPendingTitle: 'Le rapport sera généré ici',
    reportPendingDesc: 'L\'agent explore actuellement vos données et exécute les calculs en arrière-plan. Votre rapport complet et vos graphiques apparaîtront ici à la fin du traitement.',

    // Agent Panel
    chatTab: 'Discussion',
    activityTab: 'Activité de l\'Agent',
    agentPanelTitle: 'Session de l\'Agent',
    agentTabChat: 'Discussion',
    agentTabActivity: 'Activité de l\'Agent',
    agentViewExecution: 'Étapes d\'Exécution',
    waitingActivityTitle: 'En attente d\'activité de l\'agent',
    waitingActivityDesc: 'Les étapes de calcul, vérifications de données et raisonnements de l\'agent s\'afficheront ici en temps réel.',
    agentTypingPlaceholder: 'L\'agent réfléchit...',
    agentFollowUpPlaceholder: 'Posez une question de suivi ou demandez un nouveau graphique...',
    agentSendBtn: 'Envoyer',
    agentSessionTitle: 'Session de l\'Agent',
    agentSessionDesc: 'Lancez votre analyse pour converser avec l\'agent et approfondir les insights.',
    agentNameBadge: 'ANALYSTE DE DONNÉES IA',
    showingOnDashboard: 'Affiché sur le Tableau de Bord',
    clickToView: 'Cliquer pour afficher',
    proposedUpdateTitle: 'Mise à Jour du Tableau de Bord Proposée',
    activeOnDashboardNotice: 'Actuellement actif sur le tableau de bord et l\'export PDF',
    clickToApplyNotice: 'Cliquer pour appliquer ces nouvelles conclusions au rapport actif',
    askFollowUpPlaceholder: 'Posez une question de suivi ou demandez un nouveau graphique...',
    sendBtn: 'Envoyer',
    suggestionsTitle: 'Suggestions de questions d\'approfondissement :',

    // Report & Dashboard
    tabOverview: 'Vue d\'ensemble',
    tabCharts: 'Graphiques',
    tabTables: 'Tableaux',
    tabRecommendations: 'Recommandations',
    tabPrint: 'Aperçu Impression',
    exportPdfBtn: 'Exporter en PDF',
    exportingPdfBtn: 'Génération du PDF...',
    renderingPdfBtn: 'Génération du PDF...',
    downloadJsonBtn: 'Télécharger JSON',
    executiveSummaryTitle: 'Synthèse pour la Direction',
    kpiTitle: 'Indicateurs Clés de Performance (KPI)',
    visualAnalyticsTitle: 'Visualisations & Analyses Graphiques',
    featuredVisualizations: 'Visualisations Clés',
    priorityActionsTitle: 'Actions Stratégiques Prioritaires',
    allVisualizationsTitle: 'Toutes les Visualisations Analytiques',
    supportingTablesTitle: 'Tableaux de Données Justificatifs',
    tableSearchPlaceholder: 'Rechercher dans les données des tableaux...',
    recommendationsTitle: 'Feuille de Route & Recommandations Stratégiques',
    insightsTitle: 'Principales Conclusions Analytiques',
    inquiryPrefix: 'Question Métier :',
    zoomChartBtn: 'Agrandir',
    closeModalBtn: 'Fermer',
    searchTablesPlaceholder: 'Rechercher dans les données des tableaux...',
    tableRowsLabel: 'lignes',
    tableRowSingular: 'ligne',
    tableTopRowsNotice: 'Affichage des 20 premières lignes sur un total de {total}.',
    noMatchingRows: 'Aucune ligne correspondante trouvée.',
    businessInquiryLabel: 'Question Métier :',
    methodologyLabel: 'Agent Autonome Analyste de Données IA',
    confidentialLabel: 'Tableau de Bord Décisionnel Confidentiel',

    // Buy Me A Coffee
    coffeeFundraisingBadge: 'Collecte de fonds',
    coffeeSupportTitle: 'Offrez-nous un café',
    coffeeSupportDesc: 'Nous développons des outils d\'analyse en libre accès, des pipelines analytiques autonomes et des modules de modélisation climatique CMIP6. Vos contributions financent nos serveurs et permettent de garder ces outils gratuits pour la communauté de recherche !',
    coffeeCalloutTitle: 'Soutenez Nos Travaux & la Recherche Ouverte',
    coffeeCalloutDesc: 'Aidez-nous à financer l\'infrastructure cloud, les modèles CMIP6 et nos agents d\'analyse autonomes.',
    coffeeSelectAmount: 'Sélectionnez un montant',
    coffeeCustomAmount: 'Montant libre',
    coffeeEnterCustom: 'Entrez un montant personnalisé en $',
    coffeeYourNameOptional: 'Votre nom ou organisation (Facultatif)',
    coffeeYourNamePlaceholder: 'ex. Marie Curie / Laboratoire EcoLab',
    coffeeNoteOptional: 'Message / Encouragement (Facultatif)',
    coffeeNotePlaceholder: 'Laissez un mot à l\'équipe de développement...',
    coffeeHowHelps: 'Comment votre contribution est utilisée',
    coffeeHelpCompute: 'Calculs IA Cloud',
    coffeeHelpStorage: 'Ingestion & stockage GCS',
    coffeeHelpClimate: 'Modèles WorldClim CMIP6',
    coffeeProceedBtn: (amount, count) => `Soutenir avec $${amount} (${count} ${count === 1 ? 'Café' : 'Cafés'})`,
    coffeeSecureDirect: 'Financement sécurisé et direct via BuyMeACoffee',
    coffeeCopyLink: 'Copier le lien',
    coffeeLinkCopied: 'Lien copié !',
    coffeeThankYouTitle: 'Merci Infiniment pour Votre Soutien !',
    coffeeThankYouDesc: 'Votre générosité est essentielle pour assurer la pérennité de notre infrastructure cloud, l\'hébergement des données et la recherche sur les agents d\'analyse.',
    coffeeAnotherContribution: 'Faire une autre contribution',
    coffeeDoneBtn: 'Terminé',

    // Footer
    footerTitle: 'Analyste de Données IA & Modélisation Climatique',
    footerSubtitle: 'Intelligence Décisionnelle Autonome',
    footerCoffeeLink: 'Soutenez nos travaux — Offrez-nous un café',

    // Theme
    themeToggleDark: 'Passer en mode sombre',
    themeToggleLight: 'Passer en mode clair',
    themeToggleSystem: 'Thème du système',
    themeModeLabel: 'Thème',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: translations.en,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('app_language') as Language;
      if (saved === 'fr' || saved === 'en') return saved;
      // Detect browser language
      if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('fr')) {
        return 'fr';
      }
    } catch {
      // Ignore
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('app_language', lang);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div 
      id="language-switcher" 
      className={`inline-flex items-center rounded-full bg-neutral-100 dark:bg-neutral-900 p-0.5 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs ${className}`}
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
          language === 'en'
            ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
            : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
        }`}
        title="Switch to English"
        aria-pressed={language === 'en'}
      >
        <span className="text-[11px]">🇬🇧</span>
        <span>EN</span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage('fr')}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
          language === 'fr'
            ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
            : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
        }`}
        title="Passer en Français"
        aria-pressed={language === 'fr'}
      >
        <span className="text-[11px]">🇫🇷</span>
        <span>FR</span>
      </button>
    </div>
  );
};
