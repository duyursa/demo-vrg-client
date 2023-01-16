import axios from "axios";
import { getLogger } from "./logger";
import { JwtPayload, decode } from "jsonwebtoken";
import { error } from "winston";
import config from "../config";

export class AdminApiClient {
  private readonly logger = getLogger(AdminApiClient.name);
  private static instance: AdminApiClient;

  private token = {
    accessToken: null,
    refreshToken: null,
    expiredTime: 0
  };

  private requestTimeoutMs = 10000;

  private constructor() {}

  public static getInstance(): AdminApiClient {
    if (!AdminApiClient.instance) {
      AdminApiClient.instance = new AdminApiClient();
    }
    return AdminApiClient.instance;
  }

  private async login(): Promise<boolean> {
    const response = await axios({
      method: "post",
      data: {
        apiKey: config.api.apiKey,
      },
      url: `${config.api.url}/token`,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: this.requestTimeoutMs,
    });

    if (response.data) {
      const { accessToken, refreshToken } = response.data;
      const jwtPayload = decode(accessToken, { json: true });
      const expiredTime = jwtPayload.exp;

      this.token = {
        accessToken, 
        refreshToken,
        expiredTime,
      }
      
      return true;
    }
    return false;
  }

  private async refreshToken(): Promise<boolean> {
    const response = await axios({
      method: "post",
      data: {
        apiKey: config.api.apiKey,
      },
      url: `${config.api.url}/refreshToken`,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: this.requestTimeoutMs,
    });

    if (response.data) {
      const { accessToken, refreshToken } = response.data;
      const jwtPayload = decode(accessToken, { json: true });
      const expiredTime = jwtPayload.exp;

      this.token = {
        accessToken, 
        refreshToken,
        expiredTime,
      }
      return true;
    }
    return false;
  }

  async hasToken(): Promise<boolean> {
    try {
      if(!this.token.accessToken) {
        return await this.login();
      } else if(this.token.expiredTime < Date.now()/1000) {
        return await this.refreshToken();
      }
      return true;
    } catch (err) {
      this.logger.error('hasToken error');
    }
    return false;
  }

  async get(uri: string, params?: any) {
    try {
      const hasToken = await this.hasToken();
      if(!hasToken) return null;
      
      return await axios({
        method: "get",
        params,
        url: `${config.api.url}/${uri}`,
        headers: {
          Authorization: `Bearer ${this.token.accessToken}`,
          "Content-Type": "application/json",
        },
        timeout: this.requestTimeoutMs,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async post(uri: string, data?: any) {
    try {
      const hasToken = await this.hasToken();
      if(!hasToken) return null;
      
      return await axios({
        method: "post",
        data,
        url: `${config.api.url}/${uri}`,
        headers: {
          Authorization: `Bearer ${this.token.accessToken}`,
          "Content-Type": "application/json",
        },
        timeout: this.requestTimeoutMs,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async delete(uri: string, params?: any) {
    try {
      const hasToken = await this.hasToken();
      if(!hasToken) return null;

      return await axios({
        method: "delete",
        params,
        url: `${config.api.url}/${uri}`,
        headers: {
          Authorization: `Bearer ${this.token.accessToken}`,
          "Content-Type": "application/json",
        },
        timeout: this.requestTimeoutMs,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
