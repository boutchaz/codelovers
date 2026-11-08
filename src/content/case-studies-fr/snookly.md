---
title: "Snookly"
category: "SaaS · Exploitation de clubs de snooker"
description: "Système multi-locataire de gestion de clubs de snooker avec cartes membres RFID, score des tables en direct, caisse café/billard et tableau de bord administratif."
result: "Production"
metric: "Plateforme d'exploitation de clubs en production"
gradient: "from-purple-500/20 via-indigo-500/10 to-violet-600/20"
stack: ["Next.js", "Supabase", "TypeScript", "PostgreSQL", "RFID Integration"]
date: 2025-08-20
---

## Le défi

Les gérants de clubs de snooker avaient besoin d'un système unique pour gérer l'accès des membres, suivre l'occupation des tables en temps réel, encaisser les ventes du café et du billard, et superviser l'activité de plusieurs sites. Les solutions existantes étaient fragmentées — des systèmes séparés pour la caisse, le contrôle d'accès et la gestion des tables — ce qui créait des goulots d'étranglement et une mauvaise expérience pour les membres.

Les besoins principaux :

- **Accès des membres par RFID** — Cartes sans contact pour l'entrée et l'attribution des tables
- **Score des tables en direct** — Suivi de l'occupation en temps réel et facturation automatique par table et par heure
- **Caisse intégrée** — Un seul encaissement pour les commandes du café, les frais de table de billard et les articles en vente
- **Architecture multi-locataire** — Chaque club fonctionne de façon indépendante, avec des données isolées
- **Tableau de bord d'administration** — Reporting centralisé du chiffre d'affaires, de l'activité des membres et des stocks

## Notre approche

Nous avons construit une plateforme SaaS full-stack autour de trois modules principaux :

### Membres et contrôle d'accès

- **Intégration RFID** — Les membres badgent à l'entrée ; le système enregistre les arrivées et attribue les tables disponibles
- **Niveaux d'adhésion** — Configuration des tarifs horaires, des forfaits et des remises de fidélité par club
- **Profils numériques** — Historique des membres, suivi du solde et renouvellements automatiques

### Gestion des tables en direct

- **Score en temps réel** — Le personnel marque les tables occupées ou libres ; le système calcule automatiquement les frais
- **Facturation au chronomètre** — Tarifs horaires avec suivi à la minute ; facturation au prorata pour les sessions partielles
- **Notifications automatiques** — Prévenir les membres quand leur temps prépayé touche à sa fin

### Caisse café et billard

- **Encaissement unifié** — Regrouper frais de table, commandes du café et achats en boutique dans une seule transaction
- **Synchronisation des stocks** — Mise à jour des stocks en temps réel ; alertes de stock bas pour les articles les plus demandés
- **Paiements fractionnés** — Espèces, carte et solde du compte membre

### Multi-locataire et tableau de bord d'administration

- **Isolation par organisation** — Les données de chaque club sont strictement séparées grâce à la sécurité au niveau des lignes (RLS) de Supabase
- **Analyses de revenus** — Rapports quotidiens, hebdomadaires et mensuels sur l'utilisation des tables, les ventes du café et les tendances d'adhésion
- **Rôles du personnel** — Permissions pour les caissiers, les managers et les propriétaires de club

## La stack

- **Frontend :** Next.js 14 avec App Router, TypeScript, TanStack Query
- **Backend :** Supabase (PostgreSQL + Auth + Realtime + Storage)
- **Base de données :** PostgreSQL avec politiques de sécurité au niveau des lignes pour le multi-locataire
- **Intégrations :** API de lecteur de cartes RFID, traitement des paiements
- **Infrastructure :** Hébergement Vercel, backend managé Supabase

## Résultats

Snookly a été lancé en août 2025 et fonctionne aujourd'hui en production dans plusieurs clubs de snooker :

- **Exploitation simplifiée** — Le personnel enregistre les arrivées et les paiements 3 fois plus vite qu'avec des systèmes manuels
- **Exactitude en temps réel** — La facturation automatique des tables a supprimé les erreurs de calcul manuel
- **Satisfaction des membres** — Les cartes RFID ont réduit les frictions à l'entrée ; les membres apprécient la facturation transparente à la minute
- **Prêt pour plusieurs sites** — L'architecture permet d'ajouter de nouveaux clubs sans modifier le code

## Enseignements d'ingénierie

**La RLS de Supabase est le bon choix pour un multi-locataire strict :** Les politiques de sécurité au niveau des lignes imposent l'isolation des données au niveau de la base de données, ce qui supprime le risque de fuite entre locataires.

**Le temps réel compte pour la gestion des tables :** Les abonnements Supabase Realtime gardent les tableaux de bord du personnel synchronisés instantanément à l'ouverture ou à la fermeture d'une table, un point critique lors des week-ends chargés.

**L'intégration RFID a exigé une abstraction matérielle :** Nous avons construit une fine couche d'API pour gérer différents fabricants de lecteurs de cartes, ce qui rend les futures évolutions matérielles transparentes.

---

**Vous construisez une plateforme SaaS multi-locataire ?** [Parlons-en](https://cal.com/codelovers/30min?user=codelovers&overlayCalendar=true&layout=month_view).
