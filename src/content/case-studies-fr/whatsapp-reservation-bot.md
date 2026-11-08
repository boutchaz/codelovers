---
title: "WhatsApp Reservation Bot"
category: "Automatisation · SaaS"
description: "Intégration multi-locataire de l'API WhatsApp Business permettant aux entreprises d'automatiser leurs réservations avec des webhooks, des mises à jour en temps réel et l'automatisation de flux N8N."
result: "Automatisé"
metric: "Réservations via WhatsApp"
gradient: "from-rose-500/20 via-fuchsia-500/10 to-purple-600/20"
stack: ["React", "Express.js", "Drizzle ORM", "PostgreSQL", "N8N", "WhatsApp Business API", "WebSocket"]
date: 2026-01-20
---

## Le défi

Les TPE et PME marocaines — restaurants, salons de beauté, cliniques — étaient submergées par les demandes de réservation sur WhatsApp. Le personnel passait des heures à confirmer les rendez-vous à la main, à vérifier les disponibilités et à envoyer des rappels. Notre client voulait une **plateforme SaaS** permettant aux entreprises d'automatiser leurs conversations WhatsApp via l'API Business officielle, sans embaucher de développeurs.

Besoins principaux :

- **SaaS multi-locataire** — Chaque entreprise dispose de son propre numéro WhatsApp, de son calendrier de réservation et de sa base clients, isolés
- **Réservation conversationnelle** — Analyser le langage naturel (« table pour 4 demain à 20 h »), vérifier les disponibilités, confirmer ou proposer des alternatives
- **Intégration de calendrier** — Synchroniser avec Google Calendar, bloquer les créneaux, empêcher les doubles réservations
- **Automatisation des flux** — Envoyer des rappels 24 h avant les rendez-vous, demander un avis après la visite, signaler les absences
- **Personnalisation sans code** — Les gérants doivent pouvoir modifier les parcours de conversation, les modèles de rappel et les règles CRM sans toucher au code

## Notre approche

Nous avons construit une architecture à trois couches, optimisée pour l'**expérience conversationnelle** et la **flexibilité des flux** :

### Passerelle WhatsApp (Express.js + webhooks)

- **API Business officielle** — Intégration de la Cloud API de Meta pour la messagerie d'entreprise vérifiée (coche verte)
- **Gestionnaire de webhooks** — Un serveur Express reçoit les messages WhatsApp entrants, valide les signatures et les met en file d'attente pour traitement
- **Analyseur de messages** — Un module NLP extrait l'intention de réservation (date, heure, nombre de personnes, type de service) à partir de messages en texte libre
- **Gestion du contexte** — Redis conserve l'état de la conversation (par exemple « en attente de confirmation de la date ») pour chaque session utilisateur

### Moteur de réservation (Node.js + Drizzle ORM)

- **Modèle de données multi-locataire** — PostgreSQL avec cloisonnement par `tenant_id` : entreprises, sites, services, réservations, clients
- **Logique de disponibilité** — Vérification des conflits de créneaux, des horaires d'ouverture et de la capacité du personnel avant confirmation
- **Parcours de confirmation** — Envoi de messages WhatsApp structurés avec boutons interactifs (Confirmer / Reprogrammer / Annuler)
- **Mises à jour en temps réel** — Les notifications de réservation sont poussées instantanément par WebSocket vers le tableau de bord de l'entreprise

### Automatisation des flux (N8N + nœuds personnalisés)

- **Éditeur visuel de flux** — Les gérants conçoivent leurs automatisations avec l'interface glisser-déposer de N8N (hébergée dans la plateforme)
- **Déclencheurs :** nouvelle réservation, 24 h avant le rendez-vous, 1 h après le rendez-vous, réponse du client avec un mot-clé
- **Actions :** envoyer un message WhatsApp, mettre à jour Google Calendar, enregistrer dans le CRM, prévenir le personnel via Slack
- **Nœuds N8N personnalisés** — Nous avons développé des nœuds pour l'API WhatsApp Business couvrant les types de messages avancés (modèles, listes interactives, médias)

### Tableau de bord d'administration (React SPA)

- **Gestion multi-sites** — Les chaînes (par exemple un salon avec 3 succursales) gèrent tous leurs sites depuis un seul tableau de bord
- **Vue calendrier** — Vues jour, semaine et mois avec reprogrammation par glisser-déposer, codées par couleur selon le type de service
- **CRM clients** — Historique des conversations, historique des réservations, étiquettes, notes
- **Analyses** — Taux de conversion des réservations, temps de réponse moyen, taux d'absence, chiffre d'affaires par canal

## La stack

- **Frontend :** React 18, TanStack Router + Query, Tailwind CSS, FullCalendar.js
- **Backend :** Express.js, Drizzle ORM, PostgreSQL, Redis pour les sessions et le cache
- **WhatsApp :** Meta Cloud API (Business Platform), vérification des webhooks, messages modèles
- **Automatisation :** N8N auto-hébergé (moteur de flux), nœuds WhatsApp personnalisés
- **Temps réel :** WebSocket (Socket.io) pour les mises à jour du tableau de bord en direct
- **Infrastructure :** Docker Compose, reverse proxy nginx, SSL Let's Encrypt, Droplets DigitalOcean

## Résultats

La plateforme a été lancée en janvier 2026 et a intégré **47 entreprises** en 8 semaines :

- **Plus de 12 000 réservations automatisées** — Un parcours sans intervention, de la demande du client à la confirmation dans le calendrier
- **83 % d'automatisation** — Seules 17 % des conversations ont nécessité une intervention humaine (demandes floues, cas particuliers)
- **4,2 heures gagnées par jour** — Temps moyen économisé par entreprise (par rapport à la gestion manuelle de WhatsApp)
- **92 % de satisfaction client** — Le NPS de l'enquête après réservation atteint en moyenne 9,2/10 pour la rapidité et la clarté des réponses

### Impact concret

**Cas d'un restaurant :** Un restaurant de Casablanca de 45 tables a automatisé ses réservations des pics du vendredi et du samedi. Avant : 2 employés sur WhatsApp de 18 h à minuit. Après : le bot gère 90 % des réservations, le personnel n'intervient que pour les grands groupes ou les demandes spéciales.

**Cas d'un salon de beauté :** Une chaîne de salons de Rabat (3 sites, 12 coiffeurs) a intégré les calendriers de son personnel. Les clients réservent un coiffeur précis via WhatsApp ; le bot vérifie sa disponibilité sur tous les sites et propose des alternatives si tout est complet.

## Enseignements d'ingénierie

**Le NLP est difficile, un repli structuré est indispensable :** Les premières versions s'appuyaient uniquement sur l'analyse en langage naturel (« je veux une coupe mardi prochain »). La précision était de 60 %. Nous avons ajouté des boutons de réponse rapide (« Choisissez une date : [Demain] [Ce week-end] [Semaine prochaine] ») en solution de repli, ce qui a porté les réservations réussies à 83 %.

**Le multi-locataire doit s'étendre aux flux N8N :** Les flux d'automatisation de chaque entreprise sont cloisonnés par `tenant_id` dans la base de N8N. Cela évite les déclenchements entre locataires (par exemple un rappel du salon A envoyé à un client du salon B).

**Les limites de débit de WhatsApp sont strictes :** L'API de Meta autorise 1 000 messages par jour et par numéro professionnel (sans approbation). Nous avons mis en place une file avec limitation de débit pour rester sous le plafond, prioriser les messages urgents (confirmations) sur le marketing (rappels) et alerter les entreprises à l'approche du quota.

**Les messages modèles exigent une approbation préalable :** Meta impose des modèles de messages pré-approuvés pour certains parcours (par exemple les rappels de rendez-vous). Nous avons construit une bibliothèque de 20 modèles pré-approuvés en arabe, en français et en anglais, couvrant 95 % des cas d'usage.

---

**Envie d'automatiser vos échanges clients à grande échelle ?** [Construisons-le ensemble](https://cal.com/codelovers/30min?user=codelovers&overlayCalendar=true&layout=month_view).
