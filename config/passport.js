import passport from 'passport';
import userModel from '../models/userModel.js';
import 'dotenv/config';

// Configure passport serialization
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Only configure Google OAuth if environment variables are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    try {
        const { Strategy: GoogleStrategy } = await import('passport-google-oauth20');
        
        passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/user/auth/google/callback",
            scope: ['profile', 'email']
        }, async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                let user = await userModel.findOne({ googleId: profile.id });
                
                if (user) {
                    return done(null, user);
                }
                
                // Check if user exists with the same email
                user = await userModel.findOne({ email: profile.emails[0].value });
                
                if (user) {
                    // Update existing user with Google ID
                    user.googleId = profile.id;
                    if (profile.photos && profile.photos.length > 0) {
                        user.profilePic = profile.photos[0].value;
                    }
                    await user.save();
                    return done(null, user);
                }
                
                // Create new user
                const newUser = new userModel({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    profilePic: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '',
                });
                
                await newUser.save();
                return done(null, newUser);
            } catch (error) {
                return done(error, null);
            }
        }));
        
        console.log("Google OAuth strategy configured successfully");
    } catch (error) {
        console.error("Failed to configure Google OAuth strategy:", error);
    }
} else {
    console.log("Google OAuth credentials not found, skipping strategy setup");
}

export default passport;
