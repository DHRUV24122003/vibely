import type { IPost } from "@/types";

import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";

const Home = () => {
  const {
    data: posts,
    isPending: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();

  return (
    <main className="relative flex min-h-screen w-full flex-1 bg-[#08080A]">
      {/* =========================================================
          AMBIENT BACKGROUND
      ========================================================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top-left purple glow */}
        <div
          className="
            absolute
            -top-[220px]
            left-[5%]
            h-[520px]
            w-[520px]
            rounded-full
            bg-violet-600/[0.08]
            blur-[150px]
          "
        />

        {/* Right-side indigo glow */}
        <div
          className="
            absolute
            right-[-220px]
            top-[35%]
            h-[480px]
            w-[480px]
            rounded-full
            bg-indigo-500/[0.05]
            blur-[160px]
          "
        />

        {/* Bottom purple glow */}
        <div
          className="
            absolute
            bottom-[-300px]
            left-[30%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-purple-500/[0.035]
            blur-[170px]
          "
        />
      </div>

      {/* =========================================================
          MAIN FEED CONTAINER
      ========================================================= */}
      <section
        className="
          relative z-10
          mx-auto
          flex w-full
          max-w-[920px]
          flex-col
          px-5
          pb-24
          pt-8
          md:px-8
          md:pt-10
          lg:px-10
          lg:pt-12
        "
      >
        {/* =======================================================
            PAGE HEADER
        ======================================================= */}
        <header className="mb-10 w-full border-b border-white/[0.06] pb-7">
          <div className="flex items-end justify-between gap-6">
            {/* LEFT SIDE */}
            <div>
              {/* Small Vibely label */}
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-violet-400
                    shadow-[0_0_10px_rgba(167,139,250,0.7)]
                  "
                />

                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.3em]
                    text-violet-300/70
                  "
                >
                  Vibely
                </p>
              </div>

              {/* Main heading */}
              <h1
                className="
                  text-3xl
                  font-bold
                  tracking-[-0.04em]
                  text-white
                  md:text-[38px]
                  md:leading-[1.1]
                "
              >
                Your Feed
              </h1>

              {/* Subtitle */}
              <p
                className="
                  mt-3
                  max-w-lg
                  text-sm
                  leading-6
                  text-light-3
                "
              >
                Moments, ideas and stories from people you connect with.
              </p>
            </div>

            {/* RIGHT SIDE - FEED STATUS */}
            <div
              className="
                hidden
                items-center
                gap-2
                rounded-full
                border
                border-white/[0.07]
                bg-white/[0.025]
                px-3.5
                py-2
                backdrop-blur-xl
                md:flex
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-violet-400
                  shadow-[0_0_8px_rgba(167,139,250,0.7)]
                "
              />

              <span className="text-xs font-medium text-light-2">
                Latest
              </span>
            </div>
          </div>
        </header>

        {/* =======================================================
            LOADING STATE
        ======================================================= */}
        {isPostLoading && !posts ? (
          <div
            className="
              flex
              min-h-[400px]
              w-full
              items-center
              justify-center
            "
          >
            <Loader />
          </div>
        ) : isErrorPosts ? (
          /* =====================================================
              ERROR STATE
          ===================================================== */
          <div
            className="
              flex
              min-h-[320px]
              w-full
              flex-col
              items-center
              justify-center
              rounded-[28px]
              border
              border-white/[0.06]
              bg-white/[0.02]
              px-6
              text-center
            "
          >
            {/* Error icon */}
            <div
              className="
                mb-4
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-red-500/[0.08]
                text-red-300
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

                <path
                  d="M12 16.01L12.01 15.9989"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

                <path
                  d="M10.29 3.86L1.82 18A2 2 0 003.53 21H20.47A2 2 0 0022.18 18L13.71 3.86A2 2 0 0010.29 3.86Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 className="text-base font-semibold text-white">
              Couldn't load your feed
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-light-3">
              Something went wrong while fetching your posts. Try refreshing
              the page.
            </p>
          </div>
        ) : !posts?.documents?.length ? (
          /* =====================================================
              EMPTY STATE
          ===================================================== */
          <div
            className="
              flex
              min-h-[380px]
              w-full
              flex-col
              items-center
              justify-center
              rounded-[28px]
              border
              border-dashed
              border-white/[0.08]
              bg-white/[0.015]
              px-6
              text-center
            "
          >
            {/* Empty-state icon */}
            <div
              className="
                mb-5
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                border
                border-violet-400/10
                bg-violet-500/[0.07]
                text-violet-300
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-7 w-7"
              >
                <path
                  d="M12 5V19M5 12H19"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h2 className="text-lg font-semibold text-white">
              Your feed is waiting
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-light-3">
              Share your first moment and start building your Vibely feed.
            </p>
          </div>
        ) : (
          /* =====================================================
              POSTS
          ===================================================== */
          <ul className="flex w-full flex-col gap-8">
            {posts.documents.map((post) => (
              <li
                key={post.$id}
                className="w-full"
              >
                <PostCard
                  post={post as unknown as IPost}
                />
              </li>
            ))}
          </ul>
        )}

        {/* =======================================================
            FEED END
        ======================================================= */}
        {!isPostLoading &&
          !isErrorPosts &&
          posts?.documents &&
          posts.documents.length > 0 && (
            <div className="mt-12 flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/[0.08]" />

              <p
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.2em]
                  text-light-4
                "
              >
                You're all caught up
              </p>

              <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/[0.08]" />
            </div>
          )}
      </section>
    </main>
  );
};

export default Home;