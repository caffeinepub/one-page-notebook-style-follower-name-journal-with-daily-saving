import type { Principal } from "@icp-sdk/core/principal";

export interface Some<T> {
    __kind__: "Some";
    value: T;
}

export interface None {
    __kind__: "None";
}

export type Option<T> = Some<T> | None;

export type DailyList = Array<string>;

export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}

export interface UserProfile {
    name: string;
}

export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    getFollowersForDay(date: string): Promise<DailyList>;
    isCallerAdmin(): Promise<boolean>;
    saveFollowersForDay(date: string, list: DailyList): Promise<void>;
}
