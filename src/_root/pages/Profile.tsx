import { Link, useParams } from "react-router-dom";

import Loader from "@/components/shared/Loader";
import GridPostList from "@/components/shared/GridPostList";

import {
  useGetUserById,
  useGetUserPosts,
  useGetFollowStatus,
  useFollowUser,
  useUnfollowUser,
  useGetFollowers,
  useGetFollowing,
} from "@/lib/react-query/queriesAndMutations";

import { useUserContext } from "@/context/AuthContext";

import type { IPost } from "@/types";

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useUserContext();

  // =========================================================
  // PROFILE USER
  // =========================================================

  const {
    data: profileUser,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useGetUserById(id);

  // =========================================================
  // USER POSTS
  // =========================================================

  const {
    data: userPosts,
    isLoading: isPostsLoading,
    isError: isPostsError,
  } = useGetUserPosts(id);

  // =========================================================
  // FOLLOW DATA
  // =========================================================

  const {
    data: followRecord,
    isLoading: isFollowStatusLoading,
  } = useGetFollowStatus(
    currentUser.id,
    id
  );

  const {
    data: followers,
    isLoading: isFollowersLoading,
  } = useGetFollowers(id);

  const {
    data: following,
    isLoading: isFollowingLoading,
  } = useGetFollowing(id);

  // =========================================================
  // FOLLOW MUTATIONS
  // =========================================================

  const {
    mutate: followUser,
    isPending: isFollowingUser,
  } = useFollowUser();

  const {
    mutate: unfollowUser,
    isPending: isUnfollowingUser,
  } = useUnfollowUser();

  // =========================================================
  // DERIVED DATA
  // =========================================================

  const posts = userPosts?.documents ?? [];

  const isOwnProfile =
    currentUser.id === id;

  const isFollowing =
    !!followRecord;

  const followerCount =
    followers?.total ??
    followers?.documents?.length ??
    0;

  const followingCount =
    following?.total ??
    following?.documents?.length ??
    0;

  const isFollowActionLoading =
    isFollowingUser ||
    isUnfollowingUser ||
    isFollowStatusLoading;

  // =========================================================
  // FOLLOW / UNFOLLOW
  // =========================================================

  const handleFollowToggle = () => {
    if (
      !currentUser.id ||
      !id ||
      isOwnProfile ||
      isFollowActionLoading
    ) {
      return;
    }

    if (isFollowing) {
      unfollowUser({
        followerId: currentUser.id,
        followingId: id,
      });

      return;
    }

    followUser({
      followerId: currentUser.id,
      followingId: id,
    });
  };

  // =========================================================
  // PROFILE LOADING
  // =========================================================

  if (isUserLoading) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-[#08080A]">
        <Loader />
      </main>
    );
  }

  // =========================================================
  // PROFILE ERROR
  // =========================================================

  if (isUserError || !profileUser) {
    return (
      <main
        className="
          flex min-h-screen w-full
          flex-col items-center justify-center
          bg-[#08080A]
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
            <circle
              cx="12"
              cy="8"
              r="4"
              stroke="currentColor"
              strokeWidth="1.6"
            />

            <path
              d="M4 20C4.8 15.8 7.6 14 12 14C16.4 14 19.2 15.8 20 20"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h2 className="mt-5 text-lg font-semibold text-white">
          Profile unavailable
        </h2>

        <p className="mt-2 text-sm text-light-4">
          We couldn't load this Vibely profile.
        </p>
      </main>
    );
  }

  const profileImage =
    profileUser.imageUrl ||
    "/assets/icons/profile-placeholder.svg";

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
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute
            -top-[280px]
            left-[20%]
            h-[600px]
            w-[600px]
            rounded-full
            bg-violet-600/[0.055]
            blur-[180px]
          "
        />

        <div
          className="
            absolute
            right-[5%]
            top-[30%]
            h-[400px]
            w-[400px]
            rounded-full
            bg-indigo-500/[0.025]
            blur-[160px]
          "
        />
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1200px]
          px-5
          pb-24
          pt-10
          md:px-8
          lg:px-10
          lg:pt-14
        "
      >
        {/* ===================================================
            PROFILE CARD
        =================================================== */}

        <div
          className="
            relative
            overflow-hidden
            rounded-[30px]
            border
            border-white/[0.07]
            bg-[#0D0D10]
            shadow-[0_30px_90px_rgba(0,0,0,0.28)]
          "
        >
          {/* Top glow */}

          <div
            className="
              absolute
              inset-x-0
              top-0
              h-40
              bg-gradient-to-r
              from-violet-500/[0.08]
              via-indigo-500/[0.04]
              to-transparent
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-8
              p-6
              md:flex-row
              md:items-center
              md:justify-between
              md:p-9
              lg:p-10
            "
          >
            {/* ===============================================
                LEFT PROFILE INFO
            =============================================== */}

            <div
              className="
                flex
                flex-col
                items-center
                gap-6
                text-center
                sm:flex-row
                sm:text-left
              "
            >
              {/* Avatar */}

              <div
                className="
                  rounded-full
                  bg-gradient-to-br
                  from-violet-500
                  via-indigo-500
                  to-purple-500
                  p-[2px]
                  shadow-[0_0_45px_rgba(139,92,246,0.14)]
                "
              >
                <img
                  src={profileImage}
                  alt={profileUser.name || "Vibely user"}
                  className="
                    h-24
                    w-24
                    rounded-full
                    border-[4px]
                    border-[#0D0D10]
                    object-cover
                    md:h-28
                    md:w-28
                  "
                />
              </div>

              {/* User information */}

              <div>
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    justify-center
                    gap-2
                    sm:justify-start
                  "
                >
                  <h1
                    className="
                      text-2xl
                      font-semibold
                      tracking-[-0.03em]
                      text-white
                      md:text-3xl
                    "
                  >
                    {profileUser.name || "Vibely user"}
                  </h1>

                  {isOwnProfile && (
                    <span
                      className="
                        rounded-full
                        border
                        border-violet-400/10
                        bg-violet-500/[0.07]
                        px-2.5
                        py-1
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.15em]
                        text-violet-300
                      "
                    >
                      You
                    </span>
                  )}
                </div>

                {/* Username */}

                <p className="mt-2 text-sm text-light-4">
                  {profileUser.username
                    ? `@${profileUser.username}`
                    : "Vibely member"}
                </p>

                {/* Bio */}

                {profileUser.bio && (
                  <p
                    className="
                      mt-4
                      max-w-xl
                      text-sm
                      leading-6
                      text-light-2
                    "
                  >
                    {profileUser.bio}
                  </p>
                )}

                {/* ===========================================
                    STATS
                =========================================== */}

                <div
                  className="
                    mt-6
                    flex
                    items-center
                    justify-center
                    gap-6
                    sm:justify-start
                  "
                >
                  {/* POSTS */}

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {posts.length}
                    </p>

                    <p className="mt-1 text-[11px] text-light-4">
                      Posts
                    </p>
                  </div>

                  <div className="h-8 w-px bg-white/[0.07]" />

                  {/* FOLLOWERS */}

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {isFollowersLoading
                        ? "—"
                        : followerCount}
                    </p>

                    <p className="mt-1 text-[11px] text-light-4">
                      Followers
                    </p>
                  </div>

                  <div className="h-8 w-px bg-white/[0.07]" />

                  {/* FOLLOWING */}

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {isFollowingLoading
                        ? "—"
                        : followingCount}
                    </p>

                    <p className="mt-1 text-[11px] text-light-4">
                      Following
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ===============================================
                ACTION BUTTON
            =============================================== */}

            <div className="flex justify-center sm:justify-start">
              {isOwnProfile ? (
                /* ===========================================
                    EDIT OWN PROFILE
                =========================================== */

                <Link
                  to={`/update-profile/${profileUser.$id}`}
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
                    shadow-[0_8px_30px_rgba(124,58,237,0.16)]
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:shadow-[0_12px_35px_rgba(124,58,237,0.22)]
                  "
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4"
                  >
                    <path
                      d="M13.5 6.5L17.5 10.5M4 20L8.5 19L19 8.5C19.8284 7.67157 19.8284 6.32843 19 5.5L18.5 5C17.6716 4.17157 16.3284 4.17157 15.5 5L5 15.5L4 20Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  Edit profile
                </Link>
              ) : (
                /* ===========================================
                    FOLLOW / UNFOLLOW
                =========================================== */

                <button
                  type="button"
                  onClick={handleFollowToggle}
                  disabled={isFollowActionLoading}
                  className={`
                    flex
                    h-11
                    min-w-[125px]
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    px-5
                    text-sm
                    font-medium
                    transition-all
                    duration-200
                    disabled:cursor-not-allowed
                    disabled:opacity-60

                    ${
                      isFollowing
                        ? `
                          border
                          border-white/[0.09]
                          bg-white/[0.04]
                          text-light-1
                          hover:border-red-400/20
                          hover:bg-red-500/[0.06]
                          hover:text-red-300
                        `
                        : `
                          bg-gradient-to-r
                          from-violet-600
                          to-indigo-600
                          text-white
                          shadow-[0_8px_30px_rgba(124,58,237,0.18)]
                          hover:-translate-y-0.5
                          hover:shadow-[0_12px_35px_rgba(124,58,237,0.24)]
                        `
                    }
                  `}
                >
                  {isFollowActionLoading ? (
                    <span
                      className="
                        h-4
                        w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-current
                        border-t-transparent
                      "
                    />
                  ) : isFollowing ? (
                    <>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-4 w-4"
                      >
                        <path
                          d="M5 12L10 17L19 8"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      Following
                    </>
                  ) : (
                    <>
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

                      Follow
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ===================================================
            USER POSTS
        =================================================== */}

        <section className="mt-12">
          <div
            className="
              mb-7
              flex
              items-end
              justify-between
              border-b
              border-white/[0.06]
              pb-5
            "
          >
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />

                <span
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-violet-300/70
                  "
                >
                  Posts
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
                {isOwnProfile
                  ? "Your moments"
                  : `${profileUser.name}'s moments`}
              </h2>
            </div>

            {!isPostsLoading && (
              <span
                className="
                  rounded-full
                  border
                  border-white/[0.06]
                  bg-white/[0.025]
                  px-3
                  py-1.5
                  text-[11px]
                  text-light-4
                "
              >
                {posts.length}{" "}
                {posts.length === 1
                  ? "post"
                  : "posts"}
              </span>
            )}
          </div>

          {/* POSTS LOADING */}

          {isPostsLoading ? (
            <div
              className="
                flex
                min-h-[250px]
                items-center
                justify-center
              "
            >
              <Loader />
            </div>
          ) : isPostsError ? (
            /* POSTS ERROR */

            <div
              className="
                flex
                min-h-[220px]
                items-center
                justify-center
                rounded-[24px]
                border
                border-dashed
                border-white/[0.08]
                bg-white/[0.015]
              "
            >
              <p className="text-sm text-light-4">
                Couldn't load posts.
              </p>
            </div>
          ) : posts.length > 0 ? (
            /* POSTS GRID */

            <GridPostList
              posts={
                posts as unknown as IPost[]
              }
            />
          ) : (
            /* EMPTY POSTS */

            <div
              className="
                flex
                min-h-[260px]
                flex-col
                items-center
                justify-center
                rounded-[26px]
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
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  text-light-3
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                >
                  <rect
                    x="4"
                    y="4"
                    width="16"
                    height="16"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />

                  <circle
                    cx="9"
                    cy="9"
                    r="1.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />

                  <path
                    d="M5 17L9 13L12 16L15 13L20 18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <p className="mt-4 text-sm font-medium text-light-2">
                No posts yet
              </p>

              <p
                className="
                  mt-2
                  max-w-sm
                  text-xs
                  leading-5
                  text-light-4
                "
              >
                {isOwnProfile
                  ? "Your posts will appear here once you start sharing."
                  : "This person hasn't shared anything yet."}
              </p>

              {isOwnProfile && (
                <Link
                  to="/create-post"
                  className="
                    mt-5
                    rounded-xl
                    bg-violet-600
                    px-4
                    py-2.5
                    text-xs
                    font-medium
                    text-white
                    transition-colors
                    hover:bg-violet-500
                  "
                >
                  Create your first post
                </Link>
              )}
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default Profile;