import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";

const directory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../uploads",
);
fs.mkdirSync(directory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, done) => done(null, directory),
  filename: (_req, file, done) => {
    const extension = path.extname(file.originalname).toLowerCase() || ".jpg";
    done(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, done) => {
    if (file.mimetype.startsWith("image/")) return done(null, true);
    return done(new Error("Only image files are supported"));
  },
});
