import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Package, Clock, CheckCircle, XCircle, Search } from 'lucide-react';
import jsPDF from 'jspdf';

import { fetchUserOrders } from '../store/slices/ordersSlice';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Button from '../components/UI/Button';

/* ================= ORDER STATUS BADGE ================= */
const OrderStatus = ({ status }) => {
  const statusConfig = {
    pending: {
      icon: Clock,
      color:
        'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/30',
      text: 'Pending',
    },
    preparing: {
      icon: Package,
      color:
        'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30',
      text: 'Preparing',
    },
    ready: {
      icon: CheckCircle,
      color:
        'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30',
      text: 'Ready',
    },
    completed: {
      icon: CheckCircle,
      color:
        'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30',
      text: 'Completed',
    },
    cancelled: {
      icon: XCircle,
      color:
        'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30',
      text: 'Cancelled',
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}
    >
      <Icon className="w-4 h-4" />
      {config.text}
    </span>
  );
};

/* ================= MAIN PAGE ================= */
const Orders = () => {
  const [email, setEmail] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const dispatch = useDispatch();
  const { items: orders, loading } = useSelector((state) => state.orders);

  /* ---------- SEARCH ---------- */
  const handleSearch = (e) => {
    e.preventDefault();
    if (email.trim()) {
      dispatch(fetchUserOrders(email.trim()));
      setHasSearched(true);
    }
  };

  /* ---------- AUTO REFRESH (ADMIN STATUS CHANGE REFLECT) ---------- */
  useEffect(() => {
    if (hasSearched && email.trim()) {
      const interval = setInterval(() => {
        dispatch(fetchUserOrders(email.trim()));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [hasSearched, email, dispatch]);

  /* ---------- DATE FORMAT ---------- */
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  /* ---------- DOWNLOAD INVOICE ---------- */
  const downloadInvoice = (order) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Order Invoice', 10, 12);

    doc.setFontSize(11);
    doc.text(`Order ID: ${order._id}`, 10, 25);
    doc.text(`Status: ${order.status}`, 10, 33);
    doc.text(`Total Amount: ₹${order.total}`, 10, 41);

    doc.text('Customer Details:', 10, 55);
    doc.text(`Name: ${order.customerInfo.name}`, 10, 63);
    doc.text(`Email: ${order.customerInfo.email}`, 10, 71);
    doc.text(`Phone: ${order.customerInfo.phone}`, 10, 79);

    doc.text('Items:', 10, 95);
    order.items.forEach((item, i) => {
      doc.text(
        `${item.name} - ₹${item.price} × ${item.quantity}`,
        10,
        105 + i * 8
      );
    });

    doc.save(`order-${order._id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Your Orders
        </h1>

        {/* ================= SEARCH ================= */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-8 shadow-sm">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>
            <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
              Search Orders
            </Button>
          </form>
        </div>

        {loading && <LoadingSpinner size="xl" className="h-64" />}

        {!loading && hasSearched && (
          <>
            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                          Order #{order._id.slice(-8)}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <OrderStatus status={order.status} />
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-between items-center">
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        Total: ₹{order.total}
                      </p>
                      <Button
                        size="sm"
                        className="bg-gray-900 hover:bg-gray-800"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                  No orders found
                </h3>
              </div>
            )}
          </>
        )}

        {/* ================= VIEW DETAILS MODAL ================= */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg shadow-xl">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Order #{selectedOrder._id.slice(-8)}
              </h2>

              {/* CUSTOMER DETAILS */}
              <div className="space-y-1 text-gray-700 dark:text-gray-300">
                <p><b>Name:</b> {selectedOrder.customerInfo.name}</p>
                <p><b>Email:</b> {selectedOrder.customerInfo.email}</p>
                <p><b>Phone:</b> {selectedOrder.customerInfo.phone}</p>
                {selectedOrder.deliveryOption === 'delivery' && (
                  <p>
                    <b>Address:</b> {selectedOrder.customerInfo.address},{' '}
                    {selectedOrder.customerInfo.city} –{' '}
                    {selectedOrder.customerInfo.pincode}
                  </p>
                )}
              </div>

              {/* ITEMS */}
              <h4 className="font-semibold mt-4 text-gray-900 dark:text-white">
                Items
              </h4>
              <ul className="list-disc pl-5 mt-2 text-gray-700 dark:text-gray-300">
                {selectedOrder.items.map((item, i) => (
                  <li key={i}>
                    {item.name} – ₹{item.price} × {item.quantity}
                  </li>
                ))}
              </ul>

              <div className="flex justify-between items-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => downloadInvoice(selectedOrder)}
                >
                  Download Invoice
                </Button>
                <Button
                  className="bg-gray-900 hover:bg-gray-800"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
