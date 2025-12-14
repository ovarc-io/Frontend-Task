import React from 'react'

const ActionButton = ({
    icon,
    action,
    disabled = false,
    title = ''
}) => {
  return (
     <button
                  onClick={(e) => { if (disabled) { e.preventDefault(); return; } action && action(e); }}
                  className={`grid place-items-center w-10 h-10 ${disabled ? 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-60' : 'bg-main'} `}
                  aria-disabled={disabled}
                  title={disabled ? 'Sign in to perform this action' : title}
                >
                  <img src={icon} alt="Action" className="w-4 h-4" />
                </button>
  )
}

export default ActionButton