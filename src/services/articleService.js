const Article = require('../models/Article');


async function getAllArticles() {
    return Article.find().populate('author', 'username email role');
}

async function getArticleById(id) {
    return Article.findById(id).populate('author', 'username email role');
}

async function createArticle(data, userId) {
    const newArticle = new Article({ ...data, author: userId });
    return newArticle.save();
}

async function updateArticle(id, data, user) {
    const article = await Article.findById(id);
    if (!article) throw { status: 404, message: 'Article not found' };

    if (!(user.role === 'Admin' || user.role === 'Editeur' ||
        (user.role === 'Redacteur' && article.author.equals(user._id)))) {
        throw { status: 403, message: 'Access denied' };
    }

    Object.assign(article, data);
    return article.save();
}

async function deleteArticle(id) {
    const deleted = await Article.findByIdAndDelete(id);
    if (!deleted) throw { status: 404, message: 'Article not found' };
    return deleted;
}


async function getArticleStats() {
    try {
        const stats = await Article.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        return stats;
    } catch (err) {
        throw new Error('Error fetching article stats: ' + err.message);
    }
}



module.exports = {
    getArticleStats,
    getAllArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,

};
