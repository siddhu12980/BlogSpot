import { PrismaClient } from "@prisma/client/edge";
import { createPostInput, updatePostInput } from "@sidd123/common";
import { Hono } from "hono";

const blogs = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
    Variables: {
        userId: string;
        prisma: PrismaClient;
    };
}>();

blogs.get("/:id", async (c) => {
    try {
        const id = c.req.param("id");

        const prisma = c.get("prisma");
        const user = await prisma.user.findUnique({
            where: {
                id: c.get("userId"),

            },
            select: {
                id: true,
                name: true,
                email: true,
                profilePicKey: true,
                about: true
            }
        });
        const blog = await prisma.post.findUnique({
            where: {
                id: (id).toString(),
            },
        })
        if (!blog) {
            return c.json({ error: "No blog found" }, 404);
        }
        return c.json({ blog, user }, 200);
    }
    catch (e: any) {
        c.json({
            error: e.message
        }, 501);
    }
});

blogs.post("/", async (c) => {
    try {
        const prisma = c.get("prisma");
        const authorId = c.get("userId");

        const body = await c.req.json();
        const { success } = createPostInput.safeParse(body);

        if (!success) {
            return c.json({ error: " Post Type Validation Failed" }, 400);
        }

        const blog = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                published: body.published,
                post_banner: body.post_banner,
                authorId,
            },
        });

        console.log(blog);

        return c.json({ blog }, 200);
    } catch (e: any) {
        return c.json({ error: e.message }, 501);
    }
});

blogs.delete("/:id", async (c) => {
    try {
        const prisma = c.get("prisma");
        const authorId = c.get("userId");
        const id = c.req.param("id");

        const blog = await prisma.post.findUnique({
            where: {
                id: (id).toString(),
                authorId,
            },
        });

        if (!blog) {
            return c.json({ message: "No blog found" }, 404);
        }

        await prisma.post.delete({
            where: {
                id: (id).toString(),
                authorId,
            },
        });

        return c.json({
            message: "Post deleted successfully",
        }, 200);
    } catch (e: any) {
        return c.json({ error: e.message }, 501);
    }
}
);

blogs.post("/rate", async (c) => {
    try {
        const prisma = c.get("prisma");

        const body = await c.req.json();

        const { blog_id, author_id } = body;



        if (!body.blog_id) {
            return c.json({ error: " No BlogID Found" }, 400);
        }

        if (author_id == c.get("userId")) {
            return c.json({ error: "You can't rate your own post" }, 403);
        }

        const blog = await prisma.post.update({
            where: {
                id: blog_id,
            },
            data: {
                rating: {
                    increment: 1,
                },
            },

        });

        return c.json({ blog }, 200);
    } catch (e: any) {
        return c.json({ error: e.message }, 501);
    }
});

blogs.post("/save", async (c) => {
    try {
        const prisma = c.get("prisma");

        const body = await c.req.json();
        const { postId } = body;
        const userId = c.get("userId");

        const user = await prisma.user.findUnique({ where: { id: userId } });
        const post = await prisma.post.findUnique({ where: { id: postId } });

        if (!user || !post) {
            return c.json({ error: "User or Post not found" }, 404);
        }

        const existingSavedPost = await prisma.user.findFirst({
            where: {
                id: userId,
                savedPosts: {
                    some: {
                        id: postId,
                    },
                },
            },
        });

        if (existingSavedPost) {
            return c.json({ error: "Post is already saved" }, 400);
        }

        // Save the post by updating the relation
        await prisma.user.update({
            where: { id: userId },
            data: {
                savedPosts: {
                    connect: { id: postId },
                },
            },
        });

        return c.json({ message: "Post saved successfully" }, 200);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});




blogs.get("/", async (c) => {
    try {
        const prisma = c.get("prisma");

        const blogs = await prisma.post.findMany({
            where: {
                authorId: c.get("userId"),
            },
        });

        return c.json({ blogs }, 200);
    } catch (e: any) {
        return c.json({ error: e.message }, 501);
    }

});

blogs.put("/", async (c) => {
    try {
        const prisma = c.get("prisma")

        const body = await c.req.json();

        const { success } = updatePostInput.safeParse(body);

        if (!success) {
            return c.json({ error: "Update Post Type Validation Failed" }, 400);

        }
        const blog = await prisma.post.update({
            where: {
                id: body.id,
                authorId: c.get("userId"),
            },
            data: {
                title: body.title,
                content: body.content,
                published: body.published,
            },
        });

        if (!blog) {
            return c.json({ error: "No blog found" }, 404);
        }

        return c.json({ blog }, 200);


    }
    catch (e: any) {
        return c.json({ error: e.message }, 501);
    }
});

blogs.post("/saved-posts", async (c) => {
    try {
        const prisma = c.get("prisma");

        const body = await c.req.json();
        const { userId } = body;

        const userWithSavedPosts = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                savedPosts: true,
            },
        });

        if (!userWithSavedPosts) {
            return c.json({ error: "User not found" }, 404);
        }

        return c.json({ savedPosts: userWithSavedPosts.savedPosts }, 200);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});








export default blogs;
