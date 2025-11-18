
const articleService = require('../services/articleService');

exports.getAllArticles = async (req, res) => {
    try {
        const articles = await articleService.getAllArticles();
        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getArticle = async (req, res) => {
    try {
        const article = await articleService.getArticleById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });
        res.json(article);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createArticle = async (req, res) => {
    try {
        const saved = await articleService.createArticle(req.body, req.user._id);
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateArticle = async (req, res) => {
    try {
        const updated = await articleService.updateArticle(req.params.id, req.body, req.user);
        res.json(updated);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

exports.deleteArticle = async (req, res) => {
    try {
        await articleService.deleteArticle(req.params.id);
        res.json({ message: 'Article deleted' });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

exports.getStats = async (req, res) => {
    try {
        const stats = await articleService.getArticleStats();
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
