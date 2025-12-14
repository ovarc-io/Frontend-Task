import React from 'react'
import ActionButton from '../ActionButton/ActionButton'
import pencil from '../../assets/Pencil.png'
import trash from '../../assets/Bin.png'

const TableActions = ({ row, onEdit, onDelete, isAuthenticated = true }) => {
  return (
    <div className="flex space-x-2">
      <ActionButton
        icon={pencil}
        action={() => onEdit(row)}
        disabled={!isAuthenticated}
        title="Edit"
      />
      <ActionButton
        icon={trash}
        action={() => onDelete(row)}
        disabled={!isAuthenticated}
        title="Delete"
        className="bg-red-500 hover:bg-red-600"
      />
    </div>
  )
}
export default TableActions;