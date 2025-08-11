import ActionButton from '../ActionButton/ActionButton';
import pencil from '../../assets/Pencil.png';
import trash from '../../assets/Bin.png';
import { useAuth } from '../../context/AuthContext';

const TableActions = ({ row, onEdit, onDelete }) => {
    const { user } = useAuth();

  if (!user) return <div></div>
  return (
    <div className="flex space-x-2">
      <ActionButton
        icon={pencil}
        action={() => onEdit(row)}
        title="Edit"
      />
      <ActionButton
        icon={trash}
        action={onDelete}
        className="bg-red-500 hover:bg-red-600"
        title="Delete"
      />
    </div>
  );
};

export default TableActions;