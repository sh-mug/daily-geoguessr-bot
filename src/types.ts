
export interface ChallengeResponse {
    token: string;
}

export interface ChallengeToken {
    timestamp: number;
    token: string;
};

interface Highscore {
    map(arg0: (entry: any, index: any) => string): unknown;
    items: [
        {
            playerName: string;
            totalScore: number;
        }
    ];
};

export interface ChallengeHighscores {
    timestamp: number;
    token: string;
    highscores: Highscore;
};
