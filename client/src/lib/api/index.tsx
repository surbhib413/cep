import apiClient from "./apiClient";
import { toLower } from "lodash";

export const callPostAPI = async (fields: any, urlPath: string) => {
  console.log(`${process.env.NEXT_PUBLIC_API_URL}${urlPath}`);
  const finalData = {
    ...fields,
    channel: "Web",
  };
  console.log(finalData);
  let resData;
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}${urlPath}`,
      finalData
    );
    console.log("response", res);
    resData = {
      status: res.data?.status ? toLower(res.data?.status) : "success",
      message: res.data?.message,
      data: res.data,
    };
  } catch (e) {
    console.log("catch error in catch block", e.response);
    resData = {
      status: "error",
      errors: e.response?.data?.errors,
    };
  }
  return resData;
};
import Cookies from "universal-cookie";

export const callPostPrivateAPI = async (fields: any, urlPath: string) => {
  let resData;
  try {
    const response = await apiClient.postPrivate(`${urlPath}`, {
      ...fields,
      channel: "Web",
    });

    if (response.data?.errors) {
      resData = {
        status: "error",
        errors: response.data?.errors,
      };
    } else if (response?.data?.error) {
      resData = {
        status: "error",
        errors: response?.data?.error,
      };
    } else {
      resData = {
        status: response.data?.status
          ? toLower(response.data?.status)
          : "success",
        message: response.data?.message,
        data: response.data,
        errors: response.data?.errors,
      };
    }
    console.log("THIS IS THE CALL AFTER INTERCEPTOR CALL", response);
  } catch (e) {
    console.log("catch error in catch block", e.response);
    resData = {
      status: "error",
      errors: e.response?.data?.errors,
    };
  }
  return resData;
};

export const callPostPublicAPI = async (fields: any, urlPath: string) => {
  console.log(`${process.env.NEXT_PUBLIC_API_URL}${urlPath}`);
  let resData;
  try {
    const response = await apiClient.postPublic(`${urlPath}`, {
      ...fields,
      channel: "Web",
    });
    console.log("PUBLIC API RESPONSE", response);
    if (response?.data?.errors) {
      resData = {
        status: "error",
        errors: response?.data?.errors,
      };
    } else if (response?.data?.error) {
      resData = {
        status: "error",
        errors: response?.data?.error,
      };
    } else {
      resData = {
        status: response.data?.status
          ? toLower(response.data?.status)
          : "success",
        message: response.data?.message,
        data: response.data,
        // errors: response.data?.errors,
      };
    }
    console.log("THIS IS THE CALL AFTER INTERCEPTOR CALL", response);
  } catch (e) {
    console.log("catch error in catch block", e.response);
    resData = {
      status: "error",
      errors: e.response?.data?.errors,
    };
  }
  return resData;
};

export const callPostPublicPasswordVerify = async (
  fields: any,
  urlPath: string
) => {
  console.log(`${process.env.NEXT_PUBLIC_API_URL}${urlPath}`);

  const params = new URLSearchParams();
  params.append("client_id", `${process.env.NEXT_PUBLIC_CLIENT_ID_2}`);
  params.append("client_secret", `${process.env.NEXT_PUBLIC_CLIENT_SECRET_2}`);
  params.append("grant_type", `${process.env.NEXT_PUBLIC_GRANT_TYPE_2}`);
  params.append("username", fields.customerId);
  params.append("password", fields.password);

  let resData;
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  try {
    const response = await apiClient.postPublic(`${urlPath}`, params, config);

    console.log("response", response);
    resData = {
      status: response?.status ? toLower(response?.status) : "success",
      message: response.data?.message,
      data: response.data,
      errors: response.data?.errors,
    };
  } catch (e) {
    console.log("catch error in password verify catch block", e.response);
    resData = {
      status: "error",
      errors: e.response?.data?.errors,
    };
  }
  return resData;
};

export const callPostPublicAuthorizationServer = async (urlPath: string) => {
  console.log(`${process.env.NEXT_PUBLIC_API_URL}${urlPath}`);

  const params = new URLSearchParams();
  params.append("client_id", `${process.env.NEXT_PUBLIC_CLIENT_ID_1}`);
  params.append("client_secret", `${process.env.NEXT_PUBLIC_CLIENT_SECRET_1}`);
  params.append("grant_type", `${process.env.NEXT_PUBLIC_GRANT_TYPE_1}`);

  let resData;
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  try {
    const response = await apiClient.postPublic(`${urlPath}`, params, config);
    console.log("response from callAuthorizationServer ", response);

    if (response?.data?.errors) {
      resData = {
        status: "error",
        errors: response?.data?.errors,
      };
    } else if (response?.data?.error) {
      resData = {
        status: "error",
        errors: response?.data?.error,
      };
    } else {
      resData = {
        status: response?.status ? response?.status : "success",
        message: response.data?.message,
        data: response.data,
        // errors: response.data?.errors,
      };
    }
  } catch (e) {
    console.log("catch authorization error in catch block", e.response);
    resData = {
      status: "error",
      errors: e.response?.data.errors,
    };
  }
  return resData;
};

export const callGetPrivateAPI = async (fields: any, urlPath: string) => {
  console.log(`${process.env.NEXT_PUBLIC_API_URL}${urlPath}`);

  let cookieData = {};
  console.log("JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ");
  console.log(urlPath);
  console.log(fields.cookieData);
  if (!fields?.cookieData) {
    const cookies = new Cookies();
    console.log("callGetPrivateAPIIIIIIIIIIIIIIIIIIIIII : cookies.getAll", cookies.getAll());
    cookieData = {
      cookieData: {
        mark_one: cookies.get("mark_one"),
        mark_two: cookies.get("mark_two"),
        mark_three: cookies.get("mark_three"),
      },
    };
  }

  let responseType = {};
  if (fields?.customDownload) {
    delete fields?.customDownload;
    responseType = {
      responseType: "blob",
    };
  }
  const finalData = {
    params: {
      ...fields,
      ...cookieData,
      channel: "Web",
    },
    ...responseType,
  };
  console.log("callGetPrivateAPI : finalData", finalData);
  let resData;
  try {
    const response = await apiClient.getPrivate(`${urlPath}`, finalData);

    console.log("callGetPrivateAPI : response", response);
    resData = {
      status: "success",
      data: response.data,
    };
  } catch (e) {
    console.log("response : catch error in catch block", e.response);
    resData = {
      status: "failure",
      errors: e.response?.data?.errors || null,
    };
  }

  return resData;
};

export const callGetPublicAPI = async (fields: any, urlPath: string) => {
  console.log(`${process.env.NEXT_PUBLIC_API_URL}${urlPath}`);
  const finalData = {
    params: {
      ...fields,
      channel: "Web",
    },
  };
  console.log(finalData);
  let resData;
  try {
    const response = await apiClient.getPublic(`${urlPath}`, finalData);

    console.log("response of callGetPublicAPI", response);
    if (response?.data?.errors) {
      resData = {
        status: "error",
        errors: response?.data?.errors,
      };
    } else if (response?.data?.error) {
      resData = {
        status: "error",
        errors: response?.data?.error,
      };
    } else {
      resData = {
        status: response?.status ? toLower(response?.status) : "success",
        //status: "success",
        message: response.data?.message,
        data: response.data,
        // errors: response.data?.errors,
      };
    }
    // resData = {
    //   status: "success",
    //   data: response.data,
    // };
  } catch (e) {
    console.log("catch error in catch block", e.response);
    resData = {
      status: "failure",
      errors: e.response?.data?.errors,
    };
  }

  return resData;
};

export const callDeletePrivateAPI = async (fields: any, urlPath: string) => {
  console.log(
    `URL is for delete cards is: ${process.env.NEXT_PUBLIC_API_URL}${urlPath}`
  );
  const data = {
    ...fields,
    channel: "WEB",
  };
  let resData;
  try {
    const res = await apiClient.deletePrivate(
      `${process.env.NEXT_PUBLIC_API_URL}${urlPath}`,
      { headers: { "Content-Type": "application/json" }, data }
    );
    console.log("response", res);
    resData = {
      status: "success",
      data: res.data,
    };
  } catch (e) {
    console.log("catch error in catch block", e.response);
    resData = {
      status: "failure",
      errors: e.response?.data?.errors,
    };
  }

  return resData;
};

export const callPostPrivateFileUploadAPI = async (
  fields: any,
  urlPath: string
) => {
  let resData;

  try {
    const response = await apiClient.postPrivate(`${urlPath}`, fields, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data?.errors) {
      resData = {
        status: "error",
        errors: response.data?.errors,
      };
    } else {
      resData = {
        status: response.data?.status
          ? toLower(response.data?.status)
          : "success",
        message: response.data?.message,
        data: response.data,
        errors: response.data?.errors,
      };
    }
    console.log("THIS IS THE CALL AFTER INTERCEPTOR CALL", response);
  } catch (e) {
    console.log("catch error in catch block", e.response);
    resData = {
      status: "error",
      errors: e.response?.data?.errors,
    };
  }
  return resData;
};
