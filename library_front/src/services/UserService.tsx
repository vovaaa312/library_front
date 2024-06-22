//import {RegisterRequest} from "../model/request/RegisterRequest.tsx";
import axios, {AxiosResponse} from "axios";
import {AuthUser} from "../model/AuthUser.tsx";

const BASE_URL = "http://localhost:8080/api/users";

class UserService {


    // getUserDetails(login: number): Promise<AxiosResponse<AuthUser>> {
    //     return axios.get<AuthUser>(`${BASE_URL}/${login}`);
    // }

    // getUserDetails(): Promise<AxiosResponse<AuthUser>> {
    //     return axios.get<AuthUser>(`${BASE_URL}/${"getAuthorizedUserDetails"}`);
    // }

    // changePassword(passwordRequest: NewPasswordRequest):Promise<AxiosResponse<void>>{
    //     return axios.post<void>(`${BASE_URL}/changePassword`, passwordRequest);
    // }
    //
    // changeUserRole(changeRoleRequest:ChangeRoleRequest):Promise<AxiosResponse<void>>{
    //     return axios.post<void>(`${BASE_URL}/changerole`, changeRoleRequest);
    // }
    //
    // changeUserPacId(changePacIdRequest:ChangeUserPacIdRequest):Promise<AxiosResponse<void>>{
    //     return axios.post<void>(`${BASE_URL}/changepacient`, changePacIdRequest);
    // }
    //
    // changeUserZamId(changeZamIdReques:ChangeUserZamIdRequest):Promise<AxiosResponse<void>>{
    //     return axios.post<void>(`${BASE_URL}/changezamestnanec`, changeZamIdReques);
    // }

    findAll(): Promise<AxiosResponse<AuthUser[]>> {
        return axios.get<AuthUser[]>(`${BASE_URL}/findAll`);
    }
    deleteUser(userId: number): Promise<AxiosResponse<void>> {
        return axios.delete<void>(`${BASE_URL}/${userId}`);
    }

    createUser(user: AuthUser):Promise<AxiosResponse<AuthUser>>{
        return axios.post<AuthUser>(BASE_URL,user)
    }

    updateUser(userId:number, user:AuthUser):Promise<AxiosResponse<AuthUser>>{
        return axios.put<AuthUser>(`${BASE_URL}/${userId}`, user)
    }

    getUserById(id:string):Promise<AxiosResponse<AuthUser>>{
        return axios.get<AuthUser>(`${BASE_URL}/findById/${id}`);
    }


}

export default new UserService();