const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { TwitterApi } = require('twitter-api-v2');

async function main() {
  const postsDir = path.resolve(process.cwd(), 'content', 'posts');
  const historyPath = path.resolve(process.cwd(), 'data', 'tweet-history.json');

  let history = [];
  if (fs.existsSync(historyPath)) {
    history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
  }

  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  
  let unpublishedPosts = [];

  for (const file of files) {
    const fullPath = path.join(postsDir, file);
    const fileContent = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContent);
    
    if (data && data.slug && data.date) {
      if (!history.includes(data.slug)) {
        unpublishedPosts.push({
          file: fullPath,
          slug: data.slug,
          title: data.title,
          date: new Date(data.date),
          image: data.image
        });
      }
    }
  }

  if (unpublishedPosts.length === 0) {
    console.log('No unpublished posts found in the archive.');
    process.exit(0);
  }

  // Sort by date ascending (oldest first)
  unpublishedPosts.sort((a, b) => a.date - b.date);

  const postToPublish = unpublishedPosts[0];
  console.log(`Selected oldest unpublished post: ${postToPublish.slug} (Date: ${postToPublish.date})`);

  // Initialize Twitter Client
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  });

  const rwClient = client.readWrite;

  const blogBaseUrl = 'https://bichay-theo.github.io/bornbytheword-blog/p';
  const postUrl = `${blogBaseUrl}/${postToPublish.slug}`;
  const tweetText = `مقال من الأرشيف: ${postToPublish.title}\n\nلقراءة الدراسة كاملة تفضل بزيارة المدونة:\n${postUrl}`;

  let mediaIds = [];

  // Upload image if it exists
  if (postToPublish.image) {
    const imageLocalPath = path.join(process.cwd(), 'public', postToPublish.image.replace(/^\//, ''));
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

    // Update history
    history.push(postToPublish.slug);
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
    console.log('Updated tweet-history.json');
  } catch (err) {
    console.error('Error posting tweet:', err);
    process.exit(1);
  }
}

main();
