import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath){
            console.log("Local file path is not provided");
            return null;
        }
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        
        // console.log("File uploaded successfully",response.url);

        fs.unlinkSync(localFilePath);

        return response
    } catch (error) {
        fs.unlinkSync(localFilePath);  // remove the locally save
        // tempory file path as the upload failed
    }
    
}

const deleteOnCloudinary = async(fileUrl) => {
    const publicId = fileUrl.split("/").slice(-1)[0].split(".")[0];
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("cloudinary file deleted successfully: ",result);
        return result.result === 'ok';
    } catch (error) {
        console.error("Error deleting file on cloudinary",error)
        return false;
    }
}

export {uploadOnCloudinary,deleteOnCloudinary}