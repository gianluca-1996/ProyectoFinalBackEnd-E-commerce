const passport = require('passport');
const local = require('passport-local');
const userModel = require('../Dao/Models/user.model.js');
const bcrypt = require('bcrypt');

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

            const matchPassword = await bcrypt.compare(password, user.password);
            if(!matchPassword) return done('Contraseña incorrecta');
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

module.exports = initializePassport;