import fs from 'fs/promises';
import fetch, { RequestInit } from 'node-fetch';
import path from 'path';
import { ChallengeHighscores, ChallengeToken } from '../types.js';
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

const highscoresRequestOptions: (cookie: string) => RequestInit = (cookie: string) => ({
    method: 'GET',
    headers: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.9,ja;q=0.8',
        'Content-Type': 'application/json',
        'Cookie': cookie
    },
});

export const getHighscores = async (): Promise<ChallengeHighscores | undefined> => {
    try {
        const cookie = await loginAndGetCookie();
        const tokenData = await fs.readFile(tokenFilePath, 'utf8')
            .then(data => JSON.parse(data) as ChallengeToken);
        const response = await fetch(highscoresUrl(tokenData.token), highscoresRequestOptions(cookie));
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
