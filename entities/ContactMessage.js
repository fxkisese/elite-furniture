export default class ContactMessage {
  constructor({ name = '', email = '', subject = '', message = '' } = {}) {
    this.name = name;
    this.email = email;
    this.subject = subject;
    this.message = message;
    this.createdAt = new Date();
  }

  toJSON() {
    return {
      name: this.name,
      email: this.email,
      subject: this.subject,
      message: this.message,
      createdAt: this.createdAt.toISOString(),
    };
  }
}
