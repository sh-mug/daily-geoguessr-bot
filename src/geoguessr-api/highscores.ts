import fs from 'fs/promises';
import fetch from 'node-fetch';
import path from 'path';
import { ChallengeHighscores, ChallengeToken } from '../types.js';
import { createRequestOptions } from './common.js';
import { loginAndGetCookie } from './login.js';

const tokenFilePath = path.resolve('challengeToken.json');

const highscoresUrl: (challengeId: string) => string = (challengeId: string) => {
    const params = new URLSearchParams({
        friends: 'false',
        limit: '26',
        minRounds: '5'
    }).toString();

    return `https://www.geoguessr.com/api/v3/results/highscores/${challengeId}?${params}`;
};

export const getHighscores = async (): Promise<ChallengeHighscores | undefined> => {
    try {
        const cookie = await loginAndGetCookie();
        const tokenData = await fs.readFile(tokenFilePath, 'utf8')
            .then(data => JSON.parse(data) as ChallengeToken);
        const options = createRequestOptions('GET', cookie);
        const response = await fetch(highscoresUrl(tokenData.token), options as any);
        console.log('Highscores fetched:', response.statusText);
        return {
            timestamp: tokenData.timestamp,
            token: tokenData.token,
            highscores: await response.json()
        } as ChallengeHighscores;
    } catch (error) {
        console.error('Error getting highscores:', error);
    }
    return undefined;
};
