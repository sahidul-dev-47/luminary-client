// app/api/auth/check-role/route.js
import { auth } from "@/lib/auth";
import { MongoClient } from "mongodb";

export async function GET(request) {
  let client;

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.email) {
      return Response.json({ authenticated: false });
    }

    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const db = client.db("luminary_db");

    const user = await db.collection("user").findOne({
      email: session.user.email,
    });

    return Response.json({
      authenticated: true,
      role: user?.appRole || null,
    });
  } catch (error) {
    console.error("Check Role Error:", error);
    return Response.json({ authenticated: true, role: null }, { status: 200 });
  } finally {
    if (client) await client.close();
  }
}
