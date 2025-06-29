import express from 'express';
import passport from '../config/passport.js';
import { loginUser, registerUser, adminLogin, googleAuthSuccess, googleAuthFailure } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);

// Google OAuth routes
userRouter.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

userRouter.get('/auth/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: '/api/user/auth/google/failure',
        session: false
    }),
    googleAuthSuccess
);

userRouter.get('/auth/google/failure', googleAuthFailure);

export default userRouter;
