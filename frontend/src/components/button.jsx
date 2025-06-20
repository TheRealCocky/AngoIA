// src/components/ui/button.jsx
import React from 'react';

export const Button = ({ children, className = '', ...props }) => {
    return (
        <button
            className={`px-4 py-2 rounded-xl font-semibold text-white bg-[#d62828] hover:bg-[#a4161a] transition duration-200 shadow-md ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

