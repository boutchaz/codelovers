export const SITE_URL_FR = "https://wearecodelovers.com/fr";

// French pages: /fr/services/, /fr/case-studies/ and /fr/about/. The blog is one page in both languages.
export const navigationFr = [
  { label: "Services", href: "/fr/services/" },
  { label: "Études de cas", href: "/fr/case-studies/" },
  { label: "À propos", href: "/fr/about/" },
  { label: "Blog", href: "/blog/" },
];

export const heroMetricsFr = [
  { value: "8+", label: "Années d'expérience" },
  { value: "20+", label: "Projets d'entreprise livrés" },
  { value: "6+", label: "Plateformes SaaS construites" },
];

export const heroCardsFr = [
  {
    title: "Snookly",
    description: "Gestion club snooker : cartes RFID, score live, POS café.",
    badge: "SaaS · Production",
    className: "hero-card hero-card--top",
  },
  {
    title: "AgroGina",
    description: "Gestion agricole avec surveillance satellite NDVI.",
    badge: "AgTech · En ligne",
    className: "hero-card hero-card--mid",
  },
  {
    title: "Passion Fitness",
    description: "Plateforme multi-locataire arts martiaux avec app mobile.",
    badge: "SaaS · Production",
    className: "hero-card hero-card--bottom",
  },
];

export const servicesFr = [
  {
    title: "Développement Full-Stack",
    description:
      "Applications web et mobiles de niveau entreprise, avec TanStack par défaut pour les produits applicatifs, Astro ou Next quand le SEO et le statique priment, React Native pour le mobile. Du MVP à la production.",
    tags: ["React · TanStack", "TypeScript", "Node.js · Python"],
  },
  {
    title: "Ingénierie de plateformes SaaS",
    description:
      "Architecture SaaS complète avec support multi-locataire, authentification, intégration de paiement et fonctionnalités en temps réel.",
    tags: ["Stripe · Clerk", "WebSocket · APIs", "PostgreSQL · Redis"],
  },
  {
    title: "IoT & Systèmes temps réel",
    description:
      "Pipelines de données IoT, gestion d'appareils, surveillance en temps réel avec protocoles MQTT, TCP/IP et tableaux de bord analytiques.",
    tags: ["FastAPI · MQTT", "Prometheus · Grafana", "Docker"],
  },
  {
    title: "Solutions E-Commerce",
    description:
      "E-commerce headless avec Shopify Hydrogen, vitrines personnalisées et intégration de paiement pour des expériences d'achat modernes.",
    tags: ["Shopify · Hydrogen", "Remix · GraphQL", "Panier · Paiement"],
  },
  {
    title: "DevOps & Infrastructure",
    description:
      "Pipelines CI/CD, conteneurisation Docker, surveillance de production et déploiement cloud sur AWS, DigitalOcean et Vercel.",
    tags: ["GitHub Actions", "Docker · Nginx", "AWS · DigitalOcean"],
  },
  {
    title: "Systèmes d'entreprise",
    description:
      "Solutions ERP personnalisées, automatisation des flux de travail et numérisation des processus métier utilisant des frameworks modernes.",
    tags: ["ERPNext · Frappe", "N8N Automation", "MariaDB · Redis"],
  },
];

export const capabilitiesFr = [
  {
    title: "Découvrir & Définir",
    description: "Cadrage du problème par la recherche, la validation du marché et la faisabilité technique.",
    points: ["Recherche utilisateur", "Validation Lean", "Conception de la feuille de route"],
  },
  {
    title: "Concevoir & Construire",
    description: "Conception d'interface et d'interaction soutenue par une livraison d'ingénierie robuste.",
    points: ["Prototypage", "Développement Frontend / Backend", "Configuration de l'infrastructure cloud"],
  },
  {
    title: "Lancer & Évoluer",
    description: "Itération continue, analyse des données et expériences de croissance axées sur le produit.",
    points: ["CI/CD", "Instrumentation", "Optimisation de la conversion"],
  },
];

export const aboutStatsFr = [
  { value: "8+", label: "Années en ingénierie logicielle" },
  { value: "6+", label: "Plateformes SaaS lancées" },
  { value: "20+", label: "Projets d'entreprise livrés" },
  { value: "Production", label: "Fiabilité de l'infrastructure" },
];

export const aboutFeaturesFr = [
  {
    title: "Expertise Full-Stack",
    description:
      "Plus de 8 ans d'expérience pratique avec React, TanStack, TypeScript, Node.js, Python et une infrastructure cloud moderne.",
  },
  {
    title: "Prêt pour l'entreprise",
    description:
      "Systèmes construits pour 4D Logiciel et SQLI servant des milliers d'utilisateurs avec haute disponibilité et performance.",
  },
  {
    title: "Excellence DevOps",
    description:
      "Pipelines CI/CD établis, conteneurisation Docker et surveillance de production sur toutes les plateformes.",
  },
  {
    title: "Axé sur l'innovation",
    description:
      "Spécialisé dans l'IoT, les systèmes temps réel, l'e-commerce et les plateformes SaaS avec des stacks technologiques de pointe.",
  },
];

// Keyed by caseStudies[].title; fields missing here fall back to English.
export const caseStudiesFr: Record<
  string,
  { category: string; summary: string; result: string; metric: string }
> = {
  Snookly: {
    category: "SaaS · Gestion sportive",
    summary:
      "Tables, cartes joueurs, score en direct et caisse café réunis pour gérer le club.",
    result: "Production",
    metric: "Gestion multi-clubs",
  },
  "Passion Fitness": {
    category: "SaaS · Fitness & bien-être",
    summary:
      "Planning, présences et ressources pédagogiques pour les clubs d’arts martiaux, sur web et mobile.",
    result: "Production",
    metric: "Plateforme multi-salles + app mobile",
  },
  AgroGina: {
    category: "AgTech · Analyse satellite",
    summary:
      "Parcelles, équipes terrain et informations satellite réunies pour organiser le travail agricole.",
    result: "En ligne",
    metric: "Suivi des cultures en temps réel",
  },
  "LoginTel SaaS": {
    category: "IoT · Surveillance de la chaîne du froid",
    summary:
      "Une surveillance de la chaîne du froid qui relie relevés, alertes et rapports.",
    result: "Production",
    metric: "Surveillance de flotte IoT en temps réel",
  },
  "WhatsApp Reservation Bot": {
    category: "Automatisation · SaaS",
    summary:
      "Un parcours de réservation WhatsApp qui relie demandes clients, disponibilités et suivi par l’équipe.",
    result: "Automatisé",
    metric: "Réservations via WhatsApp",
  },
};

export const contactInfoFr = [
  { label: "Localisation", value: "Rabat · Maroc · À distance" },
  { label: "Email", value: "tech@wearecodelovers.com" },
  { label: "Téléphone", value: "+212 691 870 293" },
];
