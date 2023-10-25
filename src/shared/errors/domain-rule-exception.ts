export class DomainRuleException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainRuleException";
  }
}
