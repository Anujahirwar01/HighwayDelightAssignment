import { Response } from 'express';
const { validationResult } = require('express-validator');
import Note from '../models/notes.model';
import { AuthRequest } from '../middleware/auth';

// Get all notes for authenticated user
export const getNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Get notes with pagination
    const notes = await Note.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Note.countDocuments({ userId });
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        notes,
        pagination: {
          currentPage: page,
          totalPages,
          totalNotes: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notes'
    });
  }
};

// Create a new note
export const createNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { title, content } = req.body;
    const userId = req.user!._id;

    const note = await Note.create({
      title,
      content,
      userId
    });

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: { note }
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating note'
    });
  }
};

// Update a note
export const updateNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user!._id;

    const note = await Note.findOneAndUpdate(
      { _id: id, userId },
      { title, content },
      { new: true, runValidators: true }
    );

    if (!note) {
      res.status(404).json({
        success: false,
        message: 'Note not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      data: { note }
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating note'
    });
  }
};

// Delete a note
export const deleteNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    const note = await Note.findOneAndDelete({ _id: id, userId });

    if (!note) {
      res.status(404).json({
        success: false,
        message: 'Note not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting note'
    });
  }
};

// Get a single note
export const getNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    const note = await Note.findOne({ _id: id, userId });

    if (!note) {
      res.status(404).json({
        success: false,
        message: 'Note not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { note }
    });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching note'
    });
  }
};