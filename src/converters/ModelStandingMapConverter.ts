import { AnalysedStandingBonus } from "../analyser/standingAnalyser/AnalysedStandingBonus";
import { AnalysedStandingMap } from "../analyser/standingAnalyser/AnalysedStandingMap";
import { AnalysedStandingTerritory } from "../analyser/standingAnalyser/AnalysedStandingTerritory";
import { BonusAPIModel } from "../models/BonusAPIModel";
import { ValidAPIModel } from "../models/ValidAPIModel";
import { convertPlayerString } from "../util/Players";

export function modelToStandingMap(model: ValidAPIModel): AnalysedStandingMap {
    if (model.distributionStanding) {
        const mapModel = model.map;
        const overriddenBonuses = model.settings.OverriddenBonuses || [];
        const wastelandSize = model.settings.Wastelands?.WastelandSize;
        const hasWastelands = Math.max(model.settings.InitialNeutralsInDistribution, model.settings.InitialNonDistributionArmies) < (model.settings.Wastelands?.WastelandSize || 0);
        const territories = new Map<number, AnalysedStandingTerritory>();
    
        const terrModels = mapModel.territories.sort((a, b) => {
            return Number(a.id) - Number(b.id);
        });
        const standingTerrs = model.distributionStanding?.sort((a, b) => {
            return a.terrID - b.terrID;
        });
    
        for (let i = 0; i < terrModels.length; i++) {
            const terrModel = terrModels[i];
            const standingModel = standingTerrs[i];
            const coordsList = terrModel.coords.split(",");

            const terr = new AnalysedStandingTerritory(standingModel.terrID, terrModel.name, Number(coordsList[0]), Number(coordsList[1]), convertPlayerString(standingModel.ownedBy), Number(standingModel.armies), hasWastelands && Number(standingModel.armies) == wastelandSize);
            territories.set(standingModel.terrID, terr);
            terrModel.connectedTo.forEach(terrId => {
                const v = territories.get(terrId);
                if (v) {
                    v.addEdge(terr);
                    terr.addEdge(v);
                }
            })
        }

        const bonuses = new Map<number, AnalysedStandingBonus>();
        mapModel.bonuses.forEach(bonusModel => {
            const bonus = modelToBonus(bonusModel);
            bonuses.set(bonus.getId(), bonus);
            bonusModel.territoryIDs.forEach(terrId => {
                const terr = territories.get(terrId);
                terr?.addBonus(bonus);
                bonus.addVertex(terr as AnalysedStandingTerritory);
            });
            bonus.updateIsConnected();
        });

        overriddenBonuses.forEach(overriddenBonus => {
            bonuses.get(overriddenBonus.bonusID)?.overrideBonusValue(overriddenBonus.value);
        });
        
        return new AnalysedStandingMap(Number(model.id), mapModel.name, true, NaN, territories, bonuses);
    }
    throw new Error("There is no distribution standing");
}

function modelToBonus(bonusModel: BonusAPIModel): AnalysedStandingBonus {
    return new AnalysedStandingBonus(Number(bonusModel.id), Number(bonusModel.value), bonusModel.name);
}