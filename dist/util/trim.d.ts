export default function trim<T extends Record<string, string>, K extends keyof T>(obj: T, exception: K[]): T;
