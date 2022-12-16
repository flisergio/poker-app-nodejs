import express from 'express'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import { Strategy } from 'passport-jwt'
import jwt from 'jsonwebtoken'

import users from '../auth/users.js'

const secret = '5up3r-s3cr3t-p0k3r-g4m3'

const options = {
  jwtFromRequest: req => req?.cookies?.jwt,
  secretOrKey: secret
}
passport.use(new Strategy(options, ({ user_id }, done) => {
  const user = users.find(user => user.id === user_id)
  if (!user) {
    done(null, false, { message: 'Incorrect username or password.' })
  } else {
    done(null, user)
  }
}))

export default () => {
  const router = express.Router()

  router.use(cookieParser())

  router.use(passport.initialize())

  router.post('/login', express.json(), ({ body: { username, password } }, res, next) => {
    const user = users.find(user => user.id === username && user.password === password)
    if (user) {
      const { id, name } = user
      const token = jwt.sign({
        user_id: id,
        user_name: name
      }, secret)
      res
        .status(200)
        .cookie('jwt', token)
        .end()
    } else {
      res
        .status(401)
        .send('Login failed')
    }
  })

  router.use(passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/login'
  }))

  router.use((req, res, next) => {
    if (!req.isAuthenticated()) {
      res.redirect('/login') // REVISE: *all* requests will be redirected to login page
    } else {
      next()
    }
  })

  return router
}
