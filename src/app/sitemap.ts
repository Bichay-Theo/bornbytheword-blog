import { MetadataRoute } from 'next';
import { getPosts, getPages } from '@/lib/blogger';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  const pages = await getPages();

  const baseUrl = 'https://YOUR_GITHUB_USERNAME.github.io/bornbytheword-blog';

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/${post.slug}`,
    lastModified: new Date(post.updated),
  }));

  const pageUrls = pages.map((page) => ({
    url: `${baseUrl}/p/${page.slug}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...postUrls,
    ...pageUrls,
  ];
}
