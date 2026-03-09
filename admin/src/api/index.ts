import axios from 'axios';

const getConfig = async () => {
  const { data } = await axios.get('/strapi-mercadopago/configuration');
  return data;
}

const setConfig = async (data: any) => {
  const response = await axios('/strapi-mercadopago/configuration', {
    method: 'POST',
    data: { data }
  });
  return response;
}

const getDashboardStats = async (fetchClient: { get: (url: string) => Promise<{ data: any }> }, days: number = 30) => {
  const { data } = await fetchClient.get(`/strapi-mercadopago/dashboard/stats?days=${days}`);
  return data;
};

export { getConfig, setConfig, getDashboardStats };
