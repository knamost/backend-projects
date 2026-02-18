import { eq } from 'drizzle-orm';
import db from '../db/index.js';
import { usersTable } from '../models/user.model.js';


export async function GetUserByEmail(email) {

    const [existingUser] = await db
    .select({
        id: usersTable.id,
        fistname: usersTable.firstname,
        lastname: usersTable.lastname,
        email: usersTable.email,
        password: usersTable.password,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

    return existingUser;
};


