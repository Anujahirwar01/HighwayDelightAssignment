import api from './api';

// Types for Notes API
export interface Note {
  _id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
}

export interface UpdateNoteData {
  title: string;
  content: string;
}

export interface NotesResponse {
  success: boolean;
  data: {
    notes: Note[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalNotes: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  message?: string;
}

export interface NoteResponse {
  success: boolean;
  data: {
    note: Note;
  };
  message?: string;
}

export interface CreateNoteResponse {
  success: boolean;
  message: string;
  data: {
    note: Note;
  };
}

export interface DeleteNoteResponse {
  success: boolean;
  message: string;
}

class NotesService {
  // Get all notes with pagination
  async getNotes(page: number = 1, limit: number = 50): Promise<NotesResponse> {
    try {
      const response = await api.get<NotesResponse>(`/notes?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  // Get a single note by ID
  async getNote(id: string): Promise<NoteResponse> {
    try {
      const response = await api.get<NoteResponse>(`/notes/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  // Create a new note
  async createNote(noteData: CreateNoteData): Promise<CreateNoteResponse> {
    try {
      const response = await api.post<CreateNoteResponse>('/notes', noteData);
      return response.data;
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  // Update an existing note
  async updateNote(id: string, noteData: UpdateNoteData): Promise<NoteResponse> {
    try {
      const response = await api.put<NoteResponse>(`/notes/${id}`, noteData);
      return response.data;
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  // Delete a note
  async deleteNote(id: string): Promise<DeleteNoteResponse> {
    try {
      const response = await api.delete<DeleteNoteResponse>(`/notes/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  // Handle API errors
  private handleError(error: unknown): Error {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: {
          data?: {
            message?: string;
            errors?: Array<{ msg: string; field: string }>;
          };
          status?: number;
        };
        message?: string;
      };

      if (axiosError.response?.data?.message) {
        return new Error(axiosError.response.data.message);
      }

      if (axiosError.response?.data?.errors && Array.isArray(axiosError.response.data.errors)) {
        const firstError = axiosError.response.data.errors[0];
        return new Error(firstError?.msg || 'Validation error');
      }

      if (axiosError.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/signin';
        return new Error('Session expired. Please login again.');
      }

      if (axiosError.response?.status === 404) {
        return new Error('Note not found');
      }

      if (axiosError.response?.status === 403) {
        return new Error('You do not have permission to access this note');
      }

      return new Error(axiosError.message || 'An error occurred');
    }

    if (error instanceof Error) {
      return error;
    }

    return new Error('An unexpected error occurred');
  }
}

const notesService = new NotesService();
export default notesService;
