
// export const SUPPORTED_LANGUAGES = ["en", "es", "it"]

// export type Language = typeof SUPPORTED_LANGUAGES[number]

export enum Role {
    ADMIN,
    USER
}

export type User = {
    name: string,
    role: Role,
}