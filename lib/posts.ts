import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// Định nghĩa Types cho dữ liệu bài viết
export interface PostMetadata {
  title: string;
  slug: string;
  date: string;
  thumbnail?: string; // Tùy chọn, vì có thể không phải bài nào cũng có ảnh
  // Thêm các trường metadata khác đã cấu hình trong config.yml
}

export interface PostData extends PostMetadata {
  id: string; // ID lấy từ tên file
}

export interface FullPostData extends PostData {
  contentHtml: string;
}

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

// Lấy tất cả dữ liệu bài viết đã sắp xếp
export function getSortedPostsData(): PostData[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      id,
      ...(matterResult.data as PostMetadata),
    } as PostData;
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) return 1;
    return -1;
  });
}

// Lấy dữ liệu chi tiết của một bài viết dựa trên slug
export async function getPostData(slug: string): Promise<FullPostData> {
  const allPosts = getSortedPostsData();
  const postMatch = allPosts.find(p => p.slug === slug);

  if (!postMatch) {
      throw new Error(`Post with slug "${slug}" not found.`);
  }

  const id = postMatch.id;
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...(matterResult.data as PostMetadata),
  } as FullPostData;
}

// Lấy tất cả slugs để Next.js tạo đường dẫn tĩnh
export function getAllPostSlugs(): { params: { slug: string } }[] {
  const allPosts = getSortedPostsData();
  return allPosts.map(post => ({
    params: { slug: post.slug },
  }));
}