// src/pages/Inventory.jsx
import { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import Header from '../components/Header';
import BooksTable from '../components/BooksTable';
import config from '../config';
import { useParams } from 'react-router-dom';
const Inventory = () => {
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

  useEffect(() => {
    const fetchData = async () => {
    const inventoryResponse = await fetch(`${config.defaultAPIURL}/inventory.json`)
    const inventory = await inventoryResponse.json()
    const storeInventory = inventory.filter(item => item.store_id == storeId)
    const storebooklist = storeInventory.map((item)=> item.book_id )
    const booksResponse = await fetch(`${config.defaultAPIURL}/books.json`)
    const books = await booksResponse.json()
    const authorsResponse = await fetch(`${config.defaultAPIURL}/authors.json`)
    const authors = await authorsResponse.json()
    const storeBooks = books.filter((item)=> storebooklist.includes(item.id))
    const prices = storeInventory.map((item)=> item.price)
    setBooks(storeBooks)
    setAuthors(authors)
    setPrices(prices)
    };
    fetchData();

    fetch(`${config.defaultAPIURL}/books.json`)
      .then((response) => response.json())
      .then((data) => setBooks(data));
  }, []);


  // Set active tab based on view query param
  const view = 'books';
  useEffect(() => {
    if (view === 'authors' || view === 'books') {
      setActiveTab(view);
    }
  }, [view]);

  // Modal controls
  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
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

      <Header addNew={openModal} title={`Store Inventory`} buttonTitle="Add to inventory" />

      {activeTab === 'books' ? (
        <div>
          <BooksTable
            books={books}
            authors={authors}
            prices={prices}
            editingRowId={editingRowId}
            setEditingRowId={setEditingRowId}
            editName={editName}
            setEditName={setEditName}
            setBooks={setBooks}
            deleteBook={deleteBook}

          />  
          <p className="text-gray-600">No books found in this store.</p>
        </div>
      ) : (
        <div>
          <p className="text-gray-600">No authors with books in this store.</p>
        </div>
      )}

      <Modal
        title="Add/Edit Book in Store"
        save={closeModal}
        cancel={closeModal}
        show={showModal}
        setShow={setShowModal}
      >
        <div className="flex flex-col gap-4 w-full">
          <div>
            <label htmlFor="book_select" className="block text-gray-700 font-medium mb-1">
              Select Book
            </label>
            <select
              id="book_select"
              className="border border-gray-300 rounded p-2 w-full"
            >
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-gray-700 font-medium mb-1">
              Price
            </label>
            <input
              id="price"
              type="text"
              className="border border-gray-300 rounded p-2 w-full"
              placeholder="Enter Price (e.g., 29.99)"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Inventory;