import Splitter from './Splitter';

class XML extends Splitter {
    static check(data, cb) {
        try {
            const atlas = new DOMParser().parseFromString(data, 'application/xml');
            const root = atlas.documentElement;
            cb(root.nodeName === 'TextureAtlas' && root.querySelector('sprite') !== null);
        }
        catch (e) {
            cb(false);
        }
    }

    static split(data, options, cb) {
        const res = [];

        try {
            const atlas = new DOMParser().parseFromString(data, 'application/xml');
            const list = atlas.documentElement.querySelectorAll('sprite');

            for (const element of list) {
                const item = {};
                for (const attribute of element.attributes) {
                    item[attribute.name] = attribute.value;
                }

                for (const name of ['x', 'y', 'w', 'h', 'oX', 'oY', 'oW', 'oH']) {
                    item[name] = Number(item[name]);
                }

                const trimmed = item.w < item.oW || item.h < item.oH;

                res.push({
                    name: Splitter.fixFileName(item.n),
                    frame: {
                        x: item.x,
                        y: item.y,
                        w: item.w,
                        h: item.h
                    },
                    spriteSourceSize: {
                        x: item.oX,
                        y: item.oY,
                        w: item.w,
                        h: item.h
                    },
                    sourceSize: {
                        w: item.oW,
                        h: item.oH
                    },
                    rotated: item.r === 'y',
                    trimmed: trimmed
                });
            }
        }
        catch (e) {
        }

        cb(res);
    }

    static get type() {
        return 'XML';
    }
}

export default XML;
