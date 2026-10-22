import { randomUUID } from "node:crypto";

export const credentials = { username: "user", password: "password" };
export const uniqueName = prefix => `${prefix}-${randomUUID().slice(0, 8)}`;
