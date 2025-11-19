"use client";

import {
  CircleQuestionMarkIcon,
  CogIcon,
  GaugeIcon,
  SearchIcon,
} from "lucide-react";
import Link from "next/link";
import type * as React from "react";
import type { Session } from "@/actions/get-session";
import { Logo } from "@/components/icons";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: NonNullable<Session>["user"];
}

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: GaugeIcon,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: CogIcon,
    },
  ],
  navSecondary: [
    {
      title: "Get Help",
      url: "#",
      icon: CircleQuestionMarkIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const navUser = {
    name: user.name ?? data.user.name,
    email: user.email ?? data.user.email,
    avatar: user.image ?? data.user.avatar,
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5"
            >
              <Link href="/">
                <Logo className="size-5" />
                <span className="text-base font-semibold">Track Optimizer</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={navUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
