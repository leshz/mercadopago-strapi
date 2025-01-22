import axios from 'axios';

const getConfigRequest = async () => {
    const { data } = await axios.get('/strapi-mercadopago/configuration');
    return data;
}

export default getConfigRequest;