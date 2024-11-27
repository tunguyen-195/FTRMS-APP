import express from 'express';

const router = express.Router();

// Route để thay đổi ngôn ngữ
router.get('/change-lang/:lang', (req, res) => {
  const newLang = req.params.lang;
  if (['en', 'vi'].includes(newLang)) {
    res.cookie('lang', newLang, { maxAge: 900000, httpOnly: true });
    req.setLocale(newLang);
    logger.info(`Language changed to: ${newLang}`);
  } else {
    logger.warn(`Invalid language requested: ${newLang}`);
  }
  const referrer = req.get('Referrer') || '/';
  res.redirect(referrer);
});

export default router;
