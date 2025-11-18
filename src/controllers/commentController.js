const Comment = require("../models/Comment");
const Article = require("../models/Article"); // Assuming you have an Article model
const { emitNewComment, getIO } = require("../socket");
const { createNotification } = require("./notificationController");
const { sendPushNotification } = require("../push");

function buildTree(comments) {
    const map = {};
    const roots = [];
    comments.forEach(c => {
        c.children = [];
        map[c._id.toString()] = c;
    });
    comments.forEach(c => {
        if (c.parent) map[c.parent.toString()].children.push(c);
        else roots.push(c);
    });
    return roots;
}

exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ article: req.params.articleId })
            .populate("author", "name email")
            .lean();
        res.json(buildTree(comments));
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};
exports.addComment = async (req, res) => {
    try {
        const { text, parent } = req.body;

        if (!text || text.trim() === "") {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const comment = new Comment({
            text,
            parent: parent || null,
            article: req.params.articleId,
            author: req.user.id,
        });
        const saved = await comment.save();
        const clean = await Comment.findById(saved._id)
            .populate("author", "name email")
            .lean();

        const article = await Article.findById(req.params.articleId).populate("author");
        if (article && article.author) {
            const authorId = article.author._id?.toString();
            if (authorId && authorId !== req.user.id) {
                const userName = req.user.name || 'Someone'; // fallback name
                await createNotification({
                    userId: article.author._id,
                    message: `${userName} commented on your article`,
                    articleId: req.params.articleId,
                    commentId: clean._id,
                });

                if (article.author.pushSubscription) {
                    sendPushNotification(article.author.pushSubscription, {
                        title: "New Comment",
                        body: `${userName} commented on your article`,
                        url: `http://localhost:4200/article/${req.params.articleId}`,
                    }).catch(console.error);
                }
            }
        } else {
            console.warn(`Article or author not found for articleId: ${req.params.articleId}`);
        }

        emitNewComment(req.params.articleId, clean);

        res.json(clean);

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e.message });
    }
};



