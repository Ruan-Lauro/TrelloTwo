import axios from 'axios';
import { api } from "../services/axios";
import { dashboard } from '../pages/dashboard';



interface Dashboard {
  getDashboardData: () => Promise<dashboard | string | undefined>;
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