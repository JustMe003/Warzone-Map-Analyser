export class PrecisionRecallMetric {
    private relevantSet: number[];
    private answerSet: number[];
    private relevantAnswerSet: number[];

    constructor(relevantSet: number[] = [], answerSet: number[] = []) {
        this.relevantSet = relevantSet;
        this.answerSet = answerSet;

        this.relevantAnswerSet = [];
        this.updateRelevantAnswerSet();
    }
    
    private updateRelevantAnswerSet() {
        this.relevantAnswerSet = [];
        this.relevantSet.forEach(e => {
            if (this.answerSet.includes(e)) this.relevantAnswerSet.push(e);
        });
    }
    
    public setRelevantSet(relevantSet: number[]) {
        this.relevantSet = relevantSet;
        this.updateRelevantAnswerSet();
    }
    
    public setAnswerSet(answerSet: number[]) {
        this.answerSet = answerSet;
        this.updateRelevantAnswerSet();
    }

    public getPrecision() {
        return this.relevantAnswerSet.length / this.answerSet.length;
    }

    public getRecall() {
        return this.relevantAnswerSet.length / this.relevantSet.length;
    }

    public getRelevantSet() {
        return this.relevantSet;
    }

    public getAnswerSet() {
        return this.answerSet;
    }

    public getRelevantAnswerSet() {
        return this.relevantAnswerSet;
    }

    public getPrecisionAt(n: number = this.answerSet.length) {
        let c = 0;
        for (let i = 0; i < Math.min(n, this.answerSet.length); i++) {
            const element = this.answerSet[i];
            if (this.relevantSet.includes(element)) c++;
        }
        return c / n;
    }

    public getRecallAt(n: number = this.answerSet.length) {
        let c = 0;
        for (let i = 0; i < Math.min(n, this.answerSet.length); i++) {
            const element = this.answerSet[i];
            if (this.relevantSet.includes(element)) c++;
        }
        return c / this.relevantSet.length;
    }

    public getPrecisionAtReleventSetLength() {
        return this.getPrecisionAt(this.relevantSet.length);
    }

    public getFScore(n: number = this.relevantSet.length) {
        return 2 / ((1 / this.getRecallAt(n)) + (1 / this.getPrecisionAt(n)));
    }
}