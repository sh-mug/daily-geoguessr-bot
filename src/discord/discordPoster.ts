import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { ChallengeHighscores, ChallengeSettingsForPost } from '../types';

dotenv.config();

const discordToken = process.env.DISCORD_TOKEN || '';
const channelId = process.env.DISCORD_CHANNEL_ID || '';
const challengeUrl: (challengeId: string) => string = (challengeId: string) => `https://www.geoguessr.com/challenge/${challengeId}`;

const postToDiscord = async (message: string) => {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.MessageContent,
        ],
    });

    client.once('ready', async () => {
        const channel = await client.channels.fetch(channelId);
        if (channel?.isTextBased()) {
            await channel.send(message);
        } else {
            console.error('Channel not found or is not text-based.');
        }
        client.destroy(); // メッセージを投稿したらクライアントを終了
    });

    await client.login(discordToken);
};

/*
## XXXX年XX月XX日のデイリーチャレンジ
リンク：https://www.geoguessr.com/challenge/xxxxxxxxxxxxxxxx
マップ：A Balanced Japan
ゲームモード：NMPZ 60s
*/
export const postChallengeToDiscord = async (settings: ChallengeSettingsForPost) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const message = `## <t:${timestamp}:D>のデイリーチャレンジ\nリンク：${challengeUrl(settings.token)}\nマップ：${settings.name}\nゲームモード：${settings.mode} 60s`;
    await postToDiscord(message);
}

/*
## XXXX年XX月XX日のチャレンジ結果
リンク：https://www.geoguessr.com/results/xxxxxxxxxxxxxxxx
平均点：XXXXX
ランキング :
```
1位: AAAAA
    AAAAA点
2位: BBBBB
    BBBBB点
3位: CCCCC
    CCCCC点
4位: DDDDD
    DDDDD点
5位: EEEEE
    EEEEE点
6位: FFFFF
    FFFFF点
```
*/
export const postResultToDiscord: (ranking: ChallengeHighscores) => Promise<void> = async (ranking: ChallengeHighscores) => {
    // leaderboard: 上位min(6, highscores.length)人のランキングを表示
    const leaderboard = ranking.highscores.items.slice(0, 6)
        .map((entry, index) => `${index + 1}位: ${entry.playerName}\n\t${entry.totalScore}点`).join('\n');
    const average = ranking.highscores.items.reduce((acc, entry) => acc + entry.totalScore, 0) / ranking.highscores.items.length;
    const message = `## <t:${ranking.timestamp}:D>のチャレンジ結果\nリンク：${challengeUrl(ranking.token)}\n平均点：${Math.round(average)}\nランキング :\n\`\`\`\n${leaderboard}\n\`\`\``;
    await postToDiscord(message);
}
