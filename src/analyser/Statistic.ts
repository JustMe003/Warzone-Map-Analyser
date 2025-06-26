/**
 * Statistic class. Keeps track of the maximum, minimum and mean of an array of number elements
 */
export class Statistic {
    private entries: number[];
    private max: number;
    private min: number;
    private mean: number;

    constructor(entries: number[] = []) {
        this.entries = entries;
        this.max = Number.MIN_SAFE_INTEGER;
        this.min = Number.MAX_SAFE_INTEGER;
        
        if (entries.length > 0) {
            entries.forEach(n => {
                this.max = Math.max(this.max, n);
                this.min = Math.min(this.min, n);
            });
            this.mean = entries.reduce(sum) / this.entries.length
        } else {
            this.mean = NaN;
        }
    }

    /**
     * Adds a new number to the instance
     * @param n The new number
     */
    public addElement(n: number) {
        this.max = Math.max(this.max, n);
        this.min = Math.min(this.min, n);
        this.entries.push(n);
        this.mean = NaN;
    }

    /**
     * Returns the mean of all the numbers in this instance
     * @returns The mean of all numbers in this instance
     */
    public getMean() {
        if (Number.isNaN(this.mean)) this.mean = this.entries.reduce(sum) / this.entries.length;
        return this.mean;
    }

    /**
     * Returns the difference between the maximum and minimum number in this instance.
     * @returns The range of the numbers in this instance
     */
    public getRange() {
        return this.max - this.min;
    }

    /**
     * Returns the maximum number in this instance
     * @returns The maximum number in this instance
     */
    public getMax() {
        return this.max;
    }

    /**
     * Returns the minimum number in this instance
     * @returns The minimum number in this instance
     */
    public getMin() {
        return this.min;
    }
}

/**
 * Helper funtion for calculating the sum of all the numbers in an instance
 * @param n1 Total so far
 * @param n2 The number to be added
 * @returns The sum of both parameters
 */
function sum(n1: number, n2: number) {
    return n1 + n2;
}