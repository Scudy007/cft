"use client";

import Link from "next/link";
import { AiFillBug, AiOutlineDown } from "react-icons/ai";
import classNames from "classnames";
import { usePathname, useRouter } from "next/navigation"; 
import { useSession, signOut } from "next-auth/react";
import { Avatar, Button, DropdownMenu, Flex, Text, Box, Container } from "@radix-ui/themes";

const NavBar = () => {
  const { data: session, status } = useSession();
  const currentPage = usePathname();
  const router = useRouter();

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
    <header className="sticky top-0 z-50 w-full border-b border-indigo-200/60 bg-gradient-to-r from-indigo-100/80 via-white/60 to-blue-100/80 backdrop-blur-xl shadow-md">
      <Container size="4">
        <Flex justify="between" align="center" className="h-16 px-4 md:px-6">
          
          <Flex align="center" gap="3">
            <Link href="/" className="flex items-center gap-2 text-indigo-700 hover:text-indigo-900 transition-colors">
              <Box className="bg-white/80 p-1.5 rounded-lg shadow-sm border border-indigo-100">
                <AiFillBug size={22} />
              </Box>
              <Text weight="bold" size="4" className="hidden sm:block text-slate-900 tracking-tight">
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
                  "text-sm font-semibold transition-colors hover:text-indigo-700",
                  {
                    "text-indigo-700 drop-shadow-sm": item.href === currentPage,
                    "text-slate-600": item.href !== currentPage,
                  }
                )}
              >
                {item.label}
              </Link>
            ))}
          </Flex>

          <Flex align="center" gap="4">
            {status === "authenticated" && (
              <>
                <Button asChild size="2" color="indigo" variant="solid" className="cursor-pointer shadow-sm hidden sm:inline-flex">
                  <Link href="/issues/new">+ Новый аудит</Link>
                </Button>

                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="flex items-center gap-3 hover:bg-white/60 p-1 pr-3 rounded-full transition-all outline-none cursor-pointer border border-transparent hover:border-indigo-200 hover:shadow-sm">
                      <Avatar
                        src={session.user?.image || undefined}
                        fallback={session.user?.name?.charAt(0).toUpperCase() || "?"}
                        size="2"
                        radius="full"
                        color="indigo"
                      />
                      
                      <Flex direction="column" align="start" className="hidden sm:flex">
                        <Text size="2" weight="bold" className="text-slate-900 leading-none mb-1 max-w-[120px] truncate">
                          {session.user?.name}
                        </Text>
                        <Flex align="center" gap="1">
                          <Box className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                          <Text size="1" weight="medium" className={`${textColor} leading-none tracking-wide`} uppercase>
                            {roleLabel}
                          </Text>
                        </Flex>
                      </Flex>
                      
                      <AiOutlineDown className="text-slate-500 text-xs ml-1 hidden sm:block" />
                    </button>
                  </DropdownMenu.Trigger>
                  
                  <DropdownMenu.Content size="2" align="end" className="min-w-[180px]">
                    <DropdownMenu.Item className="cursor-pointer" onClick={() => router.push("/profile")}>
                      Мой профиль
                    </DropdownMenu.Item>
                    
                    <DropdownMenu.Item className="cursor-pointer" onClick={() => router.push("/settings")}>
                      Настройки системы
                    </DropdownMenu.Item>
                    
                    <DropdownMenu.Separator />
                    
                    <DropdownMenu.Item color="red" className="cursor-pointer" onClick={() => signOut({ callbackUrl: "/" })}>
                      Выйти
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </>
            )}
            
            {status === "unauthenticated" && (
              <Button asChild variant="soft" color="indigo">
                <Link href="/api/auth/signin">Войти</Link>
              </Button>
            )}
          </Flex>
          
        </Flex>
      </Container>
    </header>
  );
};

export default NavBar;