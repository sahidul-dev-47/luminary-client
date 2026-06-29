import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("luminary_db");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
      },
    },
  },

  session: {
    fields: {
      user: {
        role: true,
      },
    },
  },

  jwt: {
    enabled: true,
    definePayload: (user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }),
  },
 plugins:[
  admin()
 ]
  
});