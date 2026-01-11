import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Products CRUD
export const fetchAllProducts = createAsyncThunk('admin/fetchAllProducts', async () => {
  const response = await api.get('/admin/products');
  return response.data.data;
});

export const createProduct = createAsyncThunk('admin/createProduct', async (productData) => {
  const response = await api.post('/admin/products', productData);
  return response.data.data;
});

export const updateProduct = createAsyncThunk('admin/updateProduct', async ({ id, data }) => {
  const response = await api.put(`/admin/products/${id}`, data);
  return response.data.data;
});

export const deleteProduct = createAsyncThunk('admin/deleteProduct', async (id) => {
  await api.delete(`/admin/products/${id}`);
  return id;
});

// Orders Management
export const fetchAllOrders = createAsyncThunk('admin/fetchAllOrders', async () => {
  const response = await api.get('/admin/orders');
  return response.data.data;
});

export const updateOrderStatus = createAsyncThunk('admin/updateOrderStatus', async ({ id, status }) => {
  const response = await api.put(`/admin/orders/${id}/status`, { status });
  return response.data.data;
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    products: [],
    orders: [],
    loading: false,
    error: null,
    stats: {
      totalProducts: 0,
      totalOrders: 0,
      pendingOrders: 0,
      totalRevenue: 0,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    calculateStats: (state) => {
      state.stats.totalProducts = state.products.length;
      state.stats.totalOrders = state.orders.length;
      state.stats.pendingOrders = state.orders.filter(order => order.status === 'pending').length;
      state.stats.totalRevenue = state.orders
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + order.total, 0);
    },
  },
  extraReducers: (builder) => {
    builder
      // Products
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload);
      })
      // Orders
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });
  },
});

export const { clearError, calculateStats } = adminSlice.actions;
export default adminSlice.reducer;