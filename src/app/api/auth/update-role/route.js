import { auth } from "@/lib/auth";
import { MongoClient } from "mongodb";

export async function PATCH(request) {
  let client;

  try {
    const { role } = await request.json();

    if (!role || !["Reader", "Writer"].includes(role)) {
      return Response.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    const session = await auth.api.getSession({
      headers: request.headers,
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
          role,
          updatedAt: new Date(),
        },
      }
    );

    if (!result.matchedCount) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      role,
      message: "Role updated successfully",
    });
  } catch (error) {
    console.error("Role update error:", error);

    return Response.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}