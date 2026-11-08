---
title: "Passion Fitness"
category: "SaaS · Plateforme pour salles d'arts martiaux"
description: "Plateforme multi-locataire pour salles d'arts martiaux, au service des salles de JJB au Maroc. Réservation de cours, suivi de progression de ceinture Mon Parcours, connexions entre membres RollMap, tableau de bord web et application mobile native."
result: "Production"
metric: "Exploitation de salles de JJB au Maroc"
gradient: "from-red-500/20 via-orange-500/10 to-amber-600/20"
stack: ["Next.js", "Supabase", "Expo React Native", "Paddle", "TypeScript", "PostgreSQL"]
date: 2025-07-15
---

## Le défi

Les salles d'arts martiaux, en particulier les académies de jiu-jitsu brésilien (JJB), avaient besoin d'une plateforme spécialisée pour gérer les réservations de cours, suivre la progression des ceintures de leurs membres et entretenir l'esprit de communauté. Les logiciels de salle génériques n'offraient pas les fonctions propres aux arts martiaux, comme le suivi de la progression technique ou les connexions entre partenaires de roulage (sparring).

Les besoins principaux :

- **Réservation de cours** — Gestion du planning des cours collectifs, des open mats et des séances privées
- **Mon Parcours** — Suivi de la progression des ceintures avec des jalons techniques et des évaluations par les instructeurs
- **RollMap** — Graphe de connaissances propre au JJB, reliant les membres selon leur niveau, leurs partenaires d'entraînement et leurs échanges de techniques
- **Application mobile native** — Les membres ont besoin d'un accès nomade aux plannings, au suivi de progression et aux journaux d'entraînement
- **Intégration des paiements** — Facturation automatisée des abonnements avec Paddle pour les paiements internationaux
- **SaaS multi-locataire** — Prise en charge de plusieurs salles, avec données et image de marque isolées

## Notre approche

Nous avons construit un système à deux plateformes : un tableau de bord web Next.js pour le personnel des salles et une application mobile Expo React Native pour les membres :

### Réservation et planning des cours

- **Calendrier en direct** — Disponibilité des cours en temps réel, avec limites de capacité
- **Rappels automatiques** — Notifications push 1 heure avant les cours programmés
- **Suivi des présences** — Le personnel marque les présents ; le système enregistre la fréquence d'entraînement de chaque membre

### Mon Parcours — Système de progression des ceintures

- **Programme technique** — Définir les exigences par ceinture (par exemple « maîtriser 5 passages de garde pour la ceinture bleue »)
- **Évaluations des instructeurs** — Les coachs examinent la progression des membres et attribuent rayures et ceintures
- **Tableau de bord de progression** — Les membres voient leur parcours : techniques apprises, heures de roulage enregistrées, calendrier de promotion

### RollMap — Graphe de connaissances du JJB

- **Réseau de partenaires d'entraînement** — Visualiser qui s'entraîne avec qui ; découvrir de nouveaux partenaires de roulage
- **Échange de techniques** — Les membres étiquettent les techniques pratiquées pendant les roulages, ce qui construit une base de connaissances partagée
- **Appariement par niveau** — Suggérer des partenaires de sparring selon la catégorie de poids, l'expérience et les objectifs d'entraînement

### Expérience membre axée mobile

- **Expo React Native** — Applications iOS et Android à partir d'une seule base de code
- **Prise en charge hors ligne** — Consulter les plannings et la progression sans connexion
- **Notifications push** — Rappels de cours, promotions de ceinture et invitations de partenaires d'entraînement

### Paiement et multi-locataire

- **Intégration Paddle** — Gestion des abonnements, de la facturation et de la conformité fiscale pour les salles internationales
- **RLS Supabase** — Isolation stricte des données par salle grâce aux politiques de sécurité au niveau des lignes
- **Image de marque personnalisée** — Chaque salle configure son logo, ses couleurs et son système de ceintures (certaines salles utilisent des progressions de rayures modifiées)

## La stack

- **Tableau de bord web :** Next.js 14 avec App Router, TypeScript, TanStack Query
- **Application mobile :** Expo React Native, TypeScript, Expo Router
- **Backend :** Supabase (PostgreSQL + Auth + Realtime + Storage)
- **Base de données :** PostgreSQL avec politiques de sécurité au niveau des lignes pour le multi-locataire
- **Paiements :** Paddle pour la facturation des abonnements
- **Infrastructure :** Vercel pour le web, EAS pour les builds mobiles, backend managé Supabase

## Résultats

Passion Fitness a été lancée en juillet 2025 et fonctionne aujourd'hui en production dans des salles de JJB au Maroc :

- **Engagement des membres** — La fréquence d'entraînement a augmenté à mesure que les membres suivaient leur progression et se connectaient à des partenaires via RollMap
- **Efficacité des instructeurs** — Les évaluations de ceinture sont passées des registres papier au suivi numérique
- **Adoption mobile** — Plus de 80 % des membres utilisent l'application chaque semaine pour réserver leurs cours et consulter leur progression
- **Prête pour l'international** — Paddle gère les abonnements multidevises pour les salles qui s'étendent en Europe

## Enseignements d'ingénierie

**Expo simplifie le déploiement mobile :** Les builds EAS et les mises à jour à distance nous permettent de livrer corrections et fonctionnalités sans attendre l'approbation des stores (essentiel pour des produits en phase de démarrage).

**La visualisation du graphe RollMap est la fonctionnalité phare :** Les premières versions se concentraient sur la réservation et la progression ; le graphe social de RollMap est devenu la fonctionnalité la plus demandée dès que les membres ont vu les connexions entre partenaires d'entraînement.

**Supabase Realtime alimente les fonctions collaboratives :** Les mises à jour de capacité des cours et les évaluations des instructeurs se propagent instantanément sur le web et le mobile, indispensable pour les usages multi-appareils.

**Paddle absorbe la complexité des paiements :** Gérer la TVA, la SCA et la facturation multidevise aurait demandé des semaines de développement ; Paddle s'en est chargé nativement.

---

**Vous construisez une plateforme SaaS de niche avec web et mobile ?** [Parlons-en](https://cal.com/codelovers/30min?user=codelovers&overlayCalendar=true&layout=month_view).
