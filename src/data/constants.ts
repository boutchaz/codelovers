export const SITE_URL = "https://wearecodelovers.com";

export const navigation = [
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

export const heroMetrics = [
  { value: "7+", label: "Years of experience" },
  { value: "20+", label: "Enterprise projects delivered" },
  { value: "6+", label: "SaaS platforms built" },
];

export const heroCards = [
  {
    title: "Snookly",
    description: "Snooker club ops: RFID cards, live scoring, café POS.",
    badge: "SaaS · Production",
    className: "hero-card hero-card--top",
  },
  {
    title: "AgroGina",
    description: "Farm management with satellite NDVI crop monitoring.",
    badge: "AgTech · Live",
    className: "hero-card hero-card--mid",
  },
  {
    title: "Passion Fitness",
    description: "Multi-tenant martial arts gym platform with mobile app.",
    badge: "SaaS · Production",
    className: "hero-card hero-card--bottom",
  },
];

export const services = [
  {
    title: "Full-Stack Development",
    description:
      "Enterprise-grade web and mobile apps — framework-agnostic. TanStack for app products, Next when SEO/static matter, React Native for mobile. From MVP to production.",
    tags: ["React · TanStack", "TypeScript", "Node.js · Python"],
  },
  {
    title: "SaaS Platform Engineering",
    description:
      "Complete SaaS architecture with multi-tenant support, authentication, payment integration, and real-time features.",
    tags: ["Stripe · Clerk", "WebSocket · APIs", "PostgreSQL · Redis"],
  },
  {
    title: "IoT & Real-Time Systems",
    description:
      "IoT data pipelines, device management, real-time monitoring with MQTT, TCP/IP protocols and analytics dashboards.",
    tags: ["FastAPI · MQTT", "Prometheus · Grafana", "Docker"],
  },
  {
    title: "E-Commerce Solutions",
    description:
      "Headless e-commerce with Shopify Hydrogen, custom storefronts, and payment integration for modern shopping experiences.",
    tags: ["Shopify · Hydrogen", "Remix · GraphQL", "Cart · Checkout"],
  },
  {
    title: "DevOps & Infrastructure",
    description:
      "CI/CD pipelines, Docker containerization, production monitoring, and cloud deployment on AWS, DigitalOcean, and Vercel.",
    tags: ["GitHub Actions", "Docker · Nginx", "AWS · DigitalOcean"],
  },
  {
    title: "Enterprise Systems",
    description:
      "Custom ERP solutions, workflow automation, and business process digitalization using modern frameworks.",
    tags: ["ERPNext · Frappe", "N8N Automation", "MariaDB · Redis"],
  },
];

export const capabilities = [
  {
    title: "Discover & Define",
    description: "Problem framing through research, market validation, and technical feasibility.",
    points: ["User research", "Lean validation", "Roadmap design"],
  },
  {
    title: "Design & Build",
    description: "Interface and interaction design supported by robust engineering delivery.",
    points: ["Prototyping", "Frontend / Backend dev", "Cloud infra setup"],
  },
  {
    title: "Launch & Scale",
    description: "Continuous iteration, data analytics, and product-led growth experiments.",
    points: ["CI/CD", "Instrumentation", "Conversion optimization"],
  },
];

export const caseStudies = [
  {
    title: "Snookly",
    category: "SaaS · Sports Operations",
    summary:
      "Multi-tenant snooker club management system in production. RFID member cards, live table scoring, café/billiard POS, and administrative dashboard. Built with Next.js, Supabase, and TypeScript.",
    result: "Production",
    metric: "Multi-tenant club operations",
    gradient: "from-purple-500/20 via-indigo-500/10 to-blue-600/20",
  },
  {
    title: "Passion Fitness",
    category: "SaaS · Fitness & Wellness",
    summary:
      "Multi-tenant martial arts gym platform serving BJJ gyms in Morocco. Class booking, Mon Parcours belt progression, RollMap member connections, Next.js web dashboard, Expo React Native mobile app, and Paddle payment integration.",
    result: "Production",
    metric: "Multi-tenant gym platform + mobile app",
    gradient: "from-red-500/20 via-orange-500/10 to-amber-600/20",
  },
  {
    title: "AgroGina",
    category: "AgTech · Satellite Analytics",
    summary:
      "Precision agriculture platform with satellite imagery analysis. Bun monorepo: React/TanStack/shadcn frontend, NestJS API on Bun with Supabase Postgres RLS, FastAPI + Google Earth Engine for NDVI vegetation monitoring. Live at agrogina.com.",
    result: "Live",
    metric: "Real-time crop monitoring",
    gradient: "from-emerald-500/20 via-teal-500/10 to-green-600/20",
    href: "https://agrogina.com/",
  },
  {
    title: "LoginTel SaaS",
    category: "IoT · Cold Chain Monitoring",
    summary:
      "Cold chain monitoring platform with real-time IoT tracking, alerting systems, and compliance reporting. Built with Next.js, Strapi CMS, Python FastAPI for TCP device parsing, and Prometheus/Grafana monitoring.",
    result: "Production",
    metric: "Real-time IoT fleet monitoring",
    gradient: "from-blue-500/20 via-cyan-500/10 to-indigo-600/20",
  },
  {
    title: "WhatsApp Reservation Bot",
    category: "Automation · SaaS",
    summary:
      "Multi-tenant WhatsApp Business API integration enabling businesses to automate bookings with webhook integrations, real-time WebSocket updates, built with React, Express.js, Drizzle ORM, and N8N workflow automation.",
    result: "Automated",
    metric: "Booking process via WhatsApp",
    gradient: "from-rose-500/20 via-fuchsia-500/10 to-purple-600/20",
  },
  {
    title: "SWIBECO E-Commerce",
    category: "Retail · Platform Migration",
    summary:
      "Migrated v1 e-commerce platform from AngularJS to v2 using React, TypeScript, React-Hook-Form. Designed feature toggle system with gradual rollout for zero-downtime deployments.",
    result: "Seamless",
    metric: "Zero-downtime migration",
    gradient: "from-cyan-500/20 via-blue-500/10 to-indigo-600/20",
  },
] as const;

export const partners = ["4D Logiciel", "SWIBECO", "SQLI"];

// Testimonials hidden until real partner quotes exist
const SHOW_TESTIMONIALS = false;

export const testimonials = SHOW_TESTIMONIALS
  ? [
      {
        quote:
          "Boutchaz and CodeLovers turned our IoT idea into a live blockchain prototype in record time.",
        author: "Jeff",
        role: "IoT Partner, Logintel",
      },
      {
        quote:
          "Their Web3 expertise helped us tokenize participation and automate investor rewards seamlessly.",
        author: "Alex",
        role: "DeFi Collaborator",
      },
      {
        quote:
          "They blend design, culture, and engineering to make tech accessible and meaningful.",
        author: "Chloé",
        role: "Product Designer, Partner",
      },
    ]
  : [];

export const aboutStats = [
  { value: "7+", label: "Years in software engineering" },
  { value: "6+", label: "SaaS platforms launched" },
  { value: "20+", label: "Enterprise projects delivered" },
  { value: "Production", label: "Infrastructure reliability" },
];

export const aboutFeatures = [
  {
    title: "Full-Stack Expertise",
    description:
      "7+ years of hands-on experience with React, TanStack, TypeScript, Node.js, Python, and modern cloud infrastructure.",
  },
  {
    title: "Enterprise-Ready",
    description:
      "Built systems for 4D Logiciel, SWIBECO, and SQLI serving thousands of users with high availability and performance.",
  },
  {
    title: "DevOps Excellence",
    description:
      "Established CI/CD pipelines, Docker containerization, and production monitoring across all platforms.",
  },
  {
    title: "Innovation-Driven",
    description:
      "Specialized in IoT, real-time systems, e-commerce, and SaaS platforms with cutting-edge tech stacks.",
  },
];

export const contactInfo = [
  { label: "Location", value: "Rabat · Morocco · Remote" },
  { label: "Email", value: "tech@wearecodelovers.com" },
  { label: "Phone", value: "+212 691 870 293" },
];

export const socialNetworks = ["LinkedIn", "GitHub", "Portfolio", "Email"];
