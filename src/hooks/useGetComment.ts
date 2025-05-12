import axios from 'axios';
import { api } from "../services/axios";

export type commentCreate = {
  CardId: number;
  Comentario: string;
  Anexo?: Blob;
};

interface Comment {
  addComment: (comment: commentCreate) => Promise<string | boolean | undefined>;
  deleteComment: (id: number) => Promise<string | boolean | undefined>;
}

export const useCommentCard = (): Comment => {
  const token = localStorage.getItem("token");

  const addComment = async (comment: commentCreate) => {
  try {
    const formData = new FormData();
    formData.append('CardId', comment.CardId.toString());
    formData.append('Comentario', comment.Comentario);
    if (comment.Anexo) {
      formData.append('Anexo', comment.Anexo);
    }

    const response = await api.post('/workspace/card/comment/', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 400) {
        return "Add comment error";
      } else {
        return "Server error";
      }
    } else {
      console.error('Unknown error:', error);
    }
  }
};


  const deleteComment = async (id: number) => {
    try {
      const response = await api.delete(`/workspace/card/comment/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 400) {
          return "Delete comment error";
        } else {
          return "Server error";
        }
      } else {
        console.error('Unknown error:', error);
      }
    }
  };

  return { addComment, deleteComment };
};