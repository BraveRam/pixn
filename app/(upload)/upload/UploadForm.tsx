"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload, X, Loader2, AlertCircle } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { uploadApi } from "@/lib/api/upload";
import { checkImageLimit, MAX_IMAGES_PER_USER } from "@/lib/utils/imageLimit";

const formSchema = z.object({
  files: z
    .array(z.custom<File>())
    .min(1, "Please select at least one file")
    .max(3, "Please select up to 3 files")
    .refine((files) => files.every((file) => file.size <= 5 * 1024 * 1024), {
      message: "File size must be less than 5MB",
      path: ["files"],
    }),
});

type FormValues = z.infer<typeof formSchema>;

export default function FileUploadFormDemo() {
  const router = useRouter();
  const [imageCount, setImageCount] = React.useState<number>(0);
  const [isLoadingCount, setIsLoadingCount] = React.useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
    },
  });

  // Load current image count
  React.useEffect(() => {
    const loadCount = async () => {
      const count = await checkImageLimit.getCurrentCount();
      setImageCount(count);
      setIsLoadingCount(false);
    };
    loadCount();
  }, []);

  const uploadMutation = useMutation({
    mutationFn: uploadApi.uploadImages,
    onSuccess: async () => {
      toast.success("Image uploaded successfully");
      form.reset();

      // Refresh the count after successful upload
      const newCount = await checkImageLimit.getCurrentCount();
      setImageCount(newCount);

      router.push("/gallery");
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { error?: string } } })?.response?.data?.error || "An error occurred while uploading the image";
      toast.error(errorMessage);
    },
  });

  const onSubmit = React.useCallback(async (data: FormValues) => {
    // Check limit before uploading
    const limitCheck = await checkImageLimit.canUpload(data.files.length);

    if (!limitCheck.canUpload) {
      toast.error(limitCheck.message);
      return;
    }

    const formData = new FormData();
    data.files.forEach((file) => {
      formData.append("files", file);
    });

    uploadMutation.mutate(formData);
  }, [uploadMutation]);

  const remainingSlots = MAX_IMAGES_PER_USER - imageCount;
  const isAtLimit = imageCount >= MAX_IMAGES_PER_USER;

  return (
    <TooltipProvider>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          {isAtLimit && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <h3 className="font-semibold text-destructive">Upload Limit Reached</h3>
                  <p className="text-sm text-red-400 mt-1">
                    You have reached the maximum of {MAX_IMAGES_PER_USER} images. Please delete some existing images to upload new ones.
                  </p>
                </div>
              </div>
            </div>
          )}
          <FormField
            control={form.control}
            name="files"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FileUpload
                    value={field.value}
                    onValueChange={field.onChange}
                    accept="image/*"
                    maxFiles={3}
                    maxSize={5 * 1024 * 1024}
                    onFileReject={(_, message) => {
                      form.setError("files", {
                        message,
                      });
                    }}
                    multiple
                    disabled={isAtLimit}
                  >
                    <FileUploadDropzone className="flex flex-col items-center justify-center gap-4 p-10 border-2 border-dashed border-muted-foreground/25 rounded-3xl bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer min-h-[300px]">
                      <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-2">
                        <CloudUpload className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-lg font-semibold">
                          Drag and drop or click to upload
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Upload up to 3 images, max 5MB each
                        </p>
                        {!isLoadingCount && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {imageCount}/{MAX_IMAGES_PER_USER} images used · {remainingSlots} slots remaining
                          </p>
                        )}
                      </div>
                      <FileUploadTrigger asChild>
                        <Button variant="secondary" className="mt-4 rounded-full font-semibold cursor-pointer">
                          Choose Files
                        </Button>
                      </FileUploadTrigger>
                    </FileUploadDropzone>

                    <FileUploadList className="mt-6 space-y-3">
                      {field.value.map((file, index) => (
                        <FileUploadItem key={index} value={file} className="bg-secondary/30 border border-border rounded-xl p-3 min-w-0">
                          <FileUploadItemPreview className="rounded-lg w-12 h-12 object-cover shrink-0" />
                          <FileUploadItemMetadata className="text-sm font-medium" />
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <FileUploadItemDelete asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground hover:text-destructive cursor-pointer shrink-0"
                                >
                                  <X className="w-4 h-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </FileUploadItemDelete>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Remove file</p>
                            </TooltipContent>
                          </Tooltip>
                        </FileUploadItem>
                      ))}
                    </FileUploadList>
                  </FileUpload>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-4">
            <Button
              disabled={uploadMutation.isPending || form.watch("files").length === 0}
              type="submit"
              size="lg"
              className="rounded-full font-bold px-8 cursor-pointer"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Publish"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </TooltipProvider>
  );
}
