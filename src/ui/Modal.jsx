import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'md', }) => {
    const modalRef = useRef(null);
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        }
        else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    const widthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200" onClick={(e) => {
        if (e.target === e.currentTarget)
            onClose();
    }} role="dialog" aria-modal="true">
        <div ref={modalRef} className={`w-full ${widthClasses[maxWidth]} bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200`}>
            {title && (<div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800">
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                    {title}
                </h3>
                <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer" aria-label="Close dialog">
                    <X className="w-5 h-5" />
                </button>
            </div>)}
            <div className="p-6">{children}</div>
        </div>
    </div>);
};
Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.node,
    children: PropTypes.node,
    maxWidth: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
};
