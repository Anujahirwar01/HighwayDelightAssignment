import express from 'express';
const { body, param } = require('express-validator');
import { getNotes, createNote, updateNote, deleteNote, getNote } from '../controllers/notes.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

// Validation rules
const noteValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 10000 })
    .withMessage('Content cannot exceed 10,000 characters')
];

const noteIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid note ID')
];

// All routes are protected (require authentication)
router.use(protect);

// Routes
router.route('/')
  .get(getNotes)
  .post(noteValidation, createNote);

router.route('/:id')
  .get(noteIdValidation, getNote)
  .put([...noteIdValidation, ...noteValidation], updateNote)
  .delete(noteIdValidation, deleteNote);

export default router;