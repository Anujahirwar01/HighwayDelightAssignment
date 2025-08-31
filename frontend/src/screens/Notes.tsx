import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import notesService from '../services/notesService';

const Notes: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Load notes on component mount
    useEffect(() => {
        loadNotes();
    }, []);

    // Check authentication
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/signin');
        }
    }, [navigate]);

    const loadNotes = async () => {
        // This function is kept for future use but doesn't do anything now
        // since we're not displaying notes list in this component
    };

    const createNote = async () => {
        if (!title.trim() || !content.trim()) {
            setError('Title and content are required');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccessMessage('');

            const response = await notesService.createNote({
                title: title.trim(),
                content: content.trim()
            });

            if (response.success) {
                setSuccessMessage('Note created successfully!');
                setTitle('');
                setContent('');
                // Navigate to dashboard immediately
                navigate('/dashboard');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to create note');
        } finally {
            setLoading(false);
        }
    };

    // const formatDate = (dateString: string) => {
    //     const date = new Date(dateString);
    //     return date.toLocaleDateString('en-US', {
    //         year: 'numeric',
    //         month: 'short',
    //         day: 'numeric',
    //         hour: '2-digit',
    //         minute: '2-digit'
    //     });
    // };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                {/* <h1>Notes</h1> */}
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                        padding: '8px 16px',
                        // backgroundColor: '#6c757d',
                        color: '#007bff',
                        border: 'none',
                        // borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Back to Dashboard
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div style={{
                    marginBottom: '20px',
                    padding: '10px',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    border: '1px solid #f5c6cb',
                    borderRadius: '4px'
                }}>
                    {error}
                </div>
            )}

            {/* Success Message */}
            {successMessage && (
                <div style={{
                    marginBottom: '20px',
                    padding: '10px',
                    backgroundColor: '#d4edda',
                    color: '#155724',
                    border: '1px solid #c3e6cb',
                    borderRadius: '4px'
                }}>
                    {successMessage}
                </div>
            )}
            
            {/* Create Note Form */}
            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h2>Create New Note</h2>
                <input
                    type="text"
                    placeholder="Note title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={200}
                    disabled={loading}
                    style={{ 
                        width: '100%', 
                        padding: '10px', 
                        marginBottom: '10px', 
                        border: '1px solid #ccc', 
                        borderRadius: '4px',
                        opacity: loading ? 0.7 : 1
                    }}
                />
                <div style={{ textAlign: 'right', fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                    {title.length}/200 characters
                </div>
                <textarea
                    placeholder="Note content..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={10000}
                    rows={6}
                    disabled={loading}
                    style={{ 
                        width: '100%', 
                        padding: '10px', 
                        marginBottom: '10px', 
                        border: '1px solid #ccc', 
                        borderRadius: '4px',
                        resize: 'vertical',
                        opacity: loading ? 0.7 : 1
                    }}
                />
                <div style={{ textAlign: 'right', fontSize: '12px', color: '#666', marginBottom: '15px' }}>
                    {content.length}/10,000 characters
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={createNote}
                        disabled={loading || !title.trim() || !content.trim()}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            marginLeft: '85px',
                            border: 'none',
                            borderRadius: '2px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: (loading || !title.trim() || !content.trim()) ? 0.6 : 1,
                            textDecoration: 'none'
                        }}
                    >
                        {loading ? 'Creating...' : 'Create Note'}
                    </button>
                    {/* <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Back to Dashboard
                    </button> */}
                </div>
            </div>

            {/* Notes List */}
            {/* <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h2>Your Notes ({notes.length})</h2>
                    {loadingNotes && (
                        <div style={{ fontSize: '14px', color: '#666' }}>Loading notes...</div>
                    )}
                </div>
                
                {loadingNotes ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                        <div>Loading your notes...</div>
                    </div>
                ) : notes.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                        No notes yet. Create your first note above!
                    </p>
                ) : (
                    notes.map((note) => (
                        <div
                            key={note._id}
                            style={{
                                marginBottom: '15px',
                                padding: '15px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                backgroundColor: '#f9f9f9'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                <h3 style={{ margin: '0', flex: 1 }}>{note.title}</h3>
                            </div>
                            <p style={{ margin: '0 0 10px 0', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                                {note.content}
                            </p>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                                <div>Created: {formatDate(note.createdAt)}</div>
                                {note.updatedAt !== note.createdAt && (
                                    <div>Updated: {formatDate(note.updatedAt)}</div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div> */}
        </div>
    );
};

export default Notes;