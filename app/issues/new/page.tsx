"use client";

import { Button, Callout, TextField } from "@radix-ui/themes";
import "easymde/dist/easymde.min.css";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createIssueSchema } from "@/app/validationSchemas";
import { z } from "zod";
import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import dynamic from "next/dynamic";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

type IssueForm = z.infer<typeof createIssueSchema>;

const NewIssuePage = () => {
  const router = useRouter();
  const { register, control, handleSubmit, formState: { errors } } = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema),
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form
        className="space-y-3"
        onSubmit={handleSubmit(async (data) => {
          try {
            setSubmitting(true);
            await axios.post("/api/issues", data);
            router.push("/issues");
          } catch (error) {
            setSubmitting(false);
            setError("An unexpected error occurred.");
          }
        })}
      >
        <TextField.Root>
          <TextField.Input placeholder="Название аудита" {...register("title")} />
        </TextField.Root>
        <ErrorMessage>{errors.title?.message}</ErrorMessage>

        <TextField.Root>
          <TextField.Input placeholder="Система / Модуль" {...register("system")} />
        </TextField.Root>
        <ErrorMessage>{errors.system?.message}</ErrorMessage>

        <TextField.Root>
          <TextField.Input placeholder="Категория (например, Сеть, Доступ)" {...register("category")} />
        </TextField.Root>
        <ErrorMessage>{errors.category?.message}</ErrorMessage>

        <Controller
          name="description"
          control={control}
          render={({ field: { ref, ...fieldProps } }) => (
            <SimpleMDE placeholder="Описание нарушения" {...fieldProps} />
          )}
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>

        <Button disabled={isSubmitting}>
          Создать {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default NewIssuePage;