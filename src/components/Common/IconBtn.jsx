import React from 'react'

const IconBtn = ({text, onclick, disabled, outline=false, customClasses, type, children}) => {
    // {console.log(text, children)}
  return (
    <button
        disabled={disabled}
        onClick={onclick}
        type={type}
        className={`px-4 py-2 rounded font-semibold text-white ${outline ? 'bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white' : 'bg-blue-500 hover:bg-blue-600'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'transition duration-300 ease-in-out transform hover:scale-105'}
                ${customClasses}`}
     >
        <div className="flex flex-row gap-x-2">
            {text}
            {children}

        </div>
    </button>
  )
}

export default IconBtn
