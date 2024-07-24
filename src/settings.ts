import { ChallengePayload, ChallengeSettings } from "./types";

export function createChallengePayload(settings: ChallengeSettings): ChallengePayload {
    const { map, mode } = settings;
    return {
        map,
        forbidMoving: mode === 'NM' || mode === 'NMPZ',
        forbidRotating: mode === 'NMPZ',
        forbidZooming: mode === 'NMPZ',
        timeLimit: 60,
        rounds: 5
    };
}

export function defaultChallenge(): ChallengeSettings {
    const map = '631a309ba54a618fca31960a'; // A Balanced Japan
    const today = new Date().getDay();
    switch (today) {
        case 1:     // Monday
            return { map, mode: 'Move' };
        case 2:     // Tuesday
            return { map, mode: 'NM' };
        case 3:     // Wednesday
            return { map, mode: 'Move' };
        case 4:     // Thursday
            return { map, mode: 'NM' };
        case 5:     // Friday
            return { map, mode: 'Move' };
        case 6:     // Saturday
            return { map, mode: 'NM' };
        default:    // Sunday
            return { map, mode: 'NMPZ' };
    }
}
