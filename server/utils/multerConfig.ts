// server/utils/multerConfig.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const getStorage = (folder: string) => {
  const safeFolder = folder && folder.trim() !== '' ? folder : 'default'; 
  const uploadPath = path.join(__dirname, `../uploads/${safeFolder}`);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, uploadPath);
    },
    filename: function (_req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });
};

export const getUploader = (folder: string) => multer({ storage: getStorage(folder) });
