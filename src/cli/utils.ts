import { MultipleTopLevelPatch } from 'types/index';

export function merge <S extends object> (source: S, ...patches: Array<MultipleTopLevelPatch<S>>): S {

  const arr = Array.isArray(source);

  return (function apply (isArr, copy: any, patch: any) {

    const type = typeof patch;

    if (patch && type === 'object') {

      if (Array.isArray(patch)) {

        for (const p of patch) copy = apply(isArr, copy, p);

      } else {

        for (const k in patch) {

          const val = patch[k];

          if (typeof val === 'function') {
            copy[k] = val(copy[k], merge);
          } else if (val === undefined) {
            if (isArr) {
              copy.splice(k, 1);
            } else {
              delete copy[k];
            }
          } else if (val === null || typeof val !== 'object' || Array.isArray(val)) {

            copy[k] = val;

          } else if (typeof copy[k] === 'object') {

            copy[k] = val === copy[k] ? val : merge(copy[k], val);

          } else {

            copy[k] = apply(false, {}, val);

          }
        }

      }
    } else if (type === 'function') {

      copy = patch(copy, merge);

    }

    return copy;

  })(arr, arr ? source.slice() : Object.assign({}, source), patches);

};
