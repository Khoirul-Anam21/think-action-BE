import { unlink } from "node:fs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLD_NAME,
  api_key: process.env.CLD_API_KEY,
  api_secret: process.env.CLD_API_SECRET,
});
const uploader = cloudinary.uploader;

export const deleteFileAfterUpload = async (fileName: string) => {
  unlink(fileName, (err) => {
    if (err) throw err;
    console.log(fileName + " was deleted");
  });
};

export const resourceApi = cloudinary.api;

export const getCloudinaryPublicId = (url: string) => {
  const splitStr = url.split("/");
  const lastElement = splitStr[splitStr.length - 1];
  const splitLastElement = lastElement.split(".");
  return splitLastElement[0];
};

export default uploader;
