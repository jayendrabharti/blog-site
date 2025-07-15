"use client";
import { getPostById, updatePost } from "@/actions/post.actions";
import RevealHero from "@/components/animations/RevealHero";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Markdown from "@/utils/markdown";
import { Post } from "@prisma/client";
import {
  ArrowBigDownIcon,
  ExternalLinkIcon,
  LoaderCircleIcon,
  PencilIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type PostFormValues = {
  title: string;
  content: string;
};

export default function UpdatePostPage() {
  const router = useRouter();
  const { postId } = useParams<{ postId: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [post, setPost] = useState<Post | null>(null);

  const form = useForm<PostFormValues>({
    defaultValues: { title: post?.title || "", content: post?.content || "" },
  });

  const scrollToPreview = () => {
    const previewSection = document.querySelector("#preview");
    if (previewSection) {
      previewSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const getPost = async () => {
      try {
        const p = await getPostById(postId);
        setPost(p);
        form.reset({
          title: p.title ?? undefined,
          content: p.content ?? undefined,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        setLoading(false);
        toast.error("Failed to load post. Please try again.");
      }
    };
    getPost();
  }, [form, postId]);

  const handleSubmit = async (data: PostFormValues) => {
    try {
      const postData = await updatePost(postId, {
        title: data.title,
        content: data.content,
      });

      if (postData.id) {
        toast.success("Post updated successfully!");
        router.push(`/posts/${postData.id}`);
      } else {
        throw new Error("Post updation failed.");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoaderCircleIcon className="animate-spin h-8 w-8 text-gray-500" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!post) return notFound();

  return (
    <section className="flex flex-col h-full gap-4 max-w-4xl mx-auto p-4 w-full">
      <BackButton />
      <RevealHero className="mx-auto">
        <span className="text-2xl font-bold">Update Post</span>
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
          Update Post
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
          markdown syntax, you can refer to the
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
          or you can use the online markdown editor for better experience
          <Link
            href="https://stackedit.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="link" className="text-blue-500">
              StackEdit
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
