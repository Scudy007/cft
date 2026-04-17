"use client";
import { Button, Callout, TextField, Select } from "@radix-ui/themes";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createIssueSchema } from "@/app/validationSchemas";
import { z } from "zod";
import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { Issue } from "@prisma/client";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

type IssueFormData = z.infer<typeof createIssueSchema>;

const IssueForm = ({ issue }: { issue?: Issue }) => {
  const router = useRouter();
  const { register, control, handleSubmit, formState: { errors } } = useForm<IssueFormData>({
    resolver: zodResolver(createIssueSchema),
    defaultValues: issue || {}
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      if (issue) {
        await axios.patch(`/api/issues/${issue.id}`, data);
      } else {
        await axios.post("/api/issues", data);
      }
      router.push("/issues");
      router.refresh();
    } catch (err) {
      setError("Произошла ошибка при сохранении.");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form className="space-y-3" onSubmit={onSubmit}>
        <TextField.Root>
          <TextField.Input placeholder="Название аудита" {...register("title")} />
        </TextField.Root>
        <ErrorMessage>{errors.title?.message}</ErrorMessage>

        <TextField.Root>
          <TextField.Input placeholder="Система" {...register("system")} />
        </TextField.Root>
        <ErrorMessage>{errors.system?.message}</ErrorMessage>

        <TextField.Root>
          <TextField.Input
            placeholder="Категория (например, Web, Mobile, Network)"
            {...register("category")}
          />
        </TextField.Root>
        <ErrorMessage>{errors.category?.message}</ErrorMessage>

        <Controller
          name="criticality"
          control={control}
          render={({ field }) => (
            <Select.Root
              onValueChange={field.onChange}
              defaultValue={field.value || "MEDIUM"}
            >
              <Select.Trigger placeholder="Критичность" />
              <Select.Content>
                <Select.Item value="LOW">Low</Select.Item>
                <Select.Item value="MEDIUM">Medium</Select.Item>
                <Select.Item value="HIGH">High</Select.Item>
                <Select.Item value="CRITICAL">Critical</Select.Item>
              </Select.Content>
            </Select.Root>
          )}
        />
        <ErrorMessage>{errors.criticality?.message}</ErrorMessage>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <SimpleMDE placeholder="Описание нарушения" {...field} />
          )}
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>

        <Button disabled={isSubmitting}>
          {issue ? "Обновить" : "Создать"} {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default IssueForm;