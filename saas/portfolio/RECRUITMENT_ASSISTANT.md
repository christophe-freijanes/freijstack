# Assistant recrutement et CV (Portfolio)

## Sources de vérité

- CV principal : `public/cv/CV-Christophe-FREIJANES.pdf`.
- CV ATS téléchargeable : `public/cv/CV-Christophe-FREIJANES-ATS.pdf`.
- CV ATS HTML (imprimable) : `public/pages/resume.html`.
- Index de réponses FR/EN : `public/data/recruitment-knowledge.json`.

Les deux PDF ont été intégrés à la PR #286 et vérifiés par empreintes SHA-256.
Le CV HTML et les réponses sont basés sur le CV de 2026 fourni par l'auteur. Réviser les trois ensemble lors de chaque changement de CV.

## Ton à respecter

- **Voix** : première personne, naturelle, sociable, polie, passionnée ; directe, jamais ampoulée.
- **Rythme** : alterner réponses très courtes, exemples précis et réponses en deux ou trois phrases.
- **Échange** : écouter la question, éviter une introduction répétée ; pas de prise de rendez-vous imposée à chaque tour.
- **Relance** : proposer parfois une question liée au sujet, avec un bouton cliquable ; calendrier toujours accessible.
- **Faits** : uniquement CV, portfolio et informations personnelles communiquées directement par l'auteur.
- **Qualités humaines** : collaboration, communication, curiosité, créativité et sens du concret ; ne pas inventer de postes ou de responsabilités.
- **Passions** : sport (soccer, hockey, 24 ans de handball), photo, vidéo, art, design, 5 à 7 et cuisines du monde, **seulement si le recruteur pose une question personnelle**.
- **Transparence** : assistant virtuel, pas une conversation avec Christophe en direct ni un LLM.

## Moteur de recherche conversationnelle

L'assistant fonctionne entièrement côté navigateur : aucun LLM, API distante ou historique serveur des questions. Les réponses sont prévalidées et recherchées par mots-clés, synonymes, labels et intention. Plusieurs formulations, relances cliquables et prise de rendez-vous améliorent l'interaction sans inventer de compétences.

Test de cohérence de l'index avec les labels du CV/portfolio :

```bash
python3 saas/portfolio/scripts/check-recruitment-index.py --report
```

Pour enregistrer la liste des labels observés après une mise à jour du CV HTML :

```bash
python3 saas/portfolio/scripts/check-recruitment-index.py --write
```

Test de syntaxe JavaScript :

```bash
node --check saas/portfolio/public/js/script.js
```

## Aperçu Docker sur VPS (sans déploiement)

Depuis la branche de la PR #286 :

```bash
cd saas/portfolio
sudo bash scripts/preview-docker.sh
```

L'image locale `portfolio:pr286-review` est créée sans changer les conteneurs de production.
Le site d'aperçu est lié à `127.0.0.1:18086` sur le VPS. Pour un contrôle visuel depuis Windows, construire également l'image via Docker Desktop/WSL sur le PC, ou utiliser un tunnel SSH authentifié. Le script refuse d'écraser un conteneur d'aperçu existant.

## Publication contrôlée sur VPS

**Préalable :** vérifier les deux PDF avec leurs SHA-256 attendus. Ne pas fusionner sur `master` tant que les anciens workflows de déploiement ne sont pas sécurisés.

Dans le terminal VPS avec le compte `freijac` :

```bash
sudo git -C /root/freijstack fetch origin fix/portfolio-bulle-ia-compacte-20261017
REV=$(sudo git -C /root/freijstack rev-parse FETCH_HEAD)
DIR=$(mktemp -d)
sudo git -C /root/freijstack archive "$REV" saas/portfolio | sudo tar -x -C "$DIR"
sudo bash "$DIR/saas/portfolio/scripts/release-portfolio-vps.sh" "$REV"
```

Le script vérifie les deux CV, l’index de recrutement et l’image Docker. Il teste les URL HTTP sur un conteneur temporaire lié à localhost, publie une image sous un tag unique dans le Registry, sauvegarde l’image actuelle et remplace **uniquement Portfolio**. Un échec avant la bascule laisse la production inchangée. En cas d’échec après bascule, il tente un retour arrière et affiche une commande de restauration manuelle.

Ne pas utiliser l’ancien déploiement GitHub Actions avec l’utilisateur SSH non privilégié.
## Mise en ligne

La branche `master` comporte encore un ancien workflow de déploiement non sécurisé. **Ne pas fusionner ni relancer l'ancien workflow avant validation du déploiement contrôlé.** Prévisualiser d'abord la branche dans une image Docker isolée, vérifier le bouton IA, le bouton retour en haut, les liens PDF et les réponses FR/EN.

Ce composant ne modifie pas les services Registry, SecureVault ni leurs volumes.
