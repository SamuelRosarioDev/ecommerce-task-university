import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
	const [nome, setNome] = useState("");
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		const newUser = {
			nome,
			email,
			senha,
		};

		try {
			const response = await axios.post("https://ecommerce-task-university.onrender.com/cadastro",newUser);
			console.log(response.data);
		} catch (error) {
			console.log("Erro ao cadastrar:", error.message);
		}
	};

	return (
		<section>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					value={nome}
					onChange={(e) => setNome(e.target.value)}
					placeholder="Digite seu nome..."
				/>

				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Digite seu email..."
				/>

				<input
					type="password"
					value={senha}
					onChange={(e) => setSenha(e.target.value)}
					placeholder="Digite sua senha..."
				/>
				<button type="submit">Cadastrar</button>
				<span>
					<p>
						Já possui conta? <Link to="/login">Clique aqui</Link>
					</p>
				</span>
			</form>
		</section>
	);
}
