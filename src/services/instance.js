import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { logOutUser } from '../redux/actions/authActions';

const instance = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
      "Content-Type": "application/json",
  },
  validateStatus: function (status) {

      return (status >= 200 && status < 400);
  },
});

export const interceptor = (store) => {
  instance.interceptors.request.use(
      async (config) => {
          let token;

          const state = store.getState()

          if (state && state.authAPIReducer && state.authAPIReducer.user) {
              token = state.authAPIReducer.user.token;
              if (token) {
                  const tokenDate = new Date(jwt_decode(token).exp * 1000)
                  const newDate = new Date();
                  if (newDate >= tokenDate) {
                      // Token expired
                      store.dispatch(logOutUser());
                  }
              }
          }
          const newConfig = config;
          if (token) {
              newConfig.headers.Authorization = "Bearer " + token;
          }
          return newConfig;
      },
      (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
      (next) => {
          return Promise.resolve(next);
      },
      (error) => {

          const state = store.getState()

          if (state && state.authAPIReducer && state.authAPIReducer.user) {
              const { token } = state.authAPIReducer.user;

              if (token) {
                  const tokenDate = new Date(jwt_decode(token).exp * 1000)
                  const newDate = new Date();
                  if (newDate >= tokenDate) {
                      // Token expired
                      store.dispatch(logOutUser());
                  }
              }
          }

          return Promise.reject(error);
      }
  );
};

export default instance;