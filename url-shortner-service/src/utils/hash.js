import argon2 from 'argon2';

/** Hash a plaintext password using argon2. */
export async function hashPassword(password) {
    return argon2.hash(password);
}

/** Verify a plaintext password against an argon2 hash. */
export async function verifyPassword(hashedPassword, password) {
    return argon2.verify(hashedPassword, password);
}
