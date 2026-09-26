import { Link } from "react-router-dom";

import Loader from "@/components/shared/Loader";

import { useGetUsers } from "@/lib/react-query/queriesAndMutations";

const AllUser = () => {
  const {
    data: users,
    isLoading,
    isError,
  } = useGetUsers();

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
            -top-[260px]
            right-[8%]
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
            bottom-[10%]
            left-[5%]
            h-[420px]
            w-[420px]
            rounded-full
            bg-indigo-500/[0.03]
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
          max-w-[1250px]
          px-5
          pb-24
          pt-10
          md:px-8
          lg:px-10
          lg:pt-14
        "
      >
        {/* ===================================================
            PAGE HEADER
        =================================================== */}

        <header className="mb-10">
          <div className="mb-3 flex items-center gap-2">
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
                tracking-[0.22em]
                text-violet-300/70
              "
            >
              Community
            </span>
          </div>

          <h1
            className="
              text-[32px]
              font-semibold
              tracking-[-0.04em]
              text-white
              md:text-[40px]
            "
          >
            Discover people.
          </h1>

          <p
            className="
              mt-3
              max-w-xl
              text-sm
              leading-6
              text-light-4
              md:text-[15px]
            "
          >
            Find creators and people across Vibely.
          </p>
        </header>

        {/* ===================================================
            SECTION HEADER
        =================================================== */}

        <div
          className="
            mb-6
            flex
            items-center
            justify-between
            border-b
            border-white/[0.06]
            pb-5
          "
        >
          <div>
            <h2 className="text-base font-semibold text-white">
              People on Vibely
            </h2>

            {!isLoading && users && (
              <p className="mt-1 text-xs text-light-4">
                {users.documents.length}{" "}
                {users.documents.length === 1
                  ? "person"
                  : "people"}
              </p>
            )}
          </div>
        </div>

        {/* ===================================================
            LOADING
        =================================================== */}

        {isLoading ? (
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
        ) : isError ? (
          /* =================================================
              ERROR
          ================================================= */

          <div
            className="
              flex
              min-h-[350px]
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
                mb-4
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                border
                border-white/[0.07]
                bg-white/[0.025]
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 text-light-3"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />

                <path
                  d="M12 8V12"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />

                <circle
                  cx="12"
                  cy="16"
                  r="1"
                  fill="currentColor"
                />
              </svg>
            </div>

            <p className="text-sm font-medium text-light-2">
              Couldn't load people
            </p>

            <p className="mt-2 text-xs text-light-4">
              Something went wrong while loading the Vibely community.
            </p>
          </div>
        ) : users?.documents?.length ? (
          /* =================================================
              USERS GRID
          ================================================= */

          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              xl:grid-cols-3
            "
          >
            {users.documents.map((person) => (
              <Link
                key={person.$id}
                to={`/profile/${person.$id}`}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[24px]
                  border
                  border-white/[0.07]
                  bg-[#0D0D10]
                  p-5
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-violet-400/20
                  hover:bg-[#101014]
                  hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]
                "
              >
                {/* Hover glow */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-20
                    -top-20
                    h-40
                    w-40
                    rounded-full
                    bg-violet-500/[0.05]
                    blur-[60px]
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                  "
                />

                <div className="relative z-10">
                  {/* =========================================
                      USER HEADER
                  ========================================= */}

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-4
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
                        p-[1.5px]
                      "
                    >
                      <img
                        src={
                          person.imageUrl ||
                          "/assets/icons/profile-placeholder.svg"
                        }
                        alt={person.name || "Vibely user"}
                        className="
                          h-14
                          w-14
                          rounded-full
                          border-[2px]
                          border-[#0D0D10]
                          object-cover
                        "
                      />
                    </div>

                    {/* Arrow */}

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-white/[0.06]
                        bg-white/[0.02]
                        text-light-4
                        transition-all
                        duration-200
                        group-hover:border-violet-400/20
                        group-hover:bg-violet-500/[0.06]
                        group-hover:text-violet-300
                      "
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="
                          h-4
                          w-4
                          transition-transform
                          duration-200
                          group-hover:translate-x-0.5
                        "
                      >
                        <path
                          d="M5 12H19M13 6L19 12L13 18"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* =========================================
                      USER INFO
                  ========================================= */}

                  <div className="mt-5">
                    <h3
                      className="
                        truncate
                        text-[15px]
                        font-semibold
                        text-white
                        transition-colors
                        group-hover:text-violet-200
                      "
                    >
                      {person.name || "Vibely user"}
                    </h3>

                    <p
                      className="
                        mt-1
                        truncate
                        text-xs
                        text-light-4
                      "
                    >
                      {person.username
                        ? `@${person.username}`
                        : "Vibely member"}
                    </p>
                  </div>

                  {/* =========================================
                      VIEW PROFILE
                  ========================================= */}

                  <div
                    className="
                      mt-6
                      flex
                      items-center
                      justify-between
                      border-t
                      border-white/[0.055]
                      pt-4
                    "
                  >
                    <span
                      className="
                        text-xs
                        font-medium
                        text-light-3
                        transition-colors
                        group-hover:text-white
                      "
                    >
                      View profile
                    </span>

                    <span
                      className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.16em]
                        text-violet-400/70
                      "
                    >
                      Vibely
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* =================================================
              EMPTY
          ================================================= */

          <div
            className="
              flex
              min-h-[350px]
              flex-col
              items-center
              justify-center
              rounded-[26px]
              border
              border-dashed
              border-white/[0.08]
              bg-white/[0.015]
              text-center
            "
          >
            <p className="text-sm font-medium text-light-2">
              No people here yet
            </p>

            <p className="mt-2 text-xs text-light-4">
              New Vibely members will appear here.
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

export default AllUser;