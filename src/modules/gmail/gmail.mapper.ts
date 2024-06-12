import { GmailMessage } from "../../shared/infra/client/gmail/gmail.model";

export class GmailMapper {
  static toMessageIds = (messages: GmailMessage[]) =>
    messages.map((message) => message.id);
}
