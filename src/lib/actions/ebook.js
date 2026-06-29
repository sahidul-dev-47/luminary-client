'use server'

import { serverMutation } from "../core/server";




export const createEbook = async (newEbookData) => {
    return serverMutation('/api/ebooks', newEbookData);
}

