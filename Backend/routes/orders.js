// backend/routes/products.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Orders API is working!');
});

module.exports = router;
