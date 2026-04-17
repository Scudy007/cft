"use client";
import Link from "next/link";
import { AiFillBug } from "react-icons/ai";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react"; 

const NavBar = () => {
  const { data: session, status } = useSession(); 
  const currentPage = usePathname();

  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Issues", href: "/issues" },
  ];

  return (
    <nav className="flex justify-between h-20 px-5 mb-12 border-b items-center">
      <div className="flex items-center space-x-5">
        <Link href="/">
          <AiFillBug size={24} />
        </Link>
        <ul className="flex space-x-5">
          {links.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={classNames({
                  "hover:text-zinc-800 transition-colors": true,
                  "text-zinc-500": item.href !== currentPage,
                  "text-zinc-950": item.href === currentPage,
                })}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center space-x-4">
        {status === "authenticated" && (
          <>
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-zinc-900">
                {session.user?.name}
              </span>
              <span className="text-xs text-zinc-500">
                {(session.user as any).role} 
              </span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm bg-zinc-100 hover:bg-zinc-200 px-3 py-1 rounded-md transition-colors"
            >
              Log out
            </button>
          </>
        )}
        {status === "unauthenticated" && (
          <Link href="/api/auth/signin" className="text-sm text-blue-600 hover:underline">
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;