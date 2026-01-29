import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle({ className }: { className?: string }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`rounded-full 
                 bg-white/10 dark:bg-white/10 backdrop-blur-xl 
                 border border-black/10 dark:border-white/10 
                 flex items-center justify-center
                 hover:scale-110 active:scale-95
                 transition-all duration-300 ease-out
                 shadow-lg hover:shadow-xl
                 group cursor-pointer
                 ${className || 'fixed z-[100] top-6 right-6 hidden lg:flex w-14 h-14'}`}
            aria-label="Toggle theme"
        >
            <div className="relative w-6 h-6">
                <Sun
                    className={`absolute inset-0 w-6 h-6 text-black dark:text-white
                     transition-all duration-500 ease-out
                     ${theme === 'light'
                            ? 'opacity-100 rotate-0 scale-100'
                            : 'opacity-0 rotate-90 scale-0'}`}
                />
                <Moon
                    className={`absolute inset-0 w-6 h-6 text-black dark:text-white
                     transition-all duration-500 ease-out
                     ${theme === 'dark'
                            ? 'opacity-100 rotate-0 scale-100'
                            : 'opacity-0 -rotate-90 scale-0'}`}
                />
            </div>
        </button>
    );
}
