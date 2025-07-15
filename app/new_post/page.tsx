"use client";
import { createPost } from "@/actions/post.actions";
import RevealHero from "@/components/animations/RevealHero";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Markdown from "@/utils/markdown";
import {
  ArrowBigDownIcon,
  ExternalLinkIcon,
  LoaderCircleIcon,
  PencilIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type PostFormValues = {
  title: string;
  content: string;
};

export default function NewPostPage() {
  const router = useRouter();
  const form = useForm<PostFormValues>({
    defaultValues: { title: "", content: "" },
  });

  const scrollToPreview = () => {
    const previewSection = document.querySelector("#preview");
    if (previewSection) {
      previewSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (data: PostFormValues) => {
    try {
      const postData = await createPost({
        title: data.title,
        content: data.content,
      });

      if (postData.id) {
        toast.success("Post created successfully!");
        router.push(`/posts/${postData.id}`);
      } else {
        throw new Error("Post creation failed.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    }
  };
  return (
    <section className="flex flex-col h-full gap-4 max-w-4xl mx-auto p-4 w-full">
      <RevealHero className="mx-auto">
        <span className="text-2xl font-bold">New Post</span>
      </RevealHero>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <input
          {...form.register("title", { required: true })}
          placeholder="Title"
          className="border rounded px-3 py-2"
        />
        <Textarea
          {...form.register("content", { required: true })}
          placeholder="Write your post in markdown..."
          className="min-h-[150px]"
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <LoaderCircleIcon className="animate-spin" />
          ) : (
            <PencilIcon />
          )}
          Create Post
        </Button>
        <Button type={"button"} variant={"secondary"} onClick={scrollToPreview}>
          Preview
          <ArrowBigDownIcon />
        </Button>
      </form>

      <div className="flex flex-col gap-2 mt-6">
        <div className="text-balance text-center border border-border bg-secondary shadow-md rounded-2xl py-2 w-max max-w-full mx-auto">
          <b>
            <u>Note:</u>
          </b>{" "}
          You can apply formatting using markdown syntax. To know more about
          markdown syntax, you can refer to the{" "}
          <Link
            href="https://www.markdownguide.org/basic-syntax/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="link" className="text-blue-500">
              Markdown Guide
              <ExternalLinkIcon />
            </Button>
          </Link>
        </div>
        <div
          id="preview"
          className="prose prose-invert dark:prose-invert max-w-full overflow-x-auto border border-border shadow-md rounded-2xl"
        >
          <p className="py-2 px-4 bg-muted font-extrabold text-2xl border-b border-border">
            Preview
          </p>
          <div className="px-5">
            <Markdown
              content={form.watch("content") || `# No Content to display`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
