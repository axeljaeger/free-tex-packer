import {describe, expect, it} from 'vitest';

import Rect from './Rect';

describe('Rect', () => {
    it('clones without sharing identity', () => {
        const rect = new Rect(1, 2, 3, 4);
        const clone = rect.clone();

        expect(clone).toEqual(rect);
        expect(clone).not.toBe(rect);
    });

    it('detects complete containment including equal edges', () => {
        const bounds = new Rect(0, 0, 10, 10);

        expect(new Rect(2, 3, 4, 5).hitTest(bounds)).toBe(true);
        expect(new Rect(0, 0, 10, 10).hitTest(bounds)).toBe(true);
        expect(new Rect(9, 9, 2, 2).hitTest(bounds)).toBe(false);
    });
});
