import express from 'express';
import customRouter from './modules/custom/custom.routes.js';
import fileRouter from './modules/files/files.routes.js';
import homeRouter from './modules/home/home.routes.js';
import userRouter from './modules/users/users.routes.js';
import forgotp from './modules/forgotpassword/forgotpassword.routes.js';
import userModel from './modules/users/users.model.js';
import signJwt from './utils/createJwt.js';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import { connectToDb } from './configs/db.js';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

connectToDb();

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(
  session({
    secret: process.env.SESSION_SECRET as string, // key for encrypting session
    resave: false, // deprecated - tho still used in some cases to only resave session if it was modified
    saveUninitialized: true, // save session even if it was not modified
  }),
);

//Passport Config
app.use(passport.initialize()); // Initialize Passport
app.use(passport.session()); // Integrates with Express session

/* Oauth Credentials */
/* Work on office code/google implementation */
/* export this bloc to a util and import it i.e import './utils/googleAuthenticate.js' */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: 'http://localhost:3000/auth/google/callback', // URL to redirect to after authentication
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      // This function is called after successful authentication
      // Here you can save the user profile to your database or session
      const email = profile._json.email;
      const existingUser = await userModel.findOne({ email });
      
      if (existingUser) {
        return done(null, existingUser); // Store existingUser in the session as req.user
        //Don't store entire user in session for serious projects
      }

      const user = await userModel.create({ email });

      return done(null, user); // Store user in the session as req.user
      //Don't store entire user in session for serious projects
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user); // Save user profile to session
});
passport.deserializeUser((user: any, done) => {
  done(null, user); // Retrieve user profile from session
});

app.use('/', userRouter);
app.use('/', homeRouter);
app.use('/', fileRouter);
app.use('/', customRouter);
app.use('/', forgotp);

// Start Google authentication
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback URL after Google authentication
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), async (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }

  const person: any = req.user;
  const token = signJwt(person.id);
  
  res.cookie('staff', token, { httpOnly: true });

  return res.redirect('/home');
});

// Google Logout
// app.get("/logout", (req, res) => {
//     req.logout(()=>{
//         res.redirect("/")
//     })
// })

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.status(500).json({ message: 'Internal Server Error', error: err });
});

export default app;
