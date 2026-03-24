export type NavScope = "records" | "compose" | "exact" | "none";

export type NavItem = {
  activeOn: NavScope;
  disabled?: boolean;
  href: string;
  icon: string;
  label: string;
};

const dateRoutePattern = /^\/entries\/\d{4}-\d{2}-\d{2}$/;
const dateEditRoutePattern = /^\/entries\/\d{4}-\d{2}-\d{2}\/edit$/;

export const sidebarItems: NavItem[] = [
  {
    activeOn: "records",
    href: "/",
    icon: "book_2",
    label: "내 일기",
  },
  {
    activeOn: "none",
    disabled: true,
    href: "#",
    icon: "calendar_month",
    label: "달력",
  },
  {
    activeOn: "none",
    disabled: true,
    href: "#",
    icon: "settings",
    label: "설정",
  },
];

export const bottomNavItems: NavItem[] = [
  {
    activeOn: "records",
    href: "/",
    icon: "article",
    label: "기록",
  },
  {
    activeOn: "compose",
    href: "/entries/new",
    icon: "edit",
    label: "쓰기",
  },
];

export function isAuthRoute(pathname: string) {
  return pathname === "/login" || pathname.startsWith("/auth/");
}

export function isDateDetailRoute(pathname: string) {
  return dateRoutePattern.test(pathname);
}

export function isDateEditRoute(pathname: string) {
  return dateEditRoutePattern.test(pathname);
}

export function isRecordsRoute(pathname: string) {
  return pathname === "/" || isDateDetailRoute(pathname);
}

export function isComposeRoute(pathname: string) {
  return pathname === "/entries/new" || isDateEditRoute(pathname);
}

export function isHomeRoute(pathname: string) {
  return pathname === "/";
}

export function isNavItemActive(item: NavItem, pathname: string) {
  switch (item.activeOn) {
    case "records":
      return isRecordsRoute(pathname);
    case "compose":
      return isComposeRoute(pathname);
    case "exact":
      return pathname === item.href;
    case "none":
    default:
      return false;
  }
}
