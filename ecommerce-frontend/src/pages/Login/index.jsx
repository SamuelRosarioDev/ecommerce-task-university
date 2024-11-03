import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
require("dotenv").config();

export default function Login() {
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		const login = { email, senha };

		try {
			const response = await axios.post(`${process.env.API_URL}/login`, login);
			console.log(response.data);

			const token = response.data.token;
			localStorage.setItem("token", token);
		} catch (error) {
			alert("Erro ao logar. Verifique suas credenciais.");
			console.log("Erro ao logar:", error.message);
		}
	};

	return (
		<section>
			<form onSubmit={handleSubmit}>
				<input
					type="email"
					placeholder="Digite seu email..."
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<input
					type="password"
					placeholder="Digite sua senha..."
					value={senha}
					onChange={(e) => setSenha(e.target.value)}
					required
				/>
				<button type="submit">Logar</button>
			</form>
			<span>
				<p>
					Ainda não possui conta? <Link to="/cadastro">Clique aqui</Link>
				</p>
			</span>
		</section>
	);
}
