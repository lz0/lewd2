import jsStringEscape      from "js-string-escape";
import db          from "../../helpers/database";
import deletionKey from "./deletionKey";

/**
 * 
 * @param {object} file 
 * @param {number} userid 
 */
const addImageToDatabase = async (file, userid) => {
    const client       = await db.connect();

    let deltionKeyCheck = true;

    // Check for unique deletion key
    do {
        file.deletionKey = deletionKey(10);
        
        const fileDeletionKeyCheck = await client.query(`SELECT id FROM "Uploads" WHERE deletionkey = $1;`, [file.deletionKey]);
        deltionKeyCheck = (fileDeletionKeyCheck.rows[0] != undefined); // The deletionkey beeds to be unique
                                                                      // IE if the above query is not undefined then it needs to generate a new token
    } while (deltionKeyCheck);

    const insertUpload = await client.query(`INSERT INTO "Uploads" (filename, originalName, filesha, userid, duplicate, uploaddate, deletionkey, size) 
                                             VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7);`, [
                                                 file.filename,
                                                 file.originalname, 
                                                 file.hash, 
                                                 userid, 
                                                 file.duplicate.toString(),
                                                 file.deletionKey,
                                                 file.size
                                                ]);
                         await client.release();
};

export default addImageToDatabase;