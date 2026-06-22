import {describe, expect, it} from 'vitest';

import MaxRectsBin from './MaxRectsBin';

const makeSprite = (name, width, height) => ({
    name,
    frame: {x: 0, y: 0, w: width, h: height},
    rotated: false
});

const overlaps = (a, b) => !(
    a.frame.x + a.frame.w <= b.frame.x ||
    b.frame.x + b.frame.w <= a.frame.x ||
    a.frame.y + a.frame.h <= b.frame.y ||
    b.frame.y + b.frame.h <= a.frame.y
);

describe('MaxRectsBin', () => {
    it('places fitting sprites within the bin without overlap', () => {
        const sprites = [
            makeSprite('wide', 6, 4),
            makeSprite('left', 4, 3),
            makeSprite('right', 4, 3)
        ];
        const packer = new MaxRectsBin(10, 10);

        const result = packer.pack(sprites, MaxRectsBin.methods.BestShortSideFit);

        expect(result).toHaveLength(3);
        for (const sprite of result) {
            expect(sprite.frame.x).toBeGreaterThanOrEqual(0);
            expect(sprite.frame.y).toBeGreaterThanOrEqual(0);
            expect(sprite.frame.x + sprite.frame.w).toBeLessThanOrEqual(10);
            expect(sprite.frame.y + sprite.frame.h).toBeLessThanOrEqual(10);
        }
        for (let first = 0; first < result.length; first++) {
            for (let second = first + 1; second < result.length; second++) {
                expect(overlaps(result[first], result[second])).toBe(false);
            }
        }
    });

    it('rotates a sprite when that is the only way it can fit', () => {
        const sprites = [makeSprite('portrait', 2, 3)];
        const packer = new MaxRectsBin(3, 2, true);

        const result = packer.pack(sprites, MaxRectsBin.methods.BestShortSideFit);

        expect(result).toHaveLength(1);
        expect(result[0].rotated).toBe(true);
        expect(packer.usedRectangles[0]).toMatchObject({width: 3, height: 2});
    });

    it('leaves sprites that cannot fit unconsumed', () => {
        const sprites = [makeSprite('oversized', 11, 5)];
        const packer = new MaxRectsBin(10, 10);

        expect(packer.pack(sprites, MaxRectsBin.methods.BestAreaFit)).toEqual([]);
        expect(sprites).toHaveLength(1);
    });
});
