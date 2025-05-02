import axios from 'axios';
import { api } from "../services/axios";

interface DashboardData {
  // Você pode definir a estrutura exata dos dados do dashboard aqui
  // com base no que a API retorna
  [key: string]: any;
}

interface Dashboard {
  getDashboardData: () => Promise<DashboardData | string | undefined>;
}

export const useDashboard = (): Dashboard => {
  const token = localStorage.getItem("token");

  const getDashboardData = async () => {
    try {
      const response = await api.get('/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 400) {
          return "Get dashboard data error";
        } else {
          return "Server error";
        }
      } else {
        console.error('Unknown error:', error);
      }
    }
  };

  return { getDashboardData };
};