import { authenticate } from "@google-cloud/local-auth";
import fs from "fs";
import { Auth } from "googleapis";
import { googleConfig } from "../../../../config/google.config";

export class GoogleClientFactory {
  private static client: Auth.OAuth2Client | Auth.UserRefreshClient | null =
    null;

  static async getClient() {
    if (!this.client) {
      throw "create GoogleClient first";
    }

    return this.client;
  }

  static async createClient() {
    if (this.client) {
      return;
    }
    this.client = await this.authorize();
  }

  private static async authorize() {
    const savedOAuthClient = await this.getSavedCredentials();
    if (savedOAuthClient) {
      return savedOAuthClient;
    }

    const oAuthclient = await authenticate({
      scopes: googleConfig.scopes,
      keyfilePath: `${process.cwd()}/${googleConfig.credentialsPath}`,
    });
    this.saveCredentials(oAuthclient);
    return oAuthclient;
  }

  private static getSavedCredentials = async () => {
    try {
      const content = fs
        .readFileSync(`${process.cwd()}/${googleConfig.tokenPath}`)
        .toString();
      const credentials = JSON.parse(content);
      const refreshClient = new Auth.UserRefreshClient();
      refreshClient.fromJSON(credentials);
      return refreshClient;
    } catch (err) {
      console.log(`err: ${err}`);
      return null;
    }
  };

  private static saveCredentials = (client: Auth.OAuth2Client) => {
    const content = fs.readFileSync(googleConfig.credentialsPath).toString();
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: "authorized_user",
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    fs.writeFileSync(`${__dirname}/${googleConfig.tokenPath}`, payload);
  };
}
