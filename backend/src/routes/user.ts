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
    console.log(posts,author);

    return c.json({ author, posts }, 200);
  } catch (e: any) {
    return c.json({ error: e.message }, 501);
  }
});

user.post("/onboarding", async (c) => {
  try {
    const body = await c.req.formData();

    const rawTopics = body.get("topics");
    const profilePicKey = body.get("profilePicKey");
    const about = body.get("about");

    if (!rawTopics || !profilePicKey || !about) {
      return c.json({ error: "Missing required fields" }, 400);
    }

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

    const user = await prisma.user.update({
      where: {
        id: userID,
      },
      data: {
        about: String(about),
        tagsLiked,// 
        profilePicKey: String(profilePicKey),
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
    const { bannerPicKey } = body;

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
    const user = await prisma.user.findUnique({
      where: { id: followId },
    });
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    if (user.id === myId) {
      return c.json({ error: "You can't follow yourself" }, 400);
    }

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: myId,
          followingId: followId,
        },
      },
    });

    if (existingFollow) {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: myId,
            followingId: followId,
          },
        },
      });
      const updatedUser = await prisma.user.findUnique({
        where: {
          id: myId,
        },
      });


      return c.json({ message: "User unfollowed successfully", updatedUser });
    } else {
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
              followerId_followingId: {
                followerId: myId,
                followingId: followId,
              },
            },
          },
        },
    
      });

      return c.json({ message: "User followed successfully", updatedUser });
    }
  } catch (e: any) {
    console.error(e);
    return c.json({ error: e.message }, 500);
  }
});
;


user.get("/relation", async (c) => {
  const myId = c.get("userId");
  const prisma = c.get("prisma");

  try {
    const followedUsers = await prisma.follows.findMany({
      where: {
        followerId: myId,
      },
      select: {
        followingId: true,
      },
    });

    return c.json({
      followedUsers
    })

  }
  catch (e: any) {
    console.error(e);
    return c.json({ error: e.message }, 500);


  }


});



user.get("/profilelist/:id", async (c) => {
  const prisma = c.get("prisma");
  const user_id = c.req.param("id");

  try {
    const followedUsers = await prisma.follows.findMany({
      where: {
        followerId: user_id,
      },
      select: {
        followingId: true,
      },
    });

    const followedUsersData = await Promise.all(
      followedUsers.map(async (user) => {
        const userDetails = await prisma.user.findUnique({
          where: {
            id: user.followingId,
          },
          select: {
            profilePicKey: true,
            name: true,
            id: true,
            _count: {
              select: { followers: true },
            },
          },
        });

        return {
          profilePicKey: userDetails?.profilePicKey,
          id: userDetails?.id,
          name: userDetails?.name,
          followerCount: userDetails?._count?.followers,
        };
      })
    );

    return c.json({
      followedUsersData,
    });

  } catch (e: any) {
    console.error(e);
    return c.json({ error: e.message }, 500);
  }
});


user.post("/about", async (c) => {
  try {
    const id = c.get("userId");
    const prisma = c.get("prisma");
    const body = await c.req.json();
    const { about } = body;
    const author = await prisma.user.update({
      where: {
        id
      },
      data: {
        about,
      }
    });
    return c.json({ author }, 200);
  } catch (e: any) {
    return c.json({ error: e.message }, 501);
  }
});



user.get("/saved", async (c) => {
  try {
    const id = c.get("userId");
    const prisma = c.get("prisma");
    const body = await c.req.json();
    const { about } = body;
    const author = await prisma.user.update({
      where: {
        id
      },
      data: {
        about,
      }
    });
    return c.json({ author }, 200);
  } catch (e: any) {
    return c.json({ error: e.message }, 501);
  }
});

user.post("/profile", async (c) => {
  try {
    const body = await c.req.json();
    const { profilePicKey } = body;

    if (!profilePicKey) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const prisma = c.get("prisma");
    const userID = c.get("userId");

    const user = await prisma.user.update({
      where: {
        id: userID,
      },
      data: {
        profilePicKey: String(profilePicKey),
      },
    });
    console.log(user);

    return c.json({ message: "Profile Picture updated successfully", user }, 200);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
}


);











export default user;
