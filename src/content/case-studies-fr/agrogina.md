---
title: "AgroGina"
category: "Agriculture · Analyse satellite"
description: "Plateforme d'agriculture de précision combinant l'analyse d'imagerie satellite, le suivi NDVI avec Google Earth Engine et un ERP géospatial multi-locataire pour les exploitations marocaines."
result: "Temps réel"
metric: "Suivi de la végétation et analyses"
gradient: "from-emerald-500/20 via-teal-500/10 to-green-600/20"
externalUrl: "https://agrogina.com/"
stack: ["React", "NestJS", "FastAPI", "Google Earth Engine", "PostgreSQL + PostGIS", "Leaflet", "Redis"]
date: 2025-09-10
---

## Le problème

Les coopératives agricoles marocaines avaient besoin d'un moyen de suivre la santé des cultures sur des centaines d'exploitations dispersées, dont beaucoup en zone rurale avec une connexion peu fiable. Les méthodes de repérage traditionnelles étaient lentes, subjectives et coûteuses. La vision d'AgroGina : **des analyses agronomiques issues du satellite, accessibles aux petits exploitants**, combinées à des outils ERP pour les stocks, les ventes et la gestion des équipes.

Les principaux défis :

- **Intégration des données satellite** — Traiter l'imagerie multispectrale de Sentinel-2 pour calculer le NDVI (indice de santé de la végétation)
- **Complexité géospatiale** — Gérer des milliers de parcelles avec leurs contours polygonaux, l'historique des rotations de cultures et les prévisions de rendement
- **Multi-locataire** — Chaque coopérative ne voit que ses exploitations, ses équipes et ses données agronomiques (isolation stricte par `org_id`)
- **Expérience hors ligne d'abord** — Les agents de terrain doivent enregistrer observations et interventions sans connexion, puis synchroniser plus tard
- **Architecture à deux domaines** — La logique métier (ERP) et le traitement satellite (Google Earth Engine) demandent des technologies différentes

## Notre approche

Nous avons séparé la plateforme en deux backends spécialisés, avec un frontend React unifié :

### API métier (NestJS + PostgreSQL)

- **ERP multi-locataire** — Chaque requête est filtrée par `org_id` au niveau de la base de données (politiques RLS de Postgres)
- **Gestion des exploitations** — CRUD pour les parcelles, les cultures, les calendriers de plantation et les relevés de récolte
- **Équipes et rôles** — Comptes utilisateurs rattachés à une organisation, avec les rôles agronome, agent de terrain et administrateur
- **Stocks et ventes** — Suivi des engrais, du matériel et des ventes de récoltes par coopérative
- **REST + GraphQL** — NestJS expose les deux interfaces ; le frontend utilise GraphQL pour les requêtes imbriquées complexes

### API de traitement satellite (Python FastAPI + Google Earth Engine)

- **Intégration GEE** — SDK Python d'Earth Engine côté serveur pour le calcul du NDVI et l'analyse de séries temporelles
- **Traitement par lots** — Des workers Celery récupèrent chaque semaine les nouvelles images Sentinel-2 et calculent les indices de végétation par parcelle
- **Requêtes géospatiales** — Extensions PostGIS pour les intersections de polygones, les calculs de surface et les zones tampons
- **Couche de cache** — Redis met en cache les séries temporelles NDVI pour éviter les appels redondants à l'API GEE (optimisation des quotas)

### Frontend (React SPA)

- **Cartes Leaflet** — Édition interactive des limites d'exploitation, superpositions de cartes de chaleur NDVI
- **Synchronisation hors ligne** — IndexedDB met les données des exploitations en cache ; un service worker met les modifications en file d'attente pour les synchroniser plus tard
- **TanStack Query** — Mises à jour optimistes avec logique de nouvelle tentative pour une connectivité rurale instable
- **Support PWA** — Installable sur les tablettes Android utilisées par les agents de terrain

### Architecture multi-locataire

Chaque table de la base de données contient `org_id` (UUID). Les politiques de sécurité au niveau des lignes (RLS) de Postgres imposent :

```sql
CREATE POLICY tenant_isolation ON farms
  USING (org_id = current_setting('app.current_org_id')::uuid);
```

NestJS définit la variable de session à chaque requête via un intercepteur global. Cela garantit **zéro fuite entre locataires**, même si le code applicatif contient des bugs.

## La stack

- **Frontend :** React 18, TanStack Router + Query, Leaflet + React-Leaflet, IndexedDB, Service Worker
- **Backend métier :** NestJS, TypeORM, PostgreSQL 15 avec PostGIS, GraphQL (Apollo)
- **Backend satellite :** Python FastAPI, API Python de Google Earth Engine, Celery + Redis, GeoPandas
- **Base de données :** PostgreSQL avec l'extension PostGIS, politiques RLS, TimescaleDB pour les séries temporelles NDVI
- **Infrastructure :** Docker Compose, reverse proxy nginx, Droplets DigitalOcean, sauvegardes automatisées

## Résultats

AgroGina a été lancée en septembre 2025 et accompagne aujourd'hui **12 coopératives gérant 4 200 hectares** à travers le Maroc :

- **Plus de 8 500 analyses NDVI** — Des rapports hebdomadaires automatisés sur la santé de la végétation pour chaque parcelle inscrite
- **Hors ligne d'abord, prouvé** — Des agents de terrain à Chefchaouen et Ouarzazate saisissent leurs données pendant des déplacements d'une semaine, puis synchronisent à leur retour en ville
- **Aucune fuite de données entre locataires** — Les politiques RLS ont réussi les tests d'intrusion ; aucun incident d'accès entre organisations
- **Détection des anomalies 40 % plus rapide** — Les alertes satellite signalent les problèmes d'irrigation ou les infestations 2 à 3 semaines plus tôt que le repérage manuel

## Enseignements d'ingénierie

**Deux backends plutôt qu'un monolithe pour ce domaine :** Séparer NestJS (règles métier, CRUD rapide) de FastAPI (traitement GEE gourmand en CPU) nous a permis de les faire évoluer et de les déployer indépendamment. L'API GEE est lente (300 à 2 000 ms par requête) ; le cache est donc indispensable.

**La RLS est le bon outil pour un multi-locataire strict :** La sécurité au niveau des lignes a déplacé l'isolation entre locataires du code applicatif (source d'erreurs) vers la base de données (garantie). Nous dormons mieux en sachant qu'une clause `.where('org_id', ...)` oubliée ne fera fuiter aucune donnée.

**Le hors ligne d'abord est non négociable pour le Maroc rural :** Les premiers bêta-testeurs abandonnaient l'application quand ils ne pouvaient pas enregistrer leurs observations hors ligne. L'ajout d'IndexedDB et de la synchronisation par service worker a fait passer le NPS de 6 à 9.

**Le NDVI seul ne suffit pas :** Les agriculteurs ont demandé des recommandations prescriptives (« appliquer 20 kg/ha d'azote ») fondées sur les tendances du NDVI. Nous avons ajouté un moteur de règles qui interprète les données satellite à travers des modèles agronomiques, devenu la fonctionnalité phare de la plateforme.

---

**Besoin d'un SaaS multi-locataire avec une logique métier complexe ?** [Parlons-en](https://cal.com/codelovers/30min?user=codelovers&overlayCalendar=true&layout=month_view).
