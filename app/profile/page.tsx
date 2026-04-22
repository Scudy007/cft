"use client";

import { useSession } from "next-auth/react";
import { Box, Card, Flex, Heading, Text, Avatar, Grid, TextField, Button } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { AiOutlineUser, AiOutlineMail, AiOutlineSafety, AiOutlineBank, AiOutlineLock } from "react-icons/ai";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <Box className="max-w-4xl mx-auto py-8 px-4 text-gray-500">Загрузка профиля...</Box>;
  }

  if (status === "unauthenticated") {
    router.push("/api/auth/signin");
    return null;
  }

  const roleString = (session?.user as any)?.role?.toLowerCase() || "";
  const isAdmin = roleString.includes("admin") || roleString.includes("админ");
  const isAnalyst = roleString.includes("analyst") || roleString.includes("аналитик");

  const dotColor = isAdmin ? "bg-red-500" : isAnalyst ? "bg-blue-500" : "bg-slate-400";
  const displayRole = isAdmin ? "Администратор (Admin)" : isAnalyst ? "Аналитик ИБ (Analyst)" : (session?.user as any)?.role || "Пользователь";

  return (
    <Box className="max-w-4xl mx-auto py-8 px-4">
      <Heading size="7" color="gray" mb="6">Мой профиль</Heading>

      <Card 
        size="1" 
        variant="surface" 
        className="shadow-sm rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 p-0 mb-6 bg-white dark:bg-[#0F172A] backdrop-blur-none"
      >
        <Box className="h-32 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 w-full" />
        
        <Box className="px-8 pb-8">
          <Flex justify="between" align="end" className="-mt-12 mb-6">
            <Avatar
              src={session?.user?.image || undefined}
              fallback={session?.user?.name?.charAt(0).toUpperCase() || "?"}
              size="8"
              radius="full"
              color="indigo"
              className="ring-1 ring-black dark:ring-white shadow-md bg-white dark:!bg-[#0F172A] p-[2px]"
            />
            <Button 
              size="2" 
              variant="soft" 
              color="indigo" 
              className="cursor-pointer transition-colors hover:bg-indigo-200 dark:hover:bg-indigo-600 dark:hover:text-white"
            >
              Изменить фото
            </Button>
          </Flex>

          <Grid columns={{ initial: "1", md: "2" }} gap="6">
            <Flex direction="column" gap="4">
              <Heading size="5" color="gray">Личные данные</Heading>
              
              <Box>
                <Text as="label" size="2" weight="bold" color="gray" mb="2" display="block">Полное имя</Text>
                <TextField.Root size="3" className="bg-slate-50 dark:bg-slate-900">
                  <TextField.Slot><AiOutlineUser className="text-gray-400" /></TextField.Slot>
                  <TextField.Input defaultValue={session?.user?.name || ""} disabled className="font-medium text-slate-700 dark:text-slate-200" />
                </TextField.Root>
              </Box>

              <Box>
                <Text as="label" size="2" weight="bold" color="gray" mb="2" display="block">Email</Text>
                <TextField.Root size="3" className="bg-slate-50 dark:bg-slate-900">
                  <TextField.Slot><AiOutlineMail className="text-gray-400" /></TextField.Slot>
                  <TextField.Input defaultValue={session?.user?.email || ""} disabled className="font-medium text-slate-700 dark:text-slate-200" />
                </TextField.Root>
              </Box>
            </Flex>

            <Flex direction="column" gap="4">
              <Heading size="5" color="gray">Рабочая информация</Heading>

              <Box>
                <Text as="label" size="2" weight="bold" color="gray" mb="2" display="block">Уровень доступа</Text>
                <TextField.Root size="3" className="bg-slate-50 dark:bg-slate-900">
                  <TextField.Slot><AiOutlineSafety className="text-gray-400" /></TextField.Slot>
                  <TextField.Slot>
                    <Box className={`w-2 h-2 rounded-full ${dotColor} mr-1`} />
                  </TextField.Slot>
                  <TextField.Input defaultValue={displayRole} disabled className="font-semibold text-slate-700 dark:text-slate-200" />
                </TextField.Root>
              </Box>

              <Box>
                <Text as="label" size="2" weight="bold" color="gray" mb="2" display="block">Отдел</Text>
                <TextField.Root size="3" className="bg-slate-50 dark:bg-slate-900">
                  <TextField.Slot><AiOutlineBank className="text-gray-400" /></TextField.Slot>
                  <TextField.Input defaultValue="Финансовая безопасность" disabled className="font-medium text-slate-700 dark:text-slate-200" />
                </TextField.Root>
              </Box>
            </Flex>
          </Grid>

          <Box className="mt-8 border-t border-slate-100 dark:border-white/10 pt-6">
            <Heading size="5" color="gray" mb="4">Безопасность</Heading>
            <Grid columns={{ initial: "1", md: "2" }} gap="6">
              <Box>
                <Text as="label" size="2" weight="bold" color="gray" mb="2" display="block">Новый пароль</Text>
                <TextField.Root size="3">
                  <TextField.Slot><AiOutlineLock className="text-gray-400" /></TextField.Slot>
                  <TextField.Input type="password" placeholder="Введите новый пароль" />
                </TextField.Root>
              </Box>

              <Box>
                <Text as="label" size="2" weight="bold" color="gray" mb="2" display="block">Подтвердите пароль</Text>
                <TextField.Root size="3">
                  <TextField.Slot><AiOutlineLock className="text-gray-400" /></TextField.Slot>
                  <TextField.Input type="password" placeholder="Повторите пароль" />
                </TextField.Root>
              </Box>
            </Grid>
          </Box>

          <Flex justify="end" mt="7">
            <Button size="3" color="indigo" className="cursor-pointer shadow-sm">
              Сохранить изменения
            </Button>
          </Flex>
        </Box>
      </Card>
    </Box>
  );
}