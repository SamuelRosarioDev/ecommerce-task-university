import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

require("dotenv").config();

const port = 3000;
const app = express();

const allowedOrigin = 'https://ecommerce-task-university.vercel.app';

app.use(cors({
  origin: (origin, callback) => {
    if (origin === allowedOrigin || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

const databaseUser = path.join(__dirname, "./database/Users.json");
const databaseProducts = path.join(__dirname, "./database/Products.json");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./uploads");
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

const upload = multer({ storage });

// USERS
app.post("/cadastro", (request, response) => {
	const { nome, email, senha } = request.body;

	fs.readFile(databaseUser, "utf8", (err, data) => {
		let users = [];

		if (data) {
			users = JSON.parse(data);

			const emailExists = users.filter((user) => user.email === email);
			if (emailExists.length > 0) {
				// email ja existe nao crie outra conta com esse email
				return response.status(404).json({ message: "usuario ja existe" });
			}
		}

		const newUser = { id: uuidv4(), nome, email, senha, admin: false };
		console.log(senha);
		
		users.push(newUser);

		fs.writeFile(databaseUser, JSON.stringify(users, null, 4), (err) => {
			response
				.status(201)
				.json({ message: "Usuário cadastrado com sucesso!", user: newUser });
		});
	});
});

app.post("/login", (request, response) => {
	const { email, senha } = request.body;

	fs.readFile(databaseUser, "utf8", (err, data) => {
		if (data) {
			const users = JSON.parse(data);

			const verifyLogin = users.filter(
				(user) => user.email === email && user.senha === senha,
			);

			if (verifyLogin.length > 0) {
				const token = jwt.sign(
					{ id: verifyLogin[0].id, email: verifyLogin[0].email },
					process.env.JWT_SECRET,
					{ expiresIn: process.env.JWT_EXPIRES_IN },
				);

				return response.status(200).json({ ...verifyLogin[0], token });
			}

			return response
				.status(401)
				.json({ message: "Email ou Senha incorretos" });
		}

		return response.status(404).json({ message: "Nenhum usuário encontrado" });
	});
});

// PRODUCTS
app.post("/addProdutos", upload.single("imgFile"), (request, response) => {
	const { nomeProduto, valor, quantidade } = request.body;
	const imgFile = request.file;

	fs.readFile(databaseProducts, "utf8", (err, data) => {
		
		if (!imgFile) {
			return response.status(400).send("Nenhuma imagem enviada");
		}
		let products = [];
		if (data) {
			products = JSON.parse(data);
			const productsExists = products.filter(
				(product) => product.nomeProduto === nomeProduto,
			);
			if (productsExists.length > 0) {
				return response.status(404).json({ message: "Produto já existe" });
			}
		}
		const newProducts = {
			nomeProduto,
			valor,
			quantidade,
			imgFile: imgFile.path,
		};
		products.push(newProducts);
		
		fs.writeFile(databaseProducts, JSON.stringify(products, null, 4), (err) => {
			console.log("teste");
			
			response.status(201).json({ ...newProducts });
		});
	});
});

app.get("/produtos", (request, response) => {
	fs.readFile(databaseProducts, "utf8", (err, data) => {
		if (data) {
			const produtos = JSON.parse(data);
			return response.status(200).json({ produtos });
		}
	});
});

app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`);
});
