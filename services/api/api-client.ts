import { logout } from '../logout';
import { getAllGear, getAllRentals, getUsers, updateUserStatus } from './admin-api';
import { getMe, login, register } from './auth-api';
import { getAllCategories } from './category-api';
import { getAllGears, getGearById } from './gear-api';
import { createOrder, getMyOrders, getOrderById } from './order-api';
import { confirmPayment, getMyPayments } from './payment-api';
import { addGear, deleteGear, getMyGear, getOrders, updateGear, updateOrderStatus } from './provider-api';
import { createReview } from './review-api';

export const api = {
  auth: {
    login,
    register,
    getMe,
    logout,
  },
  categories: {
    getAllCategories,
  },
  gear: {
    getAllGears,
    getGearById,
  },
  orders: {
    createOrder,
    getMyOrders,
    getOrderById,
  },
  payments: {
    getMyPayments,
    confirmPayment,
  },
  reviews: {
    createReview,
  },
  provider: {
    getMyGear,
    addGear,
    getGearById,
    updateGear,
    deleteGear,
    getOrders,
    updateOrderStatus,
  },
  admin: {
    getUsers,
    updateUserStatus,
    getAllGear,
    getAllRentals,
  },
};
