import multer from 'multer';
import { fileURLToPath } from 'url';
import fs from 'fs';
import AWS from 'aws-sdk';
import { Router } from 'express';

const router = Router();

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
console.log(__filename);
// Create an S3 client for IDrive Cloud
const endpoint = new AWS.Endpoint('s6k7.ph.idrivee2-37.com');
const s3 = new AWS.S3({
  endpoint: endpoint,
  signatureVersion: 'v4',
  s3ForcePathStyle: true,
  region: 'us-west-2',
  accessKeyId: "LmBXwcDiyu87Qs2P2kZt",
  secretAccessKey: "iYm0qJZYdp1eJ0EKPyQ9r9aW23CUfb1D7msgfvAA"
});

const publicUrl = `https://b6e5.c19.e2-5.dev/heartstribute.bucket/`;

const cloudWatch = new AWS.CloudWatch({
  endpoint: endpoint,
  region: 'us-west-2', 
});


// Route to handle file upload
router.post('/upload/:userId/:profileId?', upload.single('file'), (req, res) => {
  console.log('Uploading file:', req.file);
  if (!req.file) {
    console.error('No file uploaded.');
    return res.status(400).send('No file uploaded.');
  }

  const fileType = req.file.mimetype;
  console.log(fileType);

  const fileStream = fs.createReadStream(req.file.path);
  const userId = req.params.userId; 
  const profileId = req.params.profileId;

  const folderPath = profileId ? `${userId}/${profileId}/` : `${userId}/`;

  const key = `ProfileManager/${folderPath}${new Date().toISOString()}-${req.file.originalname}`;

  const params = {
    Bucket: 'heartstribute.bucket',
    Key: key,
    Body: fileStream,
    ContentType: fileType,
    ACL: 'public-read',
    ContentDisposition: 'inline'
  };

  s3.putObject(params, (err, data) => {

    fs.unlinkSync(req.file.path);
    if (err) {
      console.error('Error uploading file: ', err);
      return res.status(500).send('Error uploading file: ' + err.message);
    }
    const fileUrl = `${publicUrl}${params.Key}`;
    res.status(200).send({ message: 'File uploaded successfully', url: fileUrl });
  });
});

router.delete('/deleteProfile/:userId/:profileId', async (req, res) => {
  const { userId, profileId } = req.params;

  if (!userId || !profileId) {
    return res.status(400).send('UserId and ProfileId are required.');
  }

  const folderPath = `${userId}/${profileId}/`;

  const listParams = {
    Bucket: 'heartstribute.bucket',
    Prefix: `ProfileManager/${folderPath}`
  };

  try {
    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (listedObjects.Contents.length === 0) {
      return res.status(404).send('No files found in the specified folder.');
    }

    const deleteParams = {
      Bucket: 'heartstribute.bucket',
      Delete: {
        Objects: listedObjects.Contents.map(obj => ({ Key: obj.Key }))
      }
    };

    await s3.deleteObjects(deleteParams).promise();
    
    res.status(200).send({ message: 'Profile folder and its contents deleted successfully' });
  } catch (err) {
    console.error(`Error deleting profile folder: ${err.message}`);
    res.status(500).send('Error deleting profile folder: ' + err.message);
  }
});

// Route to get metrics
router.get('/metrics', async (req, res) => {
  const params = {
    Namespace: 'AWS/S3',
    MetricName: 'BucketSizeBytes',
    Dimensions: [
      {
        Name: 'BucketName',
        Value: 'heartstribute.bucket' 
      },
      {
        Name: 'StorageType',
        Value: 'StandardStorage'
      }
    ],
    StartTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
    EndTime: new Date(),
    Period: 86400, // One day in seconds
    Statistics: ['Average']
  };

  try {
    const data = await cloudWatch.getMetricStatistics(params).promise();
    res.status(200).send(data);
  } catch (err) {
    console.error('Error retrieving metrics:', err);
    res.status(500).send('Error retrieving metrics: ' + err.message);
  }
});

router.get("/test", (req, res) => {
  res.send("Hello from the IDrive Cloud API!");
});

export default router;