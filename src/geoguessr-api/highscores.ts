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

        // save token and response.json() to file
        const dateStr = new Date().toISOString().split('T')[0];
        const responseJson = await response.json();
        await fs.mkdir('logs/challenge_ids', { recursive: true });
        await fs.mkdir('logs/raw_challenge_results', { recursive: true });
        await fs.writeFile(
            path.resolve(`logs/challenge_ids/${dateStr}.json`),
            tokenData.token, 'utf8');
        await fs.writeFile(
            path.resolve(`logs/raw_challenge_results/${dateStr}.json`),
            JSON.stringify(responseJson), 'utf8');

        return {
            timestamp: tokenData.timestamp,
            token: tokenData.token,
            highscores: responseJson
        } as ChallengeHighscores;
    } catch (error) {
        console.error('Error getting highscores:', error);
    }
    return undefined;
};
