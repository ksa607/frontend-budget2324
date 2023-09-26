import axios from 'axios';

const baseUrl = `http://localhost:9000/api`;

export const getAll = async (url) => {
  const {
    data
  } = await axios.get(`${baseUrl}/${url}`); 

  return data.items;
};
