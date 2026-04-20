"use client";

import { useState } from "react";
import { Box, Heading, Text, Card, Flex, Tabs, Switch, Button, TextField } from "@radix-ui/themes";

export default function SettingsPage() {
  const [isCompact, setIsCompact] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [deadlineNotif, setDeadlineNotif] = useState(true);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <Box className="max-w-5xl mx-auto py-8 px-4">
      <Heading size="7" color="gray" mb="6">Настройки системы</Heading>

      <Card size="3" variant="surface" className="shadow-sm rounded-2xl border border-slate-200">
        <Tabs.Root defaultValue="general">
          <Tabs.List size="2" className="mb-6">
            <Tabs.Trigger value="general" className="cursor-pointer text-base">Общие</Tabs.Trigger>
            <Tabs.Trigger value="notifications" className="cursor-pointer text-base">Уведомления</Tabs.Trigger>
            <Tabs.Trigger value="security" className="cursor-pointer text-base">Безопасность</Tabs.Trigger>
          </Tabs.List>

          <Box className="pt-2">
            <Tabs.Content value="general">
              <Flex direction="column" gap="5">
                <Box className="border-b border-slate-100 pb-5">
                  <Flex justify="between" align="center">
                    <Box>
                      <Text size="3" weight="bold" color="gray" className="block mb-1">Темная тема</Text>
                      <Text size="2" color="gray">Включить темное оформление интерфейса для работы в ночное время.</Text>
                    </Box>
                    <Switch size="3" color="indigo" disabled /> 
                  </Flex>
                </Box>

                <Box className="border-b border-slate-100 pb-5">
                  <Flex justify="between" align="center">
                    <Box>
                      <Text size="3" weight="bold" color="gray" className="block mb-1">Компактный режим таблиц</Text>
                      <Text size="2" color="gray">Уменьшить отступы в списках уязвимостей для отображения большего объема данных.</Text>
                    </Box>
                    <Switch 
                      size="3" 
                      color="indigo" 
                      checked={isCompact} 
                      onCheckedChange={setIsCompact} 
                    />
                  </Flex>
                </Box>
              </Flex>
            </Tabs.Content>

            <Tabs.Content value="notifications">
              <Flex direction="column" gap="5">
                <Box className="border-b border-slate-100 pb-5">
                  <Flex justify="between" align="center" mb={emailNotif ? "4" : "0"}>
                    <Box>
                      <Text size="3" weight="bold" color="gray" className="block mb-1">Email-уведомления</Text>
                      <Text size="2" color="gray">Получать сводку о новых критических уязвимостях на почту.</Text>
                    </Box>
                    <Switch 
                      size="3" 
                      color="blue" 
                      checked={emailNotif} 
                      onCheckedChange={setEmailNotif} 
                    />
                  </Flex>
                  {emailNotif && (
                    <Box className="mt-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <Text as="label" size="2" weight="bold" color="gray" mb="2" display="block">Email для получения отчетов</Text>
                      <Flex gap="3" align="center">
                        <TextField.Root size="2" className="max-w-md w-full">
                          <TextField.Input 
                            placeholder="admin@company.ru" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </TextField.Root>
                        <Button size="2" variant="soft" color="blue" className="cursor-pointer">Сохранить</Button>
                      </Flex>
                      <Text size="1" color="gray" mt="2" display="block">* Сохранение применяется только локально в целях демонстрации</Text>
                    </Box>
                  )}
                </Box>
                
                <Box className="border-b border-slate-100 pb-5">
                  <Flex justify="between" align="center">
                    <Box>
                      <Text size="3" weight="bold" color="gray" className="block mb-1">Уведомления о дедлайнах</Text>
                      <Text size="2" color="gray">Предупреждать за 24 часа до истечения SLA по открытым задачам.</Text>
                    </Box>
                    <Switch 
                      size="3" 
                      color="blue" 
                      checked={deadlineNotif} 
                      onCheckedChange={setDeadlineNotif} 
                    />
                  </Flex>
                </Box>
              </Flex>
            </Tabs.Content>

            <Tabs.Content value="security">
              <Flex direction="column" gap="5">
                <Box className="border-b border-slate-100 pb-5">
                  <Heading size="4" color="gray" mb="2">Двухфакторная аутентификация (2FA)</Heading>
                  <Text size="2" color="gray" mb="4" display="block">
                    Добавьте номер телефона для получения SMS-кодов или настройки приложения-аутентификатора.
                  </Text>
                  
                  <Box className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-4 max-w-md">
                    <Text as="label" size="2" weight="bold" color="gray" mb="2" display="block">Привязанный номер телефона</Text>
                    <Flex gap="3" align="center">
                      <TextField.Root size="2" className="w-full">
                        <TextField.Input 
                          placeholder="+7 (999) 000-00-00" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </TextField.Root>
                    </Flex>
                  </Box>

                  <Button variant="soft" color="indigo" className="cursor-pointer">
                    Обновить настройки 2FA
                  </Button>
                </Box>
              </Flex>
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Card>
    </Box>
  );
}