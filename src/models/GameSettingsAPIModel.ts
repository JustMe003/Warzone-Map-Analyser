import { OverridenBonusAPIModel } from "./OverridenBonusAPIModel";

export interface GameSettingsAPIModel {
    TerritoryLimit: number;
    MinimumArmyBonus: number;
    OverriddenBonuses: OverridenBonusAPIModel[];
    Wastelands: {
        WastelandSize: number;
    } | undefined;
    InitialNonDistributionArmies: number;
    InitialNeutralsInDistribution: number;
}