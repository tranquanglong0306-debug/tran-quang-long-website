import React from "react";

interface PostItem {
  title: string;
  date: string;
  read: string;
  excerpt: string;
}

interface PostsListProps {
  posts: PostItem[];
  onSelectPost: (post: any) => void;
}

export const PostsList: React.FC<PostsListProps> = ({ posts, onSelectPost }) => {
  return (
    <div className="space-y-4 font-sans">
      {posts.map((post, index) => (
        <article
          key={index}
          onClick={() => onSelectPost({
            id: `post-journal-${index}`,
            title: post.title,
            category: "Journal",
            date: post.date,
            readTime: post.read,
            summary: post.excerpt,
            content: `## ${post.title}\n\n${post.excerpt}\n\nTrong quản lý đời sống học đường và thiết kế sản phẩm số, chi tiết nhỏ nhất luôn mang sức mạnh lớn nhất. Từng đường kẻ 1px, tỷ lệ khoảng cách hay cách sắp xếp chữ viết đều phản ánh mức độ kỷ luật và tôn trọng người dùng.`
          })}
          className="group py-3.5 border-b border-white/5 hover:border-accent/40 transition-colors cursor-pointer"
        >
          <div className="flex justify-between items-baseline text-[9px] font-sans">
            <span className="num-tabular text-neutral-500">{post.date}</span>
            <span className="uppercase tracking-wider text-neutral-500 border border-white/10 px-1.5 py-0.5">
              {post.read}
            </span>
          </div>
          <h3 className="text-sm font-medium text-white mt-1.5 group-hover:text-accent transition-colors">
            {post.title}
          </h3>
          <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </article>
      ))}
    </div>
  );
};

export default PostsList;
