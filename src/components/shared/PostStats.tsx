import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { checkIsLiked } from "@/lib/utils";
import {
  useLikePost,
  useSavePost,
  useDeleteSavedPost,
  useGetSavedPostRecord,
} from "@/lib/react-query/queriesAndMutations";

import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import type { IPost } from "@/types";
import Loader from "@/components/shared/Loader";

type PostStatsProps = {
  post: IPost;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const location = useLocation();
  const queryClient = useQueryClient();

  const queryKey = [
    QUERY_KEYS.GET_CURRENT_USER,
    "saved",
    userId,
    post.$id,
  ];

  const likesList = post.likes?.map((user) => user.$id) || [];

  const [likes, setLikes] = useState<string[]>(likesList);

  const { data: savedRecord, isFetched } = useGetSavedPostRecord(
    userId,
    post.$id
  );

  const [optimisticSaved, setOptimisticSaved] =
    useState<boolean | null>(null);

  const [savedRecordId, setSavedRecordId] =
    useState<string | undefined>();

  const isSaved = optimisticSaved ?? !!savedRecord?.$id;

  const recordId = savedRecordId || savedRecord?.$id;

  const { mutate: likePost } = useLikePost();

  const {
    mutate: savePost,
    isPending: isSavingPost,
  } = useSavePost();

  const {
    mutate: deleteSavedPost,
    isPending: isDeletingSaved,
  } = useDeleteSavedPost();

  // -----------------------------
  // LIKE POST
  // -----------------------------
  const handleLikePost = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    let likesArray = [...likes];

    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((id) => id !== userId);
    } else {
      likesArray.push(userId);
    }

    setLikes(likesArray);

    likePost({
      postId: post.$id,
      likesArray,
    });
  };

  // -----------------------------
  // SAVE POST
  // -----------------------------
  const handleSavePost = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSaved && recordId) {
      setOptimisticSaved(false);
      setSavedRecordId(undefined);

      queryClient.setQueryData(queryKey, null);

      deleteSavedPost(recordId, {
        onError: () => {
          setOptimisticSaved(true);
          setSavedRecordId(recordId);
        },
      });

      return;
    }

    setOptimisticSaved(true);

    savePost(
      {
        userId,
        postId: post.$id,
      },
      {
        onSuccess: (data) => {
          if (data?.$id) {
            setSavedRecordId(data.$id);

            queryClient.setQueryData(
              queryKey,
              data
            );
          }
        },

        onError: () => {
          setOptimisticSaved(false);
          setSavedRecordId(undefined);
        },
      }
    );
  };

  const containerStyles =
    location.pathname.startsWith("/profile")
      ? "w-full"
      : "";

  const isLiked = checkIsLiked(likes, userId);

  return (
    <div
      className={`flex items-center justify-between ${containerStyles}`}
    >
      {/* LEFT ACTIONS */}
      <div className="flex items-center gap-2">

        {/* LIKE */}
        <button
          type="button"
          onClick={handleLikePost}
          className={`
            group/like flex h-10 items-center gap-2
            rounded-full px-3
            transition-all duration-200
            ${
              isLiked
                ? "bg-rose-500/10"
                : "hover:bg-white/[0.05]"
            }
          `}
          aria-label={isLiked ? "Unlike post" : "Like post"}
        >
          <img
            src={
              isLiked
                ? "/assets/icons/liked.svg"
                : "/assets/icons/like.svg"
            }
            alt=""
            className="
              h-[21px] w-[21px]
              transition-transform duration-200
              group-hover/like:scale-110
              group-active/like:scale-90
            "
          />

          <span
            className={`
              text-sm font-medium
              ${
                isLiked
                  ? "text-rose-400"
                  : "text-light-2"
              }
            `}
          >
            {likes.length}
          </span>
        </button>

        {/* COMMENT / OPEN POST */}
        <Link
          to={`/posts/${post.$id}`}
          className="
            group/comment flex h-10 items-center gap-2
            rounded-full px-3
            text-light-2
            transition-all duration-200
            hover:bg-white/[0.05]
            hover:text-white
          "
          aria-label="View post"
        >
          <div className="relative h-[21px] w-[21px]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="
                h-full w-full
                transition-transform duration-200
                group-hover/comment:scale-110
              "
            >
              <path
                d="M21 11.5C21 16.1944 16.9706 20 12 20C10.8199 20 9.69282 19.7856 8.66044 19.3955L4 21L5.42993 16.7104C3.91358 15.3133 3 13.4683 3 11.5C3 6.80558 7.02944 3 12 3C16.9706 3 21 6.80558 21 11.5Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <span className="hidden text-sm font-medium sm:inline">
            Comment
          </span>
        </Link>

        {/* SHARE - visual only for now */}
        <button
          type="button"
          className="
            group/share hidden h-10 items-center gap-2
            rounded-full px-3
            text-light-2
            transition-all duration-200
            hover:bg-white/[0.05]
            hover:text-white
            sm:flex
          "
          aria-label="Share post"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="
              h-[20px] w-[20px]
              transition-transform duration-200
              group-hover/share:-translate-y-0.5
              group-hover/share:translate-x-0.5
            "
          >
            <path
              d="M22 2L11 13"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="M22 2L15 22L11 13L2 9L22 2Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="text-sm font-medium">
            Share
          </span>
        </button>
      </div>

      {/* SAVE */}
      <div className="flex h-10 w-10 items-center justify-center">
        {!isFetched || isSavingPost || isDeletingSaved ? (
          <div className="scale-75">
            <Loader />
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSavePost}
            className={`
              group/save flex h-10 w-10
              items-center justify-center
              rounded-full
              transition-all duration-200
              ${
                isSaved
                  ? "bg-purple-500/10"
                  : "hover:bg-white/[0.05]"
              }
            `}
            aria-label={
              isSaved
                ? "Remove saved post"
                : "Save post"
            }
          >
            <img
              src={
                isSaved
                  ? "/assets/icons/saved.svg"
                  : "/assets/icons/save.svg"
              }
              alt=""
              className="
                h-[21px] w-[21px]
                transition-transform duration-200
                group-hover/save:scale-110
                group-active/save:scale-90
              "
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default PostStats;