import * as math from 'mathjs';

export class Piece {
    constructor(width, height, id = null) {
        this.id = id || Math.random().toString(36).substr(2, 9);
        this.width = width;
        this.height = height;
        this.area = math.multiply(width, height);
    }

    rotate() {
        // Permuter la largeur et la hauteur
        [this.width, this.height] = [this.height, this.width];
        return this;
    }

    calculatePerimeter() {
        return 2 * (this.width + this.height);
    }

    toString() {
        return `Piece(${this.id}): ${this.width}x${this.height}`;
    }
}
