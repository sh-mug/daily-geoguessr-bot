import fs from 'fs/promises';
import fetch from 'node-fetch';
import path from 'path';
import { createChallengePayload } from '../settings.js';
import { ChallengeResponse, ChallengeSettings, ChallengeSettingsForPost } from '../types.js';
import { createRequestOptions } from './common.js';
import { loginAndGetCookie } from './login.js';
import { fetchMapName } from './maps.js';

const challengeApiUrl = 'https://www.geoguessr.com/api/v3/challenges';
const tokenFilePath = path.resolve('challengeToken.json');

export const createChallenge = async (settings: ChallengeSettings): Promise<ChallengeSettingsForPost | undefined> => {
    try {
        const cookie = await loginAndGetCookie();
        const payload = createChallengePayload(settings);
        const options = createRequestOptions('POST', cookie, payload);
        const response = await fetch(challengeApiUrl, options as any);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.json() as ChallengeResponse;
        console.log('Challenge created:', data.token);

        const jsonData = JSON.stringify({
            timestamp: Math.floor(Date.now() / 1000),
            token: data.token
        });
        const mapName = await fetchMapName(settings.map) || 'Unknown';
        await fs.writeFile(tokenFilePath, jsonData, 'utf8');
        return {
            name: mapName,
            mode: settings.mode,
            token: data.token
        }
    } catch (error) {
        console.error('Error creating challenge:', error);
    }
    return undefined;
};
