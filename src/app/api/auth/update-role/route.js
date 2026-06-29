import { auth } from "@/lib/auth";
import { MongoClient } from "mongodb";

export async function PATCH(req) {
  let client;

  try {
    const { role } = await req.json();

    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user?.email) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const db = client.db("luminary_db");

    const result = await db.collection("user").updateOne(
      {
        email: session.user.email,
      },
      {
        $set: {
          role: role,
          updatedAt: new Date(),
        },
      }
    );

    return Response.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });

  } catch (error) {
    console.error("UPDATE ROLE ERROR:", error);

    return Response.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
