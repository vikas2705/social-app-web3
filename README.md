# Decentralized Social Media MVP

A decentralized social media platform built with Next.js, NestJS, and Ethereum. Users can connect their wallets, create posts, interact with others, and manage their profiles.

## Features

- Wallet-based authentication using RainbowKit
- Create and view posts (280 character limit)
- Like and comment on posts
- User profiles with customizable usernames, bios, and profile pictures
- Real-time updates for interactions

## Tech Stack

### Frontend

- Next.js 14
- React
- Tailwind CSS
- RainbowKit
- wagmi
- ethers.js

### Backend

- NestJS
- TypeScript
- PostgreSQL
- TypeORM

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- MetaMask or any Web3 wallet

## Setup

1. Clone the repository:

```bash
git clone https://github.com/vikas2705/social-app-web3.git
cd social-app-web3
```

2. Set up the backend:

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following variables:

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=<username>
DATABASE_PASSWORD=<password>
DATABASE_NAME=decentralized_social
JWT_SECRET=your-secret-key
```

To generate a jwt secret key using Node.js crypto module, paste the command in your terminal

```
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

3. Set up the frontend:

```bash
cd ../frontend
npm install
```

Create a `.env.local` file in the frontend directory:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=profile_images
NEXT_PUBLIC_TINYMCE_KEY=
```

4. Start the development servers:

Backend:

```bash
cd backend
npm run start:dev
```

Frontend:

```bash
cd frontend
npm run dev
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Usage

1. Connect your Ethereum wallet using the "Connect Wallet" button
2. Sign the message to verify your wallet ownership
3. Create posts, like, and comment on others' posts
4. Customize your profile with a username, bio, and profile picture

## API Endpoints

### Authentication

- `POST /auth/verify`: Verify wallet ownership

### Users

- `GET /users/:wallet`: Get user profile
- `POST /users/:wallet`: Update user profile

### Posts

- `GET /posts`: Get all posts
- `POST /posts`: Create a new post
- `GET /posts/:id`: Get a specific post
- `POST /posts/:id/like`: Like a post
- `POST /posts/:id/comment`: Comment on a post

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
