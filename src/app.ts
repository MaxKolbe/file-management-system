import express from 'express';
import customRouter from './modules/custom/custom.routes.js';
import fileRouter from './modules/files/files.services.js';
import homeRouter from './modules/home/home.routes.js';
import userRouter from './modules/users/users.routes.js';
import forgotp from './modules/forgotpassword/forgotpassword.routes.js';
import userModel from './modules/users/users.model.js';
import signJwt from './utils/createJwt.js';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import { connectToDb } from './configs/db';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Request, Response, NextFunction } from 'express';

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
    secret: 'blablabla', // key for encrypting session
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
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      // This function is called after successful authentication
      // Here you can save the user profile to your database or session
      const email = profile._json.email;

      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return done(null, profile); // Pass the user profile to the next middleware
      }

      const user = await userModel.create({ email });

      // console.log("User authenticated:", user) CHANGE ID TO MONGO ID
      return done(null, profile); // Pass the user profile to the next middleware
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
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

// Callback URL after Google authentication
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureMessage: '/' }),
  async (req, res) => {
    if (req.user) {
      const email = req.user; //req.user.json.email !!CHECKKKKKK
      const existingUser = await userModel.findOne({ email });

      if (existingUser) {
        const token = signJwt(existingUser.id);
        res.cookie('staff', token, { httpOnly: true }); //save the jwt as a cookie

        res.redirect('/home');
      }
    }
  },
);

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
