import {
  LayoutDashboard,
  Package,
  Store,
  ShoppingCart,
  CreditCard,
  Tag,
  Wrench,
  BarChart3,
  Users,
  MessageSquare,
  Car,
  FolderTree,
  Warehouse,
  Truck,
  Receipt,
  Image,
  TrendingUp,
  Wallet,
  MapPin,
} from 'lucide-react'

export type UserRole = 'admin' | 'manager' | 'accountant' | 'logistics'

export interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  badge?: number
}

const allNavItems: NavItem[] = [
  { name: 'Command Center', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Categories', href: '/dashboard/categories', icon: FolderTree },
  { name: 'Parts Catalog', href: '/dashboard/parts', icon: Package },
  { name: 'Vehicle Registry', href: '/dashboard/cars', icon: Car },
  { name: 'Shops & Suppliers', href: '/dashboard/shops', icon: Store },
  { name: 'Marketplace', href: '/dashboard/marketplace', icon: Car },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
  { name: 'Partenaires Livraisons', href: '/dashboard/delivery', icon: Truck },
  { name: 'Garages', href: '/dashboard/garages', icon: Warehouse },
  { name: 'Sales & Revenue', href: '/dashboard/sales', icon: Receipt },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  { name: 'Withdrawals', href: '/dashboard/withdrawals', icon: Wallet },
  { name: 'Promotions', href: '/dashboard/promotions', icon: Tag },
  { name: 'Mechanics', href: '/dashboard/mechanics', icon: Wrench },
  { name: 'Most Sold', href: '/dashboard/most-sold', icon: TrendingUp },
  { name: 'Images & Banners', href: '/dashboard/banners', icon: Image },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Users', href: '/dashboard/users', icon: Users },
  { name: 'Chat', href: '/dashboard/chat', icon: MessageSquare },
]

const navByHref: Record<string, NavItem> = Object.fromEntries(
  allNavItems.map((item) => [item.href, item])
)

export function getNavigationForRole(role: UserRole): NavItem[] {
  const base = [navByHref['/dashboard']]
  switch (role) {
    case 'admin':
      return allNavItems
    case 'manager':
      return [
        base[0],
        navByHref['/dashboard/categories'],
        navByHref['/dashboard/parts'],
        navByHref['/dashboard/cars'],
        navByHref['/dashboard/shops'],
        navByHref['/dashboard/marketplace'],
        navByHref['/dashboard/orders'],
        navByHref['/dashboard/delivery'],
        navByHref['/dashboard/garages'],
        navByHref['/dashboard/sales'],
        navByHref['/dashboard/promotions'],
        navByHref['/dashboard/mechanics'],
        navByHref['/dashboard/most-sold'],
        navByHref['/dashboard/banners'],
        navByHref['/dashboard/analytics'],
        navByHref['/dashboard/users'],
        navByHref['/dashboard/chat'],
      ].filter(Boolean)
    case 'accountant':
      return [
        base[0],
        navByHref['/dashboard/orders'],
        navByHref['/dashboard/sales'],
        navByHref['/dashboard/payments'],
        navByHref['/dashboard/withdrawals'],
        navByHref['/dashboard/analytics'],
      ].filter(Boolean)
    case 'logistics':
      return [
        base[0],
        navByHref['/dashboard/orders'],
        navByHref['/dashboard/delivery'],
        navByHref['/dashboard/parts'],
        navByHref['/dashboard/shops'],
        navByHref['/dashboard/mechanics'],
      ].filter(Boolean)
    default:
      return allNavItems
  }
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrator',
  manager: 'Manager',
  accountant: 'Accountant',
  logistics: 'Logistics',
}
