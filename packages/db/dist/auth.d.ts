/** Hashes a plaintext password into a `salt:hash` string safe to store in the database. */
export declare function hashPassword(password: string): Promise<string>;
/** Verifies a plaintext password against a `salt:hash` string produced by {@link hashPassword}. */
export declare function verifyPassword(password: string, storedHash: string): Promise<boolean>;
//# sourceMappingURL=auth.d.ts.map