const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { TwitterApi } = require('twitter-api-v2');

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Error: No file path provided.');
    process.exit(1);
  }

  const fullPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`Error: File not found at ${fullPath}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(fullPath, 'utf8');
  const { data } = matter(fileContent);

  if (!data.title || !data.slug) {
    console.error('Error: Missing title or slug in frontmatter.');
    process.exit(1);
  }

  // Initialize Twitter Client
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  });

  const rwClient = client.readWrite;

  const blogBaseUrl = 'https://bichay-theo.github.io/bornbytheword-blog';
  const postUrl = `${blogBaseUrl}/${data.slug}`;
  const tweetText = `مقال لاهوتي جديد: ${data.title}\n\nلقراءة الدراسة كاملة تفضل بزيارة المدونة:\n${postUrl}`;

  let mediaIds = [];

  // Upload image if it exists
  if (data.image) {
    // Frontmatter image path: "/images/file.png". Local path: "public/images/file.png"
    const imageLocalPath = path.join(process.cwd(), 'public', data.image.replace(/^\//, ''));
    if (fs.existsSync(imageLocalPath)) {
      try {
        console.log(`Uploading image to Twitter: ${imageLocalPath}`);
        const mediaId = await rwClient.v1.uploadMedia(imageLocalPath);
        mediaIds.push(mediaId);
      } catch (err) {
        console.error('Error uploading media:', err);
      }
    } else {
      console.warn(`Warning: Image not found at ${imageLocalPath}`);
    }
  }

  try {
    console.log('Posting tweet...');
    const tweetOptions = { text: tweetText };
    if (mediaIds.length > 0) {
      tweetOptions.media = { media_ids: mediaIds };
    }
    const response = await rwClient.v2.tweet(tweetOptions);
    console.log('Successfully posted tweet!', response.data);
  } catch (err) {
    console.error('Error posting tweet:', err);
    process.exit(1);
  }
}

main();
