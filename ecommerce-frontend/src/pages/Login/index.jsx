import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const login = { email, senha };
		
        try {
            console.log("Tentando fazer login com:", login);
            const response = await axios.post('https://ecommerce-task-university.onrender.com/login', `${login}`);
            console.log("Resposta do servidor:", response.data);

            const token = response.data.token;
            localStorage.setItem("token", token);
        } catch (error) {
            if (error.response) {
                console.log("Erro na resposta do servidor:", error.response.data);
                alert(`Erro ao logar. ${error.response.data.message}`);
            } else {
                console.log("Erro ao logar:", error.message);
                alert("Erro ao logar. Verifique suas credenciais.");
            }
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
