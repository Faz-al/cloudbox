const { files } = require("../utils/fileStore");

// GET files for logged-in user
const listFiles = (req, res) => {
  const userId = req.user.id;
  const userFiles = files.filter((f) => f.userId === userId);
  res.json(userFiles);
};

// REQUEST upload URL (mocked)
const getUploadUrl = (req, res) => {
  const { name, size, type } = req.body;

  // Fake file record
  const file = {
    id: Date.now().toString(),
    userId: req.user.id,
    name,
    size,
    type,
    url: "https://via.placeholder.com/300",
    createdAt: new Date(),
  };

  files.push(file);

  res.json({
    uploadUrl: "https://fake-upload-url.com",
    file,
  });
};

// DELETE file
const deleteFile = (req, res) => {
  const { id } = req.params;
  const index = files.findIndex(
    (f) => f.id === id && f.userId === req.user.id
  );

  if (index === -1) {
    return res.status(404).json({ message: "File not found" });
  }

  files.splice(index, 1);
  res.json({ message: "File deleted" });
};

module.exports = {
  listFiles,
  getUploadUrl,
  deleteFile,
};
