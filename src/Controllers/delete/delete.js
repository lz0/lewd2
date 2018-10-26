import db            from "../../helpers/database";
import deleteFiles   from "../../Functions/FileDeletion/deleteFiles";

async function get(req, res) {
    const deletionKey = req.params.key;
    const client = await db.connect();

    // Find the file to be deleted
    const getFileData = await client.query(`SELECT id, filename, filesha, duplicate 
                                            FROM "Uploads"
                                            WHERE deletionkey = $1;`, [deletionKey]);

    const file = getFileData.rows[0];
    // Do nothing if there is no file
    if (file === undefined) {
        return res.redirect("/");
    }

    await deleteFiles([file.filename]);
    res.send(`${file.filename} has just been deleted`);
}

function post(req, res) {

}

const validate = [

]

export { get, post, validate }