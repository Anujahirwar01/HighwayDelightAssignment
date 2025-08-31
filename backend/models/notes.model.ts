import mongoose, { Document, Schema, Types } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better performance
NoteSchema.index({ userId: 1, createdAt: -1 });

const Note = mongoose.model<INote>('Note', NoteSchema);

export default Note;