import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import qs from "qs";
import { LOCAL_STORAGE_JWT } from "./Constant";

export class RestApiClient {
  private encodedFormConfig: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  public static loginWithJwt = (): AxiosRequestConfig => {
    const token = localStorage.getItem(LOCAL_STORAGE_JWT);
    if (token) {
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    }
    return {};
  };

  public loginUser = async (username: string, password: string): Promise<AxiosResponse> => {
    const resp = await axios.post(
      "/api/auth/login",
      qs.stringify({
        username,
        password,
      }),
      this.encodedFormConfig
    );

    const { token } = resp.data.data;
    console.log(token);
    localStorage.setItem(LOCAL_STORAGE_JWT, token);
    return resp;
  };

  public registerUser = async (
    username: string,
    password: string,
    email: string
  ): Promise<AxiosResponse> => {
    return axios.post(
      "/api/auth/register",
      qs.stringify({
        username,
        password,
        email,
      }),
      this.encodedFormConfig
    );
  };
}
