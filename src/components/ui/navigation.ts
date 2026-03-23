export type NavItem = {
  disabled?: boolean;
  href: string;
  icon: string;
  label: string;
};

export const sidebarItems: NavItem[] = [
  {
    href: "/",
    icon: "book_2",
    label: "내 일기",
  },
  {
    disabled: true,
    href: "/calendar",
    icon: "calendar_today",
    label: "달력",
  },
  {
    disabled: true,
    href: "/settings",
    icon: "settings",
    label: "설정",
  },
];

export const bottomNavItems: NavItem[] = [
  {
    href: "/entries/new",
    icon: "edit_note",
    label: "새 일기",
  },
  {
    href: "/",
    icon: "grid_view",
    label: "내 일기",
  },
  {
    disabled: true,
    href: "/settings",
    icon: "tune",
    label: "설정",
  },
];

export function isHomeRoute(pathname: string) {
  return pathname === "/";
}

export function isComposeRoute(pathname: string) {
  return pathname.startsWith("/entries/new");
}

export function isNavItemActive(item: NavItem, pathname: string) {
  if (item.href === "/") {
    return isHomeRoute(pathname);
  }

  if (item.href === "/entries/new") {
    return isComposeRoute(pathname);
  }

  return false;
}
