import _ from "lodash";
import { logger } from "../../../config/logger.config";
import { GmailMessage } from "../../../shared/infra/client/gmail/gmail.model";
import { GmailRepository } from "../../../shared/infra/client/gmail/gmail.repo";
import { GmailMapper } from "../gmail.mapper";

type Result = {
  query: string;
  totalDelete: number;
};

export class ClearUnnecessaryEmailUseCase {
  private CHUNK_SIZE = 100;

  constructor(private gmailRepository: GmailRepository) {}

  async execute() {
    const queries = ["from:(firebase-noreply@google.com)"];
    const result: Result[] = [];

    for (const query of queries) {
      const messages: GmailMessage[] =
        await this.gmailRepository.getAllMessages("me", query);

      let totalDelete = 0;
      const chunks = _.chunk(messages, this.CHUNK_SIZE);

      for (const [index, chunk] of chunks.entries()) {
        logger.info(`start delete messages query: ${query} chunk: ${index}`);
        await this.gmailRepository.deleteMessages(
          GmailMapper.toMessageIds(chunk)
        );
        totalDelete += chunk.length;
      }

      result.push({
        query,
        totalDelete,
      });
      logger.info(`delete messages query: ${query} success`);
    }

    console.table(result);
  }
}
