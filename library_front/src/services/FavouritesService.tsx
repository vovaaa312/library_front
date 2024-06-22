import axios, { AxiosResponse } from "axios";
import {Book} from "../model/book/Book.tsx";
import {FavouriteBook} from "../model/book/FavouriteBook.tsx";

const BASE_URL = "http://localhost:8080/api/favourites";

class FavouritesService {
    getAll(): Promise<AxiosResponse<FavouriteBook[]>> {
        return axios.get<FavouriteBook[]>(`${BASE_URL}/findAll`);
    }
    getAllByUserId(userId:string): Promise<AxiosResponse<FavouriteBook[]>> {
        return axios.get<FavouriteBook[]>(`${BASE_URL}/findAll/${userId}`);
    }

    save(favourite: FavouriteBook): Promise<AxiosResponse<FavouriteBook>> {
        return axios.post<FavouriteBook>(`${BASE_URL}/save`, favourite);
    }

    findById(id: string): Promise<AxiosResponse<Book>> {
        return axios.get<Book>(`${BASE_URL}/findById/${id}`);
    }
    findByBookIdAndUserId(bookId: string, userId:string): Promise<AxiosResponse<Book>> {
        return axios.get<Book>(`${BASE_URL}/findByBookId/${bookId}/andUserId/${userId}`);
    }
    delete(id: number): Promise<AxiosResponse<void>> {
        return axios.delete<void>(`${BASE_URL}/delete/${id}`);
    }
    // update(
    //     id: number,
    //     book: Book
    // ): Promise<AxiosResponse<Book>> {
    //     return axios.put<Book>(`${BASE_URL}/${id}`, book);
    // }


}

export default new FavouritesService();