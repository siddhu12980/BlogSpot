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



blogs.post("/blog", (c) => {
    return c.text("signin route");
});

blogs.put("/blog", (c) => {
    return c.text("signin route");
});


export default blogs;