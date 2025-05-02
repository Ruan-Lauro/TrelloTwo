import axios from 'axios';
import { api } from "../services/axios";

export type checklistCreate = {
  CardId: number;
  Descricao: string;
  DataHora: Date;
};

export type checklistEdit = {
  Id: number;
  Descricao?: string;
  DataHora?: Date;
};

export type checklistUser = {
  Id: number;
  UserId: number;
};

interface Checklist {
  createChecklist: (checklist: checklistCreate) => Promise<string | boolean | undefined>;
  editChecklist: (checklist: checklistEdit) => Promise<string | boolean | undefined>;
  toggleChecklist: (id: number) => Promise<string | boolean | undefined>;
  addUserToChecklist: (data: checklistUser) => Promise<string | boolean | undefined>;
  removeUserFromChecklist: (id: number) => Promise<string | boolean | undefined>;
};

export const useGetChecklistCard = (): Checklist => {
  const token = localStorage.getItem("token");

  const createChecklist = async (checklist: checklistCreate) => {
    try {
      const response = await api.post('/workspace/checklist/create/', checklist, {
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
          return "Create checklist error";
        } else {
          return "Server error";
        }
      } else {
        console.error('Unknown error:', error);
      }
    }
  };

  const editChecklist = async (checklist: checklistEdit) => {
    try {
      const response = await api.put('/workspace/checklist/edit/', checklist, {
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
          return "Edit checklist error";
        } else {
          return "Server error";
        }
      } else {
        console.error('Unknown error:', error);
      }
    }
  };

  const toggleChecklist = async (id: number) => {
    try {
      const response = await api.put(`/workspace/checklist/toggle/${id}`, {}, {
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
          return "Toggle checklist error";
        } else {
          return "Server error";
        }
      } else {
        console.error('Unknown error:', error);
      }
    }
  };

  const addUserToChecklist = async (data: checklistUser) => {
    try {
      const response = await api.put('/workspace/checklist/user/add/', data, {
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
          return "Add user to checklist error";
        } else {
          return "Server error";
        }
      } else {
        console.error('Unknown error:', error);
      }
    }
  };

  const removeUserFromChecklist = async (id: number) => {
    try {
      const response = await api.delete(`/workspace/checklist/user/remove/${id}`, {
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
          return "Remove user from checklist error";
        } else {
          return "Server error";
        }
      } else {
        console.error('Unknown error:', error);
      }
    }
  };

  return { 
    createChecklist, 
    editChecklist, 
    toggleChecklist, 
    addUserToChecklist, 
    removeUserFromChecklist 
  };
};