import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Home,
  Compass,
  Users,
  Bookmark,
} from "lucide-react";

import { useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";

const LeftSidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const {
    user,
    setUser,
    setIsAuthenticated,
  } = useUserContext();

  const {
    mutateAsync: signOutAccount,
    isPending: isSigningOut,
  } = useSignOutAccount();

  // =========================================================
  // MENU LINKS
  // =========================================================

  const menuLinks = [
    {
      label: "Home",
      route: "/",
      icon: Home,
    },
    {
      label: "Explore",
      route: "/explore",
      icon: Compass,
    },
    {
      label: "People",
      route: "/all-users",
      icon: Users,
    },
    {
      label: "Saved",
      route: "/saved",
      icon: Bookmark,
    },
  ];

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {
    try {
      await signOutAccount();

      setUser({
        id: "",
        name: "",
        username: "",
        email: "",
        imageUrl: "",
        bio: "",
      });

      setIsAuthenticated(false);

      navigate("/sign-in", {
        replace: true,
      });
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    }
  };

  return (
    <aside
      className="
        fixed
        left-0
        top-0
        z-40
        hidden
        h-screen
        w-[280px]
        flex-col
        border-r
        border-white/[0.06]
        bg-[#09090B]
        px-5
        py-7
        md:flex
        xl:w-[300px]
      "
    >
      {/* =====================================================
          VIBELY BRAND
      ===================================================== */}

      <Link
        to="/"
        className="
          flex
          w-fit
          items-center
          gap-3
        "
      >
        {/* Vibely Logo */}

        <div
          className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
          "
        >
          <img
            src="/assets/images/vibely-logo.png"
            alt="Vibely logo"
            className="
              h-full
              w-full
              object-contain
            "
          />
        </div>

        {/* Vibely Name */}

        <div className="flex flex-col">
          <h1
            className="
              text-[22px]
              font-semibold
              leading-none
              tracking-[-0.035em]
              text-white
            "
          >
            Vibely
          </h1>

          <p
            className="
              mt-2
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.28em]
              text-white/40
            "
          >
            Connect • Share • Discover
          </p>
        </div>
      </Link>

      {/* =====================================================
          PROFILE CARD
      ===================================================== */}

      <Link
        to={`/profile/${user.id}`}
        className="
          group
          mt-10
          flex
          items-center
          gap-3
          rounded-2xl
          border
          border-white/[0.07]
          bg-white/[0.025]
          p-3
          transition-all
          duration-200
          hover:border-white/[0.11]
          hover:bg-white/[0.045]
        "
      >
        {/* Profile Picture */}

        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-full
            border
            border-violet-500/50
            bg-white/[0.05]
          "
        >
          {user.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={user.name || "profile"}
              className="
                h-full
                w-full
                object-cover
              "
            />
          ) : (
            <span
              className="
                text-base
                font-medium
                text-white
              "
            >
              {user.name?.charAt(0).toUpperCase() || "U"}
            </span>
          )}
        </div>

        {/* User Details */}

        <div className="min-w-0 flex-1">
          <p
            className="
              truncate
              text-sm
              font-semibold
              text-white
            "
          >
            {user.name || "Vibely user"}
          </p>

          <p
            className="
              mt-0.5
              truncate
              text-xs
              text-white/40
            "
          >
            @{user.username || "username"}
          </p>
        </div>

        {/* Existing arrow style */}

        <span
          className="
            text-lg
            text-white/35
            transition-colors
            group-hover:text-white/70
          "
        >
          ›
        </span>
      </Link>

      {/* =====================================================
          CREATE POST BUTTON
      ===================================================== */}

      <Link
        to="/create-post"
        className="
          mt-7
          flex
          h-[52px]
          w-full
          items-center
          justify-center
          gap-3
          rounded-[14px]
          bg-gradient-to-r
          from-violet-600
          to-indigo-600
          text-sm
          font-semibold
          text-white
          shadow-[0_12px_35px_rgba(124,58,237,0.15)]
          transition-all
          duration-200
          hover:-translate-y-[1px]
          hover:shadow-[0_15px_40px_rgba(124,58,237,0.22)]
        "
      >
        <span className="text-[24px] font-light leading-none">
          +
        </span>

        <span>Create Post</span>
      </Link>

      {/* =====================================================
          MENU TITLE
      ===================================================== */}

      <div className="mt-8 px-3">
        <p
          className="
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.22em]
            text-white/25
          "
        >
          Menu
        </p>
      </div>

      {/* =====================================================
          MENU
      ===================================================== */}

      <nav
        className="
          mt-3
          flex
          flex-col
          gap-1.5
        "
      >
        {menuLinks.map((link) => {
          const Icon = link.icon;

          const isActive =
            link.route === "/"
              ? pathname === "/"
              : pathname.startsWith(link.route);

          return (
            <Link
              key={link.label}
              to={link.route}
              className={`
                group
                relative
                flex
                h-[54px]
                items-center
                gap-4
                rounded-[14px]
                px-4
                transition-all
                duration-200

                ${
                  isActive
                    ? "bg-white/[0.065] text-white"
                    : "text-white/60 hover:bg-white/[0.035] hover:text-white"
                }
              `}
            >
              {/* Active purple line */}

              {isActive && (
                <span
                  className="
                    absolute
                    -left-5
                    h-7
                    w-[3px]
                    rounded-r-full
                    bg-violet-500
                    shadow-[0_0_12px_rgba(139,92,246,0.5)]
                  "
                />
              )}

              {/* =================================================
                  MENU ICON

                  DEFAULT = WHITE
                  HOVER   = LIGHT PURPLE
              ================================================= */}

              <Icon
                strokeWidth={1.8}
                className={`
                  h-[21px]
                  w-[21px]
                  shrink-0
                  transition-colors
                  duration-200

                  ${
                    isActive
                      ? "text-white"
                      : "text-white group-hover:text-violet-300"
                  }
                `}
              />

              <span
                className={`
                  text-[14px]
                  font-medium
                  transition-colors
                  duration-200

                  ${
                    isActive
                      ? "text-white"
                      : "text-white/60 group-hover:text-white"
                  }
                `}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* =====================================================
          BOTTOM ACCOUNT AREA
      ===================================================== */}

      <div
        className="
          mt-auto
          border-t
          border-white/[0.06]
          pt-5
        "
      >
        <div className="px-3">
          <p
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.22em]
              text-white/25
            "
          >
            Signed in as
          </p>

          <p
            className="
              mt-2
              truncate
              text-xs
              text-white/45
            "
          >
            {user.email}
          </p>
        </div>

        {/* Logout — unchanged styling */}

        <button
          type="button"
          disabled={isSigningOut}
          onClick={handleLogout}
          className="
            mt-4
            flex
            h-11
            w-full
            items-center
            gap-3
            rounded-xl
            px-3
            text-white/55
            transition-all
            duration-200
            hover:bg-white/[0.035]
            hover:text-white
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <img
            src="/assets/icons/logout.svg"
            alt="logout"
            className="h-[19px] w-[19px]"
          />

          <span className="text-sm font-medium">
            {isSigningOut ? "Logging out..." : "Logout"}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default LeftSidebar;