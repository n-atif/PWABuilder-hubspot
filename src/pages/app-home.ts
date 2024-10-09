import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import axios from 'axios';
import { styles } from '../styles/shared-styles';

@customElement('app-home')
export class AppHome extends LitElement {
  @property({ type: Array }) customObjects = [];
  @property({ type: Boolean }) showEditButtons = false;
  @property({ type: Boolean }) showDeleteButtons = false;

  static styles = [
    styles,
    css`
      .container {
        max-width: 800px;
        margin: auto;
        padding: 20px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
      }
      th {
        background-color: #f2f2f2;
        text-align: left;
      }
      a {
        display: inline-block;
        margin-top: 20px;
        text-decoration: none;
        color: white;
        background-color: #007bff;
        padding: 10px 20px;
        border-radius: 4px;
      }
      .btn-delete {
        background-color: red;
        color: white;
        border: none;
        padding: 5px 10px;
        cursor: pointer;
        display: none;
      }
      .btn-delete.visible {
        display: inline-block;
      }
      .btn-toggle-delete {
        background-color: orange;
        color: white;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
        margin-left: 10px;
        border-radius: 4px;
        font-size: 16px;
      }
      .btn-edit {
        background-color: #007BFF;
        color: white;
        border: none;
        padding: 5px 10px;
        cursor: pointer;
        margin-left: 10px;
        border-radius: 4px;
        display: none;
      }
      .btn-edit.visible {
        display: inline-block;
      }
      .btn-toggle-edit {
        background-color: green;
        color: white;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
        margin-left: 10px;
        border-radius: 4px;
        font-size: 16px;
      }
    `
  ];

  connectedCallback() {
    super.connectedCallback();
    this.fetchData();
  }

  async fetchData() {
    const customObjectsApiUrl = '/api/crm/v3/objects/books?properties=book_name,author,price';
    const headers = {
      Authorization: `Bearer ${import.meta.env.VITE_PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
    };

    try {
      const resp = await axios.get(customObjectsApiUrl, { headers });
      this.customObjects = resp.data.results;
    } catch (error) {
      console.error('Error fetching custom objects data:', error.response?.data || error.message);
    }
  }

  async deleteBook(bookId: string) {
    const deleteBookApiUrl = `/api/crm/v3/objects/books/${bookId}`;
    const headers = {
      Authorization: `Bearer ${import.meta.env.VITE_PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
    };

    try {
      await axios.delete(deleteBookApiUrl, { headers });
      this.fetchData(); // Refresh the data after deletion
    } catch (error) {
      console.error('Error deleting custom object:', error.response?.data || error.message);
      alert('Error deleting custom object in HubSpot');
    }
  }

  toggleEditButtons() {
    this.showEditButtons = !this.showEditButtons;
    if (this.showEditButtons) {
      this.showDeleteButtons = false;
    }
  }

  toggleDeleteButtons() {
    this.showDeleteButtons = !this.showDeleteButtons;
  }

  handleEdit(bookId: string) {
    window.location.href = `/edit-book/${bookId}`;
  }

  render() {
    return html`
      <div class="container">
        <h1>Custom Object Table - Books</h1>
        <table class="table">
          <thead>
            <tr>
              <th>Book Name</th>
              <th>Author</th>
              <th>Price</th>
              ${this.showEditButtons || this.showDeleteButtons ? html`<th>Actions</th>` : ''}
            </tr>
          </thead>
          <tbody>
            ${this.customObjects.map(book => html`
              <tr>
                <td>${book.properties.book_name}</td>
                <td>${book.properties.author}</td>
                <td>$${book.properties.price}</td>
                ${this.showEditButtons || this.showDeleteButtons ? html`
                  <td>
                    <button class="btn-edit ${this.showEditButtons ? 'visible' : ''}" @click="${() => this.handleEdit(book.id)}">Edit</button>
                    <button class="btn-delete ${this.showDeleteButtons ? 'visible' : ''}" @click="${() => this.deleteBook(book.id)}">Delete</button>
                  </td>
                ` : ''}
              </tr>
            `)}
          </tbody>
        </table>
        <a href="/add-book">Add New Book Record</a>
        <button class="btn-toggle-edit" @click="${this.toggleEditButtons}">Edit Record</button>
        <button class="btn-toggle-delete" @click="${this.toggleDeleteButtons}">Delete Record</button>
      </div>
    `;
  }
}