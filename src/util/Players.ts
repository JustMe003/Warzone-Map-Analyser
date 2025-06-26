const NEUTRAL_PLAYER_NAME = "Neutral";
const AVAILABLE_FOR_DISTRIBUTION_PLAYER_NAME = "AvailableForDistribution";

export const NEUTRAL_PLAYER = 0;
export const AVAILABLE_FOR_DISTRIBUTION_PLAYER = -1;

export function convertPlayerString(player: string): number {
    if (player == NEUTRAL_PLAYER_NAME) return NEUTRAL_PLAYER;
    if (player == AVAILABLE_FOR_DISTRIBUTION_PLAYER_NAME) return AVAILABLE_FOR_DISTRIBUTION_PLAYER;
    else return Number(player);
}

export function extractPlayerIdFromPickKey(pickKey: string) {
    return Number(pickKey.split("_")[1]);
}