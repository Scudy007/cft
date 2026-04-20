"use client";

import Link from "next/link";
import { AiFillBug, AiOutlineDown } from "react-icons/ai";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Avatar, Button, DropdownMenu, Flex, Text, Box, Container } from "@radix-ui/themes";

const NavBar = () => {
  const { data: session, status } = useSession();
  const currentPage = usePathname();

  const links = [
    { label: "Дашборд", href: "/" },
    { label: "Результаты аудитов", href: "/issues" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <Container size="4">
        <Flex justify="between" align="center" className="h-16 px-4 md:px-6">
          
          <Flex align="center" gap="3">
            <Link href="/" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors">
              <Box className="bg-indigo-100 p-1.5 rounded-lg">
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
                  "text-sm font-medium transition-colors hover:text-indigo-600",
                  {
                    "text-indigo-600": item.href === currentPage,
                    "text-slate-500": item.href !== currentPage,
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
                  <DropdownMenu.Trigger>
                    <button className="flex items-center gap-2 hover:bg-slate-100 p-1 pr-2 rounded-full transition-colors outline-none cursor-pointer">
                      <Avatar
                        src={session.user?.image || undefined}
                        fallback={session.user?.name?.charAt(0).toUpperCase() || "?"}
                        size="2"
                        radius="full"
                        color="indigo"
                      />
                      <AiOutlineDown className="text-slate-400 text-xs" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content size="2" align="end" className="min-w-[200px]">
                    <Box className="px-3 py-2 border-b border-slate-100 mb-1 bg-slate-50 rounded-t-md">
                      <Text size="2" weight="bold" className="block truncate text-slate-900">
                        {session.user?.name}
                      </Text>
                      <Text size="1" color="gray" className="block truncate">
                        {(session.user as any)?.role}
                      </Text>
                    </Box>
                    <DropdownMenu.Item className="cursor-pointer">Мой профиль</DropdownMenu.Item>
                    <DropdownMenu.Item className="cursor-pointer">Настройки системы</DropdownMenu.Item>
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