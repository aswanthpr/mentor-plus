import { Request } from 'express';
import passport, { Profile, DoneCallback } from 'passport';
import { Strategy as GoogleStrategy, VerifyCallback } from "passport-google-oauth20";
import MenteeRepository from '../REPOSITORY/MenteeRepository';

interface IGoogleProfile {
    emails?: { value: string }[];
    photos?: { value: string }[];
    name?: { givenName: string };
}

//google OAuth2 Strategy
passport.serializeUser((user: any, done: DoneCallback) => {
    done(null, user)
});

passport.deserializeUser((user: any, done: DoneCallback) => {
    done(null, user)
});
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env?.GOOGLE_CLIENT_ID,
            clientSecret: process?.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env?.CALLBACK_URL,
            passReqToCallback: true,
            scope: ['profile', 'email'],
        },
        async (req: Request,
            accessToken: string,
            refreshToken: string,
            profile: any,
            done: VerifyCallback) => {
                try{
            const existingUser = await MenteeRepository.dbFindMentee(profile.email[0].value);
            if (!existingUser) {
                const newUser = await MenteeRepository.createDocument({
                    name: profile.displayName,
                    email: profile.email[0].value,
                    profileUrl: profile.photos[0].value,
                    verified: true
                })
                await newUser.save();
                done(null,newUser);
            }
        }catch(error:any){
                done(null,error)
            }

            return done(null, profile);
        }))


export default passport;