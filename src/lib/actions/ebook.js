'use server'
import { serverMutation, serverFetch } from "../core/server";

export const createEbook = async (newEbookData) => {
  return serverMutation('/api/v1/writer/ebooks', newEbookData);
};

// NEW: update an existing ebook
export const updateEbook = async (id, updatedData) => {
  return serverMutation(`/api/v1/writer/ebooks/${id}`, updatedData, 'PUT');
};