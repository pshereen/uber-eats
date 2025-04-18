// server/utils/multerConfig.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const getStorage = (folder: string) => {
  const uploadPath = path.join(__dirname, `../uploads/${folder}`);
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });
};

// ✅ Export function that returns a multer instance with the given folder
export const getUploader = (folder: string) => multer({ storage: getStorage(folder) });
