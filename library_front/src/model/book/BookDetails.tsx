import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookService from "../../services/BookService.tsx";
import UserService from "../../services/UserService.tsx";
import GenreService from "../../services/GenreService.tsx";
import FavouritesService from "../../services/FavouritesService.tsx";
import { Book } from "./Book.tsx";

const BookDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const [authorNames, setAuthorNames] = useState<string[]>([]);
    const [creatorName, setCreatorName] = useState<string>("Unknown");
    const [genreNames, setGenreNames] = useState<string[]>([]);
    const [isFavourite, setIsFavourite] = useState<boolean | null>(null); // Используем null для указания на загрузку состояния
    const navigate = useNavigate();

    const [favourites, setFavourites] = useState<{ [key: string]: boolean }>({}); // Новое состояние для избранного

    useEffect(() => {
        const fetchBookDetails = async () => {
            getFavouriteBooks();

            try {
                const bookResponse = await BookService.findById(id);
                const fetchedBook = bookResponse.data;
                setBook(fetchedBook);

                // Fetch author names
                const names = await Promise.all(fetchedBook.authors.map((authorId: string) =>
                    UserService.getUserById(authorId).then(res => res.data.username)
                ));
                setAuthorNames(names);

                // Fetch creator name
                const creatorResponse = await UserService.getUserById(fetchedBook.creator);
                setCreatorName(creatorResponse.data.username);

                // Fetch genre names
                const genreNames = await Promise.all(fetchedBook.genres.map((genreId: string) =>
                    GenreService.getById(genreId).then(res => res.data.name)
                ));
                setGenreNames(genreNames);

                // Check if the book is in favourites for the current user
                const userId = localStorage.getItem('userId');
                if (userId) {
                    const response = await FavouritesService.findByBookIdAndUserId(id, userId);
                    setIsFavourite(response.data !== null);
                }
            } catch (error) {
                console.error("Error retrieving book details:", error);
            }
        };

        if (id) {
            fetchBookDetails();
        }
    }, [id]); // Обновляем при изменении id
    const getFavouriteBooks = () => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            FavouritesService.getAllByUserId(userId)
                .then((response) => {
                    const favBooks = response.data.reduce((acc: any, fav: any) => {
                        acc[fav.book] = true;
                        return acc;
                    }, {});
                    setFavourites(favBooks); // Устанавливаем состояние избранных книг

                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };
    // useEffect(() => {
    //     // Проверяем избранное при изменении userId
    //     const userId = localStorage.getItem('userId');
    //     if (userId && id) {
    //         const fetchFavouriteStatus = async () => {
    //             try {
    //                 const response = await FavouritesService.findByBookIdAndUserId(id, userId);
    //                 setIsFavourite(response.data !== null);
    //             } catch (error) {
    //                 console.error("Error retrieving favourite status:", error);
    //             }
    //         };
    //
    //         fetchFavouriteStatus();
    //     }
    // }, [id, localStorage.getItem('userId')]); // Обновляем при изменении id или userId

    const addToFavourite = (bookId: string) => {
        if (localStorage.length === 0) {
            navigate('/login'); // Перенаправление на страницу login
            return;
        }

        const userId = localStorage.getItem('userId');
        if (userId) {
            const favourite = {
                id: null,
                user: userId,
                book: bookId
            };
            FavouritesService.save(favourite)
                .then(response => {
                    console.log("Book added to favourites", response.data);
                    setFavourites(prev => ({ ...prev, [bookId]: true }));
                })
                .catch(error => {
                    console.error("Error adding book to favourites", error);
                });
        } else {
            console.error("User ID not found in localStorage");
        }
    };

    const removeFromFavourite = (bookId: string) => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            FavouritesService.findByBookIdAndUserId(bookId, userId)
                .then(response => {
                    const favouriteId = response.data.id;
                    FavouritesService.delete(favouriteId)
                        .then(() => {
                            console.log("Book removed from favourites");
                            setFavourites(prev => {
                                const updatedFavs = { ...prev };
                                delete updatedFavs[bookId];
                                return updatedFavs;
                            });
                        })
                        .catch(error => {
                            console.error("Error removing book from favourites", error);
                        });
                })
                .catch(error => {
                    console.error("Error finding favourite book", error);
                });
        } else {
            console.error("User ID not found in localStorage");
        }
    };

    const renderFavouriteButton = (bookId: string) => {
        if (favourites[bookId]) {
            return (
                <button
                    className="btn btn-danger"
                    onClick={() => removeFromFavourite(bookId)}
                    style={{ marginLeft: "10px" }}
                >
                    ★
                </button>
            );
        } else {
            return (
                <button
                    className="btn btn-warning"
                    onClick={() => addToFavourite(bookId)}
                    style={{ marginLeft: "10px" }}
                >
                    ☆
                </button>
            );
        }
    };

    const handleBack = () => {
        navigate('/'); // Возвращаемся на главную страницу
    };

    if (!book) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h1>{book.name}</h1>
            <h6>by {authorNames.join(', ')}</h6>
            <p>Year: {book.year}</p>
            <p>Rating: {book.rating}</p>
            <p>Creator: {creatorName}</p>
            <p>Genres: {genreNames.join(', ')}</p>
            <p>{book.description}</p>
            <div>
                {renderFavouriteButton(book.id)}
                {/*<button className="btn btn-primary" onClick={handleBack}>*/}
                {/*    Back to Home*/}
                {/*</button>*/}
            </div>
        </div>
    );
};

export default BookDetails;
