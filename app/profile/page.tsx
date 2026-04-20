"use client";

import { useSession } from "next-auth/react";
import { Box, Card, Flex, Heading, Text, Avatar, Grid, TextField, Button } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { AiOutlineUser, AiOutlineMail, AiOutlineSafety, AiOutlineBank, AiOutlineTrophy } from "react-icons/ai";

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

      <Card size="1" variant="surface" className="shadow-sm rounded-2xl overflow-hidden border border-slate-200 p-0 mb-6">
        <Box className="h-32 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 w-full" />
        
        <Box className="px-8 pb-8">
          <Flex justify="between" align="end" className="-mt-12 mb-6">
            <Avatar
              src={session?.user?.image || undefined}
              fallback={session?.user?.name?.charAt(0).toUpperCase() || "?"}
              size="8"
              radius="full"
              color="indigo"
              className="border-4 border-white shadow-sm bg-white"
            />
            <Button size="2" variant="soft" color="indigo" className="cursor-pointer transition-colors hover:bg-indigo-100">
              Изменить фото
            </Button>
          </Flex>

          <Grid columns={{ initial: "1", md: "2" }} gap="6">
            <Flex direction="column" gap="4">
              <Heading size="5" color="gray">Личные данные</Heading>
              
              <Box>
                <Text as="label" size="2" weight="bold" color="gray" mb="2" display="block">Полное имя</Text>
                <TextField.Root size="3">
                  <TextField.Slot><AiOutlineUser className="text-gray-400" /></TextField.Slot>
                  <TextField.Input defaultValue={session?.user?.name || ""} />
                </TextField.Root>
              </Box>

              <Box>
                <Text as="label" size="2" weight="bold" color="gray" mb="2" display="block">Email</Text>
                <TextField.Root size="3">
                  <TextField.Slot><AiOutlineMail className="text-gray-400" /></TextField.Slot>
                  <TextField.Input defaultValue={session?.user?.email || ""} disabled />
                </TextField.Root>
              </Box>
            </Flex>

            <Flex direction="column" gap="4">
              <Heading size="5" color="gray">Рабочая информация</Heading>

              <Box>
                <Text as="label" size="2" weight="bold" color="gray" mb="2" display="block">Уровень доступа</Text>
                <TextField.Root size="3" className="bg-slate-50">
                  <TextField.Slot><AiOutlineSafety className="text-gray-400" /></TextField.Slot>
                  <TextField.Slot>
                    <Box className={`w-2 h-2 rounded-full ${dotColor} mr-1`} />
                  </TextField.Slot>
                  <TextField.Input defaultValue={displayRole} disabled className="font-semibold text-slate-700" />
                </TextField.Root>
              </Box>

              <Box>
                <Text as="label" size="2" weight="bold" color="gray" mb="2" display="block">Отдел</Text>
                <TextField.Root size="3">
                  <TextField.Slot><AiOutlineBank className="text-gray-400" /></TextField.Slot>
                  <TextField.Input defaultValue="Информационная безопасность" disabled />
                </TextField.Root>
              </Box>
            </Flex>
          </Grid>

          <Flex justify="end" mt="7">
            <Button size="3" color="indigo" className="cursor-pointer shadow-sm">
              Сохранить изменения
            </Button>
          </Flex>
        </Box>
      </Card>

      <Heading size="5" color="gray" mb="4">Моя эффективность</Heading>
      <Grid columns={{ initial: "1", sm: "3" }} gap="4">
        <Card size="2" variant="surface" className="bg-slate-50 border-slate-200 shadow-sm">
          <Flex align="center" gap="3">
            <Box className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <AiOutlineTrophy size={24} />
            </Box>
            <Box>
              <Text size="2" color="gray" display="block">Решено уязвимостей</Text>
              <Text size="6" weight="bold" color="blue">14</Text>
            </Box>
          </Flex>
        </Card>

        <Card size="2" variant="surface" className="bg-slate-50 border-slate-200 shadow-sm">
          <Flex align="center" gap="3">
            <Box className="p-3 bg-orange-100 text-orange-600 rounded-lg">
              <AiOutlineSafety size={24} />
            </Box>
            <Box>
              <Text size="2" color="gray" display="block">Задач в работе</Text>
              <Text size="6" weight="bold" color="orange">3</Text>
            </Box>
          </Flex>
        </Card>

        <Card size="2" variant="surface" className="bg-slate-50 border-slate-200 shadow-sm">
          <Flex align="center" gap="3">
            <Box className="p-3 bg-green-100 text-green-600 rounded-lg">
              <AiOutlineBank size={24} />
            </Box>
            <Box>
              <Text size="2" color="gray" display="block">Соблюдение SLA</Text>
              <Text size="6" weight="bold" color="green">98%</Text>
            </Box>
          </Flex>
        </Card>
      </Grid>
    </Box>
  );
}