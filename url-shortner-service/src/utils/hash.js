import argon2 from 'argon2';


export async function hashPassword(password){
    const hashedPassword = await argon2.hash(password);
    return hashedPassword;
}

export async function verifyPassword(hashedPassword, password){
    return await argon2.verify(hashedPassword, password);
}
