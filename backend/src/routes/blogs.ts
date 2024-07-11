import { PrismaClient } from "@prisma/client/extension";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";


const blogs = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    };
    Variables: {
        userId: string
    }
}>();

blogs.get("/:id", (c) => {
    const id = c.req.param("id");
    console.log(c.get('userId'))
    console.log(id);
    return c.text("get blog route");
});


// model Post {
//     id        String  @id @default(uuid())
//     title     String
//     content   String
//     published Boolean @default(false)
//     author    User    @relation(fields: [authorId], references: [id])
//     authorId  String
//   }


blogs.post("/", async (c) => {
    try {
        console.log("===============")

        const prisma = await new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL,
        }).$extends(withAccelerate());
        console.log("===============")


        const authorId = c.get('userId')

        const body = await c.req.json();

        const blog = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                published: body.published,
                authorId
            },
        });

        return c.json({ blog })

    }
    catch (e: any) {
        return c.json({ error: e.message });


    }



});

blogs.put("/blog", (c) => {
    return c.text("signin route");
});


export default blogs;