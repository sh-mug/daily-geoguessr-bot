import { MapsResponse } from '../types.js';
import { createRequestOptions } from './common.js';
import { loginAndGetCookie } from './login.js';

const mapUrl: (map: string) => string = (map) => `https://www.geoguessr.com/api/maps/${map}`;

// map ID to map name
export const fetchMapName = async (map: string): Promise<string | undefined> => {
    try {
        const cookie = await loginAndGetCookie();
        const options = createRequestOptions('GET', cookie);
        const response = await fetch(mapUrl(map));
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.json() as MapsResponse;
        return data.name;
    } catch (error) {
        console.error('Error fetching map name:', error);
    }
    return undefined;
}
