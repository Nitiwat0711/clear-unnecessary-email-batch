import { GaxiosPromise } from "@googleapis/gmail";
import { gmail_v1 } from "googleapis";
import log from "winston";
import { logger } from "../../../../config/logger.config";
import { GmailClientFactory } from "./gmail-client.factory";
import { GmailMessage } from "./gmail.model";

export class GmailRepository {
  private CHUNK_SIZE = 100;

  constructor(
    private client: gmail_v1.Gmail = GmailClientFactory.getClient()
  ) {}

  async getAllMessages(userId: string, query: string): Promise<GmailMessage[]> {
    const messages: GmailMessage[] = [];
    let pageToken: string | undefined | null = undefined;
    let offset = 0;
    let totalCount = 0;

    do {
      logger.info(`start get gmail messages query: ${query} chunk ${offset}`);
      try {
        const response = await this.getMessages(userId, query, pageToken);
        pageToken = response.data.nextPageToken;

        if (response.data.messages == null) {
          logger.info("not found any gmail messages");
          return [];
        }

        messages.push(...(response.data.messages as GmailMessage[]));
        totalCount += response.data.resultSizeEstimate ?? 0;
        logger.info(
          `get gmail messages chunk ${offset} success with messageCount: ${
            response.data.resultSizeEstimate ?? 0
          } totalMessageCount: ${totalCount}`
        );
      } catch (err) {
        logger.error(`get messages error cause: ${err}`);
        throw err;
      }
    } while (pageToken != null);

    return messages;
  }

  async getMessages(userId: string, query: string, pageToken?: string) {
    const response = await (this.client.users.messages.list({
      userId: userId,
      maxResults: this.CHUNK_SIZE,
      q: query,
      pageToken: pageToken,
    }) as GaxiosPromise<gmail_v1.Schema$ListMessagesResponse>);

    return response;
  }

  async deleteMessages(messageIds: string[]) {
    this.client.users.messages
      .batchDelete({
        userId: "me",
        requestBody: {
          ids: messageIds,
        },
      })
      .then((response) => {
        if (response.status !== 204) {
          log.error("delete messages not success!");
          throw response;
        }
      })
      .catch((err) => {
        log.error(`delete messages error cause: ${err}`);
        throw err;
      });
  }
}
