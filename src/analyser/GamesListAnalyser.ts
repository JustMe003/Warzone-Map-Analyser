import { FileHandler } from "../fileHandler/FileHandler";
import { AnalysedMap } from "./abstractAnalysers/AnalysedMap";
import { ScoreWeights } from "./BonusWeights";
import { AnalysedStandingMap } from "./standingAnalyser/AnalysedStandingMap";
import { Statistic } from "./Statistic";

export class GamesListAnalyser {
    private folder: string;
    private winnerFScores: Statistic;
    private losersFScore: Statistic;
    private allPicksFScore: Statistic;

    constructor(folder: string) {
        this.folder = folder;
        this.winnerFScores = new Statistic();
        this.losersFScore = new Statistic();
        this.allPicksFScore = new Statistic();
    }

    public async analyse(bonusWeights: ScoreWeights, picksWeights: ScoreWeights, loadGame: (path: string) => Promise<AnalysedMap>): Promise<GamesListAnalyser> {
        const files = await FileHandler.getAllFiles(this.folder);
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // console.log(i + " of " + files.length, file);
            const analysedMap = await loadGame(this.folder + "/" + file);
            if (analysedMap instanceof AnalysedStandingMap) {
                analysedMap.analyse(bonusWeights, picksWeights);
                this.winnerFScores.addElement(analysedMap.getWinnersPicksMetric().getFScore());
                this.losersFScore.addElement(analysedMap.getOtherPicksMetric().getFScore());
                this.allPicksFScore.addElement(analysedMap.getAllPicksMetric().getFScore());
            }
        }
        
        console.log("Winners F Score: ", this.winnerFScores.getMax(), this.winnerFScores.getMean(), this.winnerFScores.getMin());
        console.log("Losers F Score: ", this.losersFScore.getMax(), this.losersFScore.getMean(), this.losersFScore.getMin());
        console.log("All Picks F Score: ", this.allPicksFScore.getMax(), this.allPicksFScore.getMean(), this.allPicksFScore.getMin());
        return this;
    }
}