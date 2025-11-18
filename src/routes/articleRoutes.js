const express = require('express');
const router = express.Router();
const { auth, authorizeRoles } = require('../middlewares/auth');
const { getAllArticles, createArticle, updateArticle, deleteArticle ,getStats} = require('../controllers/articleController');
const { addComment, getComments } = require("../controllers/commentController");

router.get('/', auth, getAllArticles);


router.post('/', auth, authorizeRoles('Admin', 'Reader', 'Writer'), createArticle);
router.put('/:id', auth, updateArticle);
router.delete('/:id', auth, authorizeRoles('Admin'), deleteArticle);



router.get("/:articleId/comments", auth, authorizeRoles('Admin', 'Editor', 'Writer', 'Reader'), getComments);


router.post("/:articleId/comments", auth, authorizeRoles('Admin', 'Editor', 'Writer', 'Reader'), addComment);


router.get('/stats', auth,  authorizeRoles('Admin', 'Editor', 'Writer', 'Reader'),getStats);
module.exports = router;
