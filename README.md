# BlogSpot

BlogSpot is a modern blogging platform similar to Medium, designed to be fully functional and deployed using an Express TypeScript backend on an EC2 instance. This app allows users to create, read, and interact with blog posts seamlessly.

## Features

- **Create Posts**: Write and publish blog posts with rich text formatting.
- **Read Posts**: Browse and read published blog posts.
- **Rate Posts**: Rate posts to provide feedback and highlight popular content.
- **User Profiles**: View and manage user profiles, including followers and followed users.
- **Search**: Search for posts by title, tags, or content.
- **Tags and Categories**: Organize and filter posts using tags and categories.

## Architecture

- **Frontend**: React application deployed on Vercel with modern UI components and responsive design.
- **Backend**: Express TypeScript application deployed on EC2 for handling API requests.
- **Database**: PostgreSQL or MongoDB for storing blog posts, user data, and ratings.

## Deployment

BlogSpot is deployed using GitHub CI/CD for automated builds and Docker for containerization. The backend runs on an EC2 instance, while the frontend is deployed on Vercel, ensuring scalability and low operational costs.

### Environment Variables

Make sure to configure the necessary environment variables, such as:

- `DATABASE_URL`: Your database connection string.
- `JWT_SECRET`: Your secret for JWT authentication.

## Contributing

If you want to contribute to BlogSpot, please follow these steps:

1. **Fork the repository.**
2. **Create a new branch for your feature or bug fix.**
3. **Make your changes.**
4. **Submit a pull request with a description of your changes.**