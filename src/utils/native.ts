/**
 * Native object assign
 */
export const assign = Object.assign;

/**
 * Native object create
 */
export const create = Object.create;

/**
 * Native object keys
 */
export const keys = Object.keys;

/**
 * Native object values
 */
export const values = Object.values;

/**
 * Native object define property
 */
export const defineProperty = Object.defineProperty;

/**
 * Native object define property
 */
export const defineProperties = Object.defineProperties;

/**
 * Native Array isArray
 */
export const isArray = Array.isArray;

export class Struct extends Array {

  pop () {
    console.log(this);
    const i = this.length - 1;
    return i > 0 ? this.splice(i, 1)[0] : this[i];
  }

}
