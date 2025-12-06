export interface User {
    id: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Team {
    id: string;
    userId: string;
    name: string;
    budget: number;
    status: 'creating' | 'ready' | 'error';
    createdAt: Date;
    updatedAt: Date;
}
export interface Player {
    id: string;
    name: string;
    position: 'GK' | 'DEF' | 'MID' | 'ATT';
    value: number;
    teamId?: string;
    isOnTransferList: boolean;
    askingPrice?: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateTeamMessage {
    userId: string;
    teamName: string;
}
export interface TeamCreatedMessage {
    userId: string;
    teamId: string;
    status: 'success' | 'error';
    error?: string;
}
export interface LoginDto {
    email: string;
    password: string;
}
export interface RegisterDto {
    email: string;
    password: string;
}
export interface AuthResponse {
    access_token: string;
    user: {
        id: string;
        email: string;
    };
}
export interface TransferFilterDto {
    teamName?: string;
    playerName?: string;
    minPrice?: number;
    maxPrice?: number;
}
export interface ListPlayerDto {
    playerId: string;
    askingPrice: number;
}
export interface BuyPlayerDto {
    playerId: string;
}
export declare const POSITION_COUNTS: {
    readonly GK: 3;
    readonly DEF: 6;
    readonly MID: 6;
    readonly ATT: 5;
};
export declare const INITIAL_BUDGET = 5000000;
export declare const MIN_TEAM_SIZE = 15;
export declare const MAX_TEAM_SIZE = 25;
export declare const TRANSFER_DISCOUNT = 0.95;
