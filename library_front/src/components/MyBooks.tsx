import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookService from "../services/BookService";
import UserService from "../services/UserService";
import GenreService from "../services/GenreService";
import { Book } from "../model/book/Book";

const MyBooks: React.FC = () => {
    const [booksList, setBooksList] = useState<Book[]>([]);
    const [creators, setCreators] = useState<{ [key: string]: string }>({});
    const [authors, setAuthors] = useState<{ [key: string]: string }>({});
    const [genres, setGenres] = useState<{ [key: string]: string }>({});
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: string } | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            navigate('/login');
        } else {
            fetchMyBooks(userId);
        }
    }, []);

    const fetchMyBooks = (userId: string) => {
        BookService.findAllByCreatorId(userId)
            .then((response) => {
                setBooksList(response.data);
                fetchUserDetails(response.data);
                fetchGenreDetails(response.data);
            })
            .catch((error) => {
                console.error("Error retrieving books", error);
            });
    };

    const fetchUserDetails = (books: Book[]) => {
        books.forEach((book) => {
            UserService.getUserById(book.creator)
                .then(response => {
                    setCreators(prev => ({...prev, [book.creator]: response.data.username}));
                })
                .catch(error => {
                    console.error("Error retrieving creator's username", error);
                });

            book.authors.forEach((authorId) => {
                UserService.getUserById(authorId)
                    .then(response => {
                        setAuthors(prev => ({...prev, [authorId]: response.data.username}));
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
                        setGenres(prev => ({...prev, [genreId]: response.data.name}));
                    })
                    .catch(error => {
                        console.error("Error retrieving genre name", error);
                    });
            });
        });
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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleAddBook = () => {
        navigate("/add-book");
    };

    const showDetails = (id: string) => {
        navigate(`/books/${id}`);
    };

    const handleDelete = (id: number) => {
        BookService.delete(id)
            .then(() => {
                setBooksList(booksList.filter(book => book.id !== id));
            })
            .catch(error => {
                console.error("Error deleting book", error);
            });
    };

    const filteredBooks = sortedBooks.filter(book =>
        book.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="my-books-container">
            {booksList.length === 0 ? (
                <div className="empty-message">
                    <p>Haven't created a book yet? It's time!</p>
                    <button className="btn btn-primary" onClick={handleAddBook}>
                        Add book
                    </button>
                </div>
            ) : (
                <div>
                    <button className="btn btn-primary" onClick={handleAddBook}>
                        Add book
                    </button>

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
                            <th scope="col">Actions</th>
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
                                        className="btn btn-warning"
                                        onClick={() => navigate(`/add-book/${book.id}`)}
                                        style={{marginLeft: "10px"}}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-success"
                                        onClick={() => showDetails(book.id)}
                                        style={{marginLeft: "10px"}}
                                    >
                                        Details
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(book.id)}
                                        style={{marginLeft: "10px"}}
                                    >
                                        Delete
                                    </button>
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

export default MyBooks;
