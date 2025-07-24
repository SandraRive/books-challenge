// api/index.js
import express  from "express";
import cors     from "cors";
import mongoose from "mongoose";
import dotenv   from "dotenv";
import bcrypt   from "bcryptjs";
import jwt      from "jsonwebtoken";

// Carga las variables de entorno solo una vez
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🔗 MongoDB conectado"))
  .catch(err => console.error("❌ Error MongoDB:", err));

// Esquema y modelo de Usuario
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);


// GET /challenges
app.get("/challenges", authMiddleware, async (req, res) => {
  try {
    const challenges = await Challenge.find({ user: req.userId });
    res.json(challenges);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error interno" });
  }
});


// Ruta de registro
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Usuario ya existe" });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error interno" });
  }
});

// Ruta de login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error interno" });
  }
});

// Middleware para verificar JWT
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "No autorizado" });
  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
}

// Modelo de Challenge (si aún no lo tienes)
const challengeSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  type:        { type: String, enum: ["libro", "manga", "pelicula", "serie"], required: true },
  completed:   { type: Boolean, default: false },
  user:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Challenge = mongoose.model("Challenge", challengeSchema);

// Ruta para crear un reto
app.post("/challenges", authMiddleware, async (req, res) => {
  const { title, description, type } = req.body;
  try {
    const challenge = await Challenge.create({
      title,
      description,
      type,
      user: req.userId,
    });
    res.status(201).json(challenge);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creando el reto" });
  }
});

// Puerto
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 API escuchando en puerto ${PORT}`);
});
