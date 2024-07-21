import dotenv from 'dotenv';
import fs from 'fs/promises';
import fetch, { RequestInit } from 'node-fetch';
import path from 'path';

dotenv.config(); // .envファイルから環境変数を読み込む

const loginUrl = 'https://www.geoguessr.com/api/v3/accounts/signin';
const cookieFilePath = path.resolve('cookie.txt');

const loginPayload = {
    email: process.env.GEOGUESSR_EMAIL || '',
    password: process.env.GEOGUESSR_PASSWORD || ''
};

const loginRequestOptions: RequestInit = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.9,ja;q=0.8'
    },
    body: JSON.stringify(loginPayload)
};

const saveCookieToFile = async (cookie: string) => {
    try {
        await fs.writeFile(cookieFilePath, cookie, 'utf8');
        console.log('Cookie saved to file.');
    } catch (error) {
        console.error('Failed to save cookie to file:', error);
    }
};

const loadCookieFromFile = async (): Promise<string | null> => {
    try {
        const cookie = await fs.readFile(cookieFilePath, 'utf8');
        console.log('Cookie loaded from file.');
        return cookie;
    } catch (error) {
        console.log('No cookie file found.');
        return null;
    }
};

export const loginAndGetCookie = async (): Promise<string> => {
    try {
        const cookie = await loadCookieFromFile();
        if (cookie) {
            return cookie;
        }

        const response = await fetch(loginUrl, loginRequestOptions);
        if (!response.ok) {
            throw new Error(`Failed to login: ${response.statusText}`);
        }

        const setCookieHeader = response.headers.raw()['set-cookie'];
        if (!setCookieHeader) {
            throw new Error('No set-cookie header found');
        }

        const newCookie = setCookieHeader.join('; ');
        await saveCookieToFile(newCookie);
        return newCookie;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};
