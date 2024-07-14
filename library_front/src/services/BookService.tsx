import axios, { AxiosResponse } from "axios";
import {Book} from "../model/book/Book.tsx";

const BASE_URL = "http://localhost:8080/api/books";

class BookService {
    findAll(): Promise<AxiosResponse<Book[]>> {
        return axios.get<Book[]>(`${BASE_URL}/findAll`);
    }
    findAllByAuthorId(id: string): Promise<AxiosResponse<Book[]>> {
        return axios.get<Book[]>(`${BASE_URL}/findAll/${id}`);
    }

    findAllByCreatorId(id: string): Promise<AxiosResponse<Book[]>> {
        return axios.get<Book[]>(`${BASE_URL}/findAllByCreator/${id}`);
    }

    create(book: Book): Promise<AxiosResponse<Book>> {
        return axios.post<Book>(`${BASE_URL}/save`, book);
    }

    findById(id: string): Promise<AxiosResponse<Book>> {
        return axios.get<Book>(`${BASE_URL}/findById/${id}`);
    }

    update(
        id: string,
        book: Book
    ): Promise<AxiosResponse<Book>> {
        return axios.put<Book>(`${BASE_URL}/update/${id}`, book);
    }

    delete(id: number): Promise<AxiosResponse<void>> {
        return axios.delete<void>(`${BASE_URL}/delete/${id}`);
    }
}

export default new BookService();