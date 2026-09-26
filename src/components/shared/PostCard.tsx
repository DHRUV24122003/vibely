import { Link } from "react-router-dom";
import type { IPost } from "@/types";

import PostStats from "@/components/shared/PostStats";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";

type PostCardProps = {
  post: IPost;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();

  const creatorId =
    typeof post.creator === "string" ? post.creator : post.creator?.$id;

  const creatorName =
    typeof post.creator === "string"
      ? "Unknown"
      : post.creator?.name || "Unknown";

  const creatorImage =
    typeof post.creator === "string"
      ? "/assets/icons/profile-placeholder.svg"
      : post.creator?.imageUrl ||
        "/assets/icons/profile-placeholder.svg";

  if (!creatorId) return null;

  const tags =
    post.tags?.filter((tag) => tag && tag.trim() !== "") ?? [];

  return (
    <article
      className="
        group relative w-full overflow-hidden
        rounded-[28px]
        border border-white/[0.07]
        bg-[#0D0D10]
        shadow-[0_20px_60px_rgba(0,0,0,0.22)]
        transition-all duration-300
        hover:border-white/[0.12]
        hover:shadow-[0_24px_80px_rgba(0,0,0,0.35)]
      "
    >
      {/* Subtle top glow */}
      <div
        className="
          pointer-events-none absolute left-1/2 top-0
          h-[1px] w-[65%] -translate-x-1/2
          bg-gradient-to-r
          from-transparent via-purple-400/50 to-transparent
          opacity-0 transition-opacity duration-300
          group-hover:opacity-100
        "
      />

      {/* Creator header */}
      <div className="flex items-center justify-between px-5 pb-4 pt-5 md:px-6 md:pt-6">
        <div className="flex min-w-0 items-center gap-3.5">

          <Link
            to={`/profile/${creatorId}`}
            className="relative shrink-0"
          >
            <div
              className="
                rounded-full
                bg-gradient-to-br
                from-purple-500/80 via-indigo-500/50 to-transparent
                p-[1.5px]
              "
            >
              <img
                src={creatorImage}
                alt={creatorName}
                className="
                  h-11 w-11 rounded-full
                  bg-[#0D0D10]
                  object-cover
                  md:h-12 md:w-12
                "
              />
            </div>

            
          </Link>

          <div className="min-w-0">
            <Link to={`/profile/${creatorId}`}>
              <p
                className="
                  truncate text-[15px] font-semibold
                  text-white
                  transition-colors
                  hover:text-purple-300
                  md:text-base
                "
              >
                {creatorName}
              </p>
            </Link>

            <div className="mt-0.5 flex items-center gap-2 text-xs text-light-3">
              <span>
                {multiFormatDateString(post.$createdAt)}
              </span>

              {post.location && (
                <>
                  <span className="h-1 w-1 rounded-full bg-light-4" />

                  <span className="max-w-[150px] truncate">
                    {post.location}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Edit post */}
        {user.id === creatorId && (
          <Link
            to={`/update-post/${post.$id}`}
            className="
              flex h-9 w-9 items-center justify-center
              rounded-full
              border border-white/[0.06]
              bg-white/[0.03]
              transition-all duration-200
              hover:border-purple-400/30
              hover:bg-purple-500/10
            "
            aria-label="Edit post"
          >
            <img
              src="/assets/icons/edit.svg"
              alt=""
              className="h-[18px] w-[18px]"
            />
          </Link>
        )}
      </div>

      {/* Caption */}
      {(post.caption || tags.length > 0) && (
        <div className="px-5 pb-5 md:px-6">
          {post.caption && (
            <Link to={`/posts/${post.$id}`}>
              <p className="text-[15px] leading-6 text-light-1 md:text-base">
                {post.caption}
              </p>
            </Link>
          )}

          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag: string, index: number) => (
                <span
                  key={`${tag}-${index}`}
                  className="
                    rounded-full
                    border border-purple-400/10
                    bg-purple-500/[0.07]
                    px-2.5 py-1
                    text-xs font-medium
                    text-purple-300
                  "
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Post media */}
      <Link
        to={`/posts/${post.$id}`}
        className="block px-3 md:px-4"
      >
        <div
          className="
            relative overflow-hidden
            rounded-[22px]
            bg-[#08080A]
          "
        >
          <img
            src={
              post.imageUrl ||
              "/assets/icons/profile-placeholder.svg"
            }
            alt={post.caption || "Vibely post"}
            className="
              max-h-[680px]
              min-h-[300px]
              w-full
              object-cover
              transition-transform
              duration-500
              ease-out
              group-hover:scale-[1.01]
            "
          />

          {/* Very subtle image overlay */}
          <div
            className="
              pointer-events-none
              absolute inset-0
              bg-gradient-to-t
              from-black/10 via-transparent to-transparent
            "
          />
        </div>
      </Link>

      {/* Interaction area */}
      <div className="px-5 py-5 md:px-6">
        <PostStats post={post} userId={user.id} />
      </div>
    </article>
  );
};

export default PostCard;