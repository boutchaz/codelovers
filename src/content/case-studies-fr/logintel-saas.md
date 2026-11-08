---
title: "LoginTel SaaS"
category: "IoT · Surveillance de la chaîne du froid"
description: "Plateforme complète de surveillance de la chaîne du froid avec suivi IoT en temps réel, systèmes d'alerte et rapports de conformité pour la logistique sous température dirigée."
result: "Production"
metric: "Surveillance de flotte IoT en temps réel"
gradient: "from-blue-500/20 via-cyan-500/10 to-indigo-600/20"
stack: ["Next.js", "Strapi CMS", "Python FastAPI", "MQTT", "TCP/IP", "Prometheus", "Grafana", "PostgreSQL"]
date: 2025-06-15
---

## Le défi

LoginTel est venu nous voir avec un problème critique : des distributeurs pharmaceutiques et alimentaires perdaient des millions à cause d'écarts de température pendant le transport. Ils avaient besoin d'une plateforme IoT robuste capable de surveiller les conditions de la chaîne du froid en temps réel, de déclencher des alertes immédiates et de produire des rapports de conformité pour les organismes de réglementation.

Les principaux défis :

- **Fiabilité en temps réel** — Les appareils IoT doivent transmettre température, humidité et position 24 h/24, 7 j/7, sans interruption
- **Complexité des protocoles** — Les appareils communiquent en MQTT, en TCP/IP et dans des formats binaires propriétaires
- **Latence des alertes** — Les dépassements de température doivent déclencher des alertes SMS/e-mail en quelques secondes, pas en minutes
- **Rapports de conformité** — Des pistes d'audit détaillées sont exigées pour les certifications FDA, HACCP et ISO
- **Architecture multi-locataire** — Chaque entreprise de logistique a besoin de données, de tableaux de bord et de règles d'alerte isolés

## Notre approche

Nous avons conçu une architecture à trois niveaux, optimisée à la fois pour l'ingestion de données en temps réel et pour les performances côté utilisateur :

### Pipeline de données IoT (Python FastAPI)

- **Service d'analyse TCP** — Décodeur de protocole binaire sur mesure pour les anciens appareils IoT
- **Intégration d'un broker MQTT** — Ingestion en moins d'une seconde depuis les capteurs modernes
- **Base de données de séries temporelles** — PostgreSQL avec l'extension TimescaleDB pour des requêtes historiques efficaces
- **Moteur d'alertes** — Surveillance de seuils par règles avec Prometheus AlertManager

### Plateforme web (Next.js + Strapi)

- **SaaS multi-locataire** — Isolation des données par organisation et contrôle d'accès par rôle
- **Tableau de bord en temps réel** — Connexions WebSocket pour des mises à jour de capteurs en direct
- **Gestion de contenu** — CMS headless Strapi pour le catalogue d'appareils, la documentation et les modèles de conformité
- **Génération de rapports** — Exports PDF automatisés avec graphiques de température horodatés et journaux de chaîne de traçabilité

### Stack d'observabilité

- **Prometheus** — Collecte de métriques depuis la passerelle IoT, les workers FastAPI et le serveur Next.js
- **Grafana** — Tableaux de bord opérationnels suivant les débits d'ingestion, les temps de réponse aux alertes et la santé du système
- **Intégration PagerDuty** — Les alertes critiques sont escaladées automatiquement vers les ingénieurs d'astreinte

## La stack

- **Frontend :** Next.js 14 avec App Router, TanStack Query, Recharts pour la visualisation des données
- **API backend :** Python FastAPI avec workers asynchrones, Celery pour les tâches de fond
- **CMS :** Strapi v4 avec PostgreSQL, types de contenu personnalisés pour les profils d'appareils
- **Couche IoT :** Broker MQTT (Mosquitto), serveur TCP sur mesure pour les protocoles binaires
- **Base de données :** PostgreSQL avec TimescaleDB pour les séries temporelles
- **Supervision :** Prometheus, Grafana, AlertManager
- **Infrastructure :** Docker Compose pour la préproduction, Kubernetes pour la production, PostgreSQL managé DigitalOcean

## Résultats

La plateforme a été lancée au T2 2024 et a depuis surveillé plus de **2 millions d'expéditions** au Maroc, en France et en Espagne :

- **Fiabilité de niveau production** — Fonctionnement stable sur 18 mois
- **Alertes en moins de 5 secondes** — Délai moyen de 3,2 secondes entre le dépassement de seuil et le SMS
- **100 % de conformité aux audits** — Tous les clients ont réussi leurs audits FDA et HACCP avec les rapports générés par LoginTel
- **40 % de coûts en moins** — Les clients ont réduit leurs pertes liées à la détérioration en éliminant les écarts de température non détectés

## Enseignements d'ingénierie

**L'abstraction des protocoles est rentable :** En découplant les protocoles des appareils (MQTT, TCP) de la logique métier, nous avons intégré trois nouveaux modèles d'appareils en moins d'une semaine chacun.

**Les séries temporelles comptent à grande échelle :** Le partitionnement en hypertables de TimescaleDB a maintenu des temps de réponse sous 200 ms, même avec 6 mois de données de capteurs par appareil.

**La fatigue d'alerte est réelle :** Nous avons ajouté des règles de limitation intelligentes (par exemple « une seule alerte par heure pour les seuils non critiques ») après que des clients se sont plaints d'une surcharge de notifications le premier mois.

---

**Prêt à construire des systèmes IoT critiques ?** [Réservez une session de travail avec CodeLovers](https://cal.com/codelovers/30min?user=codelovers&overlayCalendar=true&layout=month_view).
