import fs            from "fs";
import { promisify } from "util";
import { db }        from "../../helpers/database";
import path          from "path";

require("dotenv").config();

const unlink = promisify(fs.unlink);

/**
 * 
 * @param {Array} fileNames - List of filenames to delete 
 * @returns {boolean} gotRemoved - Due to a race condition between the AV scanners this is needed
 */
const deleteFiles = async (fileNames) => {
    const client = await db.connect();
    for (let fileName of fileNames) {
        const fullFileName = path.join(process.env.UPLOAD_DESTINATION, fileName);
    
        const getFile = await client.query(`DELETE FROM "Uploads" 
                                            WHERE filename = $1 
                                            RETURNING filesha, duplicate;`, [fileName]);
        
        // If the file has already been deleted
        if (getFile.rows.length === 0) {
            await client.release();
            return false;
        }

        if (fileName !== "robots.txt") {
            await unlink(fullFileName);
        } 
    }

    await client.release();
    return true;
};

export default deleteFiles;