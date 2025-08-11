# OVARC TASK

## A Simple Bookstore Application
[10.08.2025 16_30.webm](https://github.com/user-attachments/assets/76569485-09be-4a45-8a5c-e2aa1b88d4b1)


## Tech Stack
- **Vite**: Fast build tool and dev server.
- **React Router**: Dynamic routing with code splitting.
- **Tailwind CSS**: Utility-first CSS framework.


## Setup
1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```  

## Features
1. **Shop Page**: 
   
   It has a list of cards containing the book cover page, title & author, and which stores this book is available in. The sell button should mark this as sold but keep the card on the page.

2. **Authors Page** 

   It has a simple list of authors and two CTAs to edit the name (in-line edit) or delete the author entirely. There is a CTA & a modal too for adding a new author.

3. **Books Page** 

   It has a list of books, the number of pages, and who the author is. The edit CTA is an in-line edit for the book title.

4. **Stores Page** 

   Same as the above two. The entire row is a CTA for the next page.

5. **Store Inventory Page**

   This is where the admin adds more books to the store’s
inventory. The books should be viewable either in a list view or grouped by the author via the tab selection. The add to inventory CTA pops up a modal to select the new book and set its price.

## Project Structure
- src/pages/: Contains page components like Home, BrowseStores, Browse, BrowseAuthors, and Inventory.

- src/components/: Includes reusable UI components such as StoreCard, BookCard, AuthorCard, BooksTable, Modal, and Header.

- src/hooks/: Custom hooks like useLibraryData for data fetching and state management.

- src/assets/: Stores static assets like author images (a1.png, a2.png).

- data/: JSON files (stores.json, books.json, authors.json, inventory.json) for mock data.

Routes
- /: Home page with sections for Stores, Books, and Authors.

- /browse-stores: Browse all stores with their book counts and average prices.

- /browse: Browse all books with their authors and store availability.

- /browse-authors: Browse all authors with their published book counts.

## .env File

- after installing run this command: 
```bash
json-server --watch db.json --port 4000
```
- have in your .env:
```bash
VITE_USE_MOCK=true
VITE_MOCK_API_URL=http://localhost:4000
VITE_API_URL=http://localhost:xxxx
```

## Project's Code Review Summary 
### Repeated Logic:
Many code blocks and logic are duplicated across components.
Fix: Extract reusable functions, components, or custom hooks to follow DRY principles.

### Inconsistent Indentation:
Irregular formatting reduces readability and makes the code harder to follow.
Fix: Use a code formatter like Prettier to enforce consistent indentation across the project.

### Overuse of Inline Styling:
Inline classes and styles are heavily used, complicating style management and reuse.
Fix: Migrate styles to CSS modules, styled-components, or utility-first CSS for modular, maintainable styling.

### Large, Mixed-Responsibility Components:
Components often handle data fetching, state management, and UI rendering all together, making testing and reuse difficult.
Fix: Split components into smaller, single-responsibility units (e.g., separate data logic from presentation).

### Naming and Modularity:
Lack of standardized naming conventions and unclear module boundaries impacts scalability.
Fix: Adopt consistent naming patterns and organize code into clearly defined modules.


