export default class Utility {
    constructor() {}

    static randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }
}
