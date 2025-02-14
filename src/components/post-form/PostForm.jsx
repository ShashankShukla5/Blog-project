import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import authService from "../../appwrite/conf";
import { RTE, Button, Input, Select } from "../index";
import { useNavigate } from "react-router-dom";

function PostForm({ post }) {
  const { register, handleSubmit, control, watch, setValue, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.useData);

  const submit = async (data) => {
    if (post) {
      // Modified
      const file = data.image[0];
      if (file) {
        if (await authService.uploadFile(file)) {
          await authService.deleteFile(post.featuredImage);
        }
      }
      const dbPost = await authService.updatePost(post.$id, {
        ...data,
        featuredImage: file ? file.$id : undefined,
      });
      if (dbPost) navigate(`/post/${dbPost.$id}`);
    } else {
      const file = data.image[0]
        ? await authService.uploadFile(data.image[0])
        : null;
      if (file) {
        data.featuredImage = file.$id;
        const dbPost = await authService.createPost({
          userId: userData.$id,
          ...data,
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      }
    }
  };

  const slugTransform = useCallback((value) => {
    // console.log(typeof value)
    if (value && typeof value === "string") {
      return value
        ?.trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    } else return "";
  });

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        // console.log(value);
        // slugTransform(value)
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
      return () => subscription.unsubscribe();
    });
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
          // onInput={(e)=>{
          //   setValue('slug', slugTransform(e.currentTarget.value), { shouldValidate: true })
          // }}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />
        {post && (
          <div className="w-full mb-4">
            <img
              src={authService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full hover:cursor-pointer"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
