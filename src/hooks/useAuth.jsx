import { useAppKitAccount, useDisconnect } from '@reown/appkit/react';
import { useEffect, useCallback, useState } from 'react';
import { BACKEND_API } from '@utils/constant';
import axios from 'axios';
import useUserAuthStore from 'src/store/useUserAuthStore';
import { verifyToken } from '@utils/helper';

export default function useAuth() {
    const { address  } = useAppKitAccount();
    const { disconnect } = useDisconnect()
    const { user, token, setAuth, clearAuth } = useUserAuthStore();
    const [loading, setLoading] = useState(false);

    const verifyUser = useCallback(async () => {
        if (!address) return;
        setLoading(true);

        try {
            const localToken = token || localStorage.getItem('token');

            if (localToken) {
                let tokenData = await verifyToken(localToken);
                if (tokenData) {
                    setAuth(tokenData.user, localToken);
                    setLoading(false);
                }
                else {
                    localStorage.removeItem('token');
                }
            }


            const formData = new FormData();
            formData.append('address', address);
            const res = await axios.post(`${BACKEND_API}wallet-login/`, formData);

            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                setAuth(res.data.user, res.data.token);
                setLoading(false);
                return res.data;
            } else {
                throw new Error(res.data.error || 'Login failed');
            }

        } catch (err) {
            console.error('Auth error:', err);
            clearAuth();
            localStorage.removeItem('token');
            disconnect();
            setLoading(false);
        }
    }, [address, token]);

    useEffect(() => {
        verifyUser();
    }, [address]);

    return { user, token, verifyUser, loading };
}
