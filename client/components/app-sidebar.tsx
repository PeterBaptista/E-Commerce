"use client";

import {
  ChartBarStacked,
  Component,
  ShoppingBasketIcon,
  Tag,
} from "lucide-react";
import * as React from "react";

import { NavHeader } from "@/components/nav-header";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "Produtos",
      url: "/admin/products",
      icon: ShoppingBasketIcon,
      isActive: true,
    },

    {
      title: "Cupons",
      url: "/admin/coupons",
      icon: Tag,
      isActive: true,
    },

    {
      title: "Categorias",
      url: "/admin/categories",
      icon: ChartBarStacked,
    },
    {
      title: "Departamentos",
      url: "/admin/departments",
      icon: Component,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
