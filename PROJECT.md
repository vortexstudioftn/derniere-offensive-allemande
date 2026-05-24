# Exposé Histoire — La dernière offensive Allemande (1918)

> Site web interactif servant de support de présentation pour un exposé en binôme en Première Générale.
> **Objectif** : choquer le prof, faire comprendre la classe, rester rigoureux historiquement.

---

## État actuel — 2026-05-24 (session 5 — audit + finitions + déploiement)

**Stade** : Phase 5 — site **déployé en ligne**, toutes les finitions faites. Prêt pour la présentation.

**URL live** : https://vortexstudioftn.github.io/derniere-offensive-allemande/

### Ce qui a été fait en session 5
- [x] **Audit visuel via Playwright MCP** : navigation complète du site en mode clavier, capture de chaque section, vérification des marqueurs/flèches/labels sur toutes les cartes
- [x] **Recalibrage géo** : alignement de toutes les coordonnées de villes (6 fichiers JS de cartes) sur `coordinates.json` — marqueurs désormais précis à la décimale (Amiens, Reims, Château-Thierry, Noyon, Soissons, Villers-Cotterêts, etc.)
- [x] **Vitrail de Doullens** : carte commémorative intégrée après la grille Personnages — image du vitrail + texte explicatif sur la conférence du 26 mars 1918
- [x] **Bloc "Backs to the wall"** : citation plein écran dramatique (Cormorant Garamond italic, guillemet rouge) entre Georgette et Blücher — l'ordre du jour de Haig du 11 avril 1918
- [x] **Crop CSS** : classe `.img-crop-artillerie` créée pour `artillerie-allemande-1918.jpg` (object-position 65%)
- [x] **Déploiement GitHub Pages** : repo `vortexstudioftn/derniere-offensive-allemande` créé, Pages activé, site live
- [x] **Test 1080p via Playwright** : viewport 1920x1080, toutes les sections vérifiées — Hook, Contexte, Doullens, "Backs to the wall", Michael, Anatomie — tout lisible depuis le fond de la salle

### Architecture du mode clavier
12 sections déclarées (incluant les 4 sous-batailles séparées) :
hook(1) → contexte(4) → plan(1) → anatomie(12) → persos(1) → battle-michael(4) → battle-georgette(3) → battle-blucher(3) → battle-gneisenau(3) → friedensturm(5) → bilan(1) → sources(1)

### Reste éventuel (optionnel, si temps)
1. **Son d'ambiance** (artillerie, marche) — déclenchable manuellement, muet par défaut
2. **Easter egg 1918** : taper "1918" au clavier → affiche les dates de l'armistice
3. **Affiner les lignes de front** dans timeline.js avec des GeoJSON historiques (NLS, Mémoire des Hommes)
4. **Tests cross-browser** : Firefox, Edge (déjà vérifié Chrome via Playwright)

---

## État précédent — 2026-05-24 (session 3 — refonte visuelle + slider temporel)

**Stade** : Phase 3 — visuels intégrés, nouveau chapitre interactif, layout corrigé.

### Critique honnête de la session 2 (basée sur captures utilisateur)
- Hook : OK, parfait mood Apple TV
- Plan Ludendorff : OK
- **Cartes scrollytelling : panneau de texte trop centré, grosses bandes vides, carte invisible**
- Section Personnages : cassée en `file://` (fetch JSON bloqué)
- Flèches sur cartes : trop fines, pas d'animation, marqueurs minuscules

### Corrections de session 3
- [x] Personnages embarqués **inline** dans `index.html` (`window.__PERSONS_FALLBACK__`) → marche en double-clic
- [x] **Refactor layout scrollytelling** : panneau de texte collé à **droite** (38% largeur max), carte plein écran derrière, voile dégradé pour la lisibilité, marqueur d'activation = bordure rouge gauche subtile (plus de bordure rouge permanente)
- [x] **Animations cartes** : nouveau `js/maps/_map-helpers.js` avec polylines qui se dessinent (SVG `stroke-dashoffset` + glow), `pulseMarker` (halo CSS animé), `cityLabel` (étiquette discrète permanente). Toutes les cartes refaites avec ces helpers.
- [x] **NOUVEAU chapitre 03 — "Anatomie de l'offensive"** : carte plein écran avec **curseur temporel** (12 dates clés mars→novembre 1918) qui anime le front + flèches d'attaque + ville-clé + titre/sous-titre en temps réel. Manipulable en live à l'oral. Pièce maîtresse du "wow effect".
- [x] **4 image bleeds plein écran** intégrées entre les sections : Stoßtruppen Bundesarchiv (avant Contexte), Signature Brest-Litovsk (après Contexte), Chars Renault FT (avant Bilan), Armistice Rethondes (avant Sources). Avec citations dramatiques en surimpression.
- [x] Légende des cartes **déplacée en bas-gauche** (le texte est maintenant à droite, fini les chevauchements)
- [x] Tooltips Leaflet stylés sombre, custom CSS

### Nouvelles décisions / paramètres
- 8 chapitres au lieu de 7 (ajout d'Anatomie)
- Section Personnages n'a plus besoin de serveur

### Prochaine étape immédiate (session 4)
1. **Tester en local** (`python -m http.server 8000` ou double-clic) et **renvoyer des captures**
2. **Affiner le slider** : peut-être ajouter un mode "auto-play" (bouton ▶) qui fait défiler tout seul mars→nov en 30 sec
3. **Texte "Backs to the wall"** comme bloc dramatique typo manuscrite dans la section Personnages ou Bataille Georgette
4. **Vitrail Doullens** : à intégrer dans la section Personnages comme objet commémoratif
5. **Crop CSS** pour `artillerie-allemande-1918.jpg` si on veut l'utiliser quelque part
6. **Déploiement GitHub Pages** (URL pour le prof) — voir README.md
7. **Test en conditions réelles** : projecteur, 1920×1080, vérifier lisibilité du slider et taille des marqueurs

---

## État précédent — 2026-05-24 (session 2 — assets téléchargés)

**Stade** : Phase 2 — assets en place, prêt pour l'intégration visuelle.

### Téléchargement des assets
- `download_assets.py` (script utilisateur) lancé → 24/26 téléchargés, mais **plusieurs faux positifs** (statue de Foch, masque mortuaire de Haig, soldats polonais au lieu d'allemands, etc.)
- `download_replacements.py` (script ciblé) lancé → 5/6 remplacements validés visuellement
- Recherches API stricte → Haig 1916 (profil) + obusier allemand NARA
- `villers-cotterets.jpg` supprimé (n'a jamais été correctement remplacé)

### Bilan assets (24 fichiers utilisables / 27 prévus)

✅ **Tous OK** :
- Portraits (9/9) : Ludendorff, Hindenburg, Hutier, Bruchmüller, Foch, Pétain, Haig (profil 1916), Pershing, Mangin
- Archive : chars-renault-ft, marne-1918, ruines-amiens, sturmtruppen (Bundesarchiv tranchée), foch-doullens (**vitrail commémoratif**, à présenter comme tel)
- Docs : armistice-rethondes, brest-litovsk-signature (vraie photo signature)
- Posters : 2/2
- Cartes : kaiserschlacht-overview (en slovène mais lisible), operation-michael-map, operation-georgette-map (en anglais, claire), second-marne-map

⚠️ **Acceptable mais perfectible** :
- `artillerie-allemande-1918.jpg` : photo NARA d'un obusier allemand mars 1917, mais avec gros cadre de catalogage US autour → à **cropper** côté CSS pour ne garder que la photo (à droite de l'image)

❌ **Manquants** :
- `villers-cotterets.jpg` (supprimé) → **alternative** : utiliser `chars-renault-ft.jpg` qu'on a déjà, c'est cette techno qui a fait la contre-offensive du 18 juillet
- `ordre-haig-11avril.jpg` → **alternative** : afficher le texte "With our backs to the wall…" en grand dans le site avec une typo dramatique (effet manuscrit) — pas besoin d'image
- `operation-blucher-map.png` → **alternative** : la carte `kaiserschlacht-overview` montre déjà Blücher-Yorck, et notre carte Leaflet `blucher.js` est déjà bonne

---

## État précédent — 2026-05-24 (session 1)

**Stade** : Phase 1 — squelette + première section fonctionnelle.

### Décisions validées
- **Stack** : Vanilla HTML/CSS/JS + Leaflet (CDN) + GSAP/ScrollTrigger (CDN). Pas de build, pas de Node.
- **Durée de l'oral** : 15 minutes → densité moyenne, on développe chaque section sans surcharger.
- **Navigation** : Scrollytelling pur (tu scrolles, les cartes/anims se déclenchent).
- **Hébergement** : Local + GitHub Pages (les deux). Backup wifi assuré.

### Avancement
- [x] Recherche historique de base (Kaiserschlacht, 4 opérations, Friedensturm)
- [x] Mémoire Claude initialisée (profil utilisateur, projet, préférences)
- [x] `PROJECT.md` créé
- [x] Stack technique validée
- [x] Plan détaillé validé
- [x] Squelette HTML/CSS/JS complet
- [x] Section Hook fonctionnelle (compteur d'obus animé)
- [x] Section Contexte fonctionnelle (carte Europe + flux divisions)
- [x] `ASSETS_LIST.md` (liste initiale des images à télécharger)
- [x] `README.md` (comment lancer + déployer)
- [ ] Section "Plan Ludendorff" — contenu + viz tactiques (Stoßtruppen, Bruchmüller)
- [ ] Section "Personnages clés" — cartes interactives portraits
- [ ] Section "4 batailles" — 4 cartes Leaflet animées
- [ ] Section "Friedensturm" — carte du tournant + contre-offensive 18 juillet
- [ ] Section "Bilan" — chiffres + thèse de conclusion
- [x] Téléchargement effectif des assets (download_assets.py + download_replacements.py)
- [ ] Tests cross-browser (Chrome / Firefox / Edge)
- [ ] Déploiement GitHub Pages

**Prochaine étape immédiate (session 3)** :
1. **Photos d'archive dans les sections** : intégrer sturmtruppen-21mars.jpg dans le Hook ou Plan, ruines-amiens dans Michael, chars-renault-ft dans Friedensturm, marne-1918 et brest-litovsk-signature dans le Contexte
2. **CSS de crop** pour `artillerie-allemande-1918.jpg` (object-position pour ne montrer que la photo de droite)
3. **Texte "Backs to the wall"** comme bloc dramatique typo manuscrite (remplace l'ordre Haig en image)
4. **Vitrail Doullens** : à intégrer comme objet commémoratif dans la section Personnages (en card spéciale)
5. Optionnellement : enrichir Plan Ludendorff (visu Stoßtruppen + Bruchmüller animée)

---

## 1. Sujet & angle d'attaque

**Sujet officiel** : "La dernière offensive Allemande"
**Cadre historique** : Offensive de printemps 1918 (allemand : *Kaiserschlacht*), conçue par le général **Erich Ludendorff** comme la **dernière chance** de l'Allemagne de gagner la guerre avant l'arrivée massive des troupes américaines.

**Angle dramatique** (le fil rouge narratif) : "Comment, en 4 mois, l'Allemagne a tenté un coup de poker à 1 million d'obus le premier jour — et a déclenché sa propre défaite."

**Thèse à défendre** :
1. C'était la dernière fenêtre stratégique allemande (paix de Brest-Litovsk → 50 divisions libérées à l'Est, mais les USA arrivent)
2. Le plan était **tactiquement brillant** (Stoßtruppen, artillerie Bruchmüller) mais **stratégiquement bancal** (pas d'objectif politique clair, logistique dépassée)
3. Le **Friedensturm** (15 juillet 1918) est le **point de bascule absolu** de la 1ère GM — après ça, l'Allemagne ne peut plus que reculer jusqu'à l'armistice.

---

## 2. Plan détaillé de la présentation

### Section 0 — Hook (10 sec)
Écran noir → son d'artillerie → chiffre qui apparaît : **« 1 100 000 obus en 5 heures »** → date : *21 mars 1918, 4h40* → fade vers le titre.

### Section 1 — Contexte (1918, le grand basculement)
- Fin 1917 : la Russie sort de la guerre (traité de Brest-Litovsk, 3 mars 1918)
- ~50 divisions allemandes transférées de l'Est vers l'Ouest
- Mais : les USA sont entrés en guerre en avril 1917 et débarquent en masse (1 million de Doughboys mi-1918)
- **Course contre la montre** : l'Allemagne doit gagner AVANT que l'Amérique ne pèse vraiment
- Carte animée : flux des divisions Est → Ouest + flux US Atlantique → France

### Section 2 — Le Plan Ludendorff
- Qui est Ludendorff ? (1er Quartier-maître général, vrai patron militaire avec Hindenburg)
- Logique : **frapper la jointure franco-britannique** (la "soudure" Picardie) pour séparer les armées alliées et repousser les Britanniques vers la Manche
- Innovations tactiques :
  - **Stoßtruppen** (troupes d'assaut, infiltration en petits groupes)
  - **Feuerwalze / barrage roulant Bruchmüller** (artillerie courte, intense, mélange explosifs + gaz)
  - Pas de préparation longue → effet de surprise
- 4 opérations prévues : Michael, Georgette, Blücher-Yorck, Gneisenau (+ Friedensturm pour finir)

### Section 3 — Les personnages clés
Format carte/portrait interactif :
- **Côté allemand** : Erich Ludendorff (cerveau), Paul von Hindenburg (figure), Oskar von Hutier (général de la 18e armée, doctrine d'infiltration), Georg Bruchmüller ("Durchbruchmüller", artilleur)
- **Côté allié** : Ferdinand Foch (devient généralissime allié le 26 mars 1918 — réponse à Michael), Philippe Pétain (CEC français), Douglas Haig (BEF britannique), John Pershing (AEF américain)
- Anecdote shock : Foch nommé commandant en chef interallié *à cause* de l'effondrement britannique face à Michael

### Section 4 — Les 4 batailles
Chaque bataille = un "chapitre" avec carte interactive (zone touchée, flèches d'attaque, gain de terrain en km), chronologie courte, chiffres clés, photo d'époque.

| # | Nom de code | Dates | Lieu | Gain max | Verdict |
|---|---|---|---|---|---|
| 1 | **Michael** | 21 mars – 5 avril 1918 | Picardie (Somme–Oise) | ~60 km | Percée historique mais s'épuise avant Amiens |
| 2 | **Georgette** | 9 – 29 avril 1918 | Flandres (Lys, Ypres) | ~20 km | Échec : pas de percée vers la Manche |
| 3 | **Blücher-Yorck** | 27 mai – 6 juin 1918 | Chemin des Dames → Marne | ~60 km | Aux portes de Paris (Château-Thierry) — mais salient vulnérable |
| 4 | **Gneisenau** | 9 – 13 juin 1918 | Montdidier – Noyon | ~8 km | Stoppé par contre-attaque franco-US (Mangin) |

### Section 5 — Le Friedensturm (le tournant)
- 15 juillet 1918 : **dernière offensive allemande** — attaque de part et d'autre de Reims
- Foch a anticipé : défense élastique en Champagne (Gouraud) → l'attaque s'épuise sur du vide
- **18 juillet** : contre-offensive alliée (Mangin, 10e armée) à Villers-Cotterêts avec les chars Renault FT — **bascule de la guerre**
- À partir de là : les Allemands reculent jusqu'à l'armistice du 11 novembre
- Le nom "Friedensturm" (= "offensive de la paix") est tragiquement ironique : c'est elle qui condamne l'Allemagne

### Section 6 — Bilan & conclusion
- Pertes : ~688 000 Allemands, ~863 000 Alliés en 4 mois (chiffres à re-sourcer)
- Pourquoi ça a échoué : pas d'objectif politique clair, logistique en retard sur les percées, "Schwarzer Tag" (8 août 1918, Amiens) brise le moral allemand
- Conséquence directe : abdication du Kaiser, République de Weimar, Traité de Versailles → conditions de la suite

### Section 7 — Sources & crédits
Bibliographie cliquable, crédits images, sources des cartes.

---

## 3. Direction artistique

**Mood** : sombre, dramatique, "documentaire premium" (genre Apple TV / Arte / NYT The Daily).

**Palette** :
- Fond : `#0a0a0a` (presque noir)
- Texte principal : `#e8e6e1` (blanc cassé, lisible)
- Accent rouge sang : `#c0392b` (pour les chiffres clés, les flèches d'attaque allemandes)
- Accent bleu allié : `#3a6b8c` (pour les positions/flèches alliées)
- Sépia/ocre : `#a08e6c` (pour les éléments d'archive)

**Typographie** :
- Titres : `Cormorant Garamond` ou `Playfair Display` (serif dramatique)
- Texte : `Inter` ou `Source Sans 3` (sans serif lisible)
- Chiffres clés : `Oswald` ou `Bebel Neue` (condensé impactant)

**Effets signature** :
- Scrollytelling (le contenu change selon le scroll, comme NYT/Pudding)
- Cartes interactives Leaflet avec couches qui s'animent (flèches d'offensive)
- Compteurs de chiffres animés (de 0 → 1 100 000 obus)
- Parallax discret sur les images d'archive
- Bruitages d'ambiance OPTIONNELS (artillerie courte, marche militaire en sourdine) — déclenchés à la demande, pas auto
- Transition "rideau noir" entre les chapitres

---

## 4. Stack technique proposée

**Recommandation** : **HTML / CSS / JS vanilla** + quelques libs ciblées. Pas de framework lourd (pas de React/Next) — déploiement instantané, pas de build, ça marche en ouvrant `index.html`.

| Brique | Lib | Raison |
|---|---|---|
| Cartes interactives | **Leaflet.js** | Léger, gratuit, plein de tuiles dispo, easy à animer |
| Tuiles cartographiques historiques | OSM standard + couches custom GeoJSON pour les fronts | |
| Animations scroll | **GSAP + ScrollTrigger** | Le standard pour le scrollytelling premium |
| Timeline | **TimelineJS** (KnightLab) ou custom CSS | TimelineJS si on veut aller vite, custom si on veut le look |
| Icônes | **Lucide** ou **Heroicons** | SVG inline, propres |
| Police | Google Fonts (chargement async) | |
| Hébergement (option) | GitHub Pages / Netlify / Vercel | Gratuit, URL partageable au prof |

**Alternative plus ambitieuse** (si le binôme veut pousser) : Mapbox GL JS (cartes 3D, plus belles mais clé API requise + quota gratuit limité).

---

## 5. Structure de fichiers prévue

```
ExposerHistoire/
├── PROJECT.md                  ← ce fichier (état + plan + TODO)
├── index.html                  ← page unique (toutes les sections)
├── css/
│   ├── reset.css
│   ├── main.css                ← styles globaux + palette
│   └── sections.css            ← styles spécifiques par section
├── js/
│   ├── main.js                 ← orchestration générale
│   ├── scrollytelling.js       ← GSAP / ScrollTrigger
│   ├── maps/
│   │   ├── michael.js          ← carte opération Michael
│   │   ├── georgette.js
│   │   ├── blucher.js
│   │   ├── gneisenau.js
│   │   └── friedensturm.js
│   └── counters.js             ← compteurs animés
├── data/
│   ├── fronts.geojson          ← lignes de front aux dates clés
│   ├── battles.json            ← métadonnées batailles
│   └── persons.json            ← portraits + bio
├── assets/
│   ├── img/                    ← photos archive (à télécharger via liste fournie)
│   ├── maps/                   ← cartes historiques scannées
│   ├── audio/                  ← bruitages (optionnel)
│   └── fonts/                  ← polices auto-hébergées (optionnel)
└── ASSETS_LIST.md              ← liste précise des médias à télécharger
```

---

## 6. Idées créatives pour faire dire "wtf"

À piocher selon le temps dispo :

- **Compteur d'obus en temps réel** au début : "tu vois ce chiffre monter ? c'est ce que les Allemands tiraient en 5h". Avec un sound design discret (tic-tic).
- **Carte qui change de couleur en live** au scroll : le front passe de la ligne stable de mars 1918 à la "vague rouge" qui déferle jusqu'aux portes de Paris.
- **Mode "vue du soldat"** : extrait de journal de tranchée qui apparaît en surimpression sur une photo d'archive (utiliser les fonds Mémoire des Hommes).
- **Comparateur de forces** interactif : slider qui montre les divisions allemandes vs alliées à chaque date — au début équilibré, puis l'Allemagne consume ses réserves.
- **"Et si Michael avait réussi ?"** — encart "uchronie" 30 secondes qui montre ce qu'il se serait passé si Amiens était tombée (séparation BEF/français = effondrement probable).
- **Easter egg** : taper "1918" au clavier fait apparaître les vraies dates de l'armistice (11/11/11h).
- **Mode présentation** : touches ←/→ pour naviguer entre les chapitres en plein écran, comme un Keynote mais en mille fois plus stylé.

---

## 7. Sources historiques de référence (à compléter)

- **EHNE / Eduscol** — *Mars 1918, la dernière offensive allemande* (programme officiel Première) : https://ehne.fr/fr/eduscol/première-générale/...
- **Wikipédia FR** — *Offensive du Printemps* : https://fr.wikipedia.org/wiki/Offensive_du_Printemps
- **Wikipédia FR** — *Bataille de la Marne (1918)* : https://fr.wikipedia.org/wiki/Bataille_de_la_Marne_(1918)
- **Chemins de mémoire (gouv.fr)** — Friedensturm / 2e bataille de la Marne
- **ECPAD** — fonds photo et vidéo d'archives militaires
- **National WWI Museum** (Kansas City) — cartes animées libres : https://www.theworldwar.org/learn/educator-resource/animated-maps-first-world-war-1914-1918
- **The Map as History** — cartes pédagogiques : https://www.the-map-as-history.com/First-World-War-1914-1918
- **Mémoire des Hommes** (gouv.fr / SHD) — JMO (Journaux des marches et opérations) numérisés

---

## 8. Inspiration UI / scrollytelling

Templates et tutos à étudier / forker :
- **Mapbox scrollytelling template** : https://www.mapbox.com/blog/how-to-build-a-scrollytelling-map
- **Glitch scrollytelling tutorial** : https://blog.glitch.com/post/how-to-build-a-scrollytelling-map-using-mapbox-and-glitch/
- **NYT — Snowfall** (le grand classique du genre)
- **Pudding.cool** (data viz narrative)
- **American Battle Monuments Commission — WWI Interactive Timeline** : https://www.abmc.gov/interactive/ww1/

---

## 9. Workflow entre sessions

À chaque début de session Claude :
1. Lire ce `PROJECT.md` en premier
2. Vérifier l'état actuel (section en haut)
3. Reprendre à la prochaine étape

À chaque fin de session :
1. Mettre à jour la section "État actuel" (date, ce qui est fait, ce qui bloque)
2. Mettre à jour les cases à cocher
3. Mettre à jour la "prochaine étape immédiate"

---

## 10. Questions ouvertes / décisions à prendre

- [ ] **Stack** : on confirme HTML/CSS/JS vanilla + Leaflet + GSAP ? Ou on tente Mapbox pour le rendu carto ?
- [ ] **Durée prévue de la présentation à l'oral** : 10 min ? 15 min ? 20 min ? → conditionne la densité du contenu
- [ ] **Mode présentation** : on veut le mode "slides au clavier" en plus du scrollytelling, ou un seul des deux ?
- [ ] **Audio** : ambiances sonores OK ou trop risqué en classe ? (peut être muet par défaut avec bouton ON)
- [ ] **Hébergement** : on met le site en ligne (GitHub Pages = URL pour le prof) ou on présente en local depuis ton PC ?
- [ ] **Répartition binôme** : qui parle de quoi ? (le site peut afficher visuellement qui prend la parole)
- [ ] **Sources autorisées par le prof** : la classe / le prof attend une bibliographie type lycée ? Citer Wikipédia OK ou pas ?
