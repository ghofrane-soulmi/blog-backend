const request = require('supertest');
const app = require('../src/server');
const User = require('../src/models/User');
const Article = require('../src/models/Article');
const loginUser = require('../src/utils/loginHelper');

describe('Permissions based on roles', () => {
    let adminToken, editorToken, writerToken;
    let articleByWriterId, articleByEditorId;

    beforeAll(async () => {

        await User.deleteMany({ email: /@example\.com$/ });
        await Article.deleteMany({ title: /Test Article/ });

        const admin = await User.create({ name: 'Admin', email: 'admin@example.com', password: 'adminpass', role: 'Admin' });
        const editor = await User.create({ name: 'Editor', email: 'editor@example.com', password: 'editorpass', role: 'Editor' });
        const writer = await User.create({ name: 'Writer', email: 'writer@example.com', password: 'writerpass', role: 'Writer' });


        adminToken = (await loginUser('admin@example.com', 'adminpass')).tokens.accessToken;
        editorToken = (await loginUser('editor@example.com', 'editorpass')).tokens.accessToken;
        writerToken = (await loginUser('writer@example.com', 'writerpass')).tokens.accessToken;


        const articleByWriter = await Article.create({ title: 'Test Article Writer', content: 'Content', author: writer._id });
        const articleByEditor = await Article.create({ title: 'Test Article Editor', content: 'Content', author: editor._id });

        articleByWriterId = articleByWriter._id;
        articleByEditorId = articleByEditor._id;
    });

    // ---------------- Modification des articles ----------------

    test('Editor can modify any article', async () => {
        const res = await request(app)
            .put(`/api/articles/${articleByWriterId}`)
            .send({ title: 'Updated by Editor' })
            .set('Authorization', `Bearer ${editorToken}`);

        expect(res.statusCode).toBe(200);
    });

    test('Admin can modify any article', async () => {
        const res = await request(app)
            .put(`/api/articles/${articleByEditorId}`)
            .send({ title: 'Updated by Admin' })
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
    });

    test('Writer can modify only own article', async () => {

        let res = await request(app)
            .put(`/api/articles/${articleByWriterId}`)
            .send({ title: 'Updated by Writer' })
            .set('Authorization', `Bearer ${writerToken}`);
        expect(res.statusCode).toBe(200);


        res = await request(app)
            .put(`/api/articles/${articleByEditorId}`)
            .send({ title: 'Attempted by Writer' })
            .set('Authorization', `Bearer ${writerToken}`);
        expect(res.statusCode).toBe(403);
    });

    // ---------------- Suppression des articles ----------------

    test('Admin can delete any article', async () => {
        const res = await request(app)
            .delete(`/api/articles/${articleByWriterId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toBe(200);
    });

    test('Editor cannot delete article', async () => {
        const res = await request(app)
            .delete(`/api/articles/${articleByEditorId}`)
            .set('Authorization', `Bearer ${editorToken}`);
        expect(res.statusCode).toBe(403);
    });

    test('Writer cannot delete article', async () => {
        const res = await request(app)
            .delete(`/api/articles/${articleByEditorId}`)
            .set('Authorization', `Bearer ${writerToken}`);
        expect(res.statusCode).toBe(403);
    });

    afterAll(async () => {
        await User.deleteMany({ email: /@example\.com$/ });
        await Article.deleteMany({ title: /Test Article/ });
    });
});
