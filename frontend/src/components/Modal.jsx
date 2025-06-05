// src/components/Modal.jsx
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    const handleClickInside = (e) => {
        // Impede que o clique no conteúdo feche o modal
        e.stopPropagation();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            onClick={onClose} // clique fora (ou em qualquer lugar) fecha
        >
            <div
                className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative"
                onClick={handleClickInside} // clique dentro NÃO fecha
            >
                {children}
            </div>
        </div>
    );
};

export default Modal;
