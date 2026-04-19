"use client";
import Link from "next/link";
import { AiFillBug } from "react-icons/ai";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react"; 
import { Button, Avatar, Flex } from "@radix-ui/themes";

const NavBar = () => {
  const { data: session, status } = useSession(); 
  const currentPage = usePathname();

  const links = [
    { label: "Дашборд", href: "/" },
    { label: "Уязвимости", href: "/issues" },
  ];

  return (
    <nav className="flex justify-between h-20 px-5 mb-6 border-b items-center bg-white shadow-sm">
      <div className="flex items-center space-x-5">
        <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
          <AiFillBug size={28} />
        </Link>
        <ul className="flex space-x-5">
          {links.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={classNames({
                  "hover:text-blue-600 transition-colors font-medium": true,
                  "text-zinc-500": item.href !== currentPage,
                  "text-zinc-900": item.href === currentPage,
                })}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center">
        {status === "authenticated" && (
          <Flex align="center" gap="5">
            <Button asChild size="2" color="blue">
              <Link href="/issues/new">+ Новая уязвимость</Link>
            </Button>
            
            <Flex align="center" gap="3">
              <Avatar
                src={session.user?.image || undefined}
                fallback={session.user?.name?.charAt(0).toUpperCase() || "?"}
                size="2"
                radius="full"
                color="indigo"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-zinc-900">
                  {session.user?.name}
                </span>
                <span className="text-xs text-zinc-500 font-medium">
                  {(session.user as any).role} 
                </span>
              </div>
              <Button
                variant="soft"
                color="gray"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="ml-2 cursor-pointer"
              >
                Выйти
              </Button>
            </Flex>
          </Flex>
        )}
        
        {status === "unauthenticated" && (
          <Button asChild variant="outline" color="blue">
            <Link href="/api/auth/signin">Войти</Link>
          </Button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;