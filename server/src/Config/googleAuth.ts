import { Request } from "express";
import passport, { Profile, DoneCallback } from "passport";
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth20";
import menteeRepository from "../Repository/menteeRepository";
import "express-session";
import { Imentee } from "../Model/menteeModel";

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
        const email: string | undefined = profile.emails?.[0]?.value;
        const profileUrl: string | undefined = profile.photos?.[0]?.value;
        const name: string = profile?.displayName || "Unnamed User";
        if (!email) {

          return done(
            new Error("Email is required but not provided in Google profile"),
            undefined
          );

        }
        const existingUser = await menteeRepository.findMentee(email);


        if (existingUser && existingUser.provider === "email") {

          return done(null, false, { message: "This email is already registered with a different provider" });

        }

        let user;
        if (existingUser) {
          user = existingUser;
        } else {
          user = (await menteeRepository.createDocument({
            name,
            email,
            profileUrl,
            verified: true,
            provider: 'google'
          })) as Imentee;
        }

        return done(null, user);
      } catch (error: unknown) {
        return done(error, undefined);
      }
    }
  )
);

//google OAuth2 Strategy
passport.serializeUser((user: Express.User, done: DoneCallback) => {
  done(null, user);
});

passport.deserializeUser(async (user: Imentee, done: DoneCallback) => {
  try {
    if (!user?._id) {
      throw new Error("User ID is missing during deserialization.");
    }
    const User = await menteeRepository.findById(user?._id as string);

    done(null, User);
  } catch (error) {
    done(error, null);
  }
});
export default passport;
