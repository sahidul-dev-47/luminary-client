// lib/core/session.js
import { redirect } from "next/navigation";
import { auth } from "../auth";
import { headers } from "next/headers";

export const getUserSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return session?.user || null;
};

export const getUserToken = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    return session?.session?.token || null;
}


export const requireRole = async (requiredRole) => {
    const user = await getUserSession();

    if (!user) {
        redirect('/auth/login');
    }

    
    const userRole = user.role?.trim();
    const neededRole = requiredRole.charAt(0).toUpperCase() + requiredRole.slice(1).toLowerCase();

    if (userRole !== neededRole) {
        console.log(`Role Mismatch → Expected: ${neededRole}, Got: ${userRole}`);
        redirect('/unauthorized');
    }

    return user;
};