import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image'; // Import Image component
import { GetStaticProps } from 'next';
import { PostData, getSortedPostsData } from '../lib/posts';

interface HomeProps {
  allPostsData: PostData[];
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};

export default function Home({ allPostsData }: HomeProps) {
  // Dùng basePath từ next.config.js để tạo đường dẫn chính xác cho GitHub Pages
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>My Decap CMS Blog (TS)</title>
        <meta name="description" content="A simple blog demo with Next.js and Decap CMS" />
      </Head>

      <h1 className="text-4xl font-bold mb-8 text-center">My Decap CMS Blog (TypeScript)</h1>

      <section className="space-y-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold border-b pb-2">Bài viết mới nhất</h2>
        <ul>
          {allPostsData.map(({ id, date, title, slug, thumbnail }) => (
            <li key={id} className="border p-4 rounded-lg shadow-sm bg-white hover:bg-gray-50 mb-4 flex items-center space-x-4">
              {thumbnail && (
                <Image
                  src={`${basePath}${thumbnail}`} // Đường dẫn ảnh với basePath
                  alt={title}
                  width={100}
                  height={100}
                  className="rounded-lg object-cover"
                />
              )}
              <div>
                <Link href={`${basePath}/posts/${slug}`} className="text-blue-600 hover:underline text-xl font-medium block">
                  {title}
                </Link>
                <small className="text-gray-500">
                  {new Date(date).toLocaleDateString('vi-VN')}
                </small>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-8 text-center">
        <a href={`${basePath}/admin/`} className="text-green-600 hover:underline font-semibold text-lg">Đi đến trang Admin (Decap CMS)</a>
      </p>
    </div>
  );
}
