const express = require('express');
const Blog = require('../model/blog');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

// Create a Blog
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, tags, body } = req.body;
    const author = req.userId; // Get the logged-in user's ID
    const blog = new Blog({ title, description, tags, body, author });
    await blog.save();
    res.status(201).json({ message: 'Blog created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a Blog
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, body, state } = req.body;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    if (blog.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    blog.title = title;
    blog.description = description;
    blog.tags = tags;
    blog.body = body;
    if (state && state === 'published' && blog.state === 'draft') {
      blog.state = 'published';
    }
    await blog.save();
    res.status(200).json({ message: 'Blog updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a Blog
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    if (blog.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await blog.remove();
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get All Blogs (Published)
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ state: 'published' }).populate('author', 'first_name last_name');
    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

