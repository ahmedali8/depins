import axios from 'axios';

const client = axios.create({
  baseURL: 'http://3.13.157.111:3000',
  // baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;
