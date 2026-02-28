import {
  DailyVisitor,
  WithdrawalRequest,
  PaymentExtended,
  MostSoldProduct,
  WebsiteBanner,
  DeliveryPartner,
  GaragePartner,
  UsedVehicle,
} from '@/lib/types'

export const dailyVisitors: DailyVisitor[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - (29 - i))
  return {
    date: d.toISOString().split('T')[0],
    count: 800 + Math.floor(Math.random() * 400),
    uniqueVisitors: 500 + Math.floor(Math.random() * 250),
  }
}).reverse()

export const registeredSuppliers = 234
export const registeredMechanics = 89

export const withdrawalRequests: WithdrawalRequest[] = [
  { id: 'wr-1', supplierId: 's1', supplierName: 'AutoParts Pro', amount: 125000, currency: 'XOF', method: 'mobile_money', accountDetails: '+228 90 11 22 33', status: 'pending', requestedAt: new Date().toISOString() },
  { id: 'wr-2', supplierId: 's2', supplierName: 'Parts Warehouse', amount: 85000, currency: 'XOF', method: 'bank_transfer', accountDetails: 'TG0012345678', status: 'approved', requestedAt: new Date(Date.now() - 86400000).toISOString(), processedAt: new Date().toISOString() },
  { id: 'wr-3', supplierId: 's3', supplierName: 'Moto Clinic', amount: 45000, currency: 'XOF', method: 'mobile_money', accountDetails: '+228 91 22 33 44', status: 'rejected', requestedAt: new Date(Date.now() - 172800000).toISOString(), notes: 'Insufficient balance' },
]

export const paymentsExtended: PaymentExtended[] = [
  { id: 'p1', orderId: 'order-1', amount: 45000, method: 'credit_card', status: 'completed', transactionId: 'TXN-001', createdAt: new Date().toISOString(), source: 'client' },
  { id: 'p2', orderId: 'order-2', amount: 125000, method: 'bank_transfer', status: 'completed', transactionId: 'TXN-002', createdAt: new Date().toISOString(), source: 'supplier', description: 'Subscription Premium' },
  { id: 'p3', orderId: 'order-3', amount: 78000, method: 'credit_card', status: 'completed', transactionId: 'TXN-003', createdAt: new Date(Date.now() - 86400000).toISOString(), source: 'client' },
]

export const mostSoldProducts: MostSoldProduct[] = [
  { partId: '1', partName: 'Premium Oil Filter', productType: 'auto', totalSold: 1243, totalRevenue: 37290, avgPrice: 29.99, ordersCount: 892, trend: 12.5 },
  { partId: '2', partName: 'Brake Pads Set', productType: 'auto', totalSold: 876, totalRevenue: 78700, avgPrice: 89.99, ordersCount: 654, trend: 8.2 },
  { partId: '3', partName: 'Moto Chain Kit', productType: 'moto', totalSold: 534, totalRevenue: 26700, avgPrice: 50, ordersCount: 421, trend: 22.1 },
  { partId: '4', partName: 'Air Filter', productType: 'auto', totalSold: 1102, totalRevenue: 22040, avgPrice: 20, ordersCount: 988, trend: -2.3 },
  { partId: '5', partName: 'Spark Plugs Set', productType: 'auto', totalSold: 678, totalRevenue: 20340, avgPrice: 30, ordersCount: 512, trend: 15.7 },
]

export const websiteBanners: WebsiteBanner[] = [
  { id: 'b1', name: 'Homepage Hero', type: 'hero', imageUrl: '/images/banners/hero-1.jpg', linkUrl: '/catalog', position: 1, isActive: true, createdAt: new Date().toISOString() },
  { id: 'b2', name: 'Promo Same Day', type: 'promo', imageUrl: '/images/banners/promo-same-day.jpg', linkUrl: '/promotions/same-day', position: 2, isActive: true, createdAt: new Date().toISOString() },
  { id: 'b3', name: 'Category Engine', type: 'category', imageUrl: '/images/banners/category-engine.jpg', linkUrl: '/catalog/engine', position: 1, isActive: true, createdAt: new Date().toISOString() },
]

export const deliveryPartners: DeliveryPartner[] = [
  { id: 'dp1', name: 'Jean Driver', phone: '+228 90 11 22 33', whatsapp: '+22890112233', vehicleType: 'Van', plateNumber: 'TG-1234-AB', status: 'active', currentPosition: { lat: 6.1725, lng: 1.2314 }, lastLocationUpdate: new Date().toISOString() },
  { id: 'dp2', name: 'Marie Courier', phone: '+228 91 22 33 44', whatsapp: '+22891223344', vehicleType: 'Moto', status: 'busy', lastLocationUpdate: new Date(Date.now() - 300000).toISOString() },
]

export const garagePartners: GaragePartner[] = [
  { id: 'g1', name: 'Garage Express Lome', slug: 'garage-express-lome', tier: 'vip', specialty: ['Mecanique generale', 'Diagnostic'], description: 'Garage de reference', phone: '+228 90 11 22 33', whatsapp: '+22890112233', email: 'contact@garage.tg', address: '25 Blvd Tokoin', city: 'Lome', country: 'Togo', latitude: 6.1725, longitude: 1.2314, image: '', bannerImage: '', workspaceImages: [], rating: 4.8, reviewCount: 124, yearsInBusiness: 12, openHours: 'Lun-Sam: 7h30-18h', status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]

export const brandsCar = ['Toyota', 'Honda', 'Ford', 'Nissan', 'BMW', 'Mercedes', 'Peugeot', 'Renault', 'Hyundai', 'Kia']
export const brandsMoto = ['Honda', 'Yamaha', 'Suzuki', 'Haojue', 'Apsonic', 'Bajaj']

export const modelsByBrand: Record<string, string[]> = {
  Toyota: ['Corolla', 'Camry', 'Land Cruiser', 'Hilux', 'Rav4'],
  Honda: ['Accord', 'Civic', 'CR-V', 'CBR', 'Africa Twin'],
  Ford: ['Focus', 'Fiesta', 'Ranger', 'Mustang'],
  Yamaha: ['YZF', 'MT', 'Nmax', 'Crypton'],
}
