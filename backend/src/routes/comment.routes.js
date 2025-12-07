const express = require('express');
const authRequired = require('../middleware/auth');
const commentController = require('../controllers/comment.controller');

const router = express.Router();

router.use(authRequired);

router.get('/task/:taskId', commentController.listComments);
router.post('/task/:taskId', commentController.createComment);
router.put('/:commentId', commentController.updateComment);
router.delete('/:commentId', commentController.deleteComment);

module.exports = router;

