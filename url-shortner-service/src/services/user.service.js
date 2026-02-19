import { eq } from 'drizzle-orm';
import db from '../db/index.js';
import { usersTable } from '../models/user.model.js';


/** Look up a user by their email address. Returns the user row or undefined. */
export async function getUserByEmail(email) {
    const [user] = await db
        .select({
            id: usersTable.id,
            firstname: usersTable.firstname,
            lastname: usersTable.lastname,
            email: usersTable.email,
            password: usersTable.password,
        })
        .from(usersTable)
        .where(eq(usersTable.email, email));

    return user;
}

/** Insert a new user and return their generated id. */
export async function createUser({ firstname, lastname, email, password }) {
    const [user] = await db
        .insert(usersTable)
        .values({ firstname, lastname, email, password })
        .returning({ id: usersTable.id });

    return user;
}