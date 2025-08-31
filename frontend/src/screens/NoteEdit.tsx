import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import notesService from '../services/notesService';
import type { Note } from '../services/notesService';

const NoteEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [note, setNote] = useState<Note | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/signin');
            return;
        }

        if (id) {
            loadNote(id);
        } else {
            navigate('/dashboard');
        }
    }, [id, navigate]);

    const loadNote = async (noteId: string) => {
        try {
            setLoading(true);
            setError('');
            const response = await notesService.getNote(noteId);
            
            if (response.success) {
                setNote(response.data.note);
                setTitle(response.data.note.title);
                setContent(response.data.note.content);
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to load note');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            setError('Title and content are required');
            return;
        }

        if (!note) return;

        try {
            setSaving(true);
            setError('');
            setSuccessMessage('');

            const response = await notesService.updateNote(note._id, {
                title: title.trim(),
                content: content.trim()
            });

            if (response.success) {
                setSuccessMessage('Note updated successfully!');
                // Navigate back to view page after 1 second
                setTimeout(() => {
                    navigate(`/note/${note._id}`);
                }, 1000);
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to update note');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (note) {
            navigate(`/note/${note._id}`);
        } else {
            navigate('/dashboard');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading note...</p>
                </div>
            </div>
        );
    }

    if (error && !note) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                        <p className="text-red-600">{error}</p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Dashboard</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={handleCancel}
                        className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Cancel</span>
                    </button>
                    
                    <h1 className="text-2xl font-bold text-gray-900">Edit Note</h1>
                    
                    <div className="flex items-center space-x-3">
                        {/* <button
                            onClick={handleCancel}
                            disabled={saving}
                            className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                        </button> */}
                        
                        <button
                            onClick={handleSave}
                            disabled={saving || !title.trim() || !content.trim()}
                            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            <span>{saving ? 'Saving...' : 'Save'}</span>
                        </button>
                    </div>
                </div>

                {/* Messages */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                        <p className="text-green-600">{successMessage}</p>
                    </div>
                )}

                {/* Edit Form */}
                <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                    {/* Title Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter note title..."
                            maxLength={200}
                            disabled={saving}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold disabled:opacity-50 disabled:bg-gray-50"
                            autoFocus
                        />
                        <div className="text-right text-xs text-gray-500 mt-1">
                            {title.length}/200 characters
                        </div>
                    </div>

                    {/* Content Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Content
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your note content..."
                            maxLength={10000}
                            rows={15}
                            disabled={saving}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg leading-relaxed resize-vertical disabled:opacity-50 disabled:bg-gray-50"
                        />
                        <div className="text-right text-xs text-gray-500 mt-1">
                            {content.length}/10,000 characters
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteEdit;
