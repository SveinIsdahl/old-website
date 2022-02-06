//Vektorfunksjoner
//@ts-check
/**
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 */
function dotProduct(x1, y1, x2, y2) {
    return x1 * x2 + y1 * y2;
}

/**
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 */
function distancePoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow(y1 - y2, 2));
}
/**
 * @param {number} x
 * @param {number} y
 */
function length(x, y) {
    return Math.sqrt(x * x + y * y);
}
/**
 * @param {number} x
 * @param {number} y
 */
function normalize(x, y) {
    return {
        x: x / length(x, y),
        y: y / length(x, y)
    }
}

export {dotProduct, distancePoints, length, normalize}
