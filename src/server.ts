import dotenv from 'dotenv';
import express from 'express';
import cron from 'node-cron';
import { postChallengeToDiscord, postResultToDiscord } from './discord/index.js';
import { createChallenge, getHighscores } from './geoguessr-api/index.js';

dotenv.config();
const app = express();
const port = 25000;

const challenge = async () => {
    const challengeToken = await createChallenge();
    if (challengeToken) {
        await postChallengeToDiscord(challengeToken);
    }
};

const highscores = async () => {
    const highscores = await getHighscores();
    if (highscores) {
        await postResultToDiscord(highscores);
    }
};

app.get('/challenge', (req, res) => {
    challenge();
    res.send('Challenge created.\n');
});

app.get('/highscores', (req, res) => {
    highscores();
    res.send('Highscores posted.\n');
});

const mode = process.argv[2];

if (mode === '--standalone') {
  console.log('Running in standalone mode.');
  cron.schedule('0 0 * * *', () => {
    challenge();
  });
  cron.schedule('0 23 * * *', () => {
    highscores();
  });
} else {
    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    });
}
