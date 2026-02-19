import { eq, and } from 'drizzle-orm';
import db from '../db/index.js';
import { urlsTable } from '../models/index.js';


/** Insert a new short URL record and return the created row. */
export async function createShortURL({ shortCode, targetURL, userId }) {
    const [result] = await db
        .insert(urlsTable)
        .values({ shortCode, targetURL, userId })
        .returning({
            id: urlsTable.id,
            shortCode: urlsTable.shortCode,
            targetURL: urlsTable.targetURL,
        });

    return result;
}

/** Find a URL record by its short code. Returns the row or null. */
export async function getUrlByCode(code) {
    const [result] = await db
        .select({ targetURL: urlsTable.targetURL })
        .from(urlsTable)
        .where(eq(urlsTable.shortCode, code));

    return result ?? null;
}

/** Get all URL records belonging to a user. */
export async function getAllUrlsByUserId(userId) {
    return db
        .select()
        .from(urlsTable)
        .where(eq(urlsTable.userId, userId));
}

/**
 * Delete a URL only if it belongs to the given user.
 * Returns true if a row was deleted, false otherwise.
 */
export async function deleteUrlById(id, userId) {
    const result = await db
        .delete(urlsTable)
        .where(and(eq(urlsTable.id, id), eq(urlsTable.userId, userId)));

    return result.rowCount > 0;
}