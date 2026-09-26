import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { Input } from "@/components/ui";
import useDebounce from "@/hooks/useDebounce";

import {
  GridPostList,
  Loader,
} from "@/components/shared";

import {
  useGetPosts,
  useSearchPosts,
} from "@/lib/react-query/queriesAndMutations";

export type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts: any;
};

const SearchResults = ({
  isSearchFetching,
  searchedPosts,
}: SearchResultProps) => {
  if (isSearchFetching) {
    return (
      <div className="flex min-h-[300px] w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (
    searchedPosts &&
    searchedPosts.documents.length > 0
  ) {
    return (
      <GridPostList
        posts={searchedPosts.documents}
      />
    );
  }

  return (
    <div
      className="
        flex min-h-[300px] w-full
        flex-col items-center justify-center
        rounded-[24px]
        border border-dashed border-white/[0.08]
        bg-white/[0.015]
        px-6 text-center
      "
    >
      <div
        className="
          mb-4 flex h-12 w-12
          items-center justify-center
          rounded-2xl
          border border-white/[0.06]
          bg-white/[0.03]
          text-light-3
        "
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5"
        >
          <circle
            cx="11"
            cy="11"
            r="7"
            stroke="currentColor"
            strokeWidth="1.7"
          />

          <path
            d="M20 20L16.2 16.2"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <h3 className="text-sm font-semibold text-white">
        No posts found
      </h3>

      <p className="mt-2 text-xs text-light-3">
        Try searching with a different keyword.
      </p>
    </div>
  );
};

const Explore = () => {
  const { ref, inView } = useInView();

  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetPosts();

  const [searchValue, setSearchValue] =
    useState("");

  const debouncedSearch =
    useDebounce(searchValue, 500);

  const {
    data: searchedPosts,
    isFetching: isSearchFetching,
  } = useSearchPosts(debouncedSearch);

  useEffect(() => {
    if (
      inView &&
      !searchValue &&
      hasNextPage
    ) {
      fetchNextPage();
    }
  }, [
    inView,
    searchValue,
    hasNextPage,
    fetchNextPage,
  ]);

  if (!posts) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-[#08080A]">
        <Loader />
      </main>
    );
  }

  const shouldShowSearchResults =
    searchValue.trim() !== "";

  const hasPosts = posts.pages.some(
    (page) => page.documents.length > 0
  );

  return (
    <main
      className="
        relative min-h-screen
        w-full
        bg-[#08080A]
      "
    >
      {/* ==========================================
          BACKGROUND
      ========================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute
            -top-[240px]
            right-[5%]
            h-[520px]
            w-[520px]
            rounded-full
            bg-violet-600/[0.07]
            blur-[160px]
          "
        />

        <div
          className="
            absolute
            left-[5%]
            top-[45%]
            h-[420px]
            w-[420px]
            rounded-full
            bg-indigo-500/[0.035]
            blur-[160px]
          "
        />
      </div>

      {/* ==========================================
          PAGE
      ========================================== */}

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
        {/* ========================================
            HEADER
        ======================================== */}

        <header className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <span
              className="
                h-1.5 w-1.5
                rounded-full
                bg-violet-400
                shadow-[0_0_10px_rgba(167,139,250,0.7)]
              "
            />

            <span
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.3em]
                text-violet-300/70
              "
            >
              Discover
            </span>
          </div>

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
            Explore Vibely
          </h1>

          <p
            className="
              mt-3
              max-w-xl
              text-sm
              leading-6
              text-light-3
            "
          >
            Discover moments, ideas and stories
            shared across the community.
          </p>
        </header>

        {/* ========================================
            SEARCH
        ======================================== */}

        <div
          className="
            relative mb-12
            overflow-hidden
            rounded-2xl
            border border-white/[0.07]
            bg-[#0D0D10]
            transition-all
            duration-300
            focus-within:border-violet-500/30
            focus-within:shadow-[0_0_0_3px_rgba(139,92,246,0.05)]
          "
        >
          <div
            className="
              absolute
              left-5
              top-1/2
              -translate-y-1/2
              text-light-4
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="1.7"
              />

              <path
                d="M20 20L16.2 16.2"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <Input
            type="text"
            placeholder="Search posts..."
            value={searchValue}
            onChange={(e) =>
              setSearchValue(e.target.value)
            }
            className="
              h-[58px]
              w-full
              border-none
              bg-transparent
              pl-14
              pr-14
              text-sm
              text-white
              shadow-none
              outline-none
              placeholder:text-light-4
              focus-visible:ring-0
              focus-visible:ring-offset-0
            "
          />

          {/* Clear search */}
          {searchValue && (
            <button
              type="button"
              onClick={() =>
                setSearchValue("")
              }
              className="
                absolute
                right-4
                top-1/2
                flex h-8 w-8
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                text-light-4
                transition
                hover:bg-white/[0.05]
                hover:text-white
              "
              aria-label="Clear search"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
              >
                <path
                  d="M6 6L18 18M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* ========================================
            CONTENT HEADING
        ======================================== */}

        <div
          className="
            mb-6
            flex items-center
            justify-between
            gap-5
          "
        >
          <div>
            <h2
              className="
                text-lg
                font-semibold
                tracking-[-0.02em]
                text-white
                md:text-xl
              "
            >
              {shouldShowSearchResults
                ? "Search results"
                : "Popular right now"}
            </h2>

            <p className="mt-1 text-xs text-light-4">
              {shouldShowSearchResults
                ? `Results for "${searchValue}"`
                : "Explore the latest posts from the community."}
            </p>
          </div>

          {!shouldShowSearchResults && (
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
                md:flex
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />

              <span className="text-xs font-medium text-light-2">
                All posts
              </span>
            </div>
          )}
        </div>

        {/* ========================================
            POSTS
        ======================================== */}

        <div className="w-full">
          {shouldShowSearchResults ? (
            <SearchResults
              isSearchFetching={
                isSearchFetching
              }
              searchedPosts={
                searchedPosts
              }
            />
          ) : !hasPosts ? (
            <div
              className="
                flex
                min-h-[300px]
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
                No posts to explore yet.
              </p>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-6">
              {posts.pages.map(
                (item, index) => (
                  <GridPostList
                    key={`page-${index}`}
                    posts={
                      item.documents as unknown as any
                    }
                  />
                )
              )}
            </div>
          )}
        </div>

        {/* ========================================
            INFINITE SCROLL
        ======================================== */}

        {hasNextPage &&
          !searchValue && (
            <div
              ref={ref}
              className="
                flex
                min-h-[100px]
                items-center
                justify-center
                py-8
              "
            >
              {isFetchingNextPage && (
                <Loader />
              )}
            </div>
          )}

        {/* END OF EXPLORE */}
        {!hasNextPage &&
          !searchValue &&
          hasPosts && (
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
                You've explored it all
              </p>

              <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/[0.08]" />
            </div>
          )}
      </section>
    </main>
  );
};

export default Explore;