const express = require('express');
const router = express.Router();
const authMiddleware = require('../utils/authMiddleware');
const todoController = require('../controllers/todoController');

router.post('/', authMiddleware, todoController.createTodo);
router.get('/', authMiddleware, todoController.getTodos);
router.put('/:id', authMiddleware, todoController.updateTodo);
router.delete('/:id', authMiddleware, todoController.deleteTodo);

module.exports = router; 