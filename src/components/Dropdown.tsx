import { useState } from "react";

interface DropdownProps {
    options: string[] | number[];
    value: string | number | null;
    setValue: (value: any) => any;
}


const Dropdown: React.FC<DropdownProps> = ({ options, value, setValue }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = (option: string|number) => {
        setValue(option);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left">
            <div
                className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={toggleDropdown}
            >
                {value}
            </div>
            {isOpen && (
                <div className="absolute right-0 z-10 mt-2 w-12 rounded-md bg-white shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    <div className="p-1">
                        {options.map((option) => (
                            <div
                                key={option}
                                onClick={() => handleOptionClick(option)}
                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;