import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import rateLimit from 'express-rate-limit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
// Render sits behind a proxy, so trust one hop to see the real client IP.
app.set('trust proxy', 1);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many attempts. Try again in 15 minutes.',
});

const PORT = process.env.PORT || 3000;

const SITE_PASSWORD = process.env.SITE_PASSWORD;
const COOKIE_SECRET = process.env.COOKIE_SECRET;

if (!SITE_PASSWORD || !COOKIE_SECRET) {
  console.error('SITE_PASSWORD and COOKIE_SECRET must be set as environment variables.');
  process.exit(1);
}

const isProduction = process.env.NODE_ENV === 'production';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(COOKIE_SECRET));

// Login page and its form submission are public 
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', loginLimiter, (req, res) => {
  const { password } = req.body;

  if (password === SITE_PASSWORD) {
    res.cookie('sipcount_auth', 'ok', {
      httpOnly: true,
      signed: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: ONE_DAY_MS,
    });
    return res.redirect('/');
  }

  res.redirect('/login?error=1');
});

app.get('/sipcountlogo.svg', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sipcountlogo.svg'));
});

// Everything below this line requires the signed cookie set above.
function requireAuth(req, res, next) {
  if (req.signedCookies.sipcount_auth === 'ok') {
    return next();
  }
  res.redirect('/login');
}

app.use(requireAuth);

const distPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => console.log(`SipCount listening on port ${PORT}`));