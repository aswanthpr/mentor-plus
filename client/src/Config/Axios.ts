import axios from 'axios';

const protectedAPI=axios.create({baseURL:'http://localhost:3000'});
const unProtectedAPI = axios.create({baseURL:'http://localhost:3000',})