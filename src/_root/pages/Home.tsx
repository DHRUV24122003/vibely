import { Link } from "react-router-dom";

import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";

import { useUserContext } from "@/context/AuthContext";

import { useGetFeedPosts } from "@/lib/react-query/queriesAndMutations";

import type { IPost } from "@/types";

const Home = () => {
  // =========================================================
  // CURRENT LOGGED-IN USER
  // =========================================================

  const { user } = useUserContext();

  // =========================================================
  // PERSONALIZED FEED
  // Current user's posts + followed users' posts
  // =========================================================

  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetFeedPosts(user.id);

  const feedPosts = posts?.documents ?? [];

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        w-full
        flex-1
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
            -top-[300px]
            left-[18%]
            h-[650px]
            w-[650px]
            rounded-full
            bg-violet-600/[0.055]
            blur-[190px]
          "
        />

        <div
          className="
            absolute
            right-[8%]
            top-[38%]
            h-[450px]
            w-[450px]
            rounded-full
            bg-indigo-500/[0.025]
            blur-[170px]
          "
        />
      </div>

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      <section
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[920px]
          px-5
          pb-28
          pt-10
          md:px-8
          lg:px-10
          lg:pt-14
        "
      >
        {/* ===================================================
            HEADER
        =================================================== */}

        <header
          className="
            mb-9
            flex
            flex-col
            gap-5
            border-b
            border-white/[0.06]
            pb-7
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            {/* Label */}

            <div className="mb-3 flex items-center gap-2">
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-violet-400
                  shadow-[0_0_10px_rgba(167,139,250,0.65)]
                "
              />

              <span
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-violet-300/70
                "
              >
                Vibely
              </span>
            </div>

            {/* Title */}

            <h1
              className="
                text-[30px]
                font-semibold
                tracking-[-0.04em]
                text-white
                md:text-[36px]
              "
            >
              Your Feed
            </h1>

            {/* Description */}

            <p
              className="
                mt-2
                max-w-lg
                text-sm
                leading-6
                text-light-4
              "
            >
              Moments from you and the people you follow.
            </p>
          </div>

          {/* Feed type pill */}

          <div
            className="
              flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-white/[0.07]
              bg-white/[0.025]
              px-3.5
              py-2
            "
          >
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
                font-medium
                uppercase
                tracking-[0.16em]
                text-light-3
              "
            >
              Following
            </span>
          </div>
        </header>

        {/* ===================================================
            LOADING
        =================================================== */}

        {isPostLoading ? (
          <div
            className="
              flex
              min-h-[450px]
              w-full
              items-center
              justify-center
            "
          >
            <Loader />
          </div>
        ) : isErrorPosts ? (
          /* =================================================
             ERROR
          ================================================= */

          <div
            className="
              flex
              min-h-[420px]
              flex-col
              items-center
              justify-center
              rounded-[28px]
              border
              border-white/[0.07]
              bg-[#0D0D10]
              px-6
              text-center
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                border
                border-red-400/10
                bg-red-500/[0.05]
                text-red-300
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
              >
                <path
                  d="M12 8V13"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />

                <circle
                  cx="12"
                  cy="16.5"
                  r="1"
                  fill="currentColor"
                />

                <path
                  d="M10.2 4.8L3.6 16.3C2.8 17.7 3.8 19.5 5.4 19.5H18.6C20.2 19.5 21.2 17.7 20.4 16.3L13.8 4.8C13 3.4 11 3.4 10.2 4.8Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2
              className="
                mt-5
                text-lg
                font-semibold
                text-white
              "
            >
              Couldn't load your feed
            </h2>

            <p
              className="
                mt-2
                max-w-sm
                text-sm
                leading-6
                text-light-4
              "
            >
              Something went wrong while loading your
              latest moments.
            </p>
          </div>
        ) : feedPosts.length === 0 ? (
          /* =================================================
             EMPTY FOLLOWING FEED
          ================================================= */

          <div
            className="
              relative
              flex
              min-h-[440px]
              flex-col
              items-center
              justify-center
              overflow-hidden
              rounded-[30px]
              border
              border-white/[0.07]
              bg-[#0D0D10]
              px-6
              text-center
              shadow-[0_25px_80px_rgba(0,0,0,0.2)]
            "
          >
            {/* Empty-state glow */}

            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-[300px]
                w-[300px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-violet-600/[0.07]
                blur-[110px]
              "
            />

            <div className="relative z-10">
              {/* Icon */}

              <div
                className="
                  mx-auto
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-[20px]
                  border
                  border-violet-400/10
                  bg-violet-500/[0.07]
                  text-violet-300
                  shadow-[0_0_35px_rgba(124,58,237,0.08)]
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-7 w-7"
                >
                  <circle
                    cx="9"
                    cy="8"
                    r="3.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />

                  <path
                    d="M3 19C3.6 15.8 5.6 14 9 14C11 14 12.5 14.6 13.5 15.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />

                  <path
                    d="M18 12V18M15 15H21"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Text */}

              <h2
                className="
                  mt-6
                  text-xl
                  font-semibold
                  tracking-[-0.025em]
                  text-white
                "
              >
                Your feed is quiet
              </h2>

              <p
                className="
                  mx-auto
                  mt-3
                  max-w-sm
                  text-sm
                  leading-6
                  text-light-4
                "
              >
                Follow people on Vibely and their latest
                moments will start appearing here.
              </p>

              {/* Buttons */}

              <div
                className="
                  mt-7
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-3
                  sm:flex-row
                "
              >
                <Link
                  to="/all-users"
                  className="
                    flex
                    h-11
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-violet-600
                    to-indigo-600
                    px-5
                    text-sm
                    font-medium
                    text-white
                    shadow-[0_8px_30px_rgba(124,58,237,0.18)]
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:shadow-[0_12px_35px_rgba(124,58,237,0.25)]
                  "
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4"
                  >
                    <circle
                      cx="9"
                      cy="8"
                      r="3.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />

                    <path
                      d="M3 19C3.6 15.8 5.6 14 9 14C11 14 12.5 14.6 13.5 15.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />

                    <path
                      d="M18 12V18M15 15H21"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>

                  Discover people
                </Link>

                <Link
                  to="/create-post"
                  className="
                    flex
                    h-11
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/[0.08]
                    bg-white/[0.03]
                    px-5
                    text-sm
                    font-medium
                    text-light-2
                    transition-colors
                    hover:bg-white/[0.06]
                    hover:text-white
                  "
                >
                  Create a post
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* =================================================
             FEED POSTS
          ================================================= */

          <>
            <div className="flex w-full flex-col gap-8">
              {feedPosts.map((post) => (
                <PostCard
                  key={post.$id}
                  post={
                    post as unknown as IPost
                  }
                />
              ))}
            </div>

            {/* ===============================================
                END OF FEED
            =============================================== */}

            <div
              className="
                mt-12
                flex
                items-center
                justify-center
                gap-3
                pb-3
              "
            >
              <div
                className="
                  h-px
                  w-10
                  bg-gradient-to-r
                  from-transparent
                  to-white/[0.08]
                "
              />

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/[0.06]
                  bg-white/[0.02]
                  px-3
                  py-1.5
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-3.5 w-3.5 text-violet-300"
                >
                  <path
                    d="M5 12L10 17L19 8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span
                  className="
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.14em]
                    text-light-4
                  "
                >
                  You're all caught up
                </span>
              </div>

              <div
                className="
                  h-px
                  w-10
                  bg-gradient-to-l
                  from-transparent
                  to-white/[0.08]
                "
              />
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Home;