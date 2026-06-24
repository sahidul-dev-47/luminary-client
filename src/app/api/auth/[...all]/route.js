import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { MongoClient } from "mongodb";

// Better Auth Default Handlers
export const { POST, GET } = toNextJsHandler(auth);
