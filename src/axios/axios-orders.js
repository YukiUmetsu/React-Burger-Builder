import axios from 'axios';

const orderInstance = axios.create({
   baseURL: 'https://react-burger-builder-6ba56.firebaseio.com/'
});

export default orderInstance;