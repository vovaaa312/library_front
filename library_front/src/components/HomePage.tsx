import React, { useEffect, useState } from 'react';
import { Book } from "../model/Book.tsx";
import BookService from "../services/BookService.tsx";
import BookCard from "../model/book/BookCard.tsx";

const HomePage: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {


        BookService.findAll()
            .then(response => {
                setBooks(response.data);
            })
            .catch(error => {
                console.error("There was an error retrieving the books!", error);
            });
    }, []);

    const greeting = () => {
        if (localStorage.length !== 0) return "Hello, " + localStorage.getItem('name');
        else return "Welcome";
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center">{greeting()}</h1>
            <div className="row">
                {books.map((book) => (
                    <div className="col-md-4 mb-4" key={book.id}>
                        <BookCard book={book} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
