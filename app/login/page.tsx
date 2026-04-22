"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Box, Button, Flex, Heading, Text, TextField, Theme } from "@radix-ui/themes";
import { AiFillBug, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import Spinner from "@/app/components/Spinner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Неверный email или пароль");
      setIsLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <Theme appearance="dark" className="fixed inset-0 z-50 w-full h-full bg-[#0B0F19] flex items-center justify-center overflow-hidden font-sans">
      
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

      <Box className="relative z-10 w-full max-w-md mx-4 p-8 sm:p-10 bg-white/[0.03] border border-white/[0.08] rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.3)] backdrop-blur-xl">
        
        <Flex direction="column" align="center" mb="7">
          <Box className="bg-indigo-500/20 p-3 rounded-2xl border border-indigo-500/30 mb-4 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <AiFillBug size={32} className="text-indigo-400" />
          </Box>
          <Heading size="6" className="text-white tracking-tight" mb="1">
            Добро пожаловать в SecAudit
          </Heading>
          <Text size="2" className="text-slate-400 text-center">
            Авторизуйтесь для доступа к панели управления уязвимостями
          </Text>
        </Flex>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <Box>
            <Text as="label" size="2" weight="bold" className="text-slate-300 mb-2 block">
              Email адрес
            </Text>
            <TextField.Root size="3" className="bg-black/20 border-white/10 hover:border-indigo-500/50 transition-colors">
              <TextField.Slot><AiOutlineMail className="text-slate-400" /></TextField.Slot>
              <TextField.Input 
                type="email"
                placeholder="admin@cft.ru" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </TextField.Root>
          </Box>

          <Box>
            <Text as="label" size="2" weight="bold" className="text-slate-300 mb-2 block">
              Пароль
            </Text>
            <TextField.Root size="3" className="bg-black/20 border-white/10 hover:border-indigo-500/50 transition-colors">
              <TextField.Slot><AiOutlineLock className="text-slate-400" /></TextField.Slot>
              <TextField.Input 
                type="password"
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </TextField.Root>
          </Box>

          {error && (
            <Text size="2" color="red" className="text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
              {error}
            </Text>
          )}

          <Button 
            disabled={isLoading} 
            size="3" 
            className="w-full mt-2 cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] transition-all"
          >
            {isLoading ? <Spinner /> : "Войти в систему"}
          </Button>
        </form>

        <Text size="1" className="text-slate-500 text-center block mt-8">
          Защищено корпоративными политиками безопасности ЦФТ.
        </Text>

      </Box>
    </Theme>
  );
}