import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookService from "../services/BookService";
import UserService from "../services/UserService";
import GenreService from "../services/GenreService";
import FavouritesService, { FavouriteBook } from "../services/FavouritesService";
import { Book } from "../model/book/Book";
import "../styles/SearchBooks.css";

const Favourites: React.FC = () => {
    const [booksList, setBooksList] = useState<Book[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [creators, setCreators] = useState<{ [key: string]: string }>({});
    const [authors, setAuthors] = useState<{ [key: string]: string }>({});
    const [genres, setGenres] = useState<{ [key: string]: string }>({});
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: string } | null>(null);
    const [favourites, setFavourites] = useState<{ [key: string]: boolean }>({});
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.length === 0) {
            navigate('/login');
            return;
        }
        getFavouriteBooks();
    }, []);

    const getFavouriteBooks = () => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            FavouritesService.getAllByUserId(userId)
                .then((response) => {
                    const favouriteBooks: FavouriteBook[] = response.data;
                    const validFavouriteBooks = favouriteBooks.filter(fav => fav.book);
                    const bookIds = validFavouriteBooks.map(fav => fav.book);

                    const favBooks = validFavouriteBooks.reduce((acc: any, fav: any) => {
                        acc[fav.book] = true;
                        return acc;
                    }, {});
                    setFavourites(favBooks);

                    Promise.all(bookIds.map(id => BookService.findById(id)))
                        .then(bookResponses => {
                            const books = bookResponses.map(res => res.data);
                            setBooksList(books);
                            fetchUserDetails(books);
                            fetchGenreDetails(books);
                        })
                        .catch(error => {
                            console.error("Error retrieving books from BookService:", error);
                        });
                })
                .catch((error) => {
                    console.log("Error retrieving favourite books from FavouritesService:", error);
                });
        }
    };

    const fetchUserDetails = (books: Book[]) => {
        books.forEach((book) => {
            UserService.getUserById(book.creator)
                .then(response => {
                    setCreators(prev => ({ ...prev, [book.creator]: response.data.username }));
                })
                .catch(error => {
                    console.error("Error retrieving creator's username", error);
                });

            book.authors.forEach((authorId) => {
                UserService.getUserById(authorId)
                    .then(response => {
                        setAuthors(prev => ({ ...prev, [authorId]: response.data.username }));
                    })
                    .catch(error => {
                        console.error("Error retrieving author's username", error);
                    });
            });
        });
    };

    const fetchGenreDetails = (books: Book[]) => {
        books.forEach((book) => {
            book.genres.forEach((genreId) => {
                GenreService.getById(genreId)
                    .then(response => {
                        setGenres(prev => ({ ...prev, [genreId]: response.data.name }));
                    })
                    .catch(error => {
                        console.error("Error retrieving genre name", error);
                    });
            });
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const sortedBooks = React.useMemo(() => {
        let sortableBooks = [...booksList];
        if (sortConfig !== null) {
            sortableBooks.sort((a, b) => {
                let aValue = a[sortConfig.key as keyof Book];
                let bValue = b[sortConfig.key as keyof Book];

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableBooks;
    }, [booksList, sortConfig]);

    const requestSort = (key: string) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (column: string) => {
        if (sortConfig && sortConfig.key === column) {
            return sortConfig.direction === 'ascending' ? ' 🔽' : ' 🔼';
        }
        return '';
    };

    const filteredBooks = sortedBooks.filter(book =>
        book.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const showDetails = (id: string) => {
        navigate(`/books/${id}`);
    };

    const addToFavourite = (bookId: string) => {
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

    return (
        <div>
            {/*<input*/}
            {/*    type="text"*/}
            {/*    placeholder="Enter Book Title"*/}
            {/*    value={searchTerm}*/}
            {/*    onChange={handleSearchChange}*/}
            {/*    style={{ width: "100%", padding: "10px", marginBottom: "20px" }}*/}
            {/*/>*/}
            {booksList.length === 0 ? (
                <div style={{ textAlign: "center", margin: "20px" }}>
                    <p>Don't have any favorite book? Let's find you something</p>
                    <button className="btn btn-primary" onClick={() => navigate('/search')}>
                        Search
                    </button>
                </div>
            ) : (
                <div>
                    <input
                        type="text"
                        placeholder="Enter Book Title"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{width: "100%", padding: "10px", marginBottom: "20px"}}
                    />
                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th scope="col" onClick={() => requestSort('name')} className="sortable">
                                Name {getSortIndicator('name')}
                            </th>
                            <th scope="col" onClick={() => requestSort('authors')} className="sortable">
                                Authors {getSortIndicator('authors')}
                            </th>
                            <th scope="col" onClick={() => requestSort('genres')} className="sortable">
                                Genres {getSortIndicator('genres')}
                            </th>
                            <th scope="col" onClick={() => requestSort('year')} className="sortable">
                                Year {getSortIndicator('year')}
                            </th>
                            <th scope="col" onClick={() => requestSort('rating')} className="sortable">
                                Rating {getSortIndicator('rating')}
                            </th>
                            <th scope="col" onClick={() => requestSort('creator')} className="sortable">
                                Creator {getSortIndicator('creator')}
                            </th>
                            <th scope="col">Description</th>
                            <th scope="col">ACTIONS</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredBooks.map((book) => (
                            <tr key={book.id}>
                                <td>{book.name}</td>
                                <td>{book.authors.map(authorId => authors[authorId]).join(', ')}</td>
                                <td>{book.genres.map(genreId => genres[genreId]).join(', ')}</td>
                                <td>{book.year}</td>
                                <td>{book.rating}</td>
                                <td>{creators[book.creator]}</td>
                                <td>{book.description}</td>
                                <td>
                                    <button
                                        className="btn btn-info"
                                        onClick={() => showDetails(book.id)}
                                        style={{marginLeft: "10px"}}
                                    >
                                        Details
                                    </button>
                                    {renderFavouriteButton(book.id)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Favourites;
