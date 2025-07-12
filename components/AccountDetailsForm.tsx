"use client";

import { User } from "@prisma/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "./ui/button";
import { Loader2Icon, RotateCcwIcon, SaveIcon } from "lucide-react";
import { updateUserAction } from "@/actions/users";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().optional(),
  registrationNumber: z.string().optional(),
  course: z.string().optional(),
  graduationYear: z.string().optional(),
  dayScholar: z.boolean(),
  instagramUrl: z.string().url().or(z.literal("")).optional(),
  facebookUrl: z.string().url().or(z.literal("")).optional(),
  githubUrl: z.string().url().or(z.literal("")).optional(),
  linkedinUrl: z.string().url().or(z.literal("")).optional(),
  twitterUrl: z.string().url().or(z.literal("")).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AccountDetailssForm({ user }: { user: User }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name || "",
      phone: user.phone || "",
      registrationNumber: user.registrationNumber || "",
      course: user.course || "",
      graduationYear: user.graduationYear || "",
      dayScholar: user.dayScholar ?? false,
      instagramUrl: user.instagramUrl || "",
      facebookUrl: user.facebookUrl || "",
      githubUrl: user.githubUrl || "",
      linkedinUrl: user.linkedinUrl || "",
      twitterUrl: user.twitterUrl || "",
    },
  });
  const { update: updateSession } = useSession();

  const onSubmit = async (data: FormValues) => {
    const cleanedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) =>
        typeof value === "string" && value.trim() === ""
          ? [key, undefined]
          : [key, value]
      )
    ) as FormValues;

    const { errorMessage } = await updateUserAction({
      id: user.id,
      data: cleanedData,
    });
    await updateSession();
    if (errorMessage) {
      toast.error(errorMessage);
    } else {
      toast.success("Updated User Data !!");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="ml-2">Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your full name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="ml-2">Phone</FormLabel>
              <div className="flex flex-row items-center space-x-2">
                <span className="bg-input/30 rounded-md p-1 border border-border">
                  +91
                </span>
                <FormControl>
                  <Input {...field} placeholder="Enter your phone number" />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="registrationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="ml-2">Registration Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter your Registration number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="course"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="ml-2">Course</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your Course" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="graduationYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="ml-2">Graduation Year</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your Graduation year" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dayScholar"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0 ml-auto mr-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="mb-0">Day Scholar</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instagramUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="ml-2">Instagram URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your Instagram URL" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="facebookUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="ml-2">Facebook URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your Facebook URL" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="githubUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="ml-2">GitHub URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your GitHub URL" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="linkedinUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="ml-2">LinkedIn URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your LinkedIn URL" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="twitterUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="ml-2">Twitter URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your Twitter URL" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row space-x-3 ml-auto">
          <Button
            variant={"outline"}
            type={"button"}
            onClick={() => form.reset()}
          >
            <RotateCcwIcon />
            Reset
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <SaveIcon />
            )}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
