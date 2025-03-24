"use client";
import { useRouter } from "next/navigation";

import { MenuBarDropdown } from "./menu-bar-dropdown";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

export const appRoutes = [
  { label: "Início", href: "/" },
  { label: "Pagamentos", href: "/payment" },
  { label: "Cupons", href: "/coupons" },
  { label: "Carrinho de compras", href: "/shopping-cart" },
  { label: "Histórico de pedidos", href: "/order-history" },
];

export const MenuNav = () => {
  const router = useRouter();
  return (
    <main className="container">
      <nav className="flex  justify-between items-center h-20">
        <div className="flex-1">
          <div>
            <header
              className="text-3xl "
              onClick={() => {
                router.push("/");
              }}
            >
              <span
                className="text-3xl hover:bg-muted/60 cursor-pointer"
                onClick={() => {
                  router.push("/");
                }}
              >
                E-commerce
              </span>
            </header>
          </div>
        </div>
        <div className="flex-1  hidden lg:flex justify-end space-x-4">
          {appRoutes.map((route) => (
            <Button
              key={route.href}
              variant="link"
              onClick={() => {
                router.push(route.href);
              }}
            >
              {route.label}
            </Button>
          ))}

          <ModeToggle />
        </div>
        <MenuBarDropdown />
      </nav>
    </main>
  );
};
