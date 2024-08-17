import fs from 'fs/promises';
import fetch from 'node-fetch';
import path from 'path';
import { createChallengePayload } from '../settings.js';
import { ChallengeResponse, ChallengeSettings, ChallengeSettingsForPost, ChallengeToken, GameToken } from '../types.js';
import { createRequestOptions } from './common.js';
import { loginAndGetCookie } from './login.js';
import { fetchMapName } from './maps.js';

const challengeApiUrl = 'https://www.geoguessr.com/api/v3/challenges';
const tokenFilePath = path.resolve('challengeToken.json');
const gameUrl = 'https://www.geoguessr.com/api/v3/games';

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

const startGame = async (token: ChallengeToken): Promise<GameToken | undefined> => {
    try {
        const cookie = await loginAndGetCookie();
        const challengeURL = `${challengeApiUrl}/${token.token}`;
        const options = createRequestOptions('POST', cookie);
        const response = await fetch(challengeURL, options as any);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.json() as GameToken;
        console.log('Game started:', data.token);
        return data;
    } catch (error) {
        console.error('Error starting game:', error);
    }
}

const playRound = async (token: GameToken, round: number): Promise<void> => {
    try {
        const cookie = await loginAndGetCookie();
        const roundUrl = `${gameUrl}/${token.token}`;
        const payload = {
            lat: 0.0,
            lng: 0.0,
            stepsCount: round,
            timedOut: false,
            token: token.token
        };
        const options = createRequestOptions('POST', cookie, payload);
        const response = await fetch(roundUrl, options as any);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        console.log(`Round ${round} played`);
    } catch (error) {
        console.error('Error playing round:', error);
    }
}

const nextRound = async (token: GameToken): Promise<void> => {
    try {
        const cookie = await loginAndGetCookie();
        const roundUrl = `${gameUrl}/${token.token}?client=web`;
        const options = createRequestOptions('GET', cookie);
        const response = await fetch(roundUrl, options as any);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        console.log('Next round');
    } catch (error) {
        console.error('Error playing round:', error);
    }
}

export const playGame = async (token: ChallengeToken): Promise<void> => {
    try {
        const gameToken = await startGame(token);
        if (!gameToken) {
            throw new Error('Failed to start game');
        }
        if (gameToken.state === 'finished') {
            console.log('Game already finished');
            return;
        }
        for (let i = 1; i <= 5; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));    // wait 1s
            await playRound(gameToken, i);
            await nextRound(gameToken);
        }
    } catch (error) {
        console.error('Error playing game:', error);
    }
}
