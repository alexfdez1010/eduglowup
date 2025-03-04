export class UUID {
  static generate(): string {
    return crypto.randomUUID();
  }
}
