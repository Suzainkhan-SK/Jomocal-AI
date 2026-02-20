import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="border-b border-main bg-header backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
            <div className="container flex items-center justify-between h-14 md:h-16">
                <Link to="/" className="flex items-center shrink-0 whitespace-nowrap">
                    <img
                        src="/jomocal ai logo.png"
                        alt="Jomocal AI"
                        className="w-24 md:w-32 h-auto object-contain scale-125"
                    />
                </Link>

                <div className="hidden md:flex items-center gap-10 text-sm font-medium text-secondary">
                    <a href="#features" className="hover:text-blue-500 transition-colors">Features</a>
                    <a href="#how-it-works" className="hover:text-blue-500 transition-colors">How it Works</a>
                    <a href="#pricing" className="hover:text-blue-500 transition-colors">Pricing</a>
                </div>


                <div className="flex items-center gap-1 md:gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-1.5 md:p-2 rounded-lg text-secondary hover:text-blue-500 hover:bg-surface transition-colors shrink-0"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={18} className="md:w-5 md:h-5" /> : <Moon size={18} className="md:w-5 md:h-5" />}
                    </button>

                    <Link to="/login" className="text-xs md:text-sm font-medium text-secondary hover:text-blue-500 transition-colors px-1.5 md:px-4 py-2 whitespace-nowrap">
                        Log in
                    </Link>

                    <Link to="/signup" className="btn btn-primary text-xs md:text-sm py-1.5 px-3 md:py-2 md:px-5 rounded-full shadow-lg shadow-blue-500/20 whitespace-nowrap shrink-0">
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
