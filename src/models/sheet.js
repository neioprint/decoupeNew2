import * as math from 'mathjs';

export class Sheet {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.area = math.multiply(width, height);
        this.pieces = [];
    }

    canFitPiece(piece) {
        return piece.width <= this.width && piece.height <= this.height;
    }

    addPiece(piece, x, y) {
        if (this.canFitPiece(piece)) {
            this.pieces.push({ piece, x, y });
            return true;
        }
        return false;
    }

    calculateUtilizationRate(placements = null) {
        // Si des placements sont fournis, calculer à partir de ces placements
        if (placements && placements.length > 0) {
            const pieceArea = placements.reduce((total, placement) => 
                total + placement.piece.width * placement.piece.height, 0);
            return math.divide(pieceArea, this.area) * 100;
        }

        // Sinon, utiliser la méthode par défaut
        const pieceArea = this.pieces.reduce((total, { piece }) => 
            total + piece.area, 0);
        return math.divide(pieceArea, this.area) * 100;
    }

    calculateResidualSpace(placements = null) {
        if (placements && placements.length > 0) {
            const usedArea = placements.reduce((total, placement) => 
                total + placement.piece.width * placement.piece.height, 0);
            return this.area - usedArea;
        }

        const usedArea = this.pieces.reduce((total, { piece }) => 
            total + piece.area, 0);
        return this.area - usedArea;
    }
}
