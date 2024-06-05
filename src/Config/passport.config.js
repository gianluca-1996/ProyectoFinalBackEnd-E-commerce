const passport = require('passport');
const local = require('passport-local');
const GitHubStrategy = require('passport-github2');
const userModel = require('../Dao/Models/user.model.js');
const bcrypt = require('bcrypt');

//ESTRATEGIA LOCAL DE PASSPORT
const LocalStrategy = local.Strategy;
const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField: 'email'}, async (req, username, password, done) => {
            const {firstName, lastName, email, age, role} = req.body;
            try {
                const user = await userModel.findOne({email: username});

                if(user){
                    return done('El usuario ya existe');
                }

                const passEncrypted = bcrypt.hash(password, 2);
                const newUser = {
                    _id: user._id,
                    firstName,
                    lastName,
                    email,
                    age,
                    role,
                    password: passEncrypted
                }

                const result = await userModel.create(newUser);

                return done(null, result);
            } catch (error) {
                return done(error);
            }
        }
    ))

    passport.use('login', new LocalStrategy({usernameField: 'email'}, async (username, password, done) => {
        try {
            const user = await userModel.findOne({email: username});
            if(!user){
                return done('El usuario no existe');
            }

            if(user.password){
                const matchPassword = bcrypt.compare(password, user.password);
                if(!matchPassword) return done('Contraseña incorrecta');
            }
            else return done('Contraseña incorrecta');
            
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id)
        done(null, user)
    })
}

//ESTRATEGIA PASSPORT-GITHUB
const initializePassportGithub = () => {

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv23liFnga3SgPr4FAFr',
        clientSecret: '6726d15c05f82fc08f4209355940d3f7b6c00cca',
        callbackURL: 'http://localhost:8080/api/session/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            const user = await userModel.findOne({email: profile._json.email});
            if(!user){
                const newUser = {
                    firstName: profile._json.name,
                    lastName: ' ',
                    email: profile._json.email,
                    age: 18,
                    role: 'user'
                }

                const result = await userModel.create(newUser);
                done(null, result);
            }
            else{ done(null, user) }
        } catch (error) {
            return done(error);
        }
    }))

    passport.serializeUser((user, done) => { done(null, user._id) })

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    })
}

module.exports = {initializePassport, initializePassportGithub};