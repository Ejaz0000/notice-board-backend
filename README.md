"# Notice Board Backend

A RESTful API backend for managing organizational notices. This system allows creating, updating, and managing notices with support for drafts, publishing schedules, department targeting, and file attachments via Cloudinary.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js v5
- **Database:** MongoDB with Mongoose ODM
- **File Storage:** Cloudinary
- **File Upload:** Multer with Cloudinary storage
- **Deployment:** Vercel

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd notice-list-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory and add the required variables (see below).

4. **Run the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

   The server runs on `http://localhost:5000` by default.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

**Example `.env` file:**
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/notice-board
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```" 

## Live URL

--- https://notice-board-backend-sigma.vercel.app/
