// import axios from "axios";

// const axiosWithAuth = axios.create({
//   baseURL: "http://localhost:5001/api", // Your backend API base
// });

// axiosWithAuth.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default axiosWithAuth;






import axios from "axios";

const axiosWithAuth = axios.create({
  baseURL: "http://localhost:5001/api", // Your backend API base
});

axiosWithAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Ensure token has correct format
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      config.headers.Authorization = formattedToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration globally
axiosWithAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if it's expired
      localStorage.removeItem('token');
      // Optionally redirect to login page
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosWithAuth;