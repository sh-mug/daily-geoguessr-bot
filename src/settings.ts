import fs from 'fs/promises';
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

const urlToMapId: (url: string) => string = (url) => url.split('/').pop() || '';

export async function defaultChallenge(): Promise<ChallengeSettings> {
    const mapUrls = JSON.parse(await fs.readFile('config.json', 'utf8')).maps;
    const mapUrl = mapUrls[Math.floor(Math.random() * mapUrls.length)];
    const map = urlToMapId(mapUrl);

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
