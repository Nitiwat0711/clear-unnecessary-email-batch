export class ConfigUtil {
  static splitConfigValueByComma(value: string): string[] {
    if (value.length === 0) {
      throw `invalid config value: ${value}`;
    }

    return value.trim().split(",");
  }
}
