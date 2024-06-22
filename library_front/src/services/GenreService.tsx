import axios, { AxiosResponse } from "axios";
import {Book} from "../model/book/Book.tsx";

const BASE_URL = "http://localhost:8080/api/genres";

class GenreService {
    getAll(): Promise<AxiosResponse<Book[]>> {
        return axios.get<Book[]>(`${BASE_URL}/findAll`);
    }

    getById(id: string): Promise<AxiosResponse<Book>> {
        return axios.get<Book>(`${BASE_URL}/findById/${id}`);
    }


}

export default new GenreService();