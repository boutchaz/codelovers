export const navigation = [
  { label: "Blog", href: "https://blog.wearecodelovers.com/" },
  { label: "Contact", href: "#contact" },
];

export const heroMetrics = [
  { value: "7+", label: "Years of experience" },
  { value: "20+", label: "Enterprise projects delivered" },
  { value: "6+", label: "SaaS platforms built" },
];

export const heroCards = [
  {
    title: "LoginTel SaaS",
    description: "IoT-powered cold chain monitoring platform.",
    badge: "IoT · SaaS",
    className: "hero-card hero-card--top",
  },
  {
    title: "AgriTech Platform",
    description: "Satellite imagery for precision agriculture.",
    badge: "GIS · AgriTech",
    className: "hero-card hero-card--mid",
  },
  {
    title: "WhatsApp Bot",
    description: "Automated reservation system via WhatsApp API.",
    badge: "Automation · SaaS",
    className: "hero-card hero-card--bottom",
  },
];

export const services = [
  {
    title: "Full-Stack Development",
    description:
      "Enterprise-grade web and mobile applications using React, Next.js, TypeScript, and React Native. From MVP to production-ready systems.",
    tags: ["React · Next.js", "TypeScript", "Node.js · Python"],
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
      "CI/CD pipelines, Docker containerization, monitoring, and cloud deployment ensuring 99.9% uptime.",
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
    description:
      "Problem framing through research, market validation, and technical feasibility.",
    points: ["User research", "Lean validation", "Roadmap design"],
  },
  {
    title: "Design & Build",
    description:
      "Interface and interaction design supported by robust engineering delivery.",
    points: ["Prototyping", "Frontend / Backend dev", "Cloud infra setup"],
  },
  {
    title: "Launch & Scale",
    description:
      "Continuous iteration, data analytics, and product-led growth experiments.",
    points: ["CI/CD", "Instrumentation", "Conversion optimization"],
  },
];

export const caseStudies = [
  {
    title: "LoginTel SaaS",
    category: "IoT · Cold Chain Monitoring",
    summary:
      "Comprehensive cold chain monitoring platform with real-time IoT tracking, alerting systems, and compliance reporting. Built with Next.js, Strapi CMS, Python FastAPI for TCP device parsing, and Prometheus/Grafana monitoring.",
    result: "99.9%",
    metric: "Uptime with real-time alerts",
    gradient: "from-blue-500/20 via-cyan-500/10 to-indigo-600/20",
  },
  {
    title: "AgriTech SaaS",
    category: "Agriculture · Satellite Analytics",
    summary:
      "Precision agriculture platform with satellite imagery analysis, crop monitoring via Google Earth Engine integration for NDVI indices, and multi-tenant geospatial analytics using Leaflet/OpenLayers.",
    result: "Real-time",
    metric: "Vegetation monitoring & insights",
    gradient: "from-emerald-500/20 via-teal-500/10 to-green-600/20",
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
    title: "Shopify Hydrogen Store",
    category: "E-Commerce · Headless",
    summary:
      "High-performance headless e-commerce storefront with server-side rendering using Remix, Shopify GraphQL API, custom product filtering, cart management, and customer account features deployed on Oxygen.",
    result: "Fast",
    metric: "SSR shopping experience",
    gradient: "from-violet-500/20 via-purple-500/10 to-indigo-600/20",
  },
  {
    title: "Projeco ERP",
    category: "Enterprise · Resource Planning",
    summary:
      "Custom ERPNext application built on Frappe Framework for enterprise resource planning and project management with automated workflows, MariaDB and Redis integration, containerized with Docker.",
    result: "Complete",
    metric: "Business process automation",
    gradient: "from-orange-500/20 via-amber-500/10 to-yellow-600/20",
  },
  {
    title: "SWIBECO E-Commerce",
    category: "Retail · Platform Migration",
    summary:
      "Successfully migrated v1 e-commerce platform from AngularJS to v2 using React, TypeScript, React-Hook-Form. Designed feature toggle system with gradual rollout for zero-downtime deployments.",
    result: "Seamless",
    metric: "Migration with feature toggles",
    gradient: "from-cyan-500/20 via-blue-500/10 to-indigo-600/20",
  },
];

export const testimonials = [
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
];

export const partners = ["4D Logiciel", "SWIBECO", "SQLI", "Groupe SEB", "Shopify", "Supabase", "AWS", "Frappe"];

export const videoHighlights = [
  {
    title: "Building the Future of Logistics",
    description:
      "From IoT sensors to Solana smart contracts, see how Logintel brings transparency to cold chains.",
    src: "/videos/logintel.mp4",
    poster: "/images/logintel-poster.jpg",
    duration: "02:05",
  },
  {
    title: "Empowering Local Wellness",
    description:
      "How Atay & Abs reshapes fitness for Moroccan women through community and culture.",
    src: "/videos/atayabs.mp4",
    poster: "/images/atayabs-poster.jpg",
    duration: "01:48",
  },
  {
    title: "Tokenized Crowdfunding",
    description:
      "A look at how NFTs and smart contracts can redefine collective ownership.",
    src: "/videos/defi-crowdfunding.mp4",
    poster: "/images/defi-crowdfunding.jpg",
    duration: "02:10",
  },
];

export const aboutStats = [
  { value: "7+", label: "Years in software engineering" },
  { value: "6+", label: "SaaS platforms launched" },
  { value: "20+", label: "Enterprise projects delivered" },
  { value: "99.9%", label: "Infrastructure uptime" },
];

export const aboutFeatures = [
  {
    title: "Full-Stack Expertise",
    description: "7+ years of hands-on experience with React, Next.js, TypeScript, Node.js, Python, and modern cloud infrastructure.",
  },
  {
    title: "Enterprise-Ready",
    description: "Built systems for 4D Logiciel, SWIBECO, and SQLI serving thousands of users with high availability and performance.",
  },
  {
    title: "DevOps Excellence",
    description: "Established CI/CD pipelines, Docker containerization, and monitoring achieving 99.9% uptime across all platforms.",
  },
  {
    title: "Innovation-Driven",
    description: "Specialized in IoT, real-time systems, e-commerce, and SaaS platforms with cutting-edge tech stacks.",
  },
];

export const contactInfo = [
  { label: "Location", value: "Rabat · Morocco · Remote" },
  { label: "Email", value: "tech@wearecodelovers.com" },
  { label: "Phone", value: "+212 691 870 293" },
];

export const socialNetworks = ["LinkedIn", "GitHub", "Portfolio", "Email"];
