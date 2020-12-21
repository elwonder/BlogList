const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./blog_helper');

beforeEach(async () => {
    await Blog.deleteMany({});

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog));
        const promiseArray = blogObjects.map(blog => blog.save());
        await Promise.all(promiseArray);
})

const api = supertest(app);

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);

});

test('blogsInDb working correctly', async () => {
    const blogs = await helper.blogsInDb();
    expect(blogs.length).toBe(helper.initialBlogs.length);
})

test('id is id but not _id', async () => {
    const blogs = await helper.blogsInDb();
    expect(blogs[0].id).toBeDefined();
})

test('posting blog working correct', async () => {

    const newBlog = {
        title: 'How To Talk With Psycho',
        author: 'Dmitry Issaykin',
        url: 'localhost',
        likes: 12
    };

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);
    
    const response = await api.get('/api/blogs');

    const titles = response.body.map(r => r.title);

    expect(titles).toHaveLength(helper.initialBlogs.length + 1);
    expect(titles).toContain(
        'How To Talk With Psycho',
    );
});

test('likes setting to 0 by default', async () => {
    const newBlog = {
        title: 'How to manage life',
        author: 'Dmitry Issaykin',
        url: 'localhost:8080/how_to_manage_life.html',
    }

    await api  
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);
    
    const response = await api.get('/api/blogs');

    const blog = response.body.find(x => x.title === newBlog.title);
    expect(blog.likes).toBe(0);
})

 test('creating blog with empty parameters causeing error', async () => {
    const newBlog = {
        author: 'Dmitry Issaykin',
    };

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400);

}) 

test('delete blog', async() => {
    const blogs = await helper.blogsInDb();
    const id = blogs[0].id;

    await api
        .delete(`/api/blogs/${id}`)
        .expect(204);

    const blogsAfterDeletion = await helper.blogsInDb();

    expect(blogsAfterDeletion).toHaveLength(blogs.length - 1);

})

test('update blog', async () => {
    const blogs = await helper.blogsInDb();
    const id = blogs[0].id;

    const newBlog = {
        title: blogs[0].title,
        author: blogs[0].author,
        url: blogs[0].url,
        likes: 100,
    }

    await api
        .put(`/api/blogs/${id}`)
        .send(newBlog)
        .expect(200);

    const blogsAfterUpdate = await helper.blogsInDb();

    const modifiedBlog = blogsAfterUpdate.find(x => x.title = newBlog.title);

    expect(modifiedBlog.likes).toBe(100);
})

afterAll(() => {
    mongoose.connection.close();
});