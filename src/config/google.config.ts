import dotenv from "dotenv";
import { ConfigUtil } from "../utils/config.util";
dotenv.config();

type GoogleConfig = {
  credentialsPath: string;
  tokenPath: string;
  scopes: string[];
};

export const googleConfig: GoogleConfig = {
  credentialsPath: process.env.GOOGLE_API_CREDENTIAL_PATH ?? "",
  tokenPath: process.env.GOOGLE_API_TOKEN_PATH ?? "",
  scopes: ConfigUtil.splitConfigValueByComma(
    process.env.GOOGLE_API_PERMISSION_SCOPES ?? ""
  ),
};
