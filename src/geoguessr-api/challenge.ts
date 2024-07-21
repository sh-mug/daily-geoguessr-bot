import fs from 'fs/promises';
import fetch, { RequestInit } from 'node-fetch';
import path from 'path';
import { ChallengeResponse } from '../types.js';
import { loginAndGetCookie } from './login.js';

const challengeApiUrl = 'https://www.geoguessr.com/api/v3/challenges';
const tokenFilePath = path.resolve('challengeToken.json');

const challengePayload = {
    "map": "631a309ba54a618fca31960a",
    "forbidMoving": true,
    "forbidRotating": true,
    "forbidZooming": true,
    "timeLimit": 60,
    "rounds": 5
};

const challengeRequestOptions: (cookie: string) => RequestInit = (cookie: string) => ({
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.9,ja;q=0.8',
        'Cookie': cookie
    },
    body: JSON.stringify(challengePayload)
});

export const createChallenge = async (): Promise<string | undefined> => {
    try {
        const cookie = await loginAndGetCookie();
        const response = await fetch(challengeApiUrl, challengeRequestOptions(cookie));
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.json() as ChallengeResponse;
        console.log('Challenge created:', data.token);
        
        const jsonData = JSON.stringify({
            timestamp: Math.floor(Date.now() / 1000),
            token: data.token
        });
        await fs.writeFile(tokenFilePath, jsonData, 'utf8');
        return data.token;
    } catch (error) {
        console.error('Error creating challenge:', error);
    }
    return undefined;
};
