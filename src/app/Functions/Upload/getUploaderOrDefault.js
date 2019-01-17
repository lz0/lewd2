
import { db } from "../../helpers/database";
/**
 * Take a token and get the 
 * @param {string} token 
 */
const getUploader = async token => { 
    const client = await db.connect();

    const getUploader = await client.query(`SELECT id, uploadsize
                                            FROM "Users"
                                            WHERE token = $1;`, [ token ]);

    await client.release();

    return getUploader.rows[0];
};

export { getUploader }; // asflkhjasf