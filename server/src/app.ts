// Node.js core modules
import path from 'path';

import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
// Security
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cors from 'cors';

// Controllers
import globalErrorHandler from './controllers/errorController.js';
// Routes
import bookingRouter from './routes/bookingRoute.js';
import roomRouter from './routes/roomRoute.js';
import userRouter from './routes/userRoute.js';
// Utils
import HttpError from './utils/HttpError.js';
// Types
import eStatusCode from './types/eStatusCode.js';

const app = express();

///////////////////////////////////////////////////////////////////
// Middleware
///////////////////////////////////////////////////////////////////

// Log incoming request (in dev mode)
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Helmet: http security header
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  })
);
// Rate limit
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request, please try again in one hour',
});
app.use('/api', limiter); // don't limit requirements for static folder

// Static folder
app.use('/', express.static(path.join('public'))); // NOTE: access url - http://127.0.0.1:3000/images/profile/default-profile-photo.png

// Body parser
app.use(express.json({ limit: '10kb' }));
// Cookies parser
app.use(cookieParser());

// Data sanitization: against NoSQL query injection
app.use(mongoSanitize());
// Prevent parameter pollution
app.use(hpp());

// CORS
app.use(
  cors({
    origin: [
      'https://localhost:5173',
      'https://minshuku-client.vercel.app',
      'https://fullstack-bnb-clone-client.vercel.app',
    ],
    credentials: true, // allow to send credentials to origins
  })
);

// Router ---------------------------------------------------------
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/rooms', roomRouter);
app.use('/api/v1/users', userRouter);

// Unhandled route
app.use('*', (req, res, next) => {
  return next(
    new HttpError(
      eStatusCode['not found'],
      `Can't find: ${req.originalUrl} on this server`
    )
  );
});

// Handle global error --------------------------------------------
app.use(globalErrorHandler);

// Export
export default app;
