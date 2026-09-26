import * as z from "zod";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { PostValidation } from "@/lib/validation";

import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";

import FileUploader from "@/components/shared/FileUploader";
import Loader from "@/components/shared/Loader";

import {
  useCreatePost,
  useUpdatePost,
} from "@/lib/react-query/queriesAndMutations";

import type { IPost } from "@/types";

type PostFormProps = {
  post?: IPost;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();

  const { toast } = useToast();

  const { user } = useUserContext();

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),

    defaultValues: {
      caption: post ? post.caption : "",

      file: [],

      location: post ? post.location : "",

      tags: post ? post.tags.join(",") : "",
    },
  });

  // =========================================================
  // QUERIES
  // =========================================================

  const {
    mutateAsync: createPost,
    isPending: isLoadingCreate,
  } = useCreatePost();

  const {
    mutateAsync: updatePost,
    isPending: isLoadingUpdate,
  } = useUpdatePost();

  const isSubmitting =
    isLoadingCreate || isLoadingUpdate;

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (
    value: z.infer<typeof PostValidation>
  ) => {
    // UPDATE POST
    if (post && action === "Update") {
      const updatedPost = await updatePost({
        ...value,

        postId: post.$id,

        imageId: post.imageId,

        imageUrl: post.imageUrl,
      });

      if (!updatedPost) {
        toast({
          title: `${action} post failed. Please try again.`,
        });

        return;
      }

      navigate(`/posts/${post.$id}`);

      return;
    }

    // CREATE POST
    const newPost = await createPost({
      ...value,

      userId: user.id,
    });

    if (!newPost) {
      toast({
        title: `${action} post failed. Please try again.`,
      });

      return;
    }

    navigate("/");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="
          overflow-hidden
          rounded-[28px]
          border border-white/[0.07]
          bg-[#0D0D10]
          shadow-[0_24px_80px_rgba(0,0,0,0.25)]
        "
      >
        {/* =====================================================
            FORM HEADER
        ===================================================== */}

        <div
          className="
            flex items-center
            justify-between
            border-b
            border-white/[0.06]
            px-6 py-5
            md:px-8
          "
        >
          <div>
            <h2 className="text-base font-semibold text-white">
              {action === "Create"
                ? "New post"
                : "Edit post"}
            </h2>

            <p className="mt-1 text-xs text-light-3">
              {action === "Create"
                ? "Compose and publish something new."
                : "Make changes to your post."}
            </p>
          </div>

          <div
            className="
              rounded-full
              border border-violet-400/10
              bg-violet-500/[0.06]
              px-3 py-1.5
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-violet-300
            "
          >
            Vibely
          </div>
        </div>

        {/* =====================================================
            FORM BODY
        ===================================================== */}

        <div className="flex flex-col gap-8 p-6 md:p-8">

          {/* CAPTION */}
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem>
                <div className="mb-2.5 flex items-center justify-between">
                  <FormLabel
                    className="
                      text-sm
                      font-medium
                      text-light-1
                    "
                  >
                    Caption
                  </FormLabel>

                  <span className="text-[11px] text-light-4">
                    Tell your story
                  </span>
                </div>

                <FormControl>
                  <Textarea
                    placeholder="What's on your mind?"
                    className="
                      min-h-[150px]
                      resize-none
                      rounded-2xl
                      border
                      border-white/[0.07]
                      bg-[#09090B]
                      px-4 py-4
                      text-[15px]
                      leading-6
                      text-white
                      outline-none
                      transition-all
                      duration-200
                      placeholder:text-light-4
                      focus:border-violet-500/40
                      focus:ring-2
                      focus:ring-violet-500/[0.08]
                      custom-scrollbar
                    "
                    {...field}
                  />
                </FormControl>

                <FormMessage className="mt-2 text-xs text-red-400" />
              </FormItem>
            )}
          />

          {/* MEDIA */}
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <div className="mb-2.5">
                  <FormLabel className="text-sm font-medium text-light-1">
                    Media
                  </FormLabel>

                  <p className="mt-1 text-xs text-light-4">
                    Add an image that brings your post to life.
                  </p>
                </div>

                <FormControl>
                  <FileUploader
                    fieldChange={field.onChange}
                    mediaUrl={post?.imageUrl || ""}
                  />
                </FormControl>

                <FormMessage className="mt-2 text-xs text-red-400" />
              </FormItem>
            )}
          />

          {/* LOCATION + TAGS */}
          <div
            className="
              grid
              grid-cols-1
              gap-6
              md:grid-cols-2
            "
          >
            {/* LOCATION */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-2.5 block text-sm font-medium text-light-1">
                    Location
                  </FormLabel>

                  <FormControl>
                    <div className="relative">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="
                          absolute
                          left-4
                          top-1/2
                          h-[18px]
                          w-[18px]
                          -translate-y-1/2
                          text-light-4
                        "
                      >
                        <path
                          d="M20 10C20 15 12 21 12 21C12 21 4 15 4 10C4 5.58 7.58 2 12 2C16.42 2 20 5.58 20 10Z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />

                        <circle
                          cx="12"
                          cy="10"
                          r="2.5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                      </svg>

                      <Input
                        type="text"
                        placeholder="Add a location"
                        className="
                          h-12
                          rounded-xl
                          border
                          border-white/[0.07]
                          bg-[#09090B]
                          pl-11
                          pr-4
                          text-sm
                          text-white
                          outline-none
                          transition-all
                          duration-200
                          placeholder:text-light-4
                          focus-visible:border-violet-500/40
                          focus-visible:ring-2
                          focus-visible:ring-violet-500/[0.08]
                        "
                        {...field}
                      />
                    </div>
                  </FormControl>

                  <FormMessage className="mt-2 text-xs text-red-400" />
                </FormItem>
              )}
            />

            {/* TAGS */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-2.5 block text-sm font-medium text-light-1">
                    Tags
                  </FormLabel>

                  <FormControl>
                    <div className="relative">
                      <span
                        className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-sm
                          font-medium
                          text-light-4
                        "
                      >
                        #
                      </span>

                      <Input
                        placeholder="travel, photography, design"
                        type="text"
                        className="
                          h-12
                          rounded-xl
                          border
                          border-white/[0.07]
                          bg-[#09090B]
                          pl-10
                          pr-4
                          text-sm
                          text-white
                          outline-none
                          transition-all
                          duration-200
                          placeholder:text-light-4
                          focus-visible:border-violet-500/40
                          focus-visible:ring-2
                          focus-visible:ring-violet-500/[0.08]
                        "
                        {...field}
                      />
                    </div>
                  </FormControl>

                  <p className="mt-2 text-[11px] text-light-4">
                    Separate multiple tags with commas.
                  </p>

                  <FormMessage className="mt-2 text-xs text-red-400" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            border-t
            border-white/[0.06]
            bg-black/[0.12]
            px-6 py-5
            md:px-8
          "
        >
          <p className="hidden text-xs text-light-4 sm:block">
            Your post will be visible in the Vibely feed.
          </p>

          <div className="ml-auto flex items-center gap-3">
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={() => navigate(-1)}
              className="
                h-11
                rounded-xl
                border
                border-white/[0.07]
                bg-white/[0.03]
                px-5
                text-sm
                font-medium
                text-light-2
                transition-all
                hover:bg-white/[0.06]
                hover:text-white
              "
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="
                h-11
                min-w-[130px]
                rounded-xl
                bg-gradient-to-r
                from-violet-600
                to-indigo-600
                px-6
                text-sm
                font-semibold
                text-white
                shadow-[0_8px_25px_rgba(109,40,217,0.2)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-[0_12px_30px_rgba(109,40,217,0.3)]
                disabled:pointer-events-none
                disabled:opacity-60
              "
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader />

                  <span>
                    {action === "Create"
                      ? "Publishing"
                      : "Saving"}
                  </span>
                </div>
              ) : (
                <>
                  {action === "Create"
                    ? "Publish post"
                    : "Save changes"}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;