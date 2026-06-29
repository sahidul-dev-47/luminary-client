import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

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

  // 🔥 এই অংশটা যোগ করো — Google এর জন্য Role সেট করবে
  // onUserCreate: async (user) => {
  //   if (user.provider === "google" && (!user.role || user.role === "")) {
  //     // Google ইউজারের জন্য ডিফল্ট রোল
  //     const usersCollection = db.collection("user");
      
  //     await usersCollection.updateOne(
  //       { id: user.id },
  //       { $set: { role: "Reader" } }   // এখানে চাইলে "Writer" বা অন্য কিছু দিতে পারো
  //     );
  //   }
  // },
});