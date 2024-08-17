import { useState } from 'react';
import { useRouter } from 'next/router';
import { signOut, updateProfile } from 'firebase/auth';
// import { auth } from '@/lib/firebaseConfig';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={handleOverlayClick}>
            <div className="bg-white p-6 rounded shadow-lg">
                {children}
                <button onClick={onClose} className="mt-4 p-2 bg-red-500 text-white rounded">Close</button>
            </div>
        </div>
    );
};

export default function ProfileMenu({ auth }: { auth: any }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [username, setUserName] = useState('');
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const user = auth.currentUser;

            if (user?.isAnonymous) {
                await user.delete();
            }
            await signOut(auth);
            router.push("/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
        router.push("/login");
    };

    const updateUsername = async () => {
        try {
            await updateProfile(auth.currentUser, {
                displayName: username,
              });
              setUpdateOpen(false);
        } catch (error: any) {
            alert("Error in updating name:" +  error.code);
            
        }
    }

    return (
        <div className="relative">
            {/* Profile Icon */}
            <div className="cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <img
                    src="dice5.png"  // Replace with your profile icon path
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                />
            </div>

            {/* Dropdown Menu */}
            {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
                    <div className='text-3sm pl-4 pt-2 bg-amber-100'>Welcome, {auth.currentUser.displayName}</div>
                    <ul className="text-gray-700">
                        {/* <li
                            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => router.push("/view-profile")}
                        >
                            View Profile
                        </li> */}
                        <li
                            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => setUpdateOpen(true)}
                        >
                            Update Profile
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                            onClick={handleLogout}
                        >
                            Logout
                        </li>
                    </ul>
                </div>
            )}
            <Modal isOpen={updateOpen} onClose={() => setUpdateOpen(false)}>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Gaming Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                {/* <form onSubmit={updateUsername} className="space-y-4">
                    <div>
                    </div>
                </form> */}
                    <button type='submit' onClick={updateUsername} className="mt-4 p-2 bg-blue-500 text-white rounded">Update</button>
            </Modal>
        </div>
    );
}
