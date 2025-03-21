import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './configs/cloudinary.js'
import courseRouter from './routes/courseRoute.js'
import userRouter from './routes/userRoutes.js'
import paymentRoutes from "./routes/paymentRoutes.js";

// Initialize Express
const app = express()

// Middlewares
app.use(cors());
app.use(express.json());  // ✅ Fix: Ensure JSON body parsing globally
app.use(clerkMiddleware());

// Routes
app.get('/', (req, res) => res.send("API Working"));
app.post('/clerk', clerkWebhooks);
app.use('/api/educator', educatorRouter);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);
app.use('/api/payment', paymentRoutes);  // ✅ Fix: No need for express.json() again here

// Port
const PORT = process.env.PORT || 5000

// Start server after connecting to database
const startServer = async () => {
  try {
    await connectCloudinary()
    await connectDB()
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to connect to database:', error)
    process.exit(1)
  }
}

// Run the server
startServer()
