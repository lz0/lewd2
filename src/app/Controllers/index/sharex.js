function get(req, res) {
    res.type("sxcu; charset=utf8");
    const shareXConfig = `{
        "Name": "Local",
        "DestinationType": "ImageUploader, FileUploader",
        "RequestURL": "${process.env.SITE_LINK}upload",
        "FileFormName": "file",
        "Headers": {
          "token": "${res.locals.user.token}"
        },
        "URL": "$json:data.link$"
      }`;

    res.send(shareXConfig);
}

export { get };
