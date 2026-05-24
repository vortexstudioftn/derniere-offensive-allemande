# ASSETS_LIST — médias à télécharger

> Liste des images / vidéos / sons à télécharger pour le site.
> Tout est **libre de droits** ou **domaine public** (Wikimedia Commons, Bundesarchiv, BNF/Gallica, NARA).
> Ne pas oublier de citer les sources dans la section "Sources" du site.

**Convention de nommage** : `nomcourt.jpg` (minuscules, sans accents, sans espaces).
**Format recommandé** : JPG pour les photos d'archive, PNG pour les cartes/illustrations.
**Largeur cible** : 1600 px max (pour ne pas alourdir le site).

---

## ⭐ PRIORITÉ 1 — indispensables pour le MVP

### Portraits (dossier : `assets/img/persons/`)

Tous les portraits sont à chercher sur **Wikimedia Commons** (https://commons.wikimedia.org/). Tape le nom du général dans la barre de recherche → onglet "Multimédia". Téléchargement : cliquer sur l'image → "Télécharger l'original" (ou la plus grande version dispo).

| Fichier cible | Personnage | Recherche Wikimedia |
|---|---|---|
| `assets/img/persons/ludendorff.jpg` | Erich Ludendorff (uniforme, vers 1917-1918) | `Erich Ludendorff` |
| `assets/img/persons/hindenburg.jpg` | Paul von Hindenburg (uniforme) | `Paul von Hindenburg` |
| `assets/img/persons/hutier.jpg` | Oskar von Hutier | `Oskar von Hutier` |
| `assets/img/persons/bruchmuller.jpg` | Georg Bruchmüller | `Georg Bruchmüller` |
| `assets/img/persons/foch.jpg` | Ferdinand Foch (en uniforme, vers 1918) | `Ferdinand Foch` |
| `assets/img/persons/petain.jpg` | Philippe Pétain (1918, **pas** Vichy !) | `Philippe Pétain 1918` |
| `assets/img/persons/haig.jpg` | Douglas Haig (Field Marshal) | `Douglas Haig` |
| `assets/img/persons/pershing.jpg` | John J. Pershing | `John J. Pershing` |
| `assets/img/persons/mangin.jpg` | Charles Mangin | `Charles Mangin général` |

⚠️ **Important pour Pétain** : prendre une photo de 1918, **en uniforme français de la Grande Guerre**. Pas une photo de Vichy (1940+), qui serait totalement hors-sujet et confondante.

---

### Photos d'archive (dossier : `assets/img/archive/`)

| Fichier cible | Sujet | Recherche |
|---|---|---|
| `assets/img/archive/sturmtruppen-21mars.jpg` | Stoßtruppen allemands en assaut, 1918 | Wikimedia : `Stosstruppen` ou `German stormtroopers WWI` |
| `assets/img/archive/artillerie-allemande-1918.jpg` | Canons allemands en batterie, mars 1918 | Wikimedia : `German artillery 1918` |
| `assets/img/archive/ruines-amiens.jpg` | Ruines / civils fuyant après Michael | Wikimedia : `Spring Offensive 1918` |
| `assets/img/archive/foch-doullens.jpg` | Conférence de Doullens, 26 mars 1918 | Wikimedia : `Doullens 1918` |
| `assets/img/archive/chars-renault-ft.jpg` | Chars Renault FT en avance, juillet 1918 | Wikimedia : `Renault FT 1918` |
| `assets/img/archive/villers-cotterets.jpg` | Forêt de Villers-Cotterêts, 18 juillet 1918 | Wikimedia : `Villers-Cotterêts 1918` |
| `assets/img/archive/marne-1918.jpg` | 2ᵉ bataille de la Marne — soldats US ou français | Wikimedia : `Second Battle of the Marne` |

---

### Cartes historiques (dossier : `assets/img/maps-history/`)

Référence : https://commons.wikimedia.org/wiki/Category:Maps_of_the_Spring_Offensive_(1918)

| Fichier cible | Sujet |
|---|---|
| `assets/img/maps-history/kaiserschlacht-overview.png` | Carte d'ensemble des 5 offensives (mars-juillet 1918) |
| `assets/img/maps-history/operation-michael-map.png` | Détail opération Michael |
| `assets/img/maps-history/operation-georgette-map.png` | Détail opération Georgette |
| `assets/img/maps-history/operation-blucher-map.png` | Détail Blücher-Yorck |
| `assets/img/maps-history/second-marne-map.png` | Détail seconde Marne / Friedensturm |

💡 Ces cartes serviront pour des **overlays au sein des cartes Leaflet** (calque transparent qui montre la carte d'époque par-dessus la carte moderne).

---

## ⭐ PRIORITÉ 2 — pour enrichir

### Documents d'époque

| Fichier cible | Sujet | Source |
|---|---|---|
| `assets/img/docs/ordre-haig-11avril.jpg` | Ordre du jour de Haig « Back to the wall », 11 avril 1918 | Imperial War Museum / Wikimedia |
| `assets/img/docs/brest-litovsk-signature.jpg` | Signature du traité de Brest-Litovsk, mars 1918 | Bundesarchiv via Wikimedia |
| `assets/img/docs/armistice-rethondes.jpg` | Wagon de Rethondes, 11 novembre 1918 | Wikimedia |

### Affiches / propagande

| Fichier cible | Sujet | Source |
|---|---|---|
| `assets/img/posters/affiche-emprunt-1918.jpg` | Affiche emprunt de la défense nationale 1918 (Faivre) | Gallica / Wikimedia |
| `assets/img/posters/affiche-us-wwi.jpg` | Affiche US "I Want You" / Liberty Bond | Wikimedia |

---

## ⭐ PRIORITÉ 3 — bonus créatifs

### Audio (dossier : `assets/audio/`)

| Fichier cible | Sujet | Source |
|---|---|---|
| `assets/audio/artillerie-courte.mp3` | Boom d'obus court (~1 sec), pour le hook | Freesound.org (chercher "artillery shell" CC0) |
| `assets/audio/ambiance-tranchee.mp3` | Ambiance fond sonore discret (vent, lointain) | Freesound.org (CC0) |

⚠️ **Audio** : par défaut, le site est **muet**. Un bouton 🔊 permettra au présentateur d'activer le son s'il veut (à la demande, prévenir avant en classe).

### Carte interactive — overlay historique

Si on veut un effet "slider entre carte moderne et carte d'époque", il faut :
- Une **carte d'époque géo-référencée** du front Ouest en 1918
- Référence : https://maps.nls.uk/ (Scottish national library, géoréférencement parfait)
- Ou : `assets/img/maps-history/front-ouest-1918-georef.png` à intégrer comme couche Leaflet

---

## Sources globales recommandées

- **Wikimedia Commons** : https://commons.wikimedia.org/wiki/Category:Spring_Offensive_(1918)
- **Bundesarchiv (Allemagne, libre)** : https://www.bild.bundesarchiv.de/
- **Imperial War Museum (UK)** : https://www.iwm.org.uk/collections (filtre "non-commercial use")
- **BNF / Gallica (France)** : https://gallica.bnf.fr/ (filtre "Domaine public")
- **NARA (US)** : https://www.archives.gov/ (domaine public)
- **ECPAD (France)** : http://www.ecpad.fr/ (fonds militaire, attention licences)
- **Freesound** (audio CC0) : https://freesound.org/

---

## Workflow recommandé pour télécharger

1. Crée d'abord la structure de dossiers :
   ```
   assets/
     img/
       persons/
       archive/
       maps-history/
       docs/
       posters/
     audio/
   ```
2. Télécharge **Priorité 1 / Portraits** d'abord (le site est déjà conçu pour les afficher dès qu'elles sont là — sinon il met les initiales en fallback).
3. Renomme chaque fichier **exactement** comme dans la colonne "Fichier cible" — sinon le site ne les trouve pas.
4. Pour les photos d'archive : prends la version la plus haute résolution dispo (la compresseras ensuite si besoin).
5. Note la **source précise** de chaque image dans un coin (on l'utilisera pour la section Sources du site).

---

## État du téléchargement

- [ ] Portraits (9 fichiers)
- [ ] Photos d'archive (7 fichiers)
- [ ] Cartes historiques (5 fichiers)
- [ ] Documents (3 fichiers)
- [ ] Affiches (2 fichiers)
- [ ] Audio (2 fichiers)
