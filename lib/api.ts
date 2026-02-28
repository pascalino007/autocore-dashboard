const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.aakodessewa.com/:4000/api/v1';

// ── Token Management ─────────────────────────────────────

interface TokenData {
  accessToken: string;
  refreshToken: string;
}

export function getTokens(): TokenData | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('auth_tokens');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function setTokens(tokens: TokenData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_tokens', JSON.stringify(tokens));
}

export function clearTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_tokens');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userRole');
}

// ── HTTP Client ──────────────────────────────────────────

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

async function refreshAccessToken(): Promise<string | null> {
  const tokens = getTokens();
  if (!tokens?.refreshToken) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    });
    if (!res.ok) { clearTokens(); return null; }
    const data = await res.json();
    setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    return data.accessToken;
  } catch {
    clearTokens();
    return null;
  }
}

export async function api<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const tokens = getTokens();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (tokens?.accessToken) headers['Authorization'] = `Bearer ${tokens.accessToken}`;
  if (options.body instanceof FormData) delete headers['Content-Type'];

  let res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401 && tokens?.refreshToken) {
    if (!isRefreshing) {
      isRefreshing = true;
      const newToken = await refreshAccessToken();
      isRefreshing = false;
      if (newToken) {
        refreshQueue.forEach((cb) => cb(newToken));
        refreshQueue = [];
        headers['Authorization'] = `Bearer ${newToken}`;
        res = await fetch(`${API_BASE}${path}`, { ...options, headers });
      } else {
        refreshQueue = [];
        if (typeof window !== 'undefined') window.location.href = '/login';
        throw new Error('Session expired');
      }
    } else {
      const newToken = await new Promise<string>((resolve) => refreshQueue.push(resolve));
      headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `API error ${res.status}`);
  }
  if (res.status === 204) return undefined as any;
  return res.json();
}

// ── Auth ─────────────────────────────────────────────────

export async function login(email: string, password: string) {
  const data = await api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  const user = data.user;
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('userEmail', user.email);
  localStorage.setItem('userRole', mapRole(user.role));
  return user;
}

export async function logout() {
  try { await api('/auth/logout', { method: 'POST' }); } catch { /* ignore */ }
  clearTokens();
}

function mapRole(role: string): string {
  const map: Record<string, string> = {
    ADMIN: 'admin', MANAGER: 'manager', ACCOUNTANT: 'accountant', LOGISTICS: 'logistics',
  };
  return map[role] || 'admin';
}

// ── Analytics ────────────────────────────────────────────

export async function getAdminDashboard() {
  return api('/analytics/admin/dashboard');
}

export async function getRecentOrders(limit = 5) {
  return api(`/analytics/admin/recent-orders?limit=${limit}`);
}

export async function getTopProducts(limit = 5) {
  return api(`/analytics/admin/top-products?limit=${limit}`);
}

export async function getUserStats() {
  return api('/analytics/admin/user-stats');
}

export async function getOrderStats() {
  return api('/analytics/admin/order-stats');
}

// ── Categories ───────────────────────────────────────────

export async function getCategories(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return api(`/categories${qs}`);
}

export async function createCategory(data: any) {
  return api('/categories', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateCategory(id: number, data: any) {
  return api(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function deleteCategory(id: number) {
  return api(`/categories/${id}`, { method: 'DELETE' });
}

export async function createSubCategory(data: any) {
  return api('/categories', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateSubCategory(id: number, data: any) {
  return api(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

// ── Products / Parts ─────────────────────────────────────

export async function getProducts(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return api(`/products${qs}`);
}

export async function getProduct(id: number) {
  return api(`/products/${id}`);
}

export async function createProduct(data: any) {
  return api('/products', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateProduct(id: number, data: any) {
  return api(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function deleteProduct(id: string) {
  return api(`/products/${id}`, { method: 'DELETE' });
}

// ── Brands ───────────────────────────────────────────────

export async function getBrands(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return api(`/brands${qs}`);
}

export async function createBrand(data: any) {
  return api('/brands', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateBrand(id: number, data: any) {
  return api(`/brands/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

// ── Cars ─────────────────────────────────────────────────

export async function getCars(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return api(`/cars${qs}`);
}

export async function getVehiclesByType(vehicleType: string) {
  return api(`/cars/by-type/${encodeURIComponent(vehicleType)}`);
}

export async function getCarYears(vehicleType?: string) {
  const qs = vehicleType ? `?vehicleType=${encodeURIComponent(vehicleType)}` : '';
  return api(`/cars/years${qs}`);
}

export async function getCarMakes(vehicleType?: string) {
  const qs = vehicleType ? `?vehicleType=${encodeURIComponent(vehicleType)}` : '';
  return api(`/cars/makes${qs}`);
}

export async function getCarModels(make: string, vehicleType?: string) {
  const qs = vehicleType ? `?vehicleType=${encodeURIComponent(vehicleType)}` : '';
  return api(`/cars/models/${encodeURIComponent(make)}${qs}`);
}

export async function getCarTrims(make: string, model: string, year: number, vehicleType?: string) {
  const qs = vehicleType ? `?vehicleType=${encodeURIComponent(vehicleType)}` : '';
  return api(`/cars/trims/${encodeURIComponent(make)}/${encodeURIComponent(model)}/${year}${qs}`);
}

export async function createCar(data: any) {
  return api('/cars', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateCar(id: number, data: any) {
  return api(`/cars/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function deleteCar(id: number) {
  return api(`/cars/${id}`, { method: 'DELETE' });
}

// ── Promotions ──────────────────────────────────────────

export async function getPromotions(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return api(`/promotions${qs}`);
}

export async function createPromotion(data: any) {
  return api('/promotions', { method: 'POST', body: JSON.stringify(data) });
}

export async function updatePromotion(id: number, data: any) {
  return api(`/promotions/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function deletePromotion(id: number) {
  return api(`/promotions/${id}`, { method: 'DELETE' });
}

// ── Shops ────────────────────────────────────────────────

export async function getShops(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return api(`/shops${qs}`);
}

export async function getShop(id: string) {
  return api(`/shops/${id}`);
}

export async function verifyShop(id: string) {
  return api(`/shops/${id}/verify`, { method: 'PATCH' });
}

export async function createShop(data: any) {
  return api('/shops', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateShop(id: string, data: any) {
  return api(`/shops/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function deleteShop(id: string) {
  return api(`/shops/${id}`, { method: 'DELETE' });
}

// ── Orders ───────────────────────────────────────────────

export async function getOrders(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return api(`/orders${qs}`);
}

export async function getOrder(id: string) {
  return api(`/orders/${id}`);
}

export async function updateOrderStatus(id: string, status: string) {
  return api(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
}

export async function cancelOrderItem(orderId: string, itemId: string) {
  return api(`/orders/${orderId}/items/${itemId}/cancel`, { method: 'PATCH' });
}

// ── Payments ─────────────────────────────────────────────

export async function getPayments(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return api(`/payments${qs}`);
}

// ── Wallet / Withdrawals ─────────────────────────────────

export async function getWallets() {
  return api('/wallet/admin/all');
}

export async function processWithdrawal(id: string, status: string) {
  return api(`/wallet/admin/withdrawals/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
}


// ── Marketplace ──────────────────────────────────────────

export async function getMarketplaceListings(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return api(`/marketplace${qs}`);
}

export async function updateListingStatus(id: string, status: string) {
  return api(`/marketplace/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
}

// ── Delivery ─────────────────────────────────────────────

export async function getDeliveryPersonnel(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return api(`/delivery/admin${qs}`);
}

// ── Mechanics / Garages ──────────────────────────────────

export async function getMechanics(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return api(`/mechanics${qs}`);
}

export async function createMechanic(data: any) {
  return api('/mechanics', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateMechanic(id: string, data: any) {
  return api(`/mechanics/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function deleteMechanic(id: string) {
  return api(`/mechanics/${id}`, { method: 'DELETE' });
}

// ── Users ────────────────────────────────────────────────

export async function getUsers(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return api(`/users${qs}`);
}

export async function updateUser(id: string, data: any) {
  return api(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

// ── Slides / Banners ─────────────────────────────────────

export async function getSlides() {
  return api('/slides/admin');
}

export async function createSlide(data: any) {
  return api('/slides', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateSlide(id: string, data: any) {
  return api(`/slides/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function deleteSlide(id: string) {
  return api(`/slides/${id}`, { method: 'DELETE' });
}

// ── Chat ─────────────────────────────────────────────────

export async function getChatRooms() {
  return api('/chat/rooms');
}

export async function getChatMessages(roomId: string) {
  return api(`/chat/rooms/${roomId}/messages`);
}

export async function sendChatMessage(roomId: string, content: string) {
  return api(`/chat/rooms/${roomId}/messages`, { method: 'POST', body: JSON.stringify({ content }) });
}

// ── Notifications ────────────────────────────────────────

export async function getNotifications() {
  return api('/notifications');
}

export async function markNotificationRead(id: string) {
  return api(`/notifications/${id}/read`, { method: 'PATCH' });
}

// ── Upload ───────────────────────────────────────────────

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return api('/upload', { method: 'POST', body: formData });
}

export async function uploadFiles(files: File[]) {
  const formData = new FormData();
  files.forEach((f) => formData.append('files', f));
  return api('/upload/batch', { method: 'POST', body: formData });
}
