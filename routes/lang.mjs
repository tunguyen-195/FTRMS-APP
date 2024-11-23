import express from 'express';

const router = express.Router();

// Route để thay đổi ngôn ngữ
router.get('/change-lang/:lang', (req, res) => {
  const newLang = req.params.lang;
  console.log(`===> Requested language change to: ${newLang}`);
  if (['en', 'vi'].includes(newLang)) {
    res.cookie('lang', newLang, { maxAge: 900000, httpOnly: true });
    req.setLocale(newLang);
  }
    // console.log(`Cookie 'lang' set to: ${newLang}`);
  // } else {
  //   console.log(`Invalid language requested: ${newLang}`);
  // }
  const referrer = req.get('Referrer') || '/';
  res.redirect(referrer); // Redirect về trang trước đó hoặc trang chủ
});

export default router;
