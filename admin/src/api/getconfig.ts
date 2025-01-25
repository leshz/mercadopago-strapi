import axios from 'axios';

const getConfig = async () => {
  const { data } = await axios.get('/strapi-mercadopago/configuration');
  return data;
}

const setConfig = async (data: any) => {
  console.log(data)
  const response = await axios('/strapi-mercadopago/configuration', {
    method: 'POST',
    data: { data }
  });
  return response;
}

export { getConfig, setConfig };
