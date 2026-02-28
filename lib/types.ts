export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'customer' | 'shop_owner' | 'mechanic'
  createdAt: string
  garage?: Garage[]
  addresses?: Address[]
}

export interface Garage {
  id: string
  userId: string
  cars: Car[]
}

export interface Address {
  id: string
  userId: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

export interface Car {
  id: string
  year: number
  make: string
  model: string
  engine: string
  fuelType: string
  motorisation: string
  images?: string[]
  createdAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface SubCategory {
  id: string
  categoryId: string
  name: string
  slug: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface IProductStock {
  quantity: number
  status: 'in_stock' | 'out_of_stock' | 'low_stock'
  lowStockThreshold?: number
}

export interface IBrand {
  id: number
  name: string
  slug: string
  logo?: string
}

export interface IProductType {
  id: number
  name: string
  slug: string
}

export interface IShopCategory {
  id: number
  name: string
  slug: string
  description?: string
  parentId?: number
}

export interface IProductAttribute {
  id?: number
  name: string
  value: string
  type?: 'text' | 'number' | 'boolean' | 'select'
}

export interface IProductOption {
  id?: number
  name: string
  values: string[]
  required?: boolean
}

export interface ICustomFields {
  [key: string]: any
}

export interface Part {
  id: string
  name: string
  excerpt: string
  description: string
  slug: string
  sku?: string
  partNumber: string
  stock: IProductStock
  price: number
  compareAtPrice: number | null
  images?: string[]
  badges?: string[]
  rating?: number
  reviews?: number
  availability?: string
  isFeatured?: boolean
  condition?: 'new' | 'imported' | 'home_used'
  vehicleType?: 'AUTO' | 'MOTO'
  compatibility: 'all' | 'unknown' | 'specific' | number[]
  brand?: IBrand | null
  tags?: string[]
  type: IProductType
  categoryId?: string
  subCategoryId?: string
  categories?: IShopCategory[]
  attributes: IProductAttribute[]
  options: IProductOption[]
  customFields?: ICustomFields
  compatibleCarIds?: string[]
}

export interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}

export interface CustomSpec {
  key: string
  value: string
}

export interface Shop {
  id: string
  ownerId: string
  name: string
  description: string
  location: {
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  images: string[]
  phone: string
  email: string
  type: 'supplier' | 'mechanic'
  createdAt: string
}

export interface ProcessingInfo {
  orderId: string
  pickingAddress: Address
  shippingAddress: Address
  deliveryFees: number
  inChargeOfDelivery: string
  estimatedDeliveryDate: string
  trackingNumber?: string
  notes?: string
}

export interface Delivery {
  id: string
  orderId: string
  commandId: string
  pickingAddress: Address
  shippingAddress: Address
  deliveryFees: number
  inChargeOfDelivery: string
  date: string
  status: 'pending' | 'picking' | 'in_transit' | 'delivered' | 'cancelled'
  trackingNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'accepted' | 'on_going' | 'cancelled' | 'processing' | 'shipped' | 'delivered'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  shippingAddress: Address
  processingInfo?: ProcessingInfo
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  partId: string
  partName: string
  quantity: number
  price: number
  shopId: string
  status?: 'pending' | 'accepted' | 'rejected'
  suppliers?: string[] // Shop IDs that have this part
}

export interface Payment {
  id: string
  orderId: string
  amount: number
  method: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  transactionId: string
  createdAt: string
}

export interface Promotion {
  id: string
  name: string
  description: string
  type: 'parts_bundle' | 'service_bundle' | 'discount'
  parts: string[] // Part IDs
  services?: string[]
  discount?: number
  freeService?: string
  startDate: string
  endDate: string
  isActive: boolean
  createdAt: string
}

export interface SecondHandVehicle {
  id: string
  type: 'car' | 'motorcycle' | 'bus' | 'truck'
  make: string
  model: string
  year: number
  mileage: number
  price: number
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  description: string
  images: string[]
  sellerId: string
  location: {
    city: string
    state: string
    country: string
  }
  status: 'active' | 'sold' | 'pending' | 'expired'
  createdAt: string
}

export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  message: string
  timestamp: string
  read: boolean
}

export interface Analytics {
  topSuppliers: {
    shopId: string
    shopName: string
    totalOrders: number
    totalRevenue: number
  }[]
  topMechanics: {
    shopId: string
    shopName: string
    totalServices: number
    totalRevenue: number
  }[]
  topParts: {
    partId: string
    partName: string
    totalSold: number
    totalRevenue: number
  }[]
}

// Product type (auto | moto)
export type ProductTypeCategory = 'auto' | 'moto'

// Extended Part with product type
export interface PartExtended extends Part {
  productType?: ProductTypeCategory
  compatibleVehicles?: CompatibleVehicle[]
  compatibleWithAllCars?: boolean
  compatibleWithAllMotos?: boolean
}

export interface CompatibleVehicle {
  brand: string
  model: string
  year: number
  fuelType?: string
  motorisation?: string
}

// Used vehicle (car or moto) with brand/model/year
export interface UsedVehicle {
  id: string
  type: 'car' | 'moto'
  brand: string
  model: string
  year: number
  mileage: number
  price: number
  currency: string
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  color?: string
  transmission?: 'manual' | 'automatic' | 'cvt'
  fuelType?: string
  description: string
  images: string[]
  sellerId: string
  location: { address?: string; city: string; state?: string; country: string }
  status: 'active' | 'sold' | 'pending' | 'expired'
  createdAt: string
  updatedAt: string
}

// Garage partner (full details)
export interface GaragePartner {
  id: string
  name: string
  slug: string
  tier: 'normal' | 'vip'
  specialty: string[]
  description: string
  phone: string
  whatsapp: string
  email: string
  address: string
  city: string
  country: string
  latitude: number
  longitude: number
  image: string
  bannerImage: string
  workspaceImages: string[]
  rating: number
  reviewCount: number
  yearsInBusiness: number
  openHours: string
  status: 'active' | 'pending' | 'suspended'
  createdAt: string
  updatedAt: string
}

// Visitor analytics
export interface DailyVisitor {
  date: string
  count: number
  uniqueVisitors: number
}

// Withdrawal request from supplier
export interface WithdrawalRequest {
  id: string
  supplierId: string
  supplierName: string
  amount: number
  currency: string
  method: 'mobile_money' | 'bank_transfer'
  accountDetails: string
  status: 'pending' | 'approved' | 'rejected' | 'paid'
  requestedAt: string
  processedAt?: string
  notes?: string
}

// Payment extended (client or supplier)
export interface PaymentExtended extends Payment {
  source: 'client' | 'supplier'
  description?: string
}

// Most sold product (detailed)
export interface MostSoldProduct {
  partId: string
  partName: string
  productType: ProductTypeCategory
  totalSold: number
  totalRevenue: number
  avgPrice: number
  ordersCount: number
  trend: number // % vs previous period
}

// Website banner / image
export interface WebsiteBanner {
  id: string
  name: string
  type: 'hero' | 'promo' | 'category' | 'sidebar'
  imageUrl: string
  linkUrl?: string
  position: number
  isActive: boolean
  startDate?: string
  endDate?: string
  createdAt: string
}

// Delivery partner (partenaire de livraison)
export interface DeliveryPartner {
  id: string
  name: string
  phone: string
  whatsapp: string
  email?: string
  vehicleType: string
  plateNumber?: string
  status: 'active' | 'inactive' | 'busy'
  currentPosition?: { lat: number; lng: number }
  lastLocationUpdate?: string
}

// Delivery with full details (shipping, destination, driver position)
export interface DeliveryExtended extends Delivery {
  deliveryPartner?: DeliveryPartner
  deliveryPartnerId?: string
  estimatedArrival?: string
  pickupTime?: string
}
