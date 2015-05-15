let passport = require('passport')
// let LocalStrategy = require('passport-local').Strategy
let FacebookStrategy = require('passport-facebook').Strategy
let nodeifyit = require('nodeifyit')
let User = require('../models/user')
//TODO: load from indexjs and pass in from function instead
let config = require('../../config/auth').dev

console.log(">< config", config)

require('songbird')

function useExternalPassportStrategy(OauthStrategy, config, accountType) {
    config.passReqToCallback = true
    passport.use(new OauthStrategy(config, nodeifyit(authCB, {spread: true})))
    console.log(">< facebook strategy")

    async function authCB(req, token, _ignored_, account) {
      console.log(">< account id", account.id)
        // Your generic 3rd-party passport strategy implementation here
    }
}


function configure() {
  // console.log(">< config", config)
  // Required for session support / persistent login sessions
  passport.serializeUser(nodeifyit(async (user) => user.id))
  passport.deserializeUser(nodeifyit(async (id) => {
    return await User.promise.findById(id)
  }))


  useExternalPassportStrategy(FacebookStrategy, {
      clientID: config.facebook.consumerKey,
      clientSecret: config.facebook.consumerSecret,
      callbackURL: config.facebook.callbackUrl
  }, 'facebook')


  // useExternalPassportStrategy(LinkedInStrategy, {...}, 'linkedin')
  // useExternalPassportStrategy(LinkedInStrategy, {...}, 'facebook')
  // useExternalPassportStrategy(LinkedInStrategy, {...}, 'google')
  // useExternalPassportStrategy(LinkedInStrategy, {...}, 'twitter')
  // passport.use('local-login', new LocalStrategy({...}, (req, email, password, callback) => {...}))
  // passport.use('local-signup', new LocalStrategy({...}, (req, email, password, callback) => {...}))

  return passport
}


// passport.use('local-login', new LocalStrategy({
//        // ...
//    }, nodeifyit(async (req, email, password) => {
//        // ...
//    }, {spread: true}))

// passport.use('local-signup', new LocalStrategy({
//        // ...
//    }, nodeifyit(async (req, email, password) => {
//        // ...
//    }, {spread: true}))


module.exports = {passport, configure}
