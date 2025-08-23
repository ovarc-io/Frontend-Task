// src/pages/Inventory.jsx
import { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import Header from '../components/Header';
import BooksTable from '../components/BooksTable';
import config from '../config';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Inventory = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  
  // State for UI
  const [activeTab, setActiveTab] = useState('books');
  const [showModal, setShowModal] = useState(false);
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editName, setEditName] = useState('');
  const [deleteBook, setDeleteBook] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [prices, setPrices] = useState([]);
  const { storeId } = useParams();

  // State for adding new books
  const [allBooks, setAllBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [bookPrice, setBookPrice] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync search term with URL params
  useEffect(() => {
    const search = searchParams.get('search') || '';
    setSearchTerm(search);
  }, [searchParams]);

  // Filter books based on search
  const filteredStoreBooks = books.filter((book) => {
    if (!searchTerm.trim()) return true;
    return book.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    const fetchData = async () => {
      const inventoryResponse = await fetch(`${config.defaultAPIURL}/data/inventory.json`);
      const inventory = await inventoryResponse.json();
      const storeInventory = inventory.filter(item => item.store_id == storeId);
      const storebooklist = storeInventory.map((item) => item.book_id);
      const booksResponse = await fetch(`${config.defaultAPIURL}/data/books.json`);
      const books = await booksResponse.json();
      const authorsResponse = await fetch(`${config.defaultAPIURL}/data/authors.json`);
      const authors = await authorsResponse.json();
      const storeBooks = books.filter((item) => storebooklist.includes(item.id));
      const prices = storeInventory.map((item) => item.price);
      
      setBooks(storeBooks);
      setAuthors(authors);
      setPrices(prices);
      setInventory(storeInventory);
    };
    fetchData();

    // Fetch all books for the dropdown
    fetch(`${config.defaultAPIURL}/data/books.json`)
      .then((response) => response.json())
      .then((data) => {
        setAllBooks(data);
        // Set initial filtered books (first 7)
        setFilteredBooks(data.slice(0, 7));
      });
  }, [storeId]);

  // Set active tab based on view query param
  const view = 'books';
  useEffect(() => {
    if (view === 'authors' || view === 'books') {
      setActiveTab(view);
    }
  }, [view]);



  // Modal controls
  const openModal = () => {
    setShowModal(true);
    setSelectedBookId('');
    setBookPrice('');
    setFilteredBooks(allBooks.slice(0, 7));
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBookId('');
    setBookPrice('');
    setIsSubmitting(false);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedBookId || !bookPrice) {
      alert('Please select a book and enter a price');
      return;
    }

    const price = parseFloat(bookPrice);
    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price');
      return;
    }

    // Check if book already exists in store inventory
    const existingBook = inventory.find(item => item.book_id == selectedBookId);
    if (existingBook) {
      alert('This book is already in the store inventory');
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real application, you would make an API call here
      // For now, we'll simulate adding to inventory
      const newInventoryItem = {
        id: Math.max(...inventory.map(item => item.id)) + 1,
        book_id: parseInt(selectedBookId),
        store_id: parseInt(storeId),
        price: price
      };

      // Add to local state
      setInventory([...inventory, newInventoryItem]);
      
      // Find the book details
      const selectedBook = allBooks.find(book => book.id == selectedBookId);
      if (selectedBook) {
        setBooks([...books, selectedBook]);
        setPrices([...prices, price]);
      }

      closeModal();
      alert('Book added to inventory successfully!');
    } catch (error) {
      console.error('Error adding book to inventory:', error);
      alert('Error adding book to inventory. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6">
      <div className="flex mb-4 w-full justify-center items-center">
        <button
          onClick={() => setActiveTab('books')}
          className={`px-4 border-b-2 py-2 ${activeTab === 'books' ? 'border-b-main' : 'border-b-transparent'}`}
        >
          Books
        </button>
        <button
          onClick={() => setActiveTab('authors')}
          className={`px-4 border-b-2 py-2 ${activeTab === 'authors' ? 'border-b-main' : 'border-b-transparent'}`}
        >
          Authors
        </button>
      </div>

      <Header 
        addNew={isAuthenticated() ? openModal : null} 
        title={`Store Inventory`} 
        buttonTitle={isAuthenticated() ? "Add to inventory" : null} 
      />

      {activeTab === 'books' ? (
        <div>
          {books.length > 0 ? (
            <BooksTable
              books={filteredStoreBooks}
              authors={authors}
              prices={prices}
              editingRowId={editingRowId}
              setEditingRowId={setEditingRowId}
              editName={editName}
              setEditName={setEditName}
              setBooks={setBooks}
              deleteBook={deleteBook}
              showActions={isAuthenticated()}
            />
          ) : (
            <p className="text-gray-600">
              {searchTerm.trim() ? `No books found matching "${searchTerm}" in this store.` : "No books found in this store."}
            </p>
          )}
        </div>
      ) : (
        <div>
          <p className="text-gray-600">No authors with books in this store.</p>
        </div>
      )}

      <Modal
        title="Add Book to Store Inventory"
        save={handleSubmit}
        cancel={closeModal}
        show={showModal}
        setShow={setShowModal}
        isSubmitting={isSubmitting}
      >
                 <div className="flex flex-col gap-4 w-full">

                     <div>
             <label htmlFor="book_select" className="block text-gray-700 font-medium mb-1">
               Select Book
             </label>
             <select
               id="book_select"
               className="border border-gray-300 rounded p-2 w-full"
               value={selectedBookId}
               onChange={(e) => setSelectedBookId(e.target.value)}
             >
               <option value="">Select a book...</option>
               {filteredBooks.map((book) => (
                 <option key={book.id} value={book.id}>
                   {book.name} (ISBN: {book.isbn}) - {book.format}
                 </option>
               ))}
             </select>
             <p className="text-sm text-gray-500 mt-1">
               Showing first 7 available books
             </p>
           </div>

          <div>
            <label htmlFor="price" className="block text-gray-700 font-medium mb-1">
              Price
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              className="border border-gray-300 rounded p-2 w-full"
              placeholder="Enter Price (e.g., 29.99)"
              value={bookPrice}
              onChange={(e) => setBookPrice(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Inventory;