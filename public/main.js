// Point d'entrée principal de l'application
import { Sheet } from '../src/models/sheet.js';
import { Piece } from '../src/models/piece.js';
import { greedyAlgorithm } from '../src/core/algorithms/greedy.js';
import { PerformanceTracker } from '../src/utils/performance-tracker.js';
import { FormInput, Button, Canvas, StatsDisplay } from '../src/components/index.js';
import { Animator } from '../src/utils/animations.js';

class OptimizationApp {
    constructor() {
        this.performanceTracker = new PerformanceTracker();
        this.isOptimizing = false;
        this.lastPlacements = null;
        this.lastSheet = null;
        this.lastColorPalette = null;
        this.initializeComponents();
    }

    initializeComponents() {
        // Supprimer la création des inputs de feuille
        this.sheetWidth = document.getElementById('sheet-width');
        this.sheetHeight = document.getElementById('sheet-height');

        // Ajout des écouteurs d'événements pour la mise à jour
        this.sheetWidth.addEventListener('input', () => this.updateVisualization());
        this.sheetHeight.addEventListener('input', () => this.updateVisualization());

        // Initialisation du canvas
        const container = document.querySelector('.canvas-container');
        const canvas = document.getElementById('optimizationCanvas');
        this.canvas = new Canvas({
            element: canvas,
            width: container.clientWidth,
            height: container.clientHeight,
            onResize: () => this.updateVisualization()
        });

        // Initialisation initiale du canvas
        this.updateVisualization();

        // Récupérer les éléments de statistiques existants
        this.utilizationRateElement = document.getElementById('utilization-rate');
        this.pieceCountElement = document.getElementById('piece-count');
        this.residualSpaceElement = document.getElementById('residual-space');

        // Utiliser le bouton d'optimisation existant
        this.optimizeButton = document.getElementById('optimize-btn');
        this.optimizeButton.addEventListener('click', () => this.optimize());

        // Initialiser les écouteurs de pièces une seule fois
        this.initializePieceListeners();
    }

    initializePieceListeners() {
        console.log(' Initialisation des écouteurs de pièces');
        const container = document.getElementById('pieces-container');
        const addPieceButton = document.getElementById('add-piece');
        
        // Supprimer tous les écouteurs précédents
        const oldButton = addPieceButton.cloneNode(true);
        addPieceButton.parentNode.replaceChild(oldButton, addPieceButton);
        
        // Ajouter un seul écouteur
        oldButton.addEventListener('click', () => {
            console.log(' Bouton "Ajouter une pièce" cliqué');
            this.addPieceInput();
        });

        // Gestion de la suppression des pièces
        container.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-piece')) {
                const pieceInputs = container.querySelectorAll('.piece-input');
                
                // Empêcher la suppression s'il ne reste qu'un seul input
                if (pieceInputs.length > 1) {
                    event.target.closest('.piece-input').remove();
                    
                    // Réorganiser les numéros après suppression
                    this.renumberPieces();
                    
                    console.log(' Pièce supprimée. Nombre restant :', container.querySelectorAll('.piece-input').length);
                } else {
                    console.warn(' Impossible de supprimer le dernier champ de pièce');
                }
            }
        });
    }

    addPieceInput() {
        console.log(' Méthode addPieceInput appelée');
        const container = document.getElementById('pieces-container');
        const newPieceInput = document.createElement('div');
        newPieceInput.className = 'piece-input';
        
        // Calculer le numéro de la nouvelle pièce
        const pieceCount = container.querySelectorAll('.piece-input').length;
        const pieceNumber = pieceCount + 1;

        newPieceInput.innerHTML = `
            <div class="piece-number">${pieceNumber}</div>
            <label>Largeur (cm)</label>
            <input type="number" class="piece-width" min="0.1" step="0.1" value="21.5">
            <label>Hauteur (cm)</label>
            <input type="number" class="piece-height" min="0.1" step="0.1" value="28.5">
            <button class="remove-piece">-</button>
        `;

        console.log(' Nouvelle pièce créée', newPieceInput);
        container.appendChild(newPieceInput);
        console.log(' Nombre de pièces après ajout :', container.querySelectorAll('.piece-input').length);
    }

    renumberPieces() {
        const container = document.getElementById('pieces-container');
        const pieceInputs = container.querySelectorAll('.piece-input');
        
        pieceInputs.forEach((input, index) => {
            const numberElement = input.querySelector('.piece-number');
            if (numberElement) {
                numberElement.textContent = index + 1;
            }
        });
    }

    getPieces() {
        // Sélectionner tous les conteneurs de pièces
        const pieceInputContainers = document.querySelectorAll('.piece-input');
        const pieces = [];

        // Parcourir chaque conteneur de pièce
        pieceInputContainers.forEach((container, index) => {
            // Trouver les inputs de largeur et hauteur dans ce conteneur
            const widthInput = container.querySelector('.piece-width');
            const heightInput = container.querySelector('.piece-height');

            // Convertir les valeurs en nombres
            const width = widthInput ? parseFloat(widthInput.value) : 0;
            const height = heightInput ? parseFloat(heightInput.value) : 0;

            // Vérification détaillée
            console.log(`Pièce ${index + 1}:
                - Conteneur trouvé: ${!!container}
                - Input largeur trouvé: ${!!widthInput}
                - Input hauteur trouvé: ${!!heightInput}
                - Largeur: ${width}
                - Hauteur: ${height}
                - Valide: ${width > 0 && height > 0}`);

            // Ajouter uniquement les pièces valides
            if (width > 0 && height > 0) {
                pieces.push(new Piece(width, height));
            }
        });

        console.log(` Nombre total de pièces valides : ${pieces.length}`);
        return pieces;
    }

    async optimize() {
        if (this.isOptimizing) return;
        this.isOptimizing = true;

        try {
            // Ajouter la classe loading au bouton
            this.optimizeButton.classList.add('loading');
            this.optimizeButton.disabled = true;

            const sheetWidth = parseFloat(document.getElementById('sheet-width').value);
            const sheetHeight = parseFloat(document.getElementById('sheet-height').value);
            const sheet = new Sheet(sheetWidth, sheetHeight);
            const pieces = this.getPieces();

            console.log('Détails des pièces :', pieces.map(p => `${p.width}x${p.height}`));

            // Récupérer les options d'optimisation
            const algorithmSelect = document.getElementById('algorithm-select');
            const rotationCheckbox = document.getElementById('allow-rotation');
            const sortStrategySelect = document.getElementById('sort-strategy');

            const optimizationOptions = {
                allowRotation: rotationCheckbox.checked,
                sortStrategy: sortStrategySelect.value,
                packingStrategy: algorithmSelect.value
            };

            if (pieces.length === 0) {
                await Animator.shake(this.optimizeButton);
                return;
            }

            this.performanceTracker.start();
            
            let placements;
            switch (algorithmSelect.value) {
                case 'greedy':
                    placements = greedyAlgorithm(sheet, pieces, optimizationOptions);
                    break;
                case 'backtracking':
                    // Implémentation future
                    placements = greedyAlgorithm(sheet, pieces, optimizationOptions);
                    break;
                case 'genetic':
                    // Implémentation future
                    placements = greedyAlgorithm(sheet, pieces, optimizationOptions);
                    break;
                default:
                    placements = greedyAlgorithm(sheet, pieces, optimizationOptions);
            }

            console.log('Nombre de placements :', placements.length);

            const duration = this.performanceTracker.stop();

            // Animer les résultats
            const statsElement = document.querySelector('.stats-container');
            await Animator.fadeOut(statsElement);
            this.updateStats(sheet, placements);
            await Animator.fadeIn(statsElement);

            // Animer le canvas
            const canvasElement = this.canvas.element;
            await Animator.fadeOut(canvasElement);
            this.drawResult(sheet, placements);
            await Animator.fadeIn(canvasElement);

            // Ajouter une animation de succès
            const successMark = document.createElement('span');
            successMark.className = 'success-checkmark';
            this.optimizeButton.appendChild(successMark);
            await Animator.pulse(this.optimizeButton);

        } catch (error) {
            console.error('Erreur lors de l\'optimisation:', error);
            await Animator.shake(this.optimizeButton);
        } finally {
            // Nettoyer
            this.optimizeButton.classList.remove('loading');
            this.optimizeButton.disabled = false;
            this.isOptimizing = false;
        }
    }

    updateStats(sheet, placements) {
        // Calculer le taux d'utilisation avec les placements
        const utilizationRate = sheet.calculateUtilizationRate(placements);
        const residualSpace = sheet.calculateResidualSpace(placements);

        // Mettre à jour directement les éléments HTML
        this.utilizationRateElement.textContent = utilizationRate.toFixed(2) + ' %';
        this.pieceCountElement.textContent = placements.length;
        this.residualSpaceElement.textContent = residualSpace.toFixed(2) + ' cm²';

        // Ajouter des informations de débogage
        console.log(`📊 Statistiques de placement :
 - Taux d'utilisation : ${utilizationRate.toFixed(2)}%
 - Nombre de pièces : ${placements.length}
 - Espace résiduel : ${residualSpace.toFixed(2)} cm²`);
    }

    updateVisualization() {
        if (!this.canvas) return;

        // Stocker les derniers résultats si possible
        const lastPlacements = this.lastPlacements;
        const lastSheet = this.lastSheet;
        const lastColorPalette = this.lastColorPalette;

        this.canvas.clear();
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Dessiner un cadre représentant la feuille
        this.canvas.drawRect(0, 0, width, height, {
            strokeStyle: '#ccc',
            lineWidth: 2
        });

        // Ajouter des lignes de grille pour plus de clarté
        const gridColor = 'rgba(200, 200, 200, 0.3)';
        const gridLineWidth = 1;
        const gridSpacing = 50;

        for (let x = gridSpacing; x < width; x += gridSpacing) {
            this.canvas.ctx.beginPath();
            this.canvas.ctx.moveTo(x, 0);
            this.canvas.ctx.lineTo(x, height);
            this.canvas.ctx.strokeStyle = gridColor;
            this.canvas.ctx.lineWidth = gridLineWidth;
            this.canvas.ctx.stroke();
        }

        for (let y = gridSpacing; y < height; y += gridSpacing) {
            this.canvas.ctx.beginPath();
            this.canvas.ctx.moveTo(0, y);
            this.canvas.ctx.lineTo(width, y);
            this.canvas.ctx.strokeStyle = gridColor;
            this.canvas.ctx.lineWidth = gridLineWidth;
            this.canvas.ctx.stroke();
        }

        // Redessiner les placements précédents s'ils existent
        if (lastPlacements && lastSheet && lastColorPalette) {
            this.drawResult(lastSheet, lastPlacements, lastColorPalette);
        }
    }

    drawResult(sheet, placements, colorPalette = null) {
        // Stocker les résultats pour le redimensionnement
        this.lastPlacements = placements;
        this.lastSheet = sheet;
        
        // Générer une palette de couleurs si non fournie
        colorPalette = colorPalette || this.generateColorPalette(placements.length);
        this.lastColorPalette = colorPalette;

        // Calculer le facteur d'échelle
        const scaleX = this.canvas.width / sheet.width;
        const scaleY = this.canvas.height / sheet.height;

        // Dessiner chaque pièce
        placements.forEach((placement, index) => {
            const piece = placement.piece;
            const x = placement.x * scaleX;
            const y = placement.y * scaleY;
            const width = piece.width * scaleX;
            const height = piece.height * scaleY;

            // Dessiner le rectangle de la pièce
            this.canvas.drawRect(x, y, width, height, {
                fillStyle: colorPalette[index % colorPalette.length],
                strokeStyle: 'black',
                lineWidth: 1
            });

            // Ajouter les dimensions de la pièce
            this.canvas.ctx.fillStyle = 'black';
            this.canvas.ctx.font = '10px Arial';
            this.canvas.ctx.fillText(
                `${piece.width.toFixed(1)}x${piece.height.toFixed(1)}`, 
                x + 5, 
                y + 15
            );
        });

        // Mettre à jour la légende
        this.drawLegend(placements, colorPalette);
    }

    drawLegend(placements, colorPalette) {
        const legendX = this.canvas.width * 0.05;
        let legendY = this.canvas.height * 0.05;
        const boxSize = 20;
        const textOffset = 25;
        const lineHeight = 30;

        this.canvas.ctx.font = '12px Arial';
        this.canvas.ctx.fillStyle = 'black';

        placements.forEach(({piece}, index) => {
            // Carré de couleur
            this.canvas.ctx.fillStyle = colorPalette[index % colorPalette.length];
            this.canvas.ctx.fillRect(legendX, legendY, boxSize, boxSize);

            // Numéro de la pièce
            this.canvas.ctx.fillStyle = 'black';
            this.canvas.ctx.fillText(`Pièce ${index + 1}`, legendX + textOffset, legendY + boxSize);

            // Dimensions de la pièce
            this.canvas.ctx.fillStyle = 'rgba(0,0,0,0.7)';
            this.canvas.ctx.fillText(
                `${piece.width.toFixed(1)} x ${piece.height.toFixed(1)} cm`, 
                legendX + textOffset, 
                legendY + boxSize + 15
            );

            legendY += lineHeight;
        });
    }

    generateColorPalette(count) {
        const baseHue = 210; // Bleu comme couleur de base
        const saturation = 70;
        const lightness = 60;
        const hueStep = 50; // Écart entre les teintes

        return Array.from({length: count}, (_, i) => {
            const hue = (baseHue + i * hueStep) % 360;
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        });
    }
}

// Initialiser l'application
document.addEventListener('DOMContentLoaded', () => {
    new OptimizationApp();
});
