import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { type INavLink } from "@/types";
import { sidebarLinks } from "@/constants";

import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";

import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import {
  useUserContext,
  INITIAL_USER,
} from "@/context/AuthContext";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const {
    user,
    setUser,
    setIsAuthenticated,
    isLoading,
  } = useUserContext();

  const { mutate: signOut } = useSignOutAccount();

  const handleSignOut = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    signOut();

    setIsAuthenticated(false);
    setUser(INITIAL_USER);

    navigate("/sign-in");
  };

  // Create Post gets its own CTA.
  const navigationLinks = sidebarLinks.filter(
    (link) => link.route !== "/create-post"
  );

  return (
    <aside
      className="
        fixed left-0 top-0 z-40 hidden h-screen
        w-[280px]
        flex-col justify-between
        overflow-y-auto
        border-r border-white/[0.06]
        bg-[#09090B]
        px-5 py-7
        md:flex
        xl:w-[300px]
      "
    >
      {/* ================= TOP ================= */}
      <div className="flex flex-col">

        {/* BRAND */}
        <Link
          to="/"
          className="group mb-9 flex items-center gap-3 px-2"
        >
          <div
            className="
              relative flex h-11 w-11
              items-center justify-center
              overflow-hidden rounded-[14px]
              bg-gradient-to-br
              from-violet-500 to-indigo-600
              shadow-[0_8px_30px_rgba(124,58,237,0.22)]
              transition-transform duration-300
              group-hover:scale-[1.04]
            "
          >
            <span className="text-xl font-bold text-white">
              V
            </span>

            <div
              className="
                absolute inset-x-1 top-0
                h-px
                bg-gradient-to-r
                from-transparent via-white/60 to-transparent
              "
            />
          </div>

          <div>
            <h1 className="text-[22px] font-bold tracking-[-0.03em] text-white">
              Vibely
            </h1>

            <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.28em] text-light-3">
              Connect • Share • Discover
            </p>
          </div>
        </Link>

        {/* ================= PROFILE ================= */}

        {isLoading || !user.email ? (
          <div className="mb-7 flex h-[72px] items-center justify-center">
            <Loader />
          </div>
        ) : (
          <Link
            to={`/profile/${user.id}`}
            className="
              group mb-7 flex items-center gap-3
              rounded-2xl
              border border-white/[0.05]
              bg-white/[0.025]
              p-3
              transition-all duration-300
              hover:border-white/[0.1]
              hover:bg-white/[0.045]
            "
          >
            <div className="relative shrink-0">
              <div
                className="
                  rounded-full
                  bg-gradient-to-br
                  from-violet-500/80
                  via-indigo-500/60
                  to-transparent
                  p-[1.5px]
                "
              >
                <img
                  src={
                    user.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt={user.name}
                  className="
                    h-11 w-11 rounded-full
                    bg-[#09090B]
                    object-cover
                  "
                />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {user.name}
              </p>

              <p className="mt-0.5 truncate text-xs text-light-3">
                @{user.username}
              </p>
            </div>

            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="
                h-4 w-4 text-light-4
                transition-all duration-200
                group-hover:translate-x-0.5
                group-hover:text-light-2
              "
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        )}

        {/* ================= CREATE POST ================= */}

        <Link
          to="/create-post"
          className="
            group relative mb-7
            flex h-[52px] items-center
            justify-center gap-2.5
            overflow-hidden rounded-2xl
            bg-gradient-to-r
            from-violet-600 to-indigo-600
            font-semibold text-white
            shadow-[0_10px_35px_rgba(109,40,217,0.18)]
            transition-all duration-300
            hover:-translate-y-0.5
            hover:shadow-[0_14px_40px_rgba(109,40,217,0.28)]
            active:translate-y-0
          "
        >
          {/* top highlight */}
          <div
            className="
              pointer-events-none absolute
              inset-x-8 top-0 h-px
              bg-gradient-to-r
              from-transparent via-white/70 to-transparent
            "
          />

          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="
              h-5 w-5
              transition-transform duration-300
              group-hover:rotate-90
            "
          >
            <path
              d="M12 5V19M5 12H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <span className="text-sm">
            Create Post
          </span>
        </Link>

        {/* ================= NAVIGATION ================= */}

        <div>
          <p
            className="
              mb-3 px-3
              text-[10px] font-semibold
              uppercase tracking-[0.2em]
              text-light-4
            "
          >
            Menu
          </p>

          <nav>
            <ul className="flex flex-col gap-1.5">
              {navigationLinks.map((link: INavLink) => {
                const isActive =
                  pathname === link.route ||
                  (link.route !== "/" &&
                    pathname.startsWith(link.route));

                return (
                  <li key={link.label}>
                    <NavLink
                      to={link.route}
                      className={`
                        group relative
                        flex items-center gap-3.5
                        rounded-xl
                        px-3.5 py-3
                        transition-all duration-200
                        ${
                          isActive
                            ? "bg-white/[0.07] text-white"
                            : "text-light-3 hover:bg-white/[0.035] hover:text-white"
                        }
                      `}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <span
                          className="
                            absolute -left-5
                            h-7 w-[3px]
                            rounded-r-full
                            bg-violet-500
                            shadow-[0_0_15px_rgba(139,92,246,0.65)]
                          "
                        />
                      )}

                      <div
                        className={`
                          flex h-8 w-8
                          items-center justify-center
                          rounded-lg
                          transition-all duration-200
                          ${
                            isActive
                              ? "bg-violet-500/10"
                              : "group-hover:bg-white/[0.04]"
                          }
                        `}
                      >
                        <img
                          src={link.imgURL}
                          alt=""
                          className={`
                            h-[21px] w-[21px]
                            transition-all duration-200
                            ${
                              isActive
                                ? "invert-white"
                                : "group-hover:invert-white"
                            }
                          `}
                        />
                      </div>

                      <span className="text-sm font-medium">
                        {link.label}
                      </span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* ================= BOTTOM ================= */}

      <div className="border-t border-white/[0.06] pt-5">

        {/* Mini account label */}
        {!isLoading && user.email && (
          <div className="mb-3 px-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-light-4">
              Signed in as
            </p>

            <p className="mt-1 truncate text-xs text-light-3">
              {user.email}
            </p>
          </div>
        )}

        {/* Logout */}
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="
            group flex h-11 w-full
            justify-start gap-3
            rounded-xl px-3
            text-light-3
            transition-all duration-200
            hover:bg-red-500/[0.07]
            hover:text-red-300
          "
        >
          <img
            src="/assets/icons/logout.svg"
            alt=""
            className="
              h-5 w-5
              transition-transform duration-200
              group-hover:translate-x-0.5
            "
          />

          <span className="text-sm font-medium">
            Logout
          </span>
        </Button>
      </div>
    </aside>
  );
};

export default LeftSidebar;