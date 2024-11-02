import multer from "multer";
import { v4 } from "uuid";
import path, { extname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    storage: multer.diskStorage({
        destination: resolve(__dirname, "..", "..", "uploads"),
        filename: (_, file, callback) => {
            return callback(null, v4() + extname(file.originalname));
        }
    })
};
