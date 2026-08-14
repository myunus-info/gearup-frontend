import Cookies from 'js-cookie';
import {
  ApiResponse,
  Category,
  GearFilterParams,
  GearItem,
  Payment,
  RentalOrder,
  RentalStatus,
  Review,
  Role,
  User,
  UserStatus,
} from './types';
import {
  MOCK_CATEGORIES,
  MOCK_GEARS,
  MOCK_ORDERS,
  MOCK_PAYMENTS,
  MOCK_REVIEWS,
  MOCK_USERS,
} from './mock-data';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'gearup_access_token';
const USER_KEY = 'gearup_user';

// In-browser stateful mock persistence
class MockStore {
  private users: User[] = [...MOCK_USERS];
  private gears: GearItem[] = [...MOCK_GEARS];
  private categories: Category[] = [...MOCK_CATEGORIES];
  private orders: RentalOrder[] = [...MOCK_ORDERS];
  private payments: Payment[] = [...MOCK_PAYMENTS];
  private reviews: Review[] = [...MOCK_REVIEWS];

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const storedGears = localStorage.getItem('gearup_mock_gears');
        if (storedGears) this.gears = JSON.parse(storedGears);

        const storedOrders = localStorage.getItem('gearup_mock_orders');
        if (storedOrders) this.orders = JSON.parse(storedOrders);

        const storedUsers = localStorage.getItem('gearup_mock_users');
        if (storedUsers) this.users = JSON.parse(storedUsers);

        const storedReviews = localStorage.getItem('gearup_mock_reviews');
        if (storedReviews) this.reviews = JSON.parse(storedReviews);
      } catch (e) {
        // fallback to initial
      }
    }
  }

  private save() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('gearup_mock_gears', JSON.stringify(this.gears));
        localStorage.setItem('gearup_mock_orders', JSON.stringify(this.orders));
        localStorage.setItem('gearup_mock_users', JSON.stringify(this.users));
        localStorage.setItem('gearup_mock_reviews', JSON.stringify(this.reviews));
      } catch (e) {}
    }
  }

  getUsers() {
    return this.users;
  }
  getCategories() {
    return this.categories;
  }
  getGears() {
    return this.gears;
  }
  getOrders() {
    return this.orders;
  }
  getPayments() {
    return this.payments;
  }
  getReviews() {
    return this.reviews;
  }

  addUser(user: User) {
    this.users.push(user);
    this.save();
    return user;
  }

  updateUserStatus(id: string, status: UserStatus) {
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.status = status;
      this.save();
    }
    return user;
  }

  addGear(gear: GearItem) {
    this.gears.unshift(gear);
    this.save();
    return gear;
  }

  updateGear(id: string, updates: Partial<GearItem>) {
    const idx = this.gears.findIndex(g => g.id === id);
    if (idx !== -1) {
      this.gears[idx] = {
        ...this.gears[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.save();
      return this.gears[idx];
    }
    return null;
  }

  deleteGear(id: string) {
    this.gears = this.gears.filter(g => g.id !== id);
    this.save();
    return true;
  }

  addOrder(order: RentalOrder) {
    this.orders.unshift(order);
    this.save();
    return order;
  }

  updateOrderStatus(id: string, status: RentalStatus) {
    const order = this.orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      if (status === 'PICKED_UP') order.pickupConfirmedAt = new Date().toISOString();
      if (status === 'RETURNED') order.returnConfirmedAt = new Date().toISOString();
      if (status === 'CANCELLED') order.cancelledAt = new Date().toISOString();
      this.save();
    }
    return order;
  }

  addReview(review: Review) {
    this.reviews.push(review);
    const gear = this.gears.find(g => g.id === review.gearItemId);
    if (gear) {
      if (!gear.reviews) gear.reviews = [];
      gear.reviews.push(review);
      const sum = gear.reviews.reduce((acc, r) => acc + r.rating, 0);
      gear.avgRating = Number((sum / gear.reviews.length).toFixed(1));
    }
    this.save();
    return review;
  }
}

export const mockStore = new MockStore();

// Helper to get token
export function getStoredToken(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || undefined;
}

export function setStoredAuth(token: string, user: User) {
  Cookies.set(TOKEN_KEY, token, { expires: 7 });
  Cookies.set('user_role', user.role, { expires: 7 });
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredAuth() {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove('user_role');
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch (e) {
    return null;
  }
}

// Fetch wrapper with fallback
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackFn?: () => Promise<T> | T,
): Promise<ApiResponse<T>> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    // If backend is unreachable or returned error, execute mock fallback if provided
    if (fallbackFn) {
      const mockResult = await fallbackFn();
      return {
        statusCode: 200,
        success: true,
        message: 'Mock data fallback response',
        data: mockResult,
      };
    }
    throw err;
  }
}

export const api = {
  auth: {
    login: async (payload: { email: string; password: string }) => {
      return request<{
        accessToken: string;
        refreshToken: string;
        user: User;
      }>(
        '/auth/login',
        {
          method: 'POST',
          body: JSON.stringify(payload),
        },
        () => {
          const user = mockStore.getUsers().find(u => u.email.toLowerCase() === payload.email.toLowerCase());
          if (!user) {
            throw new Error('Invalid email or password');
          }
          if (user.status === 'SUSPENDED') {
            throw new Error('Your account has been suspended. Please contact support.');
          }
          const mockToken = `mock-jwt-token-${user.id}-${Date.now()}`;
          setStoredAuth(mockToken, user);
          return {
            accessToken: mockToken,
            refreshToken: `mock-refresh-${user.id}`,
            user,
          };
        },
      );
    },

    register: async (payload: {
      name: string;
      email: string;
      password: string;
      role: Role;
      phone?: string;
      address?: string;
      shopName?: string;
    }) => {
      return request<{ user: User; accessToken: string }>(
        '/auth/register',
        {
          method: 'POST',
          body: JSON.stringify(payload),
        },
        () => {
          const existing = mockStore
            .getUsers()
            .find(u => u.email.toLowerCase() === payload.email.toLowerCase());
          if (existing) {
            throw new Error('User with this email already exists');
          }

          const newUser: User = {
            id: `user-${Date.now()}`,
            name: payload.name,
            email: payload.email,
            role: payload.role,
            phone: payload.phone || null,
            address: payload.address || null,
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            providerProfile:
              payload.role === 'PROVIDER'
                ? {
                    id: `prof-${Date.now()}`,
                    userId: `user-${Date.now()}`,
                    shopName: payload.shopName || `${payload.name}'s Gear Shop`,
                    isVerified: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  }
                : null,
          };

          mockStore.addUser(newUser);
          const mockToken = `mock-jwt-token-${newUser.id}-${Date.now()}`;
          setStoredAuth(mockToken, newUser);
          return { user: newUser, accessToken: mockToken };
        },
      );
    },

    getMe: async () => {
      return request<User>('/auth/me', { method: 'GET' }, () => {
        const stored = getStoredUser();
        if (stored) return stored;
        return MOCK_USERS[0];
      });
    },

    logout: async () => {
      clearStoredAuth();
    },
  },

  categories: {
    getAll: async () => {
      return request<Category[]>('/categories', { method: 'GET' }, () => {
        return mockStore.getCategories();
      });
    },
  },

  gear: {
    getAll: async (filters: GearFilterParams = {}) => {
      const query = new URLSearchParams();
      if (filters.category) query.append('category', filters.category);
      if (filters.brand) query.append('brand', filters.brand);
      if (filters.price) query.append('price', filters.price);
      if (filters.search) query.append('search', filters.search);

      return request<GearItem[]>(`/gears?${query.toString()}`, { method: 'GET' }, () => {
        let list = mockStore.getGears().filter(g => g.isActive);

        if (filters.category && filters.category !== 'all') {
          list = list.filter(
            g =>
              g.categoryId === filters.category ||
              g.category?.name.toLowerCase() === filters.category?.toLowerCase(),
          );
        }

        if (filters.brand && filters.brand !== 'all') {
          list = list.filter(g => g.brand?.toLowerCase() === filters.brand?.toLowerCase());
        }

        if (filters.condition && filters.condition !== 'all') {
          list = list.filter(g => g.condition === filters.condition);
        }

        if (filters.search) {
          const q = filters.search.toLowerCase();
          list = list.filter(
            g =>
              g.name.toLowerCase().includes(q) ||
              g.brand?.toLowerCase().includes(q) ||
              g.description?.toLowerCase().includes(q),
          );
        }

        if (filters.sortBy === 'price_asc') {
          list.sort((a, b) => Number(a.pricePerDay) - Number(b.pricePerDay));
        } else if (filters.sortBy === 'price_desc') {
          list.sort((a, b) => Number(b.pricePerDay) - Number(a.pricePerDay));
        } else if (filters.sortBy === 'name') {
          list.sort((a, b) => a.name.localeCompare(b.name));
        }

        return list;
      });
    },

    getById: async (id: string) => {
      return request<GearItem>(`/gears/${id}`, { method: 'GET' }, () => {
        const gear = mockStore.getGears().find(g => g.id === id);
        if (!gear) throw new Error('Gear item not found');
        return gear;
      });
    },
  },

  orders: {
    create: async (payload: {
      startDate: string;
      endDate: string;
      items: { gearItemId: string; quantity: number }[];
    }) => {
      return request<{ order: RentalOrder; paymentUrl?: string }>(
        '/rentals',
        {
          method: 'POST',
          body: JSON.stringify(payload),
        },
        () => {
          const user = getStoredUser() || MOCK_USERS[0];
          const start = new Date(payload.startDate);
          const end = new Date(payload.endDate);
          const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

          let total = 0;
          const orderItems = payload.items.map((it, i) => {
            const gear = mockStore.getGears().find(g => g.id === it.gearItemId);
            const sub = Number(gear?.pricePerDay || 30) * it.quantity * days;
            total += sub;
            return {
              id: `item-${Date.now()}-${i}`,
              rentalOrderId: `order-${Date.now()}`,
              gearItemId: it.gearItemId,
              quantity: it.quantity,
              pricePerDaySnapshot: gear?.pricePerDay || 30,
              subtotal: sub,
              gearItem: gear,
            };
          });

          const newOrder: RentalOrder = {
            id: `order-${Date.now()}`,
            customerId: user.id,
            status: 'PLACED',
            startDate: payload.startDate,
            endDate: payload.endDate,
            totalAmount: total,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            customer: {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
            },
            items: orderItems,
            payments: [],
          };

          mockStore.addOrder(newOrder);

          return {
            order: newOrder,
            paymentUrl: `/dashboard/customer/orders/${newOrder.id}/pay`,
          };
        },
      );
    },

    getMyOrders: async () => {
      return request<RentalOrder[]>('/rentals', { method: 'GET' }, () => {
        const user = getStoredUser();
        const customerId = user?.id || 'user-customer-1';
        return mockStore.getOrders().filter(o => o.customerId === customerId);
      });
    },

    getById: async (id: string) => {
      return request<RentalOrder>(`/rentals/${id}`, { method: 'GET' }, () => {
        const order = mockStore.getOrders().find(o => o.id === id);
        if (!order) throw new Error('Order not found');
        return order;
      });
    },
  },

  payments: {
    getMyPayments: async () => {
      return request<Payment[]>('/payments', { method: 'GET' }, () => {
        return mockStore.getPayments();
      });
    },

    confirmPayment: async (params: { orderId: string; tranId: string; status: string }) => {
      return request<any>(
        `/payments?orderId=${params.orderId}&tranId=${params.tranId}&status=${params.status}`,
        { method: 'POST' },
        () => {
          const order = mockStore.getOrders().find(o => o.id === params.orderId);
          if (order) {
            mockStore.updateOrderStatus(params.orderId, 'CONFIRMED');
            const newPayment: Payment = {
              id: `pay-${Date.now()}`,
              rentalOrderId: params.orderId,
              transactionId: params.tranId,
              amount: order.totalAmount,
              provider: 'SSLCOMMERZ',
              status: 'PAID',
              method: 'Online Banking / Card',
              paidAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              rentalOrder: order,
            };
            mockStore.getPayments().unshift(newPayment);
          }
          return { success: true, message: 'Payment verified successfully' };
        },
      );
    },
  },

  reviews: {
    create: async (payload: {
      rentalOrderId: string;
      gearItemId: string;
      rating: number;
      comment?: string;
    }) => {
      return request<Review>(
        '/reviews',
        {
          method: 'POST',
          body: JSON.stringify(payload),
        },
        () => {
          const user = getStoredUser() || MOCK_USERS[0];
          const newReview: Review = {
            id: `rev-${Date.now()}`,
            customerId: user.id,
            gearItemId: payload.gearItemId,
            rentalOrderId: payload.rentalOrderId,
            rating: payload.rating,
            comment: payload.comment,
            createdAt: new Date().toISOString(),
            customer: {
              id: user.id,
              name: user.name,
              avatarUrl: user.avatarUrl,
            },
          };
          return mockStore.addReview(newReview);
        },
      );
    },
  },

  provider: {
    getMyGear: async () => {
      return request<GearItem[]>('/provider/gear', { method: 'GET' }, () => {
        const user = getStoredUser();
        const providerId = user?.id || 'user-provider-1';
        return mockStore.getGears().filter(g => g.providerId === providerId);
      });
    },

    addGear: async (payload: {
      categoryId: string;
      name: string;
      description?: string;
      brand?: string;
      pricePerDay: number;
      depositAmount?: number;
      quantityTotal: number;
      condition?: any;
      images?: string[];
    }) => {
      return request<GearItem>(
        '/provider/gear',
        {
          method: 'POST',
          body: JSON.stringify(payload),
        },
        () => {
          const user = getStoredUser() || MOCK_USERS[1];
          const category = mockStore.getCategories().find(c => c.id === payload.categoryId);

          const newGear: GearItem = {
            id: `gear-${Date.now()}`,
            providerId: user.id,
            categoryId: payload.categoryId,
            name: payload.name,
            description: payload.description,
            brand: payload.brand,
            pricePerDay: payload.pricePerDay,
            depositAmount: payload.depositAmount,
            quantityTotal: payload.quantityTotal,
            quantityAvailable: payload.quantityTotal,
            condition: payload.condition || 'GOOD',
            images: payload.images?.length
              ? payload.images
              : [
                  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80',
                ],
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            category,
            provider: {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              providerProfile: user.providerProfile,
            },
          };

          return mockStore.addGear(newGear);
        },
      );
    },

    getGearById: async (id: string) => {
      return request<GearItem>(`/provider/gear/${id}`, { method: 'GET' }, () => {
        const gear = mockStore.getGears().find(g => g.id === id);
        if (!gear) throw new Error('Gear item not found');
        return gear;
      });
    },

    updateGear: async (id: string, payload: Partial<GearItem>) => {
      return request<GearItem>(
        `/provider/gear/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(payload),
        },
        () => {
          const updated = mockStore.updateGear(id, payload);
          if (!updated) throw new Error('Gear item not found');
          return updated;
        },
      );
    },

    deleteGear: async (id: string) => {
      return request<{ success: boolean }>(`/provider/gear/${id}`, { method: 'DELETE' }, () => {
        mockStore.deleteGear(id);
        return { success: true };
      });
    },

    getOrders: async () => {
      return request<RentalOrder[]>('/provider/orders', { method: 'GET' }, () => {
        return mockStore.getOrders();
      });
    },

    updateOrderStatus: async (id: string, status: RentalStatus) => {
      return request<RentalOrder>(
        `/provider/orders/${id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        },
        () => {
          const updated = mockStore.updateOrderStatus(id, status);
          if (!updated) throw new Error('Order not found');
          return updated;
        },
      );
    },
  },

  admin: {
    getUsers: async () => {
      return request<User[]>('/admin/users', { method: 'GET' }, () => {
        return mockStore.getUsers();
      });
    },

    updateUserStatus: async (id: string, status: UserStatus) => {
      return request<User>(
        `/admin/users/${id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        },
        () => {
          const updated = mockStore.updateUserStatus(id, status);
          if (!updated) throw new Error('User not found');
          return updated;
        },
      );
    },

    getAllGear: async () => {
      return request<GearItem[]>('/admin/gear', { method: 'GET' }, () => {
        return mockStore.getGears();
      });
    },

    getAllRentals: async () => {
      return request<RentalOrder[]>('/admin/rentals', { method: 'GET' }, () => {
        return mockStore.getOrders();
      });
    },
  },
};
