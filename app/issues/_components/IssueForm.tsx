"use client";

import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { createIssueSchema } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Issue } from "@prisma/client";
import { Button, Callout, Flex, Grid, Select, TextField, Box, Heading, Text, Card, Separator } from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import RiskCalculator, { RiskData } from "./RiskCalculator";
import { calculateCVSS, calculateDread } from "@/app/lib/riskCalc";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

type IssueFormData = z.infer<typeof createIssueSchema>;

const IssueForm = ({ issue }: { issue?: Issue }) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const [riskData, setRiskData] = useState<RiskData>({
    cvssAV: (issue?.cvssAV as any) || "NETWORK",
    cvssAC: (issue?.cvssAC as any) || "LOW",
    cvssPR: (issue?.cvssPR as any) || "NONE",
    cvssUI: (issue?.cvssUI as any) || "NONE",
    cvssS: (issue?.cvssS as any) || "UNCHANGED",
    cvssC: (issue?.cvssC as any) || "NONE",
    cvssI: (issue?.cvssI as any) || "NONE",
    cvssA: (issue?.cvssA as any) || "NONE",
    dreadDamage: issue?.dreadDamage || 1,
    dreadRepro: issue?.dreadRepro || 1,
    dreadExploit: issue?.dreadExploit || 1,
    dreadAffected: issue?.dreadAffected || 1,
    dreadDiscover: issue?.dreadDiscover || 1,
  });

  const { register, control, handleSubmit, formState: { errors } } = useForm<IssueFormData>({
    resolver: zodResolver(createIssueSchema),
    defaultValues: {
      title: issue?.title,
      description: issue?.description,
      system: issue?.system,
      category: issue?.category,
      assignedToUserId: issue?.assignedToUserId
    }
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      
      const finalCvssScore = calculateCVSS(riskData);
      const finalDreadScore = calculateDread(riskData);

      const payload = { 
        ...data, 
        ...riskData,
        cvssScore: finalCvssScore,
        dreadScore: finalDreadScore
      };

      if (issue) {
        await axios.patch(`/api/issues/${issue.id}`, payload);
      } else {
        await axios.post("/api/issues", payload);
      }
      
      router.push("/"); 
      router.refresh();
    } catch (err) {
      setError("Произошла ошибка при сохранении. Проверьте заполнение всех полей.");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Box className="max-w-3xl mx-auto py-5">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <Card size="3">
          <Flex direction="column" gap="4">
            <Heading size="4">1. Информация об инциденте</Heading>
            
            <Box>
              <Text as="label" size="2" weight="bold" mb="1" display="block">Название задачи</Text>
              <TextField.Root>
                <TextField.Input placeholder="Например: SQL Injection в модуле авторизации" {...register("title")} />
              </TextField.Root>
              <ErrorMessage>{errors.title?.message}</ErrorMessage>
            </Box>

            <Grid columns="2" gap="4">
              <Box>
                <Text as="label" size="2" weight="bold" mb="1" display="block">Целевая система</Text>
                <TextField.Root>
                  <TextField.Input placeholder="iOS, WebApp, API..." {...register("system")} />
                </TextField.Root>
                <ErrorMessage>{errors.system?.message}</ErrorMessage>
              </Box>
              <Box>
                <Text as="label" size="2" weight="bold" mb="1" display="block">Категория</Text>
                <TextField.Root>
                  <TextField.Input placeholder="Vulnerability, Bug..." {...register("category")} />
                </TextField.Root>
                <ErrorMessage>{errors.category?.message}</ErrorMessage>
              </Box>
            </Grid>

            <Box>
              <Text as="label" size="2" weight="bold" mb="1" display="block">Описание нарушения</Text>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <SimpleMDE placeholder="Опишите детали уязвимости..." {...field} />
                )}
              />
              <ErrorMessage>{errors.description?.message}</ErrorMessage>
            </Box>
          </Flex>
        </Card>

        <Box>
          <Heading size="4" mb="3">2. Оценка критичности</Heading>
        
          <RiskCalculator 
            data={riskData} 
            onChange={setRiskData} 
            readonly={false} 
          />
        </Box>

        <Separator size="4" />

        <Box>
          <Button 
            disabled={isSubmitting} 
            size="3" 
            variant="solid" 
            className="w-full"
            style={{ cursor: 'pointer' }}
          >
            {issue ? "Сохранить изменения" : "Зарегистрировать уязвимость"}
            {isSubmitting && <Spinner />}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default IssueForm;