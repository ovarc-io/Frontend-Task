import { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Modal from '../components/Modal';
import Header from '../components/Header';
import Table from '../components/Table/Table';
import TableActions from '../components/ActionButton/TableActions';
import Loading from './Loading';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const StoreInventory = () => {
  const { storeId } = useParams();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  
  const [activeTab, setActiveTab] = useState('books');
  const [showModal, setShowModal] = useState(false);
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedBookId, setSelectedBookId] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [bookSearchTerm, setBookSearchTerm] = useState('');

  const searchTerm = searchParams.get('search') || '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [booksData, authorsData, inventoryData, storesData] = await Promise.all([
          api.getBooks(),
          api.getAuthors(),
          api.getInventory(),
          api.getStores(),
        ]);

        setBooks(Array.isArray(booksData) ? booksData : [booksData]);
        setAuthors(Array.isArray(authorsData) ? authorsData : [authorsData]);
        setInventory(Array.isArray(inventoryData) ? inventoryData : [inventoryData]);
        
        const currentStore = Array.isArray(storesData) 
          ? storesData.find(s => s.id === parseInt(storeId, 10))
          : null;
        setStore(currentStore);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storeId]);

  const authorMap = useMemo(() => {
    return authors.reduce((map, author) => {
      map[author.id] = `${author.first_name} ${author.last_name}`;
      return map;
    }, {});
  }, [authors]);

  const storeBooks = useMemo(() => {
    const storeInventory = inventory.filter(
      (item) => item.store_id === parseInt(storeId, 10)
    );

    let booksWithInventory = books
      .filter((book) => storeInventory.some((item) => item.book_id === book.id))
      .map((book) => {
        const inventoryItem = storeInventory.find((item) => item.book_id === book.id);
        return {
          ...book,
          inventory_id: inventoryItem.id,
          price: inventoryItem.price,
          author_name: authorMap[book.author_id] || 'Unknown Author',
        };
      });

    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      booksWithInventory = booksWithInventory.filter((book) =>
        Object.values(book).some((value) =>
          String(value).toLowerCase().includes(lowerSearch)
        )
      );
    }

    return booksWithInventory;
  }, [storeId, books, inventory, searchTerm, authorMap]);

  const availableBooks = useMemo(() => {
    const storeInventory = inventory.filter(
      (item) => item.store_id === parseInt(storeId, 10)
    );
    const inventoryBookIds = new Set(storeInventory.map(item => item.book_id));
    
    let available = books
      .filter(book => !inventoryBookIds.has(book.id))
      .map(book => ({
        ...book,
        author_name: authorMap[book.author_id] || 'Unknown Author',
      }));

    if (bookSearchTerm.trim()) {
      const lowerSearch = bookSearchTerm.toLowerCase();
      available = available.filter((book) =>
        book.name.toLowerCase().includes(lowerSearch) ||
        book.author_name.toLowerCase().includes(lowerSearch)
      );
    }

    return available;
  }, [books, inventory, storeId, authorMap, bookSearchTerm]);

  const columns = useMemo(
    () => [
      { header: 'Book Id', accessorKey: 'id' },
      { header: 'Name', accessorKey: 'name' },
      { header: 'Pages', accessorKey: 'page_count' },
      { header: 'Author', accessorKey: 'author_name' },
      {
        header: 'Price',
        accessorKey: 'price',
        cell: ({ row }) =>
          editingPriceId === row.original.inventory_id ? (
            <input
              type="number"
              step="0.01"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSavePrice(row.original.inventory_id);
                if (e.key === 'Escape') handleCancelEdit();
              }}
              onBlur={() => handleSavePrice(row.original.inventory_id)}
              className="border border-gray-300 rounded p-1 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            `$${row.original.price?.toFixed(2) || '0.00'}`
          ),
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <TableActions
            row={row}
            onEdit={() => handleEditPrice(row.original)}
            onDelete={() => handleDeleteBook(row.original.inventory_id, row.original.name)}
          />
        ),
      },
    ],
    [editingPriceId, editPrice]
  );

  const handleEditPrice = (book) => {
    if (!isAuthenticated) {
      alert('Please sign in to edit books');
      return;
    }
    setEditingPriceId(book.inventory_id);
    setEditPrice(book.price?.toString() || '');
  };

  const handleSavePrice = async (inventoryId) => {
    if (!isAuthenticated) {
      alert('Please sign in to edit books');
      return;
    }

    const price = parseFloat(editPrice);
    if (isNaN(price) || price < 0) {
      alert('Please enter a valid price');
      return;
    }

    try {
      const inventoryItem = inventory.find(item => item.id === inventoryId);
      if (inventoryItem) {
        try {
          await api.updateInventoryItem(inventoryId, { ...inventoryItem, price });
        } catch {
          // Fallback: update local state
        }
        setInventory(prev =>
          prev.map(item =>
            item.id === inventoryId ? { ...item, price } : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating price:', error);
    }

    setEditingPriceId(null);
    setEditPrice('');
  };

  const handleCancelEdit = () => {
    setEditingPriceId(null);
    setEditPrice('');
  };

  const handleDeleteBook = async (inventoryId, bookName) => {
    if (!isAuthenticated) {
      alert('Please sign in to delete books');
      return;
    }

    if (window.confirm(`Are you sure you want to remove "${bookName}" from this store?`)) {
      try {
        try {
          await api.deleteInventoryItem(inventoryId);
        } catch {
          // Fallback: update local state
        }
        setInventory(prev => prev.filter(item => item.id !== inventoryId));
      } catch (error) {
        console.error('Error deleting inventory item:', error);
      }
    }
  };

  const handleAddNew = () => {
    if (!isAuthenticated) {
      alert('Please sign in to add books to inventory');
      return;
    }
    setShowModal(true);
    setSelectedBookId('');
    setNewPrice('');
    setBookSearchTerm('');
  };

  const handleSaveNewBook = async () => {
    if (!selectedBookId || !newPrice) {
      alert('Please select a book and enter a price');
      return;
    }

    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0) {
      alert('Please enter a valid price');
      return;
    }

    try {
      const newInventoryItem = {
        book_id: parseInt(selectedBookId, 10),
        store_id: parseInt(storeId, 10),
        price: price,
      };

      try {
        await api.createInventoryItem(newInventoryItem);
      } catch {
        // Fallback: update local state
      }

      const newId = inventory.length > 0 
        ? Math.max(...inventory.map(i => i.id)) + 1 
        : 1;
      setInventory(prev => [...prev, { id: newId, ...newInventoryItem }]);
      
      setShowModal(false);
      setSelectedBookId('');
      setNewPrice('');
      setBookSearchTerm('');
    } catch (error) {
      console.error('Error adding inventory item:', error);
    }
  };

  const initialBooks = useMemo(() => {
    return availableBooks.slice(0, 7);
  }, [availableBooks]);

  const filteredBooksForDropdown = useMemo(() => {
    if (!bookSearchTerm.trim()) {
      return initialBooks;
    }
    return availableBooks;
  }, [bookSearchTerm, availableBooks, initialBooks]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="py-6">
      <div className="flex mb-4 w-full justify-center items-center">
        <button
          onClick={() => setActiveTab('books')}
          className={`px-4 border-b-2 py-2 ${
            activeTab === 'books' ? 'border-b-main' : 'border-b-transparent'
          }`}
        >
          Books
        </button>
        <button
          onClick={() => setActiveTab('authors')}
          className={`px-4 border-b-2 py-2 ${
            activeTab === 'authors' ? 'border-b-main' : 'border-b-transparent'
          }`}
        >
          Authors
        </button>
      </div>

      <Header
        addNew={handleAddNew}
        title={`Store Inventory${store ? ` - ${store.name}` : ''}`}
        buttonTitle="Add to inventory"
      />

      {activeTab === 'books' ? (
        storeBooks.length > 0 ? (
          <Table data={storeBooks} columns={columns} />
        ) : (
          <p className="text-gray-600 mt-4">No books found in this store.</p>
        )
      ) : (
        <p className="text-gray-600 mt-4">No authors with books in this store.</p>
      )}

      <Modal
        title="Add Book to Store"
        save={handleSaveNewBook}
        cancel={() => {
          setShowModal(false);
          setSelectedBookId('');
          setNewPrice('');
          setBookSearchTerm('');
        }}
        show={showModal}
        setShow={setShowModal}
      >
        <div className="flex flex-col gap-4 w-full">
          <div>
            <label htmlFor="book_search" className="block text-gray-700 font-medium mb-1">
              Search Book
            </label>
            <input
              id="book_search"
              type="text"
              value={bookSearchTerm}
              onChange={(e) => setBookSearchTerm(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              placeholder="Search by book title or author..."
            />
          </div>
          <div>
            <label htmlFor="book_select" className="block text-gray-700 font-medium mb-1">
              Select Book
            </label>
            <select
              id="book_select"
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
            >
              <option value="">Select a book...</option>
              {filteredBooksForDropdown.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.name} - {book.author_name}
                </option>
              ))}
            </select>
            {filteredBooksForDropdown.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">No books available</p>
            )}
          </div>
          <div>
            <label htmlFor="price" className="block text-gray-700 font-medium mb-1">
              Price
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              placeholder="Enter Price (e.g., 29.99)"
              required
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StoreInventory;
