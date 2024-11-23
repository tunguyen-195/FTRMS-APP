// Middleware kiểm tra người dùng đã đăng nhập hay chưa
export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Please log in to view this resource');
  res.redirect('/auth/login');
}

// Middleware kiểm tra người dùng có phải là admin hoặc manager không
export function ensureAdminOrManager(req, res, next) {
  if (req.isAuthenticated() && (req.user.role === 'admin' || req.user.role === 'manager')) {
    return next()
  }
  req.flash('error_msg', 'Access denied. Admins or Managers only.')
  res.redirect('/auth/login')
}

// Middleware chuyển hướng nếu người dùng đã đăng nhập (không cần vào lại trang login)
export function forwardAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next()
  }
  // Điều hướng người dùng dựa vào vai trò sau khi đăng nhập
  if (req.user.role === 'admin' || req.user.role === 'manager') {
    res.redirect('/dashboard')
  } else {
    res.redirect('/declaration')
  }
}

