import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

dotenv.config(); 

const port = 3000;
const app = express();

// Configurar CORS para permitir múltiplas origens
app.use(cors({
    origin: [
        "https://ecommerce-task-university.vercel.app", 
        "http://localhost:3000" // Adicione aqui outras origens se necessário
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Servir arquivos estáticos do diretório 'dist'
app.use(express.static(path.join(__dirname, 'dist')));

// Rota para retornar o index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Verifique se o diretório 'uploads' existe, se não, crie-o
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Configuração do multer para uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// Adicionando fileFilter para validar tipos de arquivo
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; // Tipos de arquivo permitidos
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        // biome-ignore lint/style/noUselessElse: <explanation>
        } else {
            cb("Erro: Tipo de arquivo não permitido!");
        }
    }
});

// Diretórios para os bancos de dados
const databaseUser = path.join(__dirname, "./database/Users.json");
const databaseProducts = path.join(__dirname, "./database/Products.json");

// Rota para cadastro de usuários
app.post("/cadastro", (request, response) => {
    const { nome, email, senha } = request.body;

    fs.readFile(databaseUser, "utf8", (err, data) => {
        if (err) {
            return response.status(500).json({ message: "Erro ao ler o arquivo de usuários" });
        }

        let users = [];
        if (data) {
            users = JSON.parse(data);

            const emailExists = users.filter((user) => user.email === email);
            if (emailExists.length > 0) {
                return response.status(404).json({ message: "Usuário já existe" });
            }
        }

        const newUser = { id: uuidv4(), nome, email, senha, admin: false };
        users.push(newUser);

        fs.writeFile(databaseUser, JSON.stringify(users, null, 4), (err) => {
            if (err) {
                return response.status(500).json({ message: "Erro ao cadastrar o usuário" });
            }
            response.status(201).json({ message: "Usuário cadastrado com sucesso!", user: newUser });
        });
    });
});

// Rota de login
app.post("/login", (request, response) => {
    const { email, senha } = request.body;

    fs.readFile(databaseUser, "utf8", (err, data) => {
        if (err) {
            console.error("Erro ao ler o arquivo de usuários:", err);
            return response.status(500).json({ message: "Erro ao ler o arquivo de usuários" });
        }

        try {
            const users = JSON.parse(data);
            const verifyLogin = users.filter(user => user.email === email && user.senha === senha);

            if (verifyLogin.length > 0) {
                const token = jwt.sign(
                    { id: verifyLogin[0].id, email: verifyLogin[0].email },
                    process.env.JWT_SECRET || "J675HGFHV556dHHdAAwlOloil", // Use uma variável de ambiente para a chave secreta
                    { expiresIn: "1h" }
                );

                return response.status(200).json({ ...verifyLogin[0], token });
            }

            return response.status(401).json({ message: "Email ou Senha incorretos" });
        } catch (parseError) {
            console.error("Erro ao processar o JSON:", parseError);
            return response.status(500).json({ message: "Erro ao processar os dados dos usuários" });
        }
    });
});

// Rota para adicionar produtos
app.post("/addProdutos", upload.single("imgFile"), (request, response) => {
    const { nomeProduto, valor, quantidade } = request.body;
    const imgFile = request.file;

    if (!imgFile) {
        return response.status(400).send("Nenhuma imagem enviada");
    }

    fs.readFile(databaseProducts, "utf8", (err, data) => {
        if (err) {
            return response.status(500).json({ message: "Erro ao ler o arquivo de produtos" });
        }

        let products = [];
        if (data) {
            products = JSON.parse(data);
            const productsExists = products.filter((product) => product.nomeProduto === nomeProduto);
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
            if (err) {
                return response.status(500).json({ message: "Erro ao adicionar o produto" });
            }
            response.status(201).json({ ...newProducts });
        });
    });
});

// Rota para obter produtos
app.get("/produtos", (request, response) => {
    fs.readFile(databaseProducts, "utf8", (err, data) => {
        if (err) {
            return response.status(500).json({ message: "Erro ao ler o arquivo de produtos" });
        }

        if (data) {
            const produtos = JSON.parse(data);
            return response.status(200).json({ produtos });
        }

        return response.status(404).json({ message: "Nenhum produto encontrado" });
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
