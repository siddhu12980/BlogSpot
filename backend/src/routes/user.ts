import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { use } from "hono/jsx";

const user = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
    prisma: PrismaClient;
  };
}>();

user.get("/author/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const prisma = c.get("prisma");

    const author = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        about: true,
        profilePicKey: true,
        tagsLiked: true,
        bannerPicKey: true,

      },
    });

    const posts = await prisma.post.findMany({
      where: {
        authorId: id,
      },
    });

    return c.json({ author, posts }, 200);
  } catch (e: any) {
    return c.json({ error: e.message }, 501);
  }
});

user.post("/onboarding", async (c) => {
  try {
    const body = await c.req.formData();

    // Extract data from formData
    const rawTopics = body.get("topics");
    const profilePicKey = body.get("profilePicKey");
    const about = body.get("about");

    // Validate required fields
    if (!rawTopics || !profilePicKey || !about) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Parse and validate topics
    let tagsLiked: string[];
    try {
      tagsLiked = JSON.parse(String(rawTopics));
      if (!Array.isArray(tagsLiked)) {
        throw new Error("Invalid topics format");
      }
    } catch (e) {
      return c.json({ error: "Invalid topics format" }, 400);
    }

    const prisma = c.get("prisma");
    const userID = c.get("userId");

    // Perform the update operation
    const user = await prisma.user.update({
      where: {
        id: userID,
      },
      data: {
        about: String(about),  // Convert to string
        tagsLiked,// Array of strings
        profilePicKey: String(profilePicKey), // Convert to string
      },
    });

    return c.json({ message: "Onboarding completed successfully", user }, 200);

  } catch (e: any) {
    console.log(e);
    return c.json({ error: e.message }, 500);
  }
});

user.post("/banner", async (c) => {
  try {
    const body = await c.req.json();
    const {bannerPicKey} = body;

    if (!bannerPicKey) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const prisma = c.get("prisma");
    const userID = c.get("userId");

    const user = await prisma.user.update({
      where: {
        id: userID,
      },
      data: {
        bannerPicKey: String(bannerPicKey),
      },
    });
    console.log(user);

    return c.json({ message: "Banner updated successfully", user }, 200);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
}


);

user.put("/follow/:id", async (c) => {
  const followId = c.req.param("id");
  const myId = c.get("userId");
  const prisma = c.get("prisma");

  try {
    // Check if the target user exists
    const user = await prisma.user.findUnique({
      where: { id: followId },
    });
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    // Check if the user is trying to follow themselves
    if (user.id === myId) {
      return c.json({ error: "You can't follow yourself" }, 400);
    }

    // Check if already following
    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: myId,
          followingId: followId,
        },
      },
    });

    if (existingFollow) {
      return c.json({ error: "Already following this user" }, 400);
    }

    // Create a new follow relationship
    await prisma.follows.create({
      data: {
        followerId: myId,
        followingId: followId,
      },
    });

  const updatedUser = await prisma.user.update({
    where: {
      id: myId,
    },
    data: {
      following: {
        connect: {
          id: followId,
        },
      },
    },
  });

  return c.json({ message: "User followed successfully", updatedUser });
  } catch (e: any) {
    console.error(e);
    return c.json({ error: e.message }, 500);
  }
});




export default user;
