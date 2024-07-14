import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BookService from "../services/BookService";
import UserService from "../services/UserService";
import GenreService from "../services/GenreService";
import { Book } from "../model/book/Book";
import { AuthUser } from "../model/AuthUser";
import { Genre } from "../model/book/Genre";

const AddBook: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const bookId = id || "";

    const [book, setBook] = useState<Book>({
        id: null,
        name: "",
        authors: [],
        year: 0,
        rating: 0,
        genres: [],
        description: "",
        creator: "",
    });

    const [creatorId, setCreatorId] = useState<string>("");
    const [creatorName, setCreatorName] = useState<string>("");
    const [searchAuthors, setSearchAuthors] = useState("");
    const [foundAuthors, setFoundAuthors] = useState<AuthUser[]>([]);
    const [selectedAuthors, setSelectedAuthors] = useState<AuthUser[]>([]);
    const [searchGenres, setSearchGenres] = useState("");
    const [foundGenres, setFoundGenres] = useState<Genre[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);

    const saveOrUpdateBook = async (e: React.FormEvent) => {
        e.preventDefault();

        const authorIds = selectedAuthors.map((author) => author.id);
        const genreIds = selectedGenres.map((genre) => genre.id);

        const bookToSave = {
            ...book,
            creator: creatorId,
            authors: authorIds,
            genres: genreIds,
        };

        if (id) {
            BookService.update(bookId, bookToSave)
                .then((response) => {
                    console.log(response.data);
                    navigate(-1);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            BookService.create(bookToSave)
                .then((response) => {
                    console.log(response.data);
                    navigate(-1);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    useEffect(() => {
        if (id) {
            BookService.findById(bookId)
                .then((response) => {
                    const bookData = response.data;
                    const creatorId = localStorage.getItem("userId") || "";
                    setBook({
                        ...bookData,
                        creator: creatorId,
                    });

                    setCreatorId(creatorId);

                    // Fetch full author data
                    Promise.all(
                        bookData.authors.map((authorId: string) =>
                            UserService.getUserById(authorId).then((response) => response.data)
                        )
                    ).then((authors) => {
                        setSelectedAuthors(authors);
                    });

                    // Fetch full genre data
                    Promise.all(
                        bookData.genres.map((genreId: string) =>
                            GenreService.getById(genreId).then((response) => response.data)
                        )
                    ).then((genres) => {
                        setSelectedGenres(genres);
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [id]);

    useEffect(() => {
        if (searchAuthors) {
            UserService.findAll()
                .then((response) => {
                    const filteredAuthors = response.data.filter(
                        (user) =>
                            user.name.toLowerCase().startsWith(searchAuthors.toLowerCase()) ||
                            user.surname.toLowerCase().startsWith(searchAuthors.toLowerCase())
                    );
                    setFoundAuthors(filteredAuthors);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            setFoundAuthors([]);
        }
    }, [searchAuthors]);

    useEffect(() => {
        if (searchGenres) {
            GenreService.getAll()
                .then((response) => {
                    const filteredGenres = response.data.filter((genre) =>
                        genre.name.toLowerCase().startsWith(searchGenres.toLowerCase())
                    );
                    setFoundGenres(filteredGenres);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            setFoundGenres([]);
        }
    }, [searchGenres]);

    const addAuthor = (author: AuthUser) => {
        setSelectedAuthors((prevAuthors) => [...prevAuthors, author]);
        setSearchAuthors("");
        setFoundAuthors([]);
    };

    const addGenre = (genre: Genre) => {
        setSelectedGenres((prevGenres) => [...prevGenres, genre]);
        setSearchGenres("");
        setFoundGenres([]);
    };

    const removeAuthor = (author: AuthUser) => {
        setSelectedAuthors((prevAuthors) =>
            prevAuthors.filter((a) => a.id !== author.id)
        );
    };

    const removeGenre = (genre: Genre) => {
        setSelectedGenres((prevGenres) =>
            prevGenres.filter((g) => g.id !== genre.id)
        );
    };

    const title = () => {
        return id ? (
            <h2 className="text-center">Update Book</h2>
        ) : (
            <h2 className="text-center">Add Book</h2>
        );
    };

    useEffect(() => {
        const creatorName = localStorage.getItem("name");
        const creatorSurname = localStorage.getItem("surname");
        const creatorId = localStorage.getItem("userId") || "";
        setCreatorId(creatorId);
        setCreatorName(`${creatorName} ${creatorSurname}`);
    }, []);

    return (
        <div>
            {title()}

            <div className="container">
                <div className="row">
                    <div className="card col-md-6 offset-md-3 offset-md-3">
                        <div className="card-body">
                            <form>
                                <div className="form-group mb-2">
                                    <label>Name</label>
                                    <input
                                        placeholder="-"
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        value={book.name}
                                        onChange={(e) =>
                                            setBook((prevBook) => ({
                                                ...prevBook,
                                                name: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="form-group mb-2">
                                    <label>Authors</label>
                                    <input
                                        placeholder="Type to search..."
                                        type="text"
                                        name="searchAuthors"
                                        className="form-control"
                                        value={searchAuthors}
                                        onChange={(e) => setSearchAuthors(e.target.value)}
                                    />
                                    <ul className="list-group">
                                        {foundAuthors.map((author) => (
                                            <li
                                                key={author.id}
                                                className="list-group-item"
                                                onClick={() => addAuthor(author)}
                                            >
                                                {author.name} {author.surname}
                                            </li>
                                        ))}
                                    </ul>
                                    <div>
                                        {selectedAuthors.map((author) => (
                                            <div key={author.id} className="card mt-2">
                                                <div className="card-body d-flex justify-content-between align-items-center">
                                                    {author.name} {author.surname}
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => removeAuthor(author)}
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="form-group mb-2">
                                    <label>Year</label>
                                    <input
                                        placeholder="-"
                                        type="number"
                                        name="year"
                                        className="form-control"
                                        value={book.year}
                                        onChange={(e) =>
                                            setBook((prevBook) => ({
                                                ...prevBook,
                                                year: parseInt(e.target.value, 10),
                                            }))
                                        }
                                    />
                                </div>
                                <div className="form-group mb-2">
                                    <label>Rating</label>
                                    <input
                                        placeholder="-"
                                        type="number"
                                        name="rating"
                                        className="form-control"
                                        value={book.rating}
                                        onChange={(e) =>
                                            setBook((prevBook) => ({
                                                ...prevBook,
                                                rating: parseFloat(e.target.value),
                                            }))
                                        }
                                    />
                                </div>
                                <div className="form-group mb-2">
                                    <label>Genres</label>
                                    <input
                                        placeholder="Type to search..."
                                        type="text"
                                        name="searchGenres"
                                        className="form-control"
                                        value={searchGenres}
                                        onChange={(e) => setSearchGenres(e.target.value)}
                                    />
                                    <ul className="list-group">
                                        {foundGenres.map((genre) => (
                                            <li
                                                key={genre.id}
                                                className="list-group-item"
                                                onClick={() => addGenre(genre)}
                                            >
                                                {genre.name}
                                            </li>
                                        ))}
                                    </ul>
                                    <div>
                                        {selectedGenres.map((genre) => (
                                            <div key={genre.id} className="card mt-2">
                                                <div className="card-body d-flex justify-content-between align-items-center">
                                                    {genre.name}
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => removeGenre(genre)}
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="form-group mb-2">
                                    <label>Description</label>
                                    <textarea
                                        placeholder="-"
                                        name="description"
                                        className="form-control"
                                        value={book.description}
                                        onChange={(e) =>
                                            setBook((prevBook) => ({
                                                ...prevBook,
                                                description: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="form-group mb-2">
                                    <label>Creator</label>
                                    <input
                                        placeholder="-"
                                        type="text"
                                        name="creator"
                                        className="form-control"
                                        value={creatorName}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => navigate(-1)}
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={saveOrUpdateBook}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddBook;
