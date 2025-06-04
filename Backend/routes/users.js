// backend/routes/products.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Users API is working!');
});

module.exports = router;
