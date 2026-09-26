import { Link } from "react-router-dom";

import type { IPost } from "@/types";

import { useUserContext } from "@/context/AuthContext";
import { checkIsLiked } from "@/lib/utils";

type GridPostListProps = {
  posts: IPost[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  const { user } = useUserContext();

  return (
    <ul
      className="
        grid
        w-full
        grid-cols-1
        gap-4
        sm:grid-cols-2
        xl:grid-cols-3
      "
    >
      {posts.map((post) => {
        const creator =
          typeof post.creator === "string"
            ? null
            : post.creator;

        const creatorName =
          creator?.name || "Vibely user";

        const creatorImage =
          creator?.imageUrl ||
          "/assets/icons/profile-placeholder.svg";

        const likesList =
          post.likes?.map(
            (likedUser) => likedUser.$id
          ) || [];

        const isLiked = checkIsLiked(
          likesList,
          user.id
        );

        return (
          <li
            key={post.$id}
            className="
              group
              relative
              aspect-square
              min-w-0
              overflow-hidden
              rounded-[22px]
              border
              border-white/[0.06]
              bg-[#0D0D10]
              shadow-[0_12px_40px_rgba(0,0,0,0.18)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-white/[0.12]
              hover:shadow-[0_20px_55px_rgba(0,0,0,0.3)]
            "
          >
            {/* IMAGE */}

            <Link
              to={`/posts/${post.$id}`}
              className="absolute inset-0"
            >
              <img
                src={
                  post.imageUrl ||
                  "/assets/icons/profile-placeholder.svg"
                }
                alt={
                  post.caption ||
                  "Vibely post"
                }
                className="
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-500
                  ease-out
                  group-hover:scale-[1.04]
                "
              />

              {/* Permanent bottom gradient */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/80
                  via-black/5
                  to-transparent
                "
              />

              {/* Hover overlay */}
              <div
                className="
                  absolute
                  inset-0
                  bg-black/0
                  transition-colors
                  duration-300
                  group-hover:bg-black/10
                "
              />
            </Link>

            {/* TOP BADGE */}

            <div
              className="
                pointer-events-none
                absolute
                left-4
                top-4
                opacity-0
                transition-all
                duration-300
                group-hover:opacity-100
              "
            >
              <div
                className="
                  rounded-full
                  border
                  border-white/10
                  bg-black/45
                  px-3
                  py-1.5
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-white/80
                  backdrop-blur-md
                "
              >
                View post
              </div>
            </div>

            {/* BOTTOM INFORMATION */}

            <div
              className="
                pointer-events-none
                absolute
                inset-x-0
                bottom-0
                z-10
                p-4
              "
            >
              {/* Caption preview */}

              {post.caption && (
                <p
                  className="
                    mb-3
                    line-clamp-2
                    text-sm
                    leading-5
                    text-white/90
                  "
                >
                  {post.caption}
                </p>
              )}

              <div className="flex items-center justify-between gap-3">
                {/* CREATOR */}

                {showUser && (
                  <div
                    className="
                      flex
                      min-w-0
                      items-center
                      gap-2
                    "
                  >
                    <img
                      src={creatorImage}
                      alt={creatorName}
                      className="
                        h-8
                        w-8
                        shrink-0
                        rounded-full
                        border
                        border-white/15
                        object-cover
                      "
                    />

                    <p
                      className="
                        truncate
                        text-xs
                        font-medium
                        text-white
                      "
                    >
                      {creatorName}
                    </p>
                  </div>
                )}

                {/* COMPACT STATS */}

                {showStats && (
                  <div
                    className="
                      flex
                      shrink-0
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-white/10
                      bg-black/40
                      px-2.5
                      py-1.5
                      backdrop-blur-md
                    "
                  >
                    <img
                      src={
                        isLiked
                          ? "/assets/icons/liked.svg"
                          : "/assets/icons/like.svg"
                      }
                      alt=""
                      className="h-4 w-4"
                    />

                    <span className="text-[11px] font-medium text-white">
                      {likesList.length}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default GridPostList;