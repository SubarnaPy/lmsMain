// import cookieparser from 'cookie-parser';

// import ffmpeg from 'fluent-ffmpeg';
// import axios from 'axios';
// import cors from 'cors';
// import fs from 'fs';
// config();
// import express from 'express';
// import{config} from 'dotenv';
// import corrs from 'cors';
// import morgan from 'morgan';
// import errorMiddleware from './middlewares/error.middleware.js';

// import { initializeChat } from "./controllers/chat.controller.js";

// const app= express();

// app.use(express.json({limit:"50mb"}));
// app.use(express.urlencoded({extended: true}));

// app.use(
//     corrs({
//         origin: [ process.env.CLIENT_URL   || 'http://localhost:5173'],
//         credentials: true,
//     })
// );

// app.use(morgan('dev'));
// app.use(cookieparser());

// //server status check
// app.get('/', (req, res)=>{
//     res.send('Server is running...');
// });

// //import all rout

// import chatRoutes from "./routes/chat.routes.js";
//  import userRoutes from './routes/user.routes.js';
//  import courseRoutes from './routes/course.routes.js';
//  import ProfileRoutes from './routes/profile.routes.js';
//  import miscRoutes from './routes/miscellaneous.routes.js';
//  import payments from './routes/payment.routes.js';
// import Ffmpeg from 'fluent-ffmpeg';
// // import liveClassRoutes from './routes/liveClass.routes.js'

// app.use('/api/v1/user', userRoutes);

// app.use('/api/v1/courses', courseRoutes);

// app.use('/api/v1/profile', ProfileRoutes);
// app.use('/api/v1/payments', payments);

// app.use('/api/v1/miscellaneous', miscRoutes);

// // Routes
// app.use("/api/v1/chat", chatRoutes);


// app.get('/get-duration', async (req, res) => {
//     const { videoUrl } = req.query;
  
//     if (!videoUrl) {
//       return res.status(400).json({ error: 'Video URL is required' });
//     }
  
//     console.log('Fetching duration for video:', videoUrl);
  
//     try {
//       // Download the video to a temporary file
//       const tempFilePath = `temp-${Date.now()}.mp4`;
//       const response = await axios({
//         url: videoUrl,
//         responseType: 'stream',
//       });
  
//       response.data.pipe(fs.createWriteStream(tempFilePath))
//         .on('finish', () => {
//           // Use ffprobe to get video metadata
//           ffmpeg.ffprobe(tempFilePath, (err, metadata) => {
//             if (err) {
//               console.error('Error fetching video metadata:', err);
//               return res.status(500).json({ error: 'Failed to fetch video duration' });
//             }
  
//             // Delete the temporary file
//             fs.unlinkSync(tempFilePath);
  
//             const duration = metadata.format.duration;
//             res.json({ duration });
//           });
//         })
//         .on('error', (err) => {
//           console.error('Error downloading video:', err);
//           res.status(500).json({ error: 'Failed to download video' });
//         });
//     } catch (error) {
//       console.error('Error fetching video duration:', error);
//       res.status(500).json({ error: 'Failed to fetch video duration' });
//     }
//   });
// // app.use("/api/v1/live", liveClassRoutes);

// // Initialize Socket.IO Chat
// // initializeChat(server);


// // Assuming you have a route like this:

  


// // app.all('*',(_req,res)=>{
// //     res.status(404).json({message: 'Page not found'});
// // });
// //coustom error handeling
// app.use(errorMiddleware);

// export default app;

import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import axios from 'axios';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import errorMiddleware from './middlewares/error.middleware.js';

// Import routes
import chatRoutes from './routes/chat.routes.js';
import userRoutes from './routes/user.routes.js';
import courseRoutes from './routes/course.routes.js';
import ProfileRoutes from './routes/profile.routes.js';
import miscRoutes from './routes/miscellaneous.routes.js';
import payments from './routes/payment.routes.js';

// Load environment variables
config();

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
  "https://lms4-q82npnle3-subs-projects-2c8f37ee.vercel.app",
  "https://lms4-kappa.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.options("*", cors()); // ✅ Allow preflight requests globally

app.use(morgan('dev'));
app.use(cookieParser());

// Server status check
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/profile', ProfileRoutes);
app.use('/api/v1/payments', payments);
app.use('/api/v1/miscellaneous', miscRoutes);
app.use('/api/v1/chat', chatRoutes);

// Endpoint to fetch video duration
app.get('/get-duration', async (req, res) => {
  const { videoUrl } = req.query;

  if (!videoUrl) {
    return res.status(400).json({ error: 'Video URL is required' });
  }

  console.log('Fetching duration for video:', videoUrl);

  try {
    // Download the video to a temporary file
    const tempFilePath = `temp-${Date.now()}.mp4`;
    const response = await axios({
      url: videoUrl,
      responseType: 'stream',
    });

    response.data.pipe(fs.createWriteStream(tempFilePath))
      .on('finish', () => {
        // Use ffprobe to get video metadata
        ffmpeg.ffprobe(tempFilePath, (err, metadata) => {
          if (err) {
            console.error('Error fetching video metadata:', err);
            return res.status(500).json({ error: 'Failed to fetch video duration' });
          }

          // Delete the temporary file
          fs.unlinkSync(tempFilePath);

          const duration = metadata.format.duration;
          res.json({ duration });
        });
      })
      .on('error', (err) => {
        console.error('Error downloading video:', err);
        res.status(500).json({ error: 'Failed to download video' });
      });
  } catch (error) {
    console.error('Error fetching video duration:', error);
    res.status(500).json({ error: 'Failed to fetch video duration' });
  }
});

// Custom error handling
app.use(errorMiddleware);

export default app;