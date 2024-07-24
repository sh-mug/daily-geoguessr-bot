export interface MapsResponse {
    name: string;
};

export type GameMode = 'Move' | 'NM' | 'NMPZ';

export interface ChallengeSettings {
    map: string;
    mode: GameMode;
};

export interface ChallengePayload {
    map: string;
    forbidMoving: boolean;
    forbidRotating: boolean;
    forbidZooming: boolean;
    timeLimit: number;
    rounds: number;
};

export interface ChallengeSettingsForPost {
    name: string;
    mode: GameMode;
    token: string;
};

export interface ChallengeResponse {
    token: string;
}

export interface ChallengeToken {
    timestamp: number;
    token: string;
};

interface HighscoresResponse {
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
    highscores: HighscoresResponse;
};
