import { Request } from "express";
import passport, { Profile, DoneCallback } from "passport";
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth20";
import MenteeRepository from "../REPOSITORY/MenteeRepository";
import "express-session";

interface IGoogleProfile {
  emails?: { value: string }[];
  photos?: { value: string }[];
  name?: { givenName: string };
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env?.GOOGLE_CLIENT_ID as string,
      clientSecret: process?.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env?.CALLBACK_URL as string,
      passReqToCallback: true,
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        console.log(profile, "thsi si the profile");
        const email: string | undefined = profile.emails?.[0]?.value;
        const profileUrl: string | undefined = profile.photos?.[0]?.value;
        if (!email) {
          return done(
            new Error("Email is required but not provided in Google profile"),
            undefined
          );
        }
        const existingUser = await MenteeRepository.dbFindMentee(email);

        let user;
        if (existingUser) {
          user = existingUser;
        } else {
          user = await MenteeRepository.createDocument({
            name: profile.displayName,
            email,
            profileUrl,
            verified: true,
          });
        }

        return done(null, user);
      } catch (error: any) {
        return done(error, undefined);
      }
    }
  )
);

//google OAuth2 Strategy
passport.serializeUser((user: any, done: DoneCallback) => {
  done(null, user);
});

passport.deserializeUser(async (user: any, done: DoneCallback) => {
  try {
    const User = await MenteeRepository.dbFindById(user?._id);

    done(null, User);
  } catch (error) {
    done(error, null);
  }
});
export default passport;
