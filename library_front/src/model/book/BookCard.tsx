import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserService from "../../services/UserService";
import GenreService from "../../services/GenreService";
import { Book } from "./Book.tsx";

interface BookCardProps {
    book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
    const [creatorName, setCreatorName] = useState<string>("Unknown");
    const [authorNames, setAuthorNames] = useState<string[]>([]);
    const [genreNames, setGenreNames] = useState<string[]>([]);

    useEffect(() => {
        // Get creator username
        UserService.getUserById(book.creator)
            .then(response => {
                setCreatorName(response.data.username);
            })
            .catch(error => {
                console.error("There was an error retrieving the creator's username!", error);
            });

        // Get authors usernames
        // const fetchAuthorNames = async () => {
        //     try {
        //         const names = await Promise.all(book.authors.map(id =>
        //             UserService.getUserById(id).then(response => response.data.username)
        //         ));
        //         setAuthorNames(names);
        //     } catch (error) {
        //         console.error("There was an error retrieving the authors' usernames!", error);
        //     }
        // };


        // Get genre names
        const fetchGenreNames = async () => {
            try {
                const names = await Promise.all(book.genres.map(id =>
                    GenreService.getById(id).then(response => response.data.name)
                ));
                setGenreNames(names);
            } catch (error) {
                console.error("There was an error retrieving the genres' names!", error);
            }
        };

        fetchGenreNames();
    }, [book.creator, book.authors, book.genres]);

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">
                    <Link className="navbar-brand" to={`/books/${book.id}`}>{book.name}</Link>
                </h5>
                <h6 className="card-subtitle mb-2 text-muted">{authorNames.join(', ')}</h6>
                <p className="card-text">Year: {book.year}</p>
                <p className="card-text">Rating: {book.rating}</p>
                <p className="card-text">{book.description}</p>
                <p className="card-text">Creator: {creatorName}</p>
                <p className="card-text">Genres: {genreNames.join(', ')}</p>
            </div>
        </div>
    );
};

export default BookCard;
