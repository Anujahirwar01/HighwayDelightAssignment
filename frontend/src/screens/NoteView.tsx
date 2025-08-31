import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3 } from 'lucide-react';
import notesService from '../services/notesService';
import type { Note } from '../services/notesService';

const NoteView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [note, setNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to load note');
        } finally {
            setLoading(false);
        }
    };

    // const formatDate = (dateString: string) => {
    //     const date = new Date(dateString);
    //     return date.toLocaleDateString('en-US', {
    //         year: 'numeric',
    //         month: 'long',
    //         day: 'numeric',
    //         hour: '2-digit',
    //         minute: '2-digit'
    //     });
    // };

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

    if (error || !note) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                        <p className="text-red-600">{error || 'Note not found'}</p>
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
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Dashboard</span>
                    </button>
                    
                    <button
                        onClick={() => navigate(`/note/${note._id}/edit`)}
                        className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit Note</span>
                    </button>
                </div>

                {/* Note Content */}
                <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {note.title}
                    </h1>
                    
                    {/* Metadata */}
                    {/* <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6 pb-4 border-b border-gray-100">
                        <span>Created: {formatDate(note.createdAt)}</span>
                        {note.updatedAt !== note.createdAt && (
                            <span>Updated: {formatDate(note.updatedAt)}</span>
                        )}
                    </div> */}
                    
                    {/* Content */}
                    <div className="prose max-w-none">
                        <div 
                            className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg"
                            style={{ lineHeight: '1.7' }}
                        >
                            {note.content}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteView;
