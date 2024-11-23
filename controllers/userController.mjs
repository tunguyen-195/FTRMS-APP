import bcrypt from 'bcryptjs'
import passport from 'passport'
import User from '../models/User.mjs'

// Hiển thị form đăng nhập
export const showLoginForm = (req, res) => {
  res.render('login', { title: 'Login' })
}

// Đăng nhập người dùng
export const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err) // Nếu có lỗi, chuyển đến middleware xử lý lỗi
    }
    if (!user) {
      req.flash('error_msg', info.message) // Flash thông báo lỗi nếu không tìm thấy user
      return res.redirect('/auth/login') // Chuyển hướng đến trang đăng nhập
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err) // Nếu lỗi khi đăng nhập, chuyển đến middleware xử lý lỗi
      }
      // Flash thông báo thành công khi đăng nhập
      req.flash('success_msg', `Welcome, ${user.username}`)

      // Chuyển hướng dựa trên role của người dùng
      if (user.role === 'admin' || user.role === 'manager') {
        return res.redirect('/dashboard')
      }
      return res.redirect('/declaration')
    })
  })(req, res, next)
}

// Hiển thị form đăng ký
export const showRegisterForm = (req, res) => {
  res.render('register', { title: 'Register' })
}

// Xử lý đăng ký người dùng
export const register = async (req, res) => {
  const { username, password, role, officer_id } = req.body

  try {
    let user = await User.findOne({ username })
    if (user) {
      req.flash('error_msg', 'User already exists') // Flash thông báo lỗi khi user đã tồn tại
      return res.redirect('/auth/register')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    user = new User({
      username,
      password: hashedPassword,
      role,
      officer_id,
    })

    await user.save()
    req.flash('success_msg', 'You are now registered and can log in') // Flash thông báo thành công khi đăng ký thành công
    res.redirect('/auth/login')
  } catch (error) {
    console.error(error)
    req.flash('error_msg', 'Something went wrong. Please try again.')
    res.status(500).send('Server Error')
  }
}

// Đăng xuất người dùng
export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err) // Xử lý lỗi nếu có khi đăng xuất
    }
    req.flash('success_msg', 'You are logged out') // Flash thông báo thành công khi đăng xuất
    res.redirect('/auth/login')
  })
}
