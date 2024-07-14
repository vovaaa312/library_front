import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const withAuthCheck = (WrappedComponent: React.FC) => {
    return (props: any) => {
        const navigate = useNavigate();

        useEffect(() => {
            const checkToken = async () => {
                try {
                    const isValid = await AuthService.isTokenValid();
                    if (!isValid) {
                        navigate('/login'); // Redirect to login if token is expired
                    }
                } catch (error) {
                    console.error(error);
                    navigate('/login'); // Redirect to login on error
                }
            };

            checkToken();
        }, [navigate]);

        return <WrappedComponent {...props} />;
    };
};

export default withAuthCheck;
