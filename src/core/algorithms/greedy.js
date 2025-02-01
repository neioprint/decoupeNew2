export function greedyAlgorithm(sheet, pieces, options = {}) {
    const {
        allowRotation = true,
        packingStrategy = 'multi-pass',
        sortStrategy = 'area-descending'
    } = options;

    // Créer une copie modifiable des pièces
    const remainingPieces = pieces.map(piece => ({
        ...piece,
        originalWidth: piece.width,
        originalHeight: piece.height
    }));

    // Stratégies de tri avancées
    const sortPieces = (pieces) => {
        switch (sortStrategy) {
            case 'area-descending':
                return pieces.sort((a, b) => (b.width * b.height) - (a.width * a.height));
            case 'longest-side-descending':
                return pieces.sort((a, b) => Math.max(b.width, b.height) - Math.max(a.width, a.height));
            case 'perimeter-descending':
                return pieces.sort((a, b) => (2 * (b.width + b.height)) - (2 * (a.width + a.height)));
            default:
                return pieces;
        }
    };

    // Rotation intelligente des pièces
    const rotatePiece = (piece) => {
        if (!allowRotation) return piece;
        
        // Rotation si cela permet un meilleur placement
        return piece.width > piece.height ? 
            { ...piece, width: piece.height, height: piece.width } : 
            piece;
    };

    // Algorithmes de placement avancés
    const placementStrategies = {
        'multi-pass': (sheet, pieces) => {
            const placements = [];
            const usedAreas = [];

            // Trier les pièces
            const sortedPieces = sortPieces(pieces);

            for (let piece of sortedPieces) {
                let placed = false;

                // Essayer différentes orientations
                const orientations = [
                    piece,
                    allowRotation ? rotatePiece(piece) : null
                ].filter(Boolean);

                for (let currentPiece of orientations) {
                    // Stratégies de placement
                    const strategies = [
                        findBottomLeftPlacement,
                        findNextAvailableSpot,
                        findMostCompactPlacement
                    ];

                    for (let strategy of strategies) {
                        const placement = strategy(sheet, currentPiece, placements);
                        if (placement) {
                            placements.push({
                                piece: currentPiece,
                                x: placement.x,
                                y: placement.y
                            });
                            placed = true;
                            break;
                        }
                    }

                    if (placed) break;
                }

                // Gestion des pièces non placées
                if (!placed) {
                    console.warn(`🚨 Impossible de placer la pièce : ${piece.width}x${piece.height}`);
                }
            }

            return placements;
        }
    };

    // Stratégies de placement détaillées
    function findBottomLeftPlacement(sheet, piece, existingPlacements) {
        for (let y = 0; y <= sheet.height - piece.height; y++) {
            for (let x = 0; x <= sheet.width - piece.width; x++) {
                if (!doesOverlap(x, y, piece, existingPlacements)) {
                    return { x, y };
                }
            }
        }
        return null;
    }

    function findNextAvailableSpot(sheet, piece, existingPlacements) {
        const lastPlacement = existingPlacements.length > 0 
            ? existingPlacements[existingPlacements.length - 1] 
            : null;

        const startX = lastPlacement ? lastPlacement.x + lastPlacement.piece.width : 0;
        const startY = lastPlacement ? lastPlacement.y : 0;

        for (let y = startY; y <= sheet.height - piece.height; y++) {
            for (let x = (y === startY ? startX : 0); x <= sheet.width - piece.width; x++) {
                if (!doesOverlap(x, y, piece, existingPlacements)) {
                    return { x, y };
                }
            }
        }
        return null;
    }

    function findMostCompactPlacement(sheet, piece, existingPlacements) {
        let bestPlacement = null;
        let minRemainingArea = Infinity;

        for (let y = 0; y <= sheet.height - piece.height; y++) {
            for (let x = 0; x <= sheet.width - piece.width; x++) {
                if (!doesOverlap(x, y, piece, existingPlacements)) {
                    const remainingArea = calculateRemainingArea(sheet, piece, x, y, existingPlacements);
                    if (remainingArea < minRemainingArea) {
                        bestPlacement = { x, y };
                        minRemainingArea = remainingArea;
                    }
                }
            }
        }

        return bestPlacement;
    }

    function calculateRemainingArea(sheet, piece, x, y, existingPlacements) {
        const newPlacements = [
            ...existingPlacements,
            { piece, x, y }
        ];

        const placedArea = newPlacements.reduce((total, p) => total + p.piece.width * p.piece.height, 0);
        return sheet.area - placedArea;
    }

    function doesOverlap(x, y, piece, existingPlacements) {
        const newPieceRect = {
            x, y,
            right: x + piece.width,
            bottom: y + piece.height
        };

        return existingPlacements.some(placement => {
            const existingRect = {
                x: placement.x,
                y: placement.y,
                right: placement.x + placement.piece.width,
                bottom: placement.y + placement.piece.height
            };

            return !(newPieceRect.right < existingRect.x ||
                     newPieceRect.x > existingRect.right ||
                     newPieceRect.bottom < existingRect.y ||
                     newPieceRect.y > existingRect.bottom);
        });
    }

    // Utiliser la stratégie multi-pass
    return placementStrategies['multi-pass'](sheet, remainingPieces);
}
