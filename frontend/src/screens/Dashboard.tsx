import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import notesService from '../services/notesService';

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  name: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notesLoading, setNotesLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (!token || !userData) {
      // No token or user data, redirect to login
      navigate('/signin');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setLoading(false);
      
      // Fetch notes after user data is loaded
      fetchNotes();
    } catch {
      // Invalid user data, redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      navigate('/signin');
    }
  }, [navigate]);

  // Refresh notes when component becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        fetchNotes();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  const fetchNotes = async () => {
    try {
      setNotesLoading(true);
      setError('');
      const response = await notesService.getNotes(1, 50);
      
      if (response.success) {
        setNotes(response.data.notes);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError('Failed to load notes');
    } finally {
      setNotesLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: string, noteTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${noteTitle}"?`)) {
      return;
    }

    try {
      await notesService.deleteNote(noteId);
      // Remove the deleted note from the local state
      setNotes(notes.filter(note => note._id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
      setError('Failed to delete note');
    }
  };

  const handleSignOut = () => {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Redirect to sign in page
    navigate('/signin');
  };

  // Show loading if user data is not yet loaded
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <span className="text-xl font-semibold text-gray-900">Dashboard</span>
        </div>
        <button 
          onClick={handleSignOut}
          className="text-blue-500 font-medium hover:text-blue-600 transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Welcome Section */}
      <div className="mb-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Welcome, {user?.name}!
          </h2>
          <p className="text-gray-600">
            Email: {user?.email}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Create Note Button */}
      <div className="mb-4 space-y-3">
        <Link
          to="/notes"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-3 text-decoration-none"
        >
          <Plus className="w-6 h-6" />
          <span className="text-lg">Create</span>
        </Link>
        
        {/* <div className="text-center">
          <p className="text-sm text-gray-600">
            Click on any note title to view • Click Create to add new notes
          </p>
        </div> */}
      </div>

      {/* Notes Section */}
      <div>
        <div className="flex items-center justify-between ml-2">
          <h3 className="text-l font-semibold text-gray-600">Notes</h3>
          {/* <button
            onClick={fetchNotes}
            className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            title="Refresh notes"
          >
            <RefreshCw className="w-5 h-5" />
          </button> */}
        </div>
        
        <div className="space-y-4">
          {notesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No notes yet. Create your first note!</p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note._id} className="bg-white border  border-gray-200 rounded-xl shadow-sm p-2 mb-2">
                <div className="flex items-center justify-between">
                  <h4 
                    className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600 flex-1"
                    onClick={() => navigate(`/note/${note._id}`)}
                  >
                    {note.title}
                  </h4>
                  <button
                    onClick={() => handleDeleteNote(note._id, note.title)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete note"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;