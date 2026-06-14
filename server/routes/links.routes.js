const express = require('express');
const router = express.Router();
const linksController = require('../controllers/links.controller');
const voteController = require('../controllers/vote.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', linksController.getAll);
router.get('/:id(\\d+)', linksController.getOne);
router.post('/', authMiddleware, linksController.submit);
router.post('/:id/vote', authMiddleware, voteController.castVote);

module.exports = router;
