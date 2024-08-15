// components/ProtectedRoute.tsx
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/components/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    return user ? <>{children}</> : null;
};

export default ProtectedRoute;
