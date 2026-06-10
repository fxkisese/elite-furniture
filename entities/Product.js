export default class Product {
  constructor({ id = '', title = '', description = '', price = 0, imageUrl = '' } = {}) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      price: this.price,
      imageUrl: this.imageUrl,
    };
  }
}
