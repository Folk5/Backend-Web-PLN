const express = require('express');
const router = express.Router();

router.put('/test-body', (req, res) => {
  console.log('Received body:', req.body);
  res.json({ received: req.body });
});

module.exports = router;
