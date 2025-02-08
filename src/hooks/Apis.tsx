// hooks/useApi.ts
import axios from "axios";
import { useSnackbar } from "notistack";

type RequestMethod = "GET" | "POST" | "DELETE";

interface ApiOptions {
  method: RequestMethod;
  url: string;
  data?: any;
  id?: number | string;
  responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream' | undefined;
  filename?: string;
}

export const useApi = () => {
  const { enqueueSnackbar } = useSnackbar();

  const apiRequest = async ({ method, url, data, responseType = 'json' }: ApiOptions) => {
    try {
      const response = await axios({ method, url, data, responseType });
      return response.data;
    } catch (error) {
      enqueueSnackbar("An error occurred. Please try again.", { variant: "error" });
      throw error;
    }
  };

  return { apiRequest };
};
