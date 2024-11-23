import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcryptjs'
import User from '../models/User.mjs'

// Passport local strategy
passport.use(
  new LocalStrategy({ usernameField: 'username' }, async (username, password, done) => {
    try {
      // Tìm kiếm người dùng dựa trên username
      const user = await User.findOne({ username })
      if (!user) {
        return done(null, false, { message: 'User not found' })
      }

      // Kiểm tra mật khẩu
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password' })
      }

      // Đăng nhập thành công, trả về thông tin người dùng
      return done(null, user)
    } catch (err) {
      return done(err)
    }
  }),
)

// Cấu hình Passport để lưu trữ thông tin người dùng trong session
passport.serializeUser((user, done) => {
  done(null, user.id)
})

// Tìm kiếm người dùng dựa trên ID khi lấy từ session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

export default passport
