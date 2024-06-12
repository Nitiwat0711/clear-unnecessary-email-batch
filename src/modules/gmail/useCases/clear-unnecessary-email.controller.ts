import { GmailRepository } from "../../../shared/infra/client/gmail/gmail.repo";
import { ClearUnnecessaryEmailUseCase } from "./clear-unnecessary-email.usecase";

export class ClearUnnecessaryEmailController {
  private clearUnnecessaryEmailUseCase: ClearUnnecessaryEmailUseCase;

  constructor() {
    const gmailRepository = new GmailRepository();
    this.clearUnnecessaryEmailUseCase = new ClearUnnecessaryEmailUseCase(
      gmailRepository
    );
  }

  async execute() {
    await this.clearUnnecessaryEmailUseCase.execute();
  }
}
