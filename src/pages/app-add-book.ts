import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
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

  @property({ type: String }) bookId: string | null = null;
  @state() private isEditMode = false;
  @state() private book = { book_name: '', author: '', price: '' };
  @state() private isLoading = true;

  async connectedCallback() {
    super.connectedCallback();
    if (this.bookId) {
      this.isEditMode = true;
      await this.fetchBookDetails(this.bookId);
    } else {
      this.isLoading = false;
    }
  }

  async fetchBookDetails(bookId: string) {
    const fetchBookApiUrl = `/api/crm/v3/objects/books/${bookId}`;
    const headers = {
      Authorization: `Bearer ${import.meta.env.VITE_PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
    };
    const params = {
      properties: 'book_name,author,price' // Specify desired properties
    };

    try {
      const response = await axios.get(fetchBookApiUrl, { headers, params });
      console.log('Full API response with properties:', response.data); // Log entire response

      const bookProperties = response.data.properties;
      this.book = {
        book_name: bookProperties.book_name || '',
        author: bookProperties.author || '',
        price: bookProperties.price || ''
      };
      console.log('Fetched book details:', this.book);
    } catch (error: any) {
      console.error('Error fetching book details:', error.response?.data || error.message);
    } finally {
      this.isLoading = false;
      this.requestUpdate();
    }
  }

  async updateData(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const book_name = formData.get('book_name') as string;
    const author = formData.get('author') as string;
    const price = formData.get('price') as string;

    const bookData = {
      properties: {
        book_name: book_name,
        author: author,
        price: price
      }
    };

    const headers = {
      Authorization: `Bearer ${import.meta.env.VITE_PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
    };

    try {
      if (this.isEditMode) {
        const updateBookApiUrl = `/api/crm/v3/objects/books/${this.bookId}`;
        await axios.patch(updateBookApiUrl, bookData, { headers });
      } else {
        const createBookApiUrl = '/api/crm/v3/objects/books';
        await axios.post(createBookApiUrl, bookData, { headers });
      }
      window.location.href = '/';
    } catch (error: any) {
      console.error('Error saving book:', error.response?.data || error.message);
      alert('Error saving book in HubSpot');
    }
  }

  render() {
    if (this.isLoading) {
      return html`<div class="container">Loading...</div>`;
    }

    return html`
      <div class="container">
        <h1>${this.isEditMode ? 'Edit Book Record' : 'Add New Book Record'}</h1>
        <form class="form-container" @submit="${this.updateData}">
          <div class="form-group">
            <label for="book_name">Book Name:</label>
            <input
              type="text"
              name="book_name"
              id="book_name"
              class="form-control"
              .value=${this.book.book_name || ''}
              required>
          </div>
          <div class="form-group">
            <label for="author">Author:</label>
            <input
              type="text"
              name="author"
              id="author"
              class="form-control"
              .value=${this.book.author || ''}
              required>
          </div>
          <div class="form-group">
            <label for="price">Price:</label>
            <input
              type="number"
              name="price"
              id="price"
              class="form-control"
              step="0.01"
              .value=${this.book.price || ''}
              required>
          </div>
          <div class="form-group">
            <button type="submit" class="btn-submit">
              ${this.isEditMode ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
        <a href="/">Return to the homepage</a>
      </div>
    `;
  }
}