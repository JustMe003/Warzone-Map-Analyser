import { BonusAPIModel } from "./BonusAPIModel";
import { TerritoryAPIModel } from "./TerritoryAPIModel";

export interface MapAPIModel {
	id: string,
	name: string,
	territories: TerritoryAPIModel[],
	bonuses: BonusAPIModel[]
	// distributionModes: DistributionModesAPIModel[]
}