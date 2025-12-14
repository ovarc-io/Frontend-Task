# OVARC TASK

## Tech Stack
- **Vite**: Fast build tool and dev server.
- **React Router**: Dynamic routing with code splitting.
- **Tailwind CSS**: Utility-first CSS framework.
- **json-server**: Mock backend server for development.


## Setup
1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Install mock server dependencies** (optional):
   ```bash
   cd mock-server && npm install && cd ..
   ```

3. **Configure environment variables** (optional):
   Create a `.env` file in the root directory:
   ```
   VITE_USE_MOCK_SERVER=true
   VITE_MOCK_API_URL=http://localhost:3001
   VITE_REAL_API_URL=http://localhost:3000/api
   ```

4. **Start the mock server** (in a separate terminal):
   ```bash
   npm run mock-server
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Build for production**:
   ```bash
   npm run build
   ```

## Authentication
- **Sign In**: Click "Sign In" button in the top bar
- **Demo Credentials**:
  - Username: `admin`, Password: `admin123`
  - Username: `user`, Password: `user123`
- **Sign Out**: Click "Sign Out" button when logged in
- **Protected Actions**: Non-logged in users cannot add/edit/delete inventory items  

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

   This is where the admin adds more books to the store's inventory. Features include:
   - View books in a table with columns: Book ID, Name, Pages, Author, Price, Actions
   - **Sorting**: Click any column header to sort (ascending/descending)
   - **Search**: Use the search bar to filter books
   - **Edit Price**: Click edit icon to inline-edit book price
   - **Delete**: Click delete icon to remove book from store inventory
   - **Add Book**: Click "Add to inventory" to add a new book with price
   - **Book Selection**: Searchable dropdown showing up to 7 initial books, with search functionality
   - **Authorization**: Only logged-in users can perform add/edit/delete operations

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

## Code Review

### Strengths

1. **Modern Tech Stack**: Uses React 19, Vite, and modern React Router with code splitting
2. **Component Structure**: Well-organized component structure with reusable components
3. **Custom Hooks**: Good use of custom hooks (useLibraryData) for data management
4. **Table Component**: Uses @tanstack/react-table for advanced table functionality
5. **Lazy Loading**: Implements route-based code splitting for better performance

### Areas for Improvement

1. **Data Fetching**
   - **Issue**: Direct fetch calls in components and hooks, no centralized API layer
   - **Improvement**: Created centralized API service layer (`src/services/api.js`) for better maintainability
   - **Benefit**: Easier to switch between mock and real backend, consistent error handling

2. **State Management**
   - **Issue**: Local state management only, no global state for user/auth
   - **Improvement**: Implemented AuthContext for global authentication state
   - **Benefit**: Consistent auth state across all components, easier to manage user sessions

3. **Error Handling**
   - **Issue**: Minimal error handling, mostly console.error
   - **Improvement**: Added try-catch blocks and fallback mechanisms
   - **Benefit**: Better user experience, graceful degradation when API fails

4. **Data Persistence**
   - **Issue**: Changes are only in memory, not persisted
   - **Improvement**: Integrated with mock server API for persistence
   - **Benefit**: Data persists across page refreshes when using mock server

5. **Environment Configuration**
   - **Issue**: No environment variable configuration
   - **Improvement**: Added .env support for API endpoints and configuration
   - **Benefit**: Easy switching between development and production environments

6. **Authentication**
   - **Issue**: No authentication system implemented
   - **Improvement**: Implemented full authentication with protected routes and actions
   - **Benefit**: Secure access control, better user experience

7. **Code Duplication**
   - **Issue**: Similar fetch patterns repeated across components
   - **Improvement**: Centralized data fetching logic in API service
   - **Benefit**: DRY principle, easier maintenance

8. **Type Safety**
   - **Recommendation**: Consider migrating to TypeScript for better type safety
   - **Benefit**: Catch errors at compile time, better IDE support

### Security Considerations

1. **Input Validation**: Forms now include validation for required fields
2. **Authentication**: Token-based authentication implemented
3. **Authorization**: Protected actions require authentication
4. **Recommendation**: Add CSRF protection if integrating with real backend

### Performance

1. **Good**: Lazy loading implemented
2. **Good**: Memoization used in useLibraryData and components
3. **Improvement**: Could add React.memo for expensive components

### Testing

- **Recommendation**: Add unit tests and integration tests
- **Benefit**: Ensure code quality and prevent regressions

### Accessibility

- **Recommendation**: Add ARIA labels and improve keyboard navigation support
- **Benefit**: Better accessibility for screen readers and keyboard users
