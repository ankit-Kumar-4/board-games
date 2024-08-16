import { useState } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
// import { auth } from '@/lib/firebaseConfig';


export default function ProfileMenu({auth}: {auth: any}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    const handleLogout =  async () => {
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
                    <ul className="text-gray-700">
                        {/* <li
                            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => router.push("/view-profile")}
                        >
                            View Profile
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => router.push("/edit-profile")}
                        >
                            Edit Profile
                        </li> */}
                        <li
                            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                            onClick={handleLogout}
                        >
                            Logout
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
