import express from 'express'
import dotenv from 'dotenv'
import session from 'express-session'
import connectDB from './config/database.mjs'
import passport from './config/passport.mjs'
import helmet from 'helmet'
import csrf from 'csurf'
import exphbs from 'express-handlebars'
import morgan from 'morgan'
import fs from 'fs'
import path from 'path'
import helpers from 'handlebars-helpers'
import connectFlash from 'connect-flash'
import i18n, { i18nMiddleware } from './middleware/i18n.mjs'
import cookieParser from 'cookie-parser' // Sử dụng cookie-parser để đọc cookie
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import logger from './logger.js' // Import logger của winston

import authRoutes from './routes/auth.mjs'
import declarationRoutes from './routes/declaration.mjs'
import dashboardRoutes from './routes/dashboard.mjs'
import langRoutes from './routes/lang.mjs' // Import route chuyển ngôn ngữ
import profileRouter from './routes/profile.mjs';
import { ensureAuthenticated } from './middleware/auth.mjs';
import profileRoutes from './routes/profile.mjs';
import registerRoutes from './routes/register.mjs';
import apiRoutes from './routes/api.mjs'; // Import the API routes
import residencesRoutes from './routes/residences.mjs';
import adminRoutes from './routes/admin.mjs';

// Tính toán __dirname cho ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Đọc cấu hình từ file .env
dotenv.config()

// Kết nối MongoDB
connectDB().then(() => {
  logger.info('Connected to MongoDB');
}).catch(err => {
  logger.error('Error connecting to MongoDB:', err);
});

const app = express()

// Sử dụng cookie-parser trước để có thể ọc cookie
app.use(cookieParser())

// Sử dụng middleware i18n
app.use(i18nMiddleware)

// Cấu hình Handlebars với helper `t` cho i18n
const hbs = exphbs.create({
  helpers: {
    ...helpers(), // Handlebars helpers
    t: (key, opts) => {
      // console.log(`Translating key: ${key} with options:`, opts);
      return i18n.__(key, opts);
    }, // Helper 't' for i18n
    concat: function(...args) {
      // Remove the last argument which is the options object
      return args.slice(0, -1).join('');
    },
    formatDate: function(date) {
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return new Date(date).toLocaleDateString('vi-VN', options);
    }
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
  },
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', './views')

// Bảo mật HTTP headers với Helmet
app.use(helmet())
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://cdn.jsdelivr.net'],
    },
  }),
)

// Ensure you serve static files
app.use(express.static('public'))

// Kết nối flash để hiển thị thông báo tạm thời
app.use(connectFlash())

// Body-parser để xử lý dữ liệu từ form (POST)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Cấu hình session cho việc xác thực
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret-key',
    resave: false,
    saveUninitialized: false, // Ensure this is false to avoid creating sessions for unauthenticated users
    cookie: { secure: false } // Set to true if using HTTPS
  })
);

// Passport.js để xử lý xác thực
app.use(passport.initialize())
app.use(passport.session())

// CSRF protection middleware
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Make sure to pass the CSRF token to all views
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Cung cấp token CSRF, thông báo flash, và ngôn ngữ hiện tại cho tất cả các views
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken()
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.__ = res.__
  res.locals.lng = req.cookies.lang || 'en'
  next()
})

// Tạo một write stream trong chế độ append
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), { flags: 'a' });

// Sử dụng Morgan để log các request HTTP vào console và file
app.use(morgan('combined', { stream: accessLogStream }));

// Route chuyển ngôn ngữ
app.use('/', langRoutes) // Kết nối route cho chuyển ngôn ngữ

// Đnh nghĩa cho trang root "/"
app.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/auth/login')
  }

  if (req.user.role === 'admin' || req.user.role === 'manager') {
    return res.redirect('/dashboard')
  } else if (req.user.role === 'user') {
    return res.redirect('/declaration')
  }
})

// Routes cho xác thực người dùng
app.use('/auth', authRoutes)

// Routes cho trang khai báo
app.use('/declaration', declarationRoutes)

// Routes cho trang dashboard
app.use('/dashboard', dashboardRoutes)

// Routes cho trang profile
app.use('/profile', profileRoutes);

// Routes cho trang register
app.use('/register', registerRoutes);

// Use the API routes
app.use('/api', apiRoutes);

// Routes for residence management
app.use('/residences', residencesRoutes);

// Use the admin routes
app.use('/admin', adminRoutes);

// Xử lý trang 404 (không tìm thấy route)
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' })
})

app.get('/change-lang/:lang', (req, res) => {
  const { lang } = req.params;
  res.cookie('lang', lang, { maxAge: 900000, httpOnly: true });
  res.redirect('back');
});

// Khởi động server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "script-src 'self' https://cdn.jsdelivr.net");
  next();
});

app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
});

