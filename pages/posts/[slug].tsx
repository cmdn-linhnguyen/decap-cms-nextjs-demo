import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image'; // Import Image component
import { GetStaticProps, GetStaticPaths } from 'next';
import { FullPostData, getAllPostSlugs, getPostData } from '../../lib/posts';

interface PostProps {
    postData: FullPostData;
}

export const getStaticPaths: GetStaticPaths = () => {
    const paths = getAllPostSlugs();
    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps<PostProps> = async ({ params }) => {
    const slug = params!.slug as string;
    const postData = await getPostData(slug);
    return {
        props: {
            postData,
        },
    };
};

export default function Post({ postData }: PostProps) {
    // Dùng basePath từ next.config.js để tạo đường dẫn chính xác cho GitHub Pages
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <Head>
                <title>{postData.title}</title>
                <meta name="description" content={postData.title} />
            </Head>
            <article className="prose lg:prose-xl max-w-none bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-2">{postData.title}</h1>
                <div className="text-gray-500 text-sm mb-4">
                    Ngày: {new Date(postData.date).toLocaleDateString('vi-VN')}
                </div>
                {postData.thumbnail && (
                    <div className="mb-4">
                        <Image
                            src={`${basePath}${postData.thumbnail}`} // Đường dẫn ảnh với basePath
                            alt={postData.title}
                            width={600}
                            height={300}
                            className="rounded-lg object-cover w-full h-auto"
                        />
                    </div>
                )}
                <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            </article>
            <Link href={`${basePath}/`} className="mt-8 inline-block text-blue-600 hover:underline font-medium">
                &larr; Quay lại trang chủ
            </Link>
        </div>
    );
}
