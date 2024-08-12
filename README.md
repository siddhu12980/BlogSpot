# BlogSpot

BlogSpot is a modern blogging platform similar to Medium, designed to be fully functional and deployed in a serverless environment using Cloudflare Workers. It utilizes Prisma Accelerate for efficient connection pooling and scaling. This app allows users to create, read, and interact with blog posts seamlessly.

## Features

- **Create Posts**: Write and publish blog posts with rich text formatting.
- **Read Posts**: Browse and read published blog posts.
- **Rate Posts**: Rate posts to provide feedback and highlight popular content.
- **User Profiles**: View and manage user profiles, including followers and followed users.
- **Search**: Search for posts by title, tags, or content.
- **Tags and Categories**: Organize and filter posts using tags and categories.

## Architecture

- **Frontend**: React application with modern UI components and responsive design.
- **Backend**: Serverless functions deployed using Cloudflare Workers.
- **Database**: Prisma with Prisma Accelerate for connection pooling and efficient database operations.
- **Database**: PostgreSQL or MongoDB for storing blog posts, user data, and ratings.

## Deployment

BlogSpot is deployed in a serverless environment using Cloudflare Workers to ensure scalability and low operational costs. Prisma Accelerate is used to optimize database connection management and performance.

### Cloudflare Workers Setup

1. **Install Cloudflare Wrangler CLI:**

   ```bash
   npm install -g wrangler
   ```

2. **Configure Cloudflare Workers:**

   Create a `wrangler.toml` file in the root directory with your Cloudflare account details and deployment settings. For example:

   ```toml
   name = "blogspot-backend"
   type = "javascript"

   account_id = "your-account-id"
   workers_dev = true
   compatibility_date = "2024-08-01"

   [[triggers]]
   crons = ["0 0 * * *"]
   ```

3. **Deploy Cloudflare Workers:**

   ```bash
   wrangler publish
   ```

### Prisma Accelerate Setup

1. **Install Prisma CLI:**

   ```bash
   npm install @prisma/cli --save-dev
   ```

2. **Configure Prisma:**

   Update your `prisma/schema.prisma` with the database connection details. Use Prisma Accelerate to optimize performance:

   ```plaintext
   generator client {
     provider = "prisma-client-js"
   }

   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Generate Prisma Client:**

   ```bash
   npx prisma generate
   ```

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/blogspot.git
   cd blogspot
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create a `.env` file:**

   Copy the `.env.example` file to `.env` and update it with your environment-specific variables:

   ```bash
   cp .env.example .env
   ```

   Add your environment variables to the `.env` file:

   ```plaintext
   REACT_APP_BACKEND_URL=https://your-cloudflare-worker-url.com
   DATABASE_URL=your-database-url
   ```

4. **Start the development server:**

   ```bash
   npm start
   # or
   yarn start
   ```

   The frontend will be available at `http://localhost:3000`.

## Usage

1. **Create a new blog post:**

   Navigate to the blog creation page and fill in the required fields such as title, content, and tags. Click "Publish" to make your post live.

2. **Read and interact with posts:**

   Browse through the available posts, read content, and rate posts to give feedback.

3. **Manage your profile:**

   View and edit your profile information, including your bio, followed users, and saved posts.

## Contributing

If you want to contribute to BlogSpot, please follow these steps:

1. **Fork the repository.**
2. **Create a new branch for your feature or bug fix.**
3. **Make your changes.**
4. **Submit a pull request with a description of your changes.**


Feel free to adjust the details according to your specific configuration and deployment needs.