import React from 'react';
import { Link } from 'react-router-dom';
import { Bot } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container flex items-center justify-between h-16 md:h-20">
                <Link to="/" className="flex items-center gap-1.5 md:gap-2 font-bold text-lg md:text-2xl text-blue-600">
                    <Bot size={24} className="md:w-8 md:h-8" />
                    <span className="text-slate-900">AI Auto Studio</span>
                </Link>

                <div className="hidden md:flex items-center gap-10 text-sm font-medium text-slate-600">
                    <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
                    <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</a>
                    <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <Link to="/login" className="text-xs md:text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors px-2 md:px-4 py-2">
                        Log in
                    </Link>
                    <Link to="/signup" className="btn btn-primary text-xs md:text-sm py-2 px-4 md:px-5 rounded-full shadow-lg shadow-blue-500/20">
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
