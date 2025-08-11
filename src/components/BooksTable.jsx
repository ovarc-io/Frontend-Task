import  { useMemo, useState } from 'react';
import Table from './Table/Table';
import TableActions from './ActionButton/TableActions';
import { useAuth } from '../context/AuthContext';

const BooksTable = ({
  books,
  authors,
  editingRowId,
  setEditingRowId,
  editName,
  setEditName,
  setBooks,
  deleteBook,
  columnsConfig = ['id', 'name', 'pages', 'author', 'actions'], // Default columns
  showPrice = false,        // Show Price column if true
  editPriceMode = false,    // If true, edit button edits price; else edits name
}) => {
  const [editPrice, setEditPrice] = useState('');
    const { user } = useAuth();


  const authorMap = useMemo(() => {
    return authors.reduce((map, author) => {
      map[author.id] = `${author.first_name} ${author.last_name}`;
      return map;
    }, {});
  }, [authors]);

  const enrichedBooks = useMemo(() => {
    return books.map((book) => ({
      ...book,
      author_name: authorMap[book.author_id] || 'Unknown Author',
    }));
  }, [books, authorMap]);

  const allColumns = useMemo(
    () => ({
      id: { header: 'Book Id', accessorKey: 'id' },
      name: {
        header: 'Name',
        accessorKey: 'name',
        cell: ({ row }) => {
          if (editingRowId === row.original.id && !editPriceMode) {
            // Editing name
            return (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave(row.original.id);
                  if (e.key === 'Escape') handleCancel();
                }}
                className="border border-gray-300 rounded p-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            );
          }
          return row.original.name;
        },
      },
      pages: { header: 'Pages', accessorKey: 'page_count' },
      author: { header: 'Author', accessorKey: 'author_name' },
      ...(showPrice && {
        price: {
          header: 'Price',
          accessorKey: 'price',
          cell: ({ row }) => {
            if (editingRowId === row.original.id && editPriceMode) {
              // Editing price
              return (
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave(row.original.id);
                    if (e.key === 'Escape') handleCancel();
                  }}
                  className="border border-gray-300 rounded p-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  min="0"
                  step="0.01"
                />
              );
            }
            return row.original.price !== undefined ? row.original.price : '-';
          },
        },
      }),
     ...(user && { actions: {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <TableActions
            row={row}
            onEdit={
              editingRowId === row.original.id
                ? handleCancel
                : () => handleEdit(row.original)
            }
            onDelete={() => deleteBook(row.original.id, row.original.name)}
          />
        ),
      },})
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editingRowId, editName, editPrice, showPrice, editPriceMode,user]
  );

  // Compose columns based on columnsConfig + price if showPrice is true
  const columns = useMemo(() => {
    let baseCols = columnsConfig.map((colKey) => allColumns[colKey]).filter(Boolean);
    if (showPrice && !columnsConfig.includes('price')) {
      const actionsIndex = baseCols.findIndex((col) => col.id === 'actions');
      if (actionsIndex === -1) {
        baseCols.push(allColumns.price);
      } else {
        baseCols.splice(actionsIndex, 0, allColumns.price);
      }
    }
    return baseCols;
  }, [columnsConfig, allColumns, showPrice]);

  // Handle edit button click
  const handleEdit = (book) => {
    setEditingRowId(book.id);
    if (editPriceMode) {
      setEditPrice(book.price !== undefined ? book.price : '');
    } else {
      setEditName(book.name);
    }
  };

  // Save edited name or price depending on mode
  const handleSave = (id) => {
    if (editPriceMode) {
      const parsedPrice = parseFloat(editPrice);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        alert('Please enter a valid non-negative price');
        return;
      }
      setBooks(
        books.map((book) =>
          book.id === id ? { ...book, price: parsedPrice } : book
        )
      );
      setEditPrice('');
    } else {
      setBooks(
        books.map((book) =>
          book.id === id ? { ...book, name: editName } : book
        )
      );
      setEditName('');
    }
    setEditingRowId(null);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingRowId(null);
    setEditName('');
    setEditPrice('');
  };

  return <Table data={enrichedBooks} columns={columns} />;
};

export default BooksTable;