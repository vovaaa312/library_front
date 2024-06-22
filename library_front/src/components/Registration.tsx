import { useState } from "react";
import { Link } from "react-router-dom";
import {RegisterRequest} from "../model/request/RegisterRequest.tsx";
import AuthService from "../services/AuthService.tsx";



function Registration() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            console.log("Passwords are not equal");
            return;
        }

        const registerRequest: RegisterRequest = {
            username,
            password,
            email,
            name,
            surname
        };

        console.log("RegisterRequest:", registerRequest);

        try {
            // const role = "UZIVATEL";
            const response = await AuthService.register({ username, password,email, name, surname});
            console.log("Register successful:", response.data);
            // Handle successful login, e.g., store user data, redirect, etc.
        } catch (error) {
            console.error("Register failed:", error);
            // Handle errors, e.g., show an error message to the user
        }
        // Здесь можно добавить логику для отправки данных на сервер
    };

    return (
        <div className="container">
            <div className="card col-md-6 offset-md-3 offset-md-3">
                <div className="card-body">
                    <div className="form-group mb-2">
                        <h1>Registration</h1>
                    </div>

                    <div className="form-group mb-2">
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            placeholder="Username"
                            className="form-control"
                        />
                    </div>

                    <div className="form-group mb-2">
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Password"
                            className="form-control"
                        />
                    </div>

                    <div className="form-group mb-2">
                        <input
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type="password"
                            placeholder="Confirm password"
                            className="form-control"
                        />
                    </div>

                    <div className="form-group mb-2">
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Email"
                            className="form-control"
                        />
                    </div>

                    <div className="form-group mb-2">
                        <input
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            placeholder="Name"
                            className="form-control"
                        />
                    </div>

                    <div className="form-group mb-2">
                        <input
                            onChange={(e) => setSurname(e.target.value)}
                            type="text"
                            placeholder="Surname"
                            className="form-control"
                        />
                    </div>

                    {/*<div className="form-group mb-2">*/}
                    {/*    <select*/}
                    {/*        className="form-control"*/}
                    {/*        value={role}*/}
                    {/*        onChange={(e) => setRole(e.target.value)}*/}
                    {/*    >*/}
                    {/*        <option value="USER">USER</option>*/}
                    {/*        <option value="ADMIN">ADMIN</option>*/}
                    {/*    </select>*/}
                    {/*</div>*/}

                    <div className="form-group mb-2">
                        <button onClick={handleRegister} type="submit" className="btn btn-success">
                            Register
                        </button>
                    </div>

                    <div className="form-group mb-2">
                        <Link to="/login">
                            <button className="btn btn-danger">Back to login</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Registration;
