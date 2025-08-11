const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const convertToGif = async (req, res) => {
  const { videoUrl } = req.body;
  if (!videoUrl) {
    return res.status(400).json({ error: 'videoUrl is required' });
  }

  const outputPath = path.join(__dirname, '../../public/uploads', `converted-${Date.now()}.gif`);
  try {
    await new Promise((resolve, reject) => {
      ffmpeg(videoUrl)
        .outputOptions(['-vf', 'fps=10,scale=320:-1:flags=lanczos'])
        .toFormat('gif')
        .save(outputPath)
        .on('end', resolve)
        .on('error', reject);
    });
    res.json({ gifUrl: `/uploads/${path.basename(outputPath)}` });
  } catch (error) {
    console.error('Error converting to GIF:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { convertToGif };