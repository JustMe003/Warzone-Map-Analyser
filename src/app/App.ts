import { AnalysedMap } from "../analyser/abstractAnalysers/AnalysedMap";
import { AnalysedStandingMap } from "../analyser/standingAnalyser/AnalysedStandingMap";
import { mapToGraphicalMap } from "../converters/MapGraphicalMapConverter";
import { modelToGeneralMap } from "../converters/ModelGeneralMapConverter";
import { modelToStandingMap } from "../converters/ModelStandingMapConverter";
import { GraphicalMap } from "../map/GraphicalMap";
import { ValidAPIModel } from "../models/ValidAPIModel";
import { extractPlayerIdFromPickKey } from "../util/Players";
import { GlobalAppDataInterface } from "./GlobalAppDataInterface";

/**
 * Class AppData
 * 
 * Contains and handles the main data flow
 */
class AppData implements GlobalAppDataInterface {
    private gameData: ValidAPIModel | undefined;
    private graphicalMap: GraphicalMap | undefined;
    private analysedMap: AnalysedMap | undefined;
    private doAnalyseMap: boolean;

    constructor() {
        this.graphicalMap = undefined;
        this.analysedMap = undefined;
        this.gameData = undefined;
        this.doAnalyseMap = true;
    }

    public updateGameData(model: ValidAPIModel) {
        this.gameData = model;
        if (model.distributionStanding != null) {
            const analysedMap = modelToStandingMap(model) as AnalysedStandingMap;
            this.analysedMap = analysedMap;
            if (this.doAnalyseMap) analysedMap.analyse();
            const winnerIds = this.getWinnerIds();
            if (winnerIds.length == 0) throw new Error("No winner found: " + this.gameData.name);
            const winnerPicks: number[][] = [];
            const otherPicks: number[][] = [];
            Object.keys(this.gameData.picks).forEach(key => {
                if (winnerIds.includes(extractPlayerIdFromPickKey(key))) winnerPicks.push(this.gameData?.picks[key] as number[]);
                else otherPicks.push(this.gameData?.picks[key] as number[]);
            });
            analysedMap.setPicksMetric(winnerPicks, otherPicks);
        } else {
            this.analysedMap = modelToGeneralMap(model);
            if (this.doAnalyseMap) this.analysedMap.analyse();
        }
        this.graphicalMap = mapToGraphicalMap(this.analysedMap);
    }

    public getGraphicalMap() {
        return this.graphicalMap;
    }

    public getAnalysedMap() {
        return this.analysedMap;
    }

    public getGameName() {
        return this.gameData?.name || "No name found";
    }

    public getMapName() {
        return this.analysedMap?.getName() || "No name found";
    }

    public setDoAnalyseMap(bool: boolean) {
        this.doAnalyseMap = bool;
    }

    private getWinnerIds() {
        const winList: number[] = [];
        this.gameData?.players.forEach(playerModel => {
            if (playerModel.state == "Won") winList.push(Number(playerModel.id.substring(2, playerModel.id.length - 2)));
        });
        return winList;
    }
}

export const appData = new AppData();