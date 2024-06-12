import { gmail_v1, google } from "googleapis";
import { GoogleClientFactory } from "../googleapis/google-client.factory";

export class GmailClientFactory {
  private static client: gmail_v1.Gmail | null = null;

  static async createClient() {
    if (this.client) {
      return;
    }

    const oAuthClient = await GoogleClientFactory.getClient();
    this.client = google.gmail({
      version: "v1",
      auth: oAuthClient,
    }) as gmail_v1.Gmail;
  }

  static getClient() {
    if (this.client == null) {
      throw "create GmailClient first";
    }
    return this.client;
  }
}
