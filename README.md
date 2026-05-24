# La dernière offensive Allemande — Exposé interactif

Site web servant de support à un exposé d'histoire de Première Générale sur la **Kaiserschlacht** (offensive de printemps allemande, 1918).

Construit avec HTML / CSS / JS vanilla + **Leaflet** (cartes) + **GSAP / ScrollTrigger** (scrollytelling). Aucun build, aucune dépendance à installer.

> 📌 **Pour piloter le projet entre sessions** : voir `PROJECT.md` (état d'avancement, plan détaillé, TODO).
> 📌 **Pour télécharger les images** : voir `ASSETS_LIST.md` (liste précise, par priorité).

---

## 🚀 Lancer le site en local

### Option 1 — Double-cliquer `index.html` (le plus simple)
Marche pour 95 % du site. Limite : le chargement de `data/persons.json` peut échouer selon le navigateur (sécurité CORS sur `file://`).

### Option 2 — Mini serveur Python (recommandé, marche partout)
Ouvre **PowerShell** dans le dossier du projet et lance :

```powershell
python -m http.server 8000
```

Puis ouvre dans ton navigateur : http://localhost:8000

### Option 3 — Extension VS Code "Live Server"
Si tu utilises VS Code : installe l'extension **Live Server** (Ritwick Dey), clique droit sur `index.html` → "Open with Live Server". Bonus : rechargement automatique quand tu modifies un fichier.

---

## 🌐 Déployer en ligne (GitHub Pages — gratuit, URL partageable au prof)

1. Crée un compte GitHub si t'en as pas (https://github.com).
2. Crée un nouveau dépôt public, par exemple `derniere-offensive-allemande`.
3. Dans le dossier du projet, en PowerShell :
   ```powershell
   git init
   git add .
   git commit -m "Initial commit — exposé Kaiserschlacht"
   git branch -M main
   git remote add origin https://github.com/<TON_PSEUDO>/derniere-offensive-allemande.git
   git push -u origin main
   ```
4. Sur GitHub : **Settings → Pages** → Source : "Deploy from a branch" → Branche `main`, dossier `/ (root)` → Save.
5. Au bout d'une minute, le site est accessible à : `https://<TON_PSEUDO>.github.io/derniere-offensive-allemande/`

C'est l'URL que tu donneras au prof.

---

## 📁 Structure du projet

```
ExposerHistoire/
├── PROJECT.md           ← état du projet, plan, TODO (à lire en premier)
├── ASSETS_LIST.md       ← liste des images à télécharger
├── README.md            ← ce fichier
├── index.html           ← page unique du site
├── css/
│   ├── reset.css
│   ├── main.css         ← palette, typo, layout global, navigation
│   └── sections.css     ← styles spécifiques par section
├── js/
│   ├── main.js          ← navigation + smooth scroll
│   ├── counters.js      ← compteurs animés (1 100 000 obus...)
│   ├── scrollytelling.js ← GSAP/ScrollTrigger → events step:enter
│   ├── persons.js       ← injection des cartes personnages depuis JSON
│   └── maps/
│       ├── context.js   ← carte Europe + flux (section Contexte)
│       ├── michael.js   ← opération Michael (21 mars - 5 avril)
│       ├── georgette.js ← opération Georgette (9 - 29 avril)
│       ├── blucher.js   ← Blücher-Yorck (27 mai - 6 juin)
│       ├── gneisenau.js ← Gneisenau (9 - 13 juin)
│       └── friedensturm.js ← Friedensturm + contre-attaque 18 juillet
├── data/
│   └── persons.json     ← données des 9 personnages
└── assets/              ← (à créer) — images à télécharger via ASSETS_LIST.md
    ├── img/
    │   ├── persons/
    │   ├── archive/
    │   └── maps-history/
    └── audio/
```

---

## 🎬 Mode présentation (jour J)

- Mets le navigateur en **plein écran** (F11)
- Ferme tous les onglets parasites
- Coupe les notifications Windows (concentration "Ne pas déranger")
- Branche en HDMI sur le vidéoprojecteur **avant** de lancer le site (la première carte Leaflet calcule sa taille au chargement)
- Si le wifi de la classe est foireux : ouvre depuis le dossier local — toutes les libs sont en CDN mais Leaflet a besoin des tuiles OSM (donc connexion souhaitable). **Plan B** : avoir aussi l'URL GitHub Pages en backup.

---

## 🔧 Modifier le contenu rapidement

- **Changer un texte** : édite `index.html` directement (cherche la phrase, modifie).
- **Changer un compteur** : trouve `<span class="counter" data-target="...">` et modifie `data-target`.
- **Ajouter un personnage** : ajoute une entrée dans `data/persons.json`.
- **Modifier une carte** : édite le fichier `js/maps/<nom>.js` correspondant.

---

## ❓ Problèmes connus

| Symptôme | Cause | Solution |
|---|---|---|
| Section Personnages vide | `data/persons.json` pas chargé (CORS file://) | Lance via `python -m http.server` (option 2) |
| Cartes Leaflet blanches | Pas de connexion internet | Vérifie le wifi (tuiles OSM en ligne) |
| Compteurs ne s'animent pas | JS bloqué | Ouvre la console (F12), regarde les erreurs |
| Tout est cassé après une modif | Erreur de syntaxe | Console (F12) → onglet Console → ligne d'erreur |
