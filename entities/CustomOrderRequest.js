export default class CustomOrderRequest {
  constructor({ name = '', email = '', phone = '', details = '' } = {}) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.details = details;
    this.requestedAt = new Date();
  }

  toJSON() {
    return {
      name: this.name,
      email: this.email,
      phone: this.phone,
      details: this.details,
      requestedAt: this.requestedAt.toISOString(),
    };
  }
}
