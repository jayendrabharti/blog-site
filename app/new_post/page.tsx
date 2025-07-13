"use client";
import { createPost } from "@/actions/post.actions";
import RevealHero from "@/components/animations/RevealHero";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircleIcon, PencilIcon } from "lucide-react";
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
      </form>
    </section>
  );
}
