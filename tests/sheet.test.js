import { Sheet } from '../src/models/sheet';
import { Piece } from '../src/models/piece';

describe('Sheet Model', () => {
    let sheet;
    let piece;

    beforeEach(() => {
        sheet = new Sheet(100, 100);
        piece = new Piece(50, 50);
    });

    test('should create a sheet with correct dimensions', () => {
        expect(sheet.width).toBe(100);
        expect(sheet.height).toBe(100);
        expect(sheet.area).toBe(10000);
    });

    test('should check if piece can fit', () => {
        expect(sheet.canFitPiece(piece)).toBeTruthy();
        const largePiece = new Piece(150, 50);
        expect(sheet.canFitPiece(largePiece)).toBeFalsy();
    });

    test('should add piece to sheet', () => {
        const result = sheet.addPiece(piece, 0, 0);
        expect(result).toBeTruthy();
        expect(sheet.pieces.length).toBe(1);
    });

    test('should calculate utilization rate', () => {
        sheet.addPiece(piece, 0, 0);
        expect(sheet.calculateUtilizationRate()).toBe(25);
    });
});
