import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import axios from 'axios';
import { styles } from '../styles/shared-styles';

@customElement('app-add-book')
export class AppAddBook extends LitElement {
  static styles = [
    styles,
    css`
      .container {
        max-width: 600px;
        margin: auto;
        padding: 20px;
        text-align: center;
      }
      .form-container {
        max-width: 500px;
        margin: auto;
        text-align: left;
      }
      .form-group {
        margin-bottom: 15px;
      }
      .form-control {
        width: 100%;
        padding: 10px;
        margin: 5px 0 10px 0;
        display: inline-block;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
      }
      .btn-submit {
        width: 100%;
        background-color: #4CAF50;
        color: white;
        padding: 14px 20px;
        margin: 8px 0;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .btn-submit:hover {
        background-color: #45a049;
      }
      a {
        display: block;
        margin-top: 20px;
        text-decoration: none;
        color: blue;
      }
    `
  ];

  async updateData(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const book_name = formData.get('book_name') as string;
    const author = formData.get('author') as string;
    const price = formData.get('price') as string;

    const newBook = {
      properties: {
        book_name: book_name,
        author: author,
        price: price
      }
    };

    const createBookApiUrl = '/api/crm/v3/objects/books'; // Use the proxy URL
    const headers = {
      Authorization: `Bearer ${import.meta.env.VITE_PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
    };

    try {
      await axios.post(createBookApiUrl, newBook, { headers });
      window.location.href = '/';
    } catch (error) {
      console.error('Error creating new custom object:', error.response?.data || error.message);
      alert('Error creating new custom object in HubSpot');
    }
  }

  render() {
    return html`
      <div class="container">
        <h1>Add new book record</h1>
        <form class="form-container" @submit="${this.updateData}">
          <div class="form-group">
            <label for="book_name">Book Name:</label>
            <input type="text" name="book_name" id="book_name" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="author">Author:</label>
            <input type="text" name="author" id="author" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="price">Price:</label>
            <input type="number" name="price" id="price" class="form-control" required>
          </div>
          <div class="form-group">
            <button type="submit" class="btn-submit">Submit</button>
          </div>
        </form>
        <a href="/">Return to the homepage</a>
      </div>
    `;
  }
}