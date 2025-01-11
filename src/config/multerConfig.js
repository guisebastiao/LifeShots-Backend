import multer from "multer";
import { mimetypes } from "../utils/mimetypes";

export const multerConfig = multer({
  fileFilter: (_req, file, cb) => {
    if (!mimetypes.includes(file.mimetype)) {
      return cb(
        new multer.MulterError(
          "O tipo de arquivo que você está enviando não é suportado."
        )
      );
    }

    return cb(null, true);
  },
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
