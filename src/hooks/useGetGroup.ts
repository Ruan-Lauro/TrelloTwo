import axios from 'axios';
import { api } from "../services/axios";

export interface Group {
  id: number;
  nome: string;
  foto: string;
}

export interface GroupUser {
  id: number;
  grupoId: number;
  usuarioId: number;
  nome: string;
  foto: string;
}

interface UseGroupType {
  getUserGroups: () => Promise<Group[] | string | undefined>;
  getAllGroups: () => Promise<Group[] | string | undefined>;
  createGroup: (name: string, photo?: File) => Promise<boolean | string | undefined>;
  editGroup: (id: number, name?: string, photo?: File) => Promise<boolean | string | undefined>;
  deleteGroup: (id: number) => Promise<boolean | string | undefined>;
  getGroupUsers: (id: number) => Promise<GroupUser[] | string | undefined>;
  addUserToGroup: (groupId: number, userId: number) => Promise<boolean | string | undefined>;
  removeUserFromGroup: (linkId: number) => Promise<boolean | string | undefined>;
}

export const useGetGroup = (): UseGroupType => {
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const getUserGroups = async () => {
    try {
      const res = await api.get("/grupo/", { headers });
      return res.data;
    } catch (error) {
      return handleError(error, "Error fetching user groups");
    }
  };

  const getAllGroups = async () => {
    try {
      const res = await api.get("/grupo/list", { headers });
      return res.data;
    } catch (error) {
      return handleError(error, "Error fetching all groups");
    }
  };

  const createGroup = async (name: string, photo?: File) => {
    try {
      const formData = new FormData();
      formData.append("Nome", name);
      if (photo) formData.append("Foto", photo);

      const res = await api.post("/grupo/create/", formData, {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
      });

      return res.status === 200;
    } catch (error) {
      return handleError(error, "Error creating group");
    }
  };

  const editGroup = async (id: number, name?: string, photo?: File) => {
    try {
      const formData = new FormData();
      formData.append("Id", id.toString());
      if (name) formData.append("Nome", name);
      if (photo) formData.append("Foto", photo);

      const res = await api.post("/grupo/edit/", formData, {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
      });

      return res.status === 200;
    } catch (error) {
      return handleError(error, "Error editing group");
    }
  };

  const deleteGroup = async (id: number) => {
    try {
      const res = await api.delete(`/grupo/remove/?id=${id}`, { headers });
      return res.status === 200;
    } catch (error) {
      return handleError(error, "Error deleting group");
    }
  };

  const getGroupUsers = async (id: number) => {
    try {
      const res = await api.get(`/grupo/users/${id}`, { headers });
      return res.data;
    } catch (error) {
      return handleError(error, "Error fetching group users");
    }
  };

  const addUserToGroup = async (groupId: number, userId: number) => {
    try {
      const res = await api.put("/grupo/users/add/", {
        GrupoId: groupId,
        UsuarioId: userId,
      }, { headers });

      return res.status === 200;
    } catch (error) {
      return handleError(error, "Error adding user to group");
    }
  };

  const removeUserFromGroup = async (linkId: number) => {
    try {
      const res = await api.delete(`/grupo/users/remove/${linkId}`, { headers });
      return res.status === 200;
    } catch (error) {
      return handleError(error, "Error removing user from group");
    }
  };

  const handleError = (error: unknown, fallbackMessage: string): string => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        return fallbackMessage;
      } else {
        return "Server error";
      }
    }
    console.error("Unknown error:", error);
    return "Unknown error";
  };

  return {
    getUserGroups,
    getAllGroups,
    createGroup,
    editGroup,
    deleteGroup,
    getGroupUsers,
    addUserToGroup,
    removeUserFromGroup,
  };
};