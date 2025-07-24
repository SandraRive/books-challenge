// api/index.js
import express  from "express";
import cors     from "cors";
import mongoose from "mongoose";
import dotenv   from "dotenv";
import bcrypt   from "bcryptjs";
import jwt      from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ——— CONEXIÓN A MONGODB —————————————————————————————
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🔗 MongoDB conectado"))
  .catch(err => console.error("❌ Error MongoDB:", err));

// ——— MODELOS ——————————————————————————————————————————

// Usuario
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// Challenge
const challengeSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  type:        { type: String, enum: ["libro", "manga", "pelicula", "serie"], required: true },
  completed:   { type: Boolean, default: false },
  user:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });
const Challenge = mongoose.model("Challenge", challengeSchema);

// Achievement
const achievementSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  key:   { type: String, required: true },
  title: { type: String, required: true },
  date:  { type: Date, default: Date.now },
});
const Achievement = mongoose.model("Achievement", achievementSchema);

// ——— HELPERS ——————————————————————————————————————————

/**
 * Otorga un logro al usuario si aún no lo tiene.
 */
async function grantAchievement(userId, key, title) {
  const exists = await Achievement.exists({ user: userId, key });
  if (!exists) {
    await Achievement.create({ user: userId, key, title });
  }
}

// ——— MIDDLEWARE ——————————————————————————————————————

/**
 * Verifica el JWT y añade `req.userId`.
 */
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

// ——— RUTAS DE AUTENTICACIÓN ——————————————————————————

/**
 * Registro de usuario.
 */
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Usuario ya existe" });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error interno" });
  }
});

/**
 * Login de usuario.
 */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error interno" });
  }
});

// ——— RUTAS DE RETOS ——————————————————————————————————

/**
 * Obtiene todos los retos del usuario autenticado.
 */
app.get("/challenges", authMiddleware, async (req, res) => {
  try {
    const challenges = await Challenge.find({ user: req.userId });
    res.json(challenges);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error interno" });
  }
});

/**
 * Crea un nuevo reto y otorga el logro de primer reto creado.
 */
app.post("/challenges", authMiddleware, async (req, res) => {
  const { title, description, type } = req.body;
  try {
    const challenge = await Challenge.create({
      title,
      description,
      type,
      user: req.userId,
    });
    // Logro: primer reto creado
    await grantAchievement(req.userId, "first_created", "Primer reto creado");
    res.status(201).json(challenge);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creando el reto" });
  }
});

/**
 * Marca o desmarca un reto como completado, y otorga logros correspondientes.
 */
app.patch("/challenges/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    // Actualiza el reto
    const challenge = await Challenge.findOneAndUpdate(
      { _id: id, user: req.userId },
      { completed },
      { new: true }
    );
    if (!challenge) {
      return res.status(404).json({ message: "Reto no encontrado" });
    }
    if (completed) {
      // Logro: primer completado
      await grantAchievement(req.userId, "first_completed", "Primer reto completado");
      // Logro: cinco completados
      const count = await Challenge.countDocuments({ user: req.userId, completed: true });
      if (count === 5) {
        await grantAchievement(req.userId, "five_completed", "¡Cinco retos completados!");
      }
    }
    res.json(challenge);
  } catch (err) {
    console.error("Error actualizando reto:", err);
    res.status(500).json({ message: "Error interno" });
  }
});

// ——— RUTA DE RANKING —————————————————————————————————

/**
 * Calcula y devuelve el ranking de usuarios por número de retos completados.
 */
app.get("/ranking", authMiddleware, async (req, res) => {
  try {
    const agg = await Challenge.aggregate([
      { $match: { completed: true } },
      { $group: { _id: "$user", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$userInfo.name",
          completedCount: "$count",
        },
      },
    ]);
    res.json(agg);
  } catch (err) {
    console.error("❌ Error obteniendo ranking:", err);
    res.status(500).json({ message: "Error interno" });
  }
});

// ——— RUTA DE LOGROS —————————————————————————————————

/**
 * Devuelve la lista de logros del usuario autenticado.
 */
app.get("/achievements", authMiddleware, async (req, res) => {
  try {
    const ach = await Achievement.find({ user: req.userId })
      .sort({ date: 1 })
      .select("-__v -user");
    res.json(ach);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo logros" });
  }
});

// ——— RUTA DE PERFIL ——————————————————————————————————

/**
 * Devuelve el perfil y estadísticas básicas del usuario.
 */
app.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("name email");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const totalCreated   = await Challenge.countDocuments({ user: req.userId });
    const totalCompleted = await Challenge.countDocuments({ user: req.userId, completed: true });
    res.json({
      name:           user.name,
      email:          user.email,
      totalCreated,
      totalCompleted,
    });
  } catch (err) {
    console.error("❌ Error en GET /me:", err);
    res.status(500).json({ message: "Error interno" });
  }
});

// ——— INICIAR SERVIDOR —————————————————————————————

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 API escuchando en puerto ${PORT}`);
});
