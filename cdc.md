# Cahier des Charges : Optimisation de Découpe de Papier

## Objectif Principal
Développer un outil d'optimisation de découpe de papier pour maximiser l'utilisation des feuilles et minimiser les chutes.

## Contexte
- Problématique : Optimiser la disposition des pièces sur une feuille de papier
- Objectif : Maximiser le nombre de poses et réduire les espaces résiduels

## Spécifications Techniques

### Dimensions de Référence
- Feuille standard : 65 × 100 cm (650 × 1000 mm)
- Pièce standard : 21,5 × 28,5 cm (215 × 285 mm)

### Configurations de Poses
1. **Configuration Minimale** : 8 poses
2. **Configuration Intermédiaire** : 9 poses
3. **Configuration Optimale** : 10 poses

### Algorithmes d'Optimisation
#### 1. Algorithmes Gloutons
- Principes : Choix locaux optimaux à chaque étape
- Exemple : Placement de la plus grande pièce en premier

#### 2. Algorithmes de Backtracking
- Exploration exhaustive des possibilités de placement
- Retour en arrière si une solution partielle est non extensible

#### 3. Algorithmes Génétiques
- Techniques inspirées de l'évolution naturelle
- Mécanismes : Sélection, mutation, croisement

#### 4. Programmation Linéaire en Nombres Entiers (PLNE)
- Modélisation mathématique du problème
- Utilisation de solveurs pour trouver la solution optimale

## Contraintes de Calcul
- Unité principale : Centimètres (cm)
- Unité secondaire : Millimètres (mm)
- Tous calculs internes effectués en cm

## Critères d'Évaluation
1. Nombre total de poses
2. Taux d'utilisation de la surface
3. Minimisation des espaces résiduels
4. Facilité de placement des pièces

## Cas de Test
- Configuration : 65 × 100 cm
- Pièce : 21,5 × 28,5 cm
- Objectif : Atteindre 10 poses

## Livrables
1. Interface utilisateur intuitive
2. Algorithme d'optimisation flexible
3. Rapport détaillé de découpe
4. Visualisation des résultats

## Axes d'Amélioration
- Support de différentes tailles de feuilles
- Prise en compte de contraintes supplémentaires
- Optimisation des performances algorithmiques
