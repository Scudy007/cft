"use client";

import Link from "next/link";
import { AiFillBug, AiOutlineDown } from "react-icons/ai";
import { BsMoon, BsSun } from "react-icons/bs";
import classNames from "classnames";
import { usePathname, useRouter } from "next/navigation"; 
import { useSession, signOut } from "next-auth/react";
import { Avatar, Button, DropdownMenu, Flex, Text, Box, Container } from "@radix-ui/themes";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const NavBar = () => {
  const { data: session, status } = useSession();
  const currentPage = usePathname();
  const router = useRouter(); 
  
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (currentPage === '/login') return null;

  const links = [
    { label: "Дашборд", href: "/" },
    { label: "Рабочее пространство", href: "/issues" },
  ];

  const roleString = (session?.user as any)?.role?.toLowerCase() || "";
  const isAdmin = roleString.includes("admin") || roleString.includes("админ");
  const isAnalyst = roleString.includes("analyst") || roleString.includes("аналитик");

  const dotColor = isAdmin ? "bg-red-500" : isAnalyst ? "bg-blue-500" : "bg-slate-400";
  const textColor = isAdmin ? "text-red-600" : isAnalyst ? "text-blue-600" : "text-slate-500";
  const roleLabel = isAdmin ? "Админ" : isAnalyst ? "Аналитик" : (session?.user as any)?.role || "Пользователь";

  return (
    <header className="sticky top-0 z-50 w-full border-b transition-colors duration-300 border-indigo-200/60 bg-gradient-to-r from-indigo-100/80 via-white/60 to-blue-100/80 backdrop-blur-xl shadow-md dark:border-white/10 dark:from-[#0B0F19]/80 dark:via-[#111827]/80 dark:to-[#0B0F19]/80">
      <Container size="4">
        <Flex justify="between" align="center" className="h-16 px-4 md:px-6">
          
          <Flex align="center" gap="3">
            <Link href="/" className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors">
              <Box className="bg-white/80 dark:bg-white/10 p-1.5 rounded-lg shadow-sm border border-indigo-100 dark:border-white/10">
                <AiFillBug size={22} />
              </Box>
              <Text weight="bold" size="4" className="hidden sm:block text-slate-900 dark:text-white tracking-tight transition-colors">
                SecAudit
              </Text>
            </Link>
          </Flex>

          <Flex align="center" gap="6" className="absolute left-1/2 -translate-x-1/2 hidden md:flex">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={classNames(
                  "text-sm font-semibold transition-colors",
                  {
                    "text-indigo-700 dark:text-indigo-400 drop-shadow-sm": item.href === currentPage,
                    "text-slate-600 dark:text-slate-400 hover:text-indigo-700 dark:hover:text-indigo-300": item.href !== currentPage,
                  }
                )}
              >
                {item.label}
              </Link>
            ))}
          </Flex>

          <Flex align="center" gap="4">
            {status === "authenticated" && (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="flex items-center gap-3 hover:bg-white/60 dark:hover:bg-white/10 p-1 pr-3 rounded-full transition-all outline-none cursor-pointer border border-transparent hover:border-indigo-200 dark:hover:border-white/20 hover:shadow-sm">
                    <Avatar
                      src={session.user?.image || undefined}
                      fallback={session.user?.name?.charAt(0).toUpperCase() || "?"}
                      size="2"
                      radius="full"
                      color="indigo"
                    />
                    
                    <Flex direction="column" align="start" className="hidden sm:flex">
                      <Text size="2" weight="bold" className="text-slate-900 dark:text-white leading-none mb-1 max-w-[120px] truncate transition-colors">
                        {session.user?.name}
                      </Text>
                      <Flex align="center" gap="1">
                        <Box className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                        <Text size="1" weight="medium" className={`${textColor} leading-none tracking-wide`} uppercase>
                          {roleLabel}
                        </Text>
                      </Flex>
                    </Flex>
                    
                    <AiOutlineDown className="text-slate-500 dark:text-slate-400 text-xs ml-1 hidden sm:block" />
                  </button>
                </DropdownMenu.Trigger>
                
                <DropdownMenu.Content size="2" align="end" className="min-w-[180px]">
                  <DropdownMenu.Item className="cursor-pointer" onClick={() => router.push("/profile")}>
                    Мой профиль
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item color="red" className="cursor-pointer" onClick={() => signOut({ callbackUrl: "/" })}>
                    Выйти
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            )}
            
            {status === "unauthenticated" && (
              <Button asChild variant="soft" color="indigo">
                <Link href="/login">Войти</Link>
              </Button>
            )}

            <Box className="w-px h-6 bg-indigo-200/60 dark:bg-white/20 hidden sm:block mx-1 transition-colors" />
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/80 dark:hover:bg-white/10 rounded-full transition-all cursor-pointer outline-none flex items-center justify-center shadow-sm border border-transparent hover:border-indigo-100 dark:hover:border-white/20"
              aria-label="Переключить тему"
            >
              {mounted && theme === 'dark' ? <BsSun size={18} /> : <BsMoon size={18} />}
            </button>

          </Flex>
        </Flex>
      </Container>
    </header>
  );
};

export default NavBar;