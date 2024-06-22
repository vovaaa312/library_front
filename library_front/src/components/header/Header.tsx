import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const mainContentStyle = {
    paddingBottom: '55px'
};

const linkStyle = {
    textDecoration: 'none', // Убираем подчеркивание
    margin: '10px', // Отступ между элементами
    color: 'black', // Цвет текста
};

const Header: React.FC = () => {
    const navigate = useNavigate();

    const handleAuthClick = () => {
        if (localStorage.length !== 0) {
            // Log out logic here (e.g., clear localStorage and redirect)
            localStorage.clear();
            navigate('/login');
        } else {
            // Redirect to login/registration page
            navigate('/login');
        }
    };

    const loginSpan = () => {
        return (
            <button className="btn btn-outline-dark" onClick={handleAuthClick}>
                {localStorage.length !== 0 ? 'Logout' : 'Login/Register'}
            </button>
        );
    };

    const searchSpan = () => {
        return <Link style={linkStyle} to="/search">Search</Link>;
    };
    const favouritesSpan=()=>{
        return <Link style={linkStyle} to="/favourites">Favourites</Link>;

    }
    const addBookSpan=()=>{
        return <Link style={linkStyle} to="/my-books">My books</Link>;

    }

    const authorizedMenu = () => {
        return (
            <div className="d-flex w-100 justify-content-between align-items-center">
                <div>
                    <Link style={linkStyle} to="/">HomePage</Link>
                    {searchSpan()}
                    {favouritesSpan()}
                    {addBookSpan()}
                </div>
                <div>
                    {loginSpan()}
                </div>
            </div>
        );
    };
    const unauthorizedMenu = () => {
        return (
            <div className="d-flex w-100 justify-content-between align-items-center">
                <div>
                    <Link style={linkStyle} to="/">HomePage</Link>
                    {searchSpan()}
                </div>
                <div>
                    {loginSpan()}
                </div>
            </div>
        );
    };
    const itemMenu = () => {
        if(localStorage.length===0) return unauthorizedMenu()
        return authorizedMenu();
    };

    return (
        <div style={mainContentStyle}>
            <header style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}>
                <nav className="navbar navbar-expand-md" style={{ backgroundColor: '#ff9999' }}>
                    <div className="container-fluid">
                        {itemMenu()}
                    </div>
                </nav>
            </header>
        </div>
    );
};

export default Header;
