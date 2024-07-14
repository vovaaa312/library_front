import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Registration from "./components/Registration";
import HomePage from "./components/HomePage.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import NotFound from "./components/NotFound.tsx";
import Header from "./components/header/Header.tsx";
import BookDetails from "./model/book/BookDetails.tsx";
import SearchBooks from "./components/SearchBooks.tsx";
import Favourites from "./components/Favourites.tsx";
import AddBook from "./components/AddBook.tsx"; // Импортируем компонент AddBook
import MyBooks from "./components/MyBooks.tsx";
import withAuthCheck from "./services/withAuthCheck.tsx";

//const AuthenticatedHomePage = withAuthCheck(HomePage);
//const AuthenticatedBookDetails = withAuthCheck(BookDetails);
//const AuthenticatedSearchBooks = withAuthCheck(SearchBooks);
const AuthenticatedFavourites = withAuthCheck(Favourites);
const AuthenticatedAddBook = withAuthCheck(AddBook);
const AuthenticatedMyBooks = withAuthCheck(MyBooks);

function App() {
    return (
        <Router>
            <Header />
            <div>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/registration" element={<Registration />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/books/:id" element={<BookDetails />} />
                    <Route path="/search" element={<SearchBooks />} />
                    <Route path="/favourites" element={<AuthenticatedFavourites />} />
                    <Route path="/add-book" element={<AuthenticatedAddBook />} />
                    <Route path="/add-book/:id" element={<AuthenticatedAddBook />} /> {/* Новый маршрут */}
                    <Route path="/my-books" element={<AuthenticatedMyBooks />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
