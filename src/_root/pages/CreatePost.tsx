import PostForm from "@/components/forms/PostForm";

const CreatePost = () => {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#08080A]">
      {/* Background ambience */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute -top-[220px] left-[10%]
            h-[500px] w-[500px]
            rounded-full
            bg-violet-600/[0.07]
            blur-[160px]
          "
        />

        <div
          className="
            absolute bottom-[-250px] right-[-100px]
            h-[500px] w-[500px]
            rounded-full
            bg-indigo-500/[0.04]
            blur-[170px]
          "
        />
      </div>

      {/* Page content */}
      <section
        className="
          relative z-10
          mx-auto
          w-full
          max-w-[1000px]
          px-5
          pb-24
          pt-8
          md:px-8
          md:pt-10
          lg:px-10
          lg:pt-12
        "
      >
        {/* Page header */}
        <header className="mb-9 border-b border-white/[0.06] pb-7">
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
              Create
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
            Create something.
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-light-3">
            Share a moment, idea or story with your community.
          </p>
        </header>

        {/* Composer */}
        <PostForm action="Create" />
      </section>
    </main>
  );
};

export default CreatePost;