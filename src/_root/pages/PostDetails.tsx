import { useParams, Link, useNavigate } from "react-router-dom";

import type { IPost } from "@/types";

import { Button } from "@/components/ui";
import Loader from "@/components/shared/Loader";
import GridPostList from "@/components/shared/GridPostList";
import PostStats from "@/components/shared/PostStats";

import {
  useGetPostById,
  useGetUserPosts,
  useDeletePost,
} from "@/lib/react-query/queriesAndMutations";

import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserContext();

  // =========================================================
  // CURRENT POST
  // =========================================================

  const {
    data: post,
    isLoading: isPostLoading,
    isError: isPostError,
  } = useGetPostById(id);

  // Creator can be populated object or string id
  const creatorId =
    typeof post?.creator === "string"
      ? post.creator
      : post?.creator?.$id;

  // =========================================================
  // RELATED POSTS
  // =========================================================

  const {
    data: userPosts,
    isLoading: isUserPostLoading,
    isError: isUserPostsError,
  } = useGetUserPosts(creatorId);

  const relatedPosts =
    userPosts?.documents?.filter(
      (userPost) => userPost.$id !== id
    ) ?? [];

  // =========================================================
  // DELETE
  // =========================================================

  const {
    mutate: deletePost,
    isPending: isDeleting,
  } = useDeletePost();

  const handleDeletePost = () => {
    if (!id) return;

    deletePost({
      postId: id,
      imageId: post?.imageId,
    });

    navigate(-1);
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (isPostLoading) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-[#08080A]">
        <Loader />
      </main>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (isPostError || !post) {
    return (
      <main
        className="
          flex min-h-screen w-full
          flex-col items-center justify-center
          gap-5 bg-[#08080A]
          px-5 text-center
        "
      >
        <div
          className="
            flex h-14 w-14
            items-center justify-center
            rounded-2xl
            border border-white/[0.07]
            bg-white/[0.03]
            text-light-3
          "
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6"
          >
            <path
              d="M12 8V12"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle
              cx="12"
              cy="16"
              r="1"
              fill="currentColor"
            />
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">
            Post unavailable
          </h2>

          <p className="mt-2 text-sm text-light-3">
            We couldn't load this post.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => navigate(-1)}
          className="
            rounded-xl
            border border-white/[0.07]
            bg-white/[0.04]
            px-5 text-white
            hover:bg-white/[0.07]
          "
        >
          Go back
        </Button>
      </main>
    );
  }

  // =========================================================
  // CREATOR
  // =========================================================

  const creator =
    typeof post.creator === "string"
      ? null
      : post.creator;

  const creatorName =
    creator?.name || "Vibely user";

  const creatorImage =
    creator?.imageUrl ||
    "/assets/icons/profile-placeholder.svg";

  const isCurrentUserPost =
    user.id === creatorId;

  return (
    <main
      className="
        relative
        min-h-screen
        w-full
        bg-[#08080A]
      "
    >
      {/* =====================================================
          AMBIENT BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute
            -top-[250px]
            right-[10%]
            h-[520px]
            w-[520px]
            rounded-full
            bg-violet-600/[0.055]
            blur-[170px]
          "
        />

        <div
          className="
            absolute
            bottom-[5%]
            left-[5%]
            h-[450px]
            w-[450px]
            rounded-full
            bg-indigo-500/[0.03]
            blur-[170px]
          "
        />
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section
        className="
          relative z-10
          mx-auto
          w-full
          max-w-[1250px]
          px-5
          pb-24
          pt-8
          md:px-8
          md:pt-10
          lg:px-10
          lg:pt-12
        "
      >
        {/* ===================================================
            BACK + PAGE LABEL
        =================================================== */}

        <div
          className="
            mb-8
            flex items-center
            justify-between
          "
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              group
              flex items-center
              gap-2.5
              rounded-xl
              px-1 py-2
              text-sm
              font-medium
              text-light-3
              transition-colors
              hover:text-white
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="
                h-5 w-5
                text-violet-400
                transition-transform
                duration-200
                group-hover:-translate-x-1
              "
            >
              <path
                d="M19 12H5M11 18L5 12L11 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            Back
          </button>

          <div
            className="
              hidden
              items-center
              gap-2
              md:flex
            "
          >
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />

            <span
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.22em]
                text-light-4
              "
            >
              Post
            </span>
          </div>
        </div>

        {/* ===================================================
            POST CARD
        =================================================== */}

        <article
          className="
            grid
            overflow-hidden
            rounded-[30px]
            border
            border-white/[0.07]
            bg-[#0D0D10]
            shadow-[0_30px_90px_rgba(0,0,0,0.32)]
            lg:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)]
          "
        >
          {/* =================================================
              IMAGE SIDE
          ================================================= */}

          <div
            className="
              relative
              flex
              min-h-[420px]
              items-center
              justify-center
              overflow-hidden
              bg-[#050506]
              lg:min-h-[650px]
            "
          >
            {/* Blurred background layer */}
            <img
              src={post.imageUrl}
              alt=""
              aria-hidden="true"
              className="
                absolute
                inset-0
                h-full
                w-full
                scale-110
                object-cover
                opacity-20
                blur-3xl
              "
            />

            {/* Main image */}
            <img
              src={post.imageUrl}
              alt={post.caption || "Vibely post"}
              className="
                relative
                z-10
                max-h-[720px]
                h-full
                w-full
                object-contain
              "
            />

            {/* Very subtle image edge */}
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                z-20
                ring-1
                ring-inset
                ring-white/[0.03]
              "
            />
          </div>

          {/* =================================================
              INFORMATION SIDE
          ================================================= */}

          <div
            className="
              flex
              min-h-[500px]
              flex-col
              p-6
              md:p-7
              lg:min-h-[650px]
              lg:p-8
            "
          >
            {/* ===============================================
                CREATOR HEADER
            =============================================== */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                border-b
                border-white/[0.06]
                pb-6
              "
            >
              {creatorId ? (
                <Link
                  to={`/profile/${creatorId}`}
                  className="
                    group
                    flex
                    min-w-0
                    items-center
                    gap-3.5
                  "
                >
                  {/* Avatar ring */}
                  <div
                    className="
                      rounded-full
                      bg-gradient-to-br
                      from-violet-500
                      via-indigo-500
                      to-purple-500
                      p-[1.5px]
                    "
                  >
                    <img
                      src={creatorImage}
                      alt={creatorName}
                      className="
                        h-11
                        w-11
                        rounded-full
                        border-[2px]
                        border-[#0D0D10]
                        object-cover
                        md:h-12
                        md:w-12
                      "
                    />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        truncate
                        text-sm
                        font-semibold
                        text-white
                        transition-colors
                        group-hover:text-violet-300
                      "
                    >
                      {creatorName}
                    </p>

                    <div
                      className="
                        mt-1
                        flex
                        flex-wrap
                        items-center
                        gap-1.5
                        text-[11px]
                        text-light-4
                      "
                    >
                      <span>
                        {multiFormatDateString(
                          post.$createdAt
                        )}
                      </span>

                      {post.location && (
                        <>
                          <span>•</span>

                          <span className="truncate">
                            {post.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <img
                    src={creatorImage}
                    alt={creatorName}
                    className="h-11 w-11 rounded-full object-cover"
                  />

                  <p className="text-sm font-semibold text-white">
                    {creatorName}
                  </p>
                </div>
              )}

              {/* =============================================
                  OWNER ACTIONS
              ============================================= */}

              {isCurrentUserPost && (
                <div className="flex items-center gap-2">
                  {/* EDIT */}

                  <Link
                    to={`/update-post/${post.$id}`}
                    aria-label="Edit post"
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/[0.07]
                      bg-white/[0.025]
                      text-violet-300
                      transition-all
                      duration-200
                      hover:border-violet-400/20
                      hover:bg-violet-500/[0.07]
                    "
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-[18px] w-[18px]"
                    >
                      <path
                        d="M13.5 6.5L17.5 10.5M4 20L8.5 19L19 8.5C19.8284 7.67157 19.8284 6.32843 19 5.5L18.5 5C17.6716 4.17157 16.3284 4.17157 15.5 5L5 15.5L4 20Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>

                  {/* DELETE */}

                  <Button
                    type="button"
                    variant="ghost"
                    disabled={isDeleting}
                    onClick={handleDeletePost}
                    aria-label="Delete post"
                    className="
                      flex
                      h-10
                      w-10
                      rounded-xl
                      border
                      border-white/[0.07]
                      bg-white/[0.025]
                      p-0
                      text-light-3
                      transition-all
                      hover:border-red-400/20
                      hover:bg-red-500/[0.06]
                      hover:text-red-300
                    "
                  >
                    {isDeleting ? (
                      <Loader />
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-[18px] w-[18px]"
                      >
                        <path
                          d="M4 7H20"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />

                        <path
                          d="M9 11V17M15 11V17"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />

                        <path
                          d="M6 7L7 20H17L18 7"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        <path
                          d="M9 7V4H15V7"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* ===============================================
                CAPTION
            =============================================== */}

            <div
              className="
                flex
                flex-1
                flex-col
                py-7
              "
            >
              {post.caption && (
                <p
                  className="
                    whitespace-pre-wrap
                    text-[15px]
                    leading-7
                    text-light-1
                  "
                >
                  {post.caption}
                </p>
              )}

              {/* TAGS */}

              {post.tags?.length > 0 && (
                <div
                  className="
                    mt-5
                    flex
                    flex-wrap
                    gap-2
                  "
                >
                  {post.tags.map(
                    (
                      tag: string,
                      index: number
                    ) => (
                      <span
                        key={`${tag}-${index}`}
                        className="
                          rounded-full
                          border
                          border-violet-400/10
                          bg-violet-500/[0.055]
                          px-3
                          py-1.5
                          text-[11px]
                          font-medium
                          text-violet-300
                        "
                      >
                        {tag.startsWith("#")
                          ? tag
                          : `#${tag}`}
                      </span>
                    )
                  )}
                </div>
              )}
            </div>

            {/* ===============================================
                STATS
            =============================================== */}

            <div
              className="
                border-t
                border-white/[0.06]
                pt-5
              "
            >
              <PostStats
                post={post as unknown as IPost}
                userId={user.id}
              />
            </div>
          </div>
        </article>

        {/* ===================================================
            RELATED POSTS
        =================================================== */}

        <section className="mt-14">
          <div
            className="
              mb-7
              flex
              items-end
              justify-between
              gap-5
              border-t
              border-white/[0.06]
              pt-10
            "
          >
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-violet-400
                  "
                />

                <span
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-violet-300/70
                  "
                >
                  Discover more
                </span>
              </div>

              <h2
                className="
                  text-xl
                  font-semibold
                  tracking-[-0.025em]
                  text-white
                  md:text-2xl
                "
              >
                More from {creatorName}
              </h2>

              <p className="mt-2 text-sm text-light-4">
                Explore more moments shared by this creator.
              </p>
            </div>

            {creatorId && (
              <Link
                to={`/profile/${creatorId}`}
                className="
                  hidden
                  rounded-full
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  px-4
                  py-2
                  text-xs
                  font-medium
                  text-light-2
                  transition-all
                  hover:bg-white/[0.05]
                  hover:text-white
                  sm:block
                "
              >
                View profile
              </Link>
            )}
          </div>

          {/* LOADING */}

          {isUserPostLoading ? (
            <div
              className="
                flex
                min-h-[220px]
                w-full
                items-center
                justify-center
              "
            >
              <Loader />
            </div>
          ) : isUserPostsError ? (
            /* ERROR */

            <div
              className="
                flex
                min-h-[200px]
                items-center
                justify-center
                rounded-[24px]
                border
                border-dashed
                border-white/[0.07]
                bg-white/[0.015]
              "
            >
              <p className="text-sm text-light-4">
                Couldn't load related posts.
              </p>
            </div>
          ) : relatedPosts.length > 0 ? (
            /* POSTS */

            <GridPostList
              posts={
                relatedPosts as unknown as IPost[]
              }
            />
          ) : (
            /* EMPTY */

            <div
              className="
                flex
                min-h-[220px]
                flex-col
                items-center
                justify-center
                rounded-[24px]
                border
                border-dashed
                border-white/[0.08]
                bg-white/[0.015]
                px-6
                text-center
              "
            >
              <div
                className="
                  mb-4
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/[0.06]
                  bg-white/[0.025]
                  text-light-3
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                >
                  <path
                    d="M4 6H20M4 12H20M4 18H14"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <p className="text-sm font-medium text-light-2">
                Nothing else here yet
              </p>

              <p className="mt-2 text-xs text-light-4">
                This creator hasn't shared another post.
              </p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default PostDetails;