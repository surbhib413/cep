import axios from "axios";
import env from "../../environment";
import lodash, { toLower } from "lodash";
import Cookies from "universal-cookie";

const TIMEOUT = 60000;
const publicAxiosInstance = axios.create({
  // baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  timeout: TIMEOUT,
  headers: {},
});

const publicAIReq = publicAxiosInstance.interceptors.request.use(
  async (config) => {
    // if (config?.url?.includes('/authorizationserver/oauth/token')) {
    //   return config;
    // }
    const cookies = new Cookies();

    // const access_token: any = localStorage.getItem("mark_one");
    const access_token: any = cookies.get("mark_one");
    if (access_token) {
      config.headers = {
        Authorization: `Bearer ${access_token}`,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
const publicAIRes = publicAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // const access_token = await refreshAccessToken();
      //axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;

      const params = new URLSearchParams();
      params.append("client_id", env.serverClientId);
      params.append("client_secret", env.serverClientSecret);
      params.append("grant_type", "client_credentials");

      return publicAxiosInstance
        .post("/authorizationserver/oauth/token", params, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then(async (res) => {
          const cookies = new Cookies();

          // const { dispatch } = store;
          // await dispatch(setUserToken(res?.data));
          // localStorage.setItem("mark_one", res?.data?.access_token);
          // document.cookie = `mark_one=${res?.data?.access_token}; path=/`;
          cookies.set("mark_one", res?.data?.access_token, { path: "/" });

          //localStorage.setItem('refresh_token', res?.data?.refresh_token)

          // New request with new token
          const config = error.config;
          config.headers.Authorization = `Bearer ${res?.data?.access_token}`;

          return new Promise((resolve, reject) => {
            axios
              .request(config)
              .then((response) => {
                resolve(response);
              })
              .catch((er) => {
                if (er.response.status === 302) {
                  resolve(er.response);
                } else {
                  reject(er);
                }
              });
          });
        })
        .catch((er) => {
          return Promise.reject(er);
        });
    }
    return Promise.reject(error);
  }
);

const privateAxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  timeout: TIMEOUT,
  headers: {},
});

// const privateAIReq = privateAxiosInstance.interceptors.request.use(
//   async (config) => {
//     // if (config?.url?.includes('/authorizationserver/oauth/token')) {
//     // return config;
//     // }
//     // const cookies = new Cookies(config.headers.cookie);

//     console.log("privateAxiosInstance.interceptors.request config", config);

//     // return config;

//     // const access_token: any = localStorage.getItem("mark_two");
//     // const access_token: any = getCookie("mark_two");
//     // const access_token: any = "eysvguVDGZNqN2cnmmBE2Sy3JzQ";
//     const paramsData = lodash.cloneDeep(config.params);
//     const access_token: any = config.params?.cookieData?.mark_two + "xxxcv";
//     console.log("RESET_ACCESS_TOKEN", access_token);
//     if (access_token) {
//       config.headers = {
//         Authorization: `Bearer ${access_token}`,
//         // Cookie: JSON.stringify(paramsData.cookieData),
//       };
//     }

//     if (paramsData?.cookieData) {
//       // config.data = paramsData.cookieData;
//       delete paramsData.cookieData;
//       config.params = paramsData;
//     }
//     console.log(
//       "privateAxiosInstance.interceptors.request final config",
//       config
//     );
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
privateAxiosInstance.interceptors.request.use(
  async (config) => {
    // if (config?.url?.includes('/authorizationserver/oauth/token')) {
    //   return config;
    // }
    try {
      const cookies = new Cookies(config.headers.cookie);
      console.log(
        "privateAxiosInstance.interceptors.request cookies",
        cookies.getAll()
      );

      // const access_token: any = localStorage.getItem("mark_two");
      const access_token: any = cookies.get("mark_two");
      console.log("RESET_ACCESS_TOKEN", access_token);
      // return config;
      if (access_token) {
        config.headers = {
          Authorization: `Bearer ${access_token}`,
        };
      }
      return config;
    } catch (e) {
      return Promise.reject(e);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
// const privateAIRes = privateAxiosInstance.interceptors.response.use(
//   (response) => {
//     console.log(
//       "privateAxiosInstance.interceptors.response success response",
//       response
//     );
//     return response;
//   },
//   async function (error) {
//     const originalRequest = error.config;
//     const cookieData = JSON.parse(originalRequest.data);

//     console.log(
//       "privateAxiosInstance.interceptors.response cookieData",
//       cookieData
//     );
//     console.log("privateAxiosInstance.interceptors.response error", error);
//     console.log(
//       "privateAxiosInstance.interceptors.response error.config",
//       error.config
//     );
//     console.log(
//       "privateAxiosInstance.interceptors.response error.response",
//       error.response
//     );
//     if (error.response.status === 401 && !originalRequest._retry) {
//       console.log(
//         "privateAxiosInstance.interceptors.response error refresh trigger",
//         error
//       );
//       originalRequest._retry = true;
//       // const access_token = await refreshAccessToken();
//       //axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;

//       // const refresh_token: any = localStorage.getItem("mark_three");
//       // const refresh_token: any = getCookie("mark_three");
//       const refresh_token: any = cookieData.mark_three;

//       const params = new URLSearchParams();
//       params.append("client_id", env.userClientId);
//       params.append("client_secret", env.userClientSecret);
//       params.append("grant_type", "refresh_token");
//       params.append("refresh_token", refresh_token);

//       return privateAxiosInstance
//         .post("/authorizationserver/oauth/token", params, {
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//         })
//         .then(async (res) => {
//           // const { dispatch } = store;
//           // await dispatch(setUserToken(res?.data));
//           // localStorage.setItem("mark_two", res?.data?.access_token);
//           // localStorage.setItem("mark_three", res?.data?.refresh_token);
//           const cookies = new Cookies();

//           // document.cookie = `mark_two=${res?.data?.access_token}; path=/`;
//           // document.cookie = `mark_three=${res?.data?.refresh_token}; path=/`;
//           cookies.set("mark_two", res?.data?.access_token, { path: "/" });
//           cookies.set("mark_three", res?.data?.refresh_token, { path: "/" });

//           // New request with new token
//           const config = error.config;
//           config.headers.Authorization = `Bearer ${res?.data?.access_token}`;

//           return new Promise((resolve, reject) => {
//             axios
//               .request(config)
//               .then((response) => {
//                 resolve(response);
//               })
//               .catch((er) => {
//                 if (er.response.status === 302) {
//                   resolve(er.response);
//                 } else {
//                   reject(er);
//                 }
//               });
//           });
//         })
//         .catch((er) => {
//           return Promise.reject(er);
//         });
//     }
//     return Promise.reject(error);
//   }
// );
// Response interceptor for API calls
privateAxiosInstance.interceptors.response.use(
  (response) => {
    console.log(
      "privateAxiosInstance.interceptors.response success response",
      response
    );
    return response;
  },
  async function (error) {
    try {
      const originalRequest = error.config;
      console.log("privateAxiosInstance.interceptors.response error", error);
      console.log(
        "privateAxiosInstance.interceptors.response error.config",
        error.config
      );
      console.log(
        "privateAxiosInstance.interceptors.response error.response",
        error.response
      );
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        // const access_token = await refreshAccessToken();
        //axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
        const cookies = new Cookies(error.response);

        console.log(
          "privateAxiosInstance.interceptors.response cookies",
          cookies.getAll()
        );
        const refresh_token: any = cookies.get("mark_three");

        const params = new URLSearchParams();
        params.append("client_id", env.userClientId);
        params.append("client_secret", env.userClientSecret);
        params.append("grant_type", "refresh_token");
        params.append("refresh_token", refresh_token);

        return privateAxiosInstance
          .post("/authorizationserver/oauth/token", params, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          })
          .then(async (res) => {
            // const { dispatch } = store;
            // await dispatch(setUserToken(res?.data));
            // localStorage.setItem("mark_two", res?.data?.access_token);
            // localStorage.setItem("mark_three", res?.data?.refresh_token);

            cookies.set("mark_two", res?.data?.access_token, { path: "/" });
            cookies.set("mark_three", res?.data?.refresh_token, { path: "/" });

            // New request with new token
            const config = error.config;
            config.headers.Authorization = `Bearer ${res?.data?.access_token}`;

            return new Promise((resolve, reject) => {
              axios
                .request(config)
                .then((response) => {
                  resolve(response);
                })
                .catch((er) => {
                  if (er.response.status === 302) {
                    resolve(er.response);
                  } else {
                    reject(er);
                  }
                });
            });
          })
          .catch((er) => {
            return Promise.reject(er);
          });
      }
      return Promise.reject(error);
    } catch (e) {
      return Promise.reject(e);
    }
  }
);

const getPrivateAxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  timeout: TIMEOUT,
  headers: {},
  withCredentials: true,
});

const getPrivateAIReq = getPrivateAxiosInstance.interceptors.request.use(
  async (config) => {
    // console.log("getPrivateAxiosInstance.interceptors.request config", config);
    // console.log(
    //   "getPrivateAxiosInstance.interceptors.request config.headers",
    //   config.headers
    // );
    // console.log(
    //   "getPrivateAxiosInstance.interceptors.request config.headers.cookie",
    //   config.headers.cookie
    // );
    // const cookies = new Cookies();
    // console.log(
    //   "getPrivateAxiosInstance.interceptors.request : cookies",
    //   cookies.getAll()
    // );

    const paramsData = lodash.cloneDeep(config.params);
    const access_token: any = config.params?.cookieData?.mark_two;
    console.log(
      "getPrivateAxiosInstance.interceptors.request : access_token",
      access_token
    );
    console.log(
      "getPrivateAxiosInstance.interceptors.request : paramsData",
      paramsData
    );
    if (access_token) {
      config.headers = {
        Authorization: `Bearer ${access_token}`,
        // Cookie: JSON.stringify(paramsData.cookieData),
      };
    }

    if (paramsData?.cookieData) {
      // config.data = paramsData.cookieData;
      delete paramsData.cookieData;
      config.params = paramsData;
    }
    console.log(
      "getPrivateAxiosInstance.interceptors.request final config",
      config
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
const getPrivateAIRes = getPrivateAxiosInstance.interceptors.response.use(
  (response) => {
    console.log(
      "getPrivateAxiosInstance.interceptors.response success response",
      response
    );
    return response;
  },
  async function (error) {
    console.log("Found it...................", error);
    const originalRequest = error.config;
    console.log("error.config", error.config);
    console.log("originalRequest.data", originalRequest.data);
    const cookieData = JSON.parse(originalRequest.data);

    console.log(
      "getPrivateAxiosInstance.interceptors.response cookieData",
      cookieData
    );
    console.log("getPrivateAxiosInstance.interceptors.response error", error);
    console.log(
      "getPrivateAxiosInstance.interceptors.response error.config",
      error.config
    );
    console.log(
      "getPrivateAxiosInstance.interceptors.response error.response",
      error.response
    );
    if (error.response.status === 401 && !originalRequest._retry) {
      console.log(
        "getPrivateAxiosInstance.interceptors.response error refresh trigger",
        error
      );
      originalRequest._retry = true;
      // const access_token = await refreshAccessToken();
      //axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;

      // const refresh_token: any = localStorage.getItem("mark_three");
      // const refresh_token: any = getCookie("mark_three");
      const refresh_token: any = cookieData.mark_three;

      const params = new URLSearchParams();
      params.append("client_id", env.userClientId);
      params.append("client_secret", env.userClientSecret);
      params.append("grant_type", "refresh_token");
      params.append("refresh_token", refresh_token);

      return getPrivateAxiosInstance
        .post("/authorizationserver/oauth/token", params, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then(async (res) => {
          // const { dispatch } = store;
          // await dispatch(setUserToken(res?.data));
          // localStorage.setItem("mark_two", res?.data?.access_token);
          // localStorage.setItem("mark_three", res?.data?.refresh_token);
          const cookies = new Cookies();

          // document.cookie = `mark_two=${res?.data?.access_token}; path=/`;
          // document.cookie = `mark_three=${res?.data?.refresh_token}; path=/`;
          cookies.set("mark_two", res?.data?.access_token, { path: "/" });
          cookies.set("mark_three", res?.data?.refresh_token, { path: "/" });

          // New request with new token
          const config = error.config;
          config.headers.Authorization = `Bearer ${res?.data?.access_token}`;

          return new Promise((resolve, reject) => {
            axios
              .request(config)
              .then((response) => {
                resolve(response);
              })
              .catch((er) => {
                if (er.response.status === 302) {
                  resolve(er.response);
                } else {
                  reject(er);
                }
              });
          });
        })
        .catch((er) => {
          return Promise.reject(er);
        });
    }
    return Promise.reject(error);
  }
);

export default {
  getPrivate: async (url: any, config = {}) => {
    try {
      const response = await getPrivateAxiosInstance.get(url, config);
      console.log("APICLIENT res !!", response);
      return response;
    } catch (ex) {
      console.log("Error ", ex);
      console.log("Error ", ex.response);
      return ex.response;
    }
  },
  postPrivate: async (url: any, data: any, config = {}) => {
    try {
      const response = await privateAxiosInstance.post(url, data, config);
      return response;
    } catch (ex) {
      return ex.response;
    }
  },
  deletePrivate: async (url: any, config = {}) => {
    try {
      const response = await privateAxiosInstance.delete(url, config);
      return response;
    } catch (ex) {
      return ex.response;
    }
  },
  getPublic: async (url: any, config = {}) => {
    try {
      const response = await publicAxiosInstance.get(url, config);
      return response;
    } catch (ex) {
      return ex.response;
    }
  },
  postPublic: async (url: any, data: any, config = {}) => {
    try {
      const response = await publicAxiosInstance.post(url, data, config);
      return response;
    } catch (ex) {
      return ex.response;
    }
  },
};

// publicAxiosInstance.interceptors.request.eject(publicAIReq);
// publicAxiosInstance.interceptors.response.eject(publicAIRes);
// privateAxiosInstance.interceptors.request.eject(privateAIReq);
// privateAxiosInstance.interceptors.response.eject(privateAIRes);

// const getCookie = (cname: string) => {
//   var name = cname + "=";
//   var decodedCookie = decodeURIComponent(document.cookie);
//   var ca = decodedCookie.split(";");
//   for (var i = 0; i < ca.length; i++) {
//     var c = ca[i];
//     while (c.charAt(0) == " ") {
//       c = c.substring(1);
//     }
//     if (c.indexOf(name) == 0) {
//       return c.substring(name.length, c.length);
//     }
//   }
//   return "";
// };
