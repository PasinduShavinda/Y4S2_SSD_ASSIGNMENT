const path = require('path');
const express = require('express');
const multer = require('multer');
const File = require('../model/shv_rs_topic_file_model');
const Router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './TopicDocfiles');
    },
    filename(req, file, cb) {
      cb(null, `${new Date().getTime()}_${file.originalname}`);
    }
  }),
  limits: {
    fileSize: 20000000 // max file size 20MB 
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls)$/)) {
      return cb(
        new Error(
          'only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format.'
        )
      );
    }
    cb(undefined, true); // continue with upload
  }
});

Router.post(
  '/TopicUpload',
  upload.single('file'),
  async (req, res) => {
    try {
      const { ResTopicFileGroupId, ResTopicFileSupervisor, ResTopicFileTopic, ResTopicFilePanel } = req.body;
      const { path, mimetype } = req.file;
      const file = new File({
        ResTopicFileGroupId,
        ResTopicFileSupervisor,
        ResTopicFileTopic,
        ResTopicFilePanel,
        file_path: path,
        file_mimetype: mimetype
      });
      await file.save();
      res.send('file uploaded successfully.');
    } catch (error) {
      res.status(400).send('Error while uploading file. Try again later.');
    }
  },
  (error, req, res, next) => {
    if (error) {
      res.status(500).send(error.message);
    }
  }
);

Router.get('/TopicgetAllFiles', async (req, res) => {
  try {
    const files = await File.find({});
    const sortedByCreationDate = files.sort(
      (a, b) => b.createdAt - a.createdAt
    );
    res.send(sortedByCreationDate);
  } catch (error) {
    res.status(400).send('Error while getting list of files. Try again later.');
  }
});

// Router.get('/Topicdownload/:id', async (req, res) => {
//   try {
//     const file = await File.findById(req.params.id);
//     res.set({
//       'Content-Type': file.file_mimetype
//     });
//     res.sendFile(path.join(__dirname, '..', file.file_path));
//   } catch (error) {
//     res.status(400).send('Error while downloading file. Try again later.');
//   }
// });

Router.get('/Topicdownload/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    
    // Validate fileId to ensure it's safe to use as part of the file path.
    if (!isValidFileId(fileId)) {
      return res.status(400).send('Invalid file ID');
    }

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).send('File not found');
    }

    res.set({
      'Content-Type': file.file_mimetype
    });
    
    const filePath = path.join(__dirname, '..', file.file_path);
    
    // Ensure the filePath is within a safe directory.
    if (!isSafePath(filePath)) {
      console.error('Access denied for filePath:', filePath);
      return res.status(403).send('Access denied');
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error while downloading file. Try again later.');
  }
});

async function isValidFileId(id) {
  try {
    // Check if the id exists in your database
    const file = await File.findById(id);
    return !!file; // Returns true if the file exists, false otherwise
  } catch (error) {
    console.error('Error while validating file ID:', error);
    return false; // Handle any errors and return false
  }
}

const safeDirectory = path.join(__dirname, '..', 'TopicDocfiles'); // Define the safe directory

function isSafePath(filePath) {
  // Normalize the file path to handle different path separators
  const normalizedPath = path.normalize(filePath);
  
  // Check if the normalized path starts with the safe directory
  return normalizedPath.startsWith(safeDirectory);
}

module.exports = Router;