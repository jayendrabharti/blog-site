"use client";
import { getPostById, updatePost } from "@/actions/post.actions";
import RevealHero from "@/components/animations/RevealHero";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Post } from "@prisma/client";
import { LoaderCircleIcon, PencilIcon } from "lucide-react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type PostFormValues = {
  title: string;
  content: string;
};

export default function UpdatePostPage() {
  const { postId } = useParams<{ postId: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [post, setPost] = useState<Post | null>(null);

  const router = useRouter();

  const form = useForm<PostFormValues>({
    defaultValues: { title: post?.title || "", content: post?.content || "" },
  });

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
      </form>
    </section>
  );
}
