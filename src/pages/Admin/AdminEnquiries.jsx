import { useEffect, useState } from 'react';
import api from '../../services/api';
import AdminLayout from './AdminLayout';

const statusOptions = ['pending', 'in_progress', 'completed', 'cancelled'];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
};

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    try {
      const res = await api.get('/enquiries/admin');
      setEnquiries(res.data.data);
    } catch (err) {
      console.error('Failed to load enquiries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/enquiries/admin/${id}/status`, { status });
      fetchEnquiries();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">

        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Customer Enquiries
        </h2>

        {loading ? (
          <div className="text-gray-600 dark:text-gray-400">Loading...</div>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">

            <table className="w-full border-collapse">

              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  {['Name', 'Phone', 'Type', 'Message', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {enquiries.map((e) => (
                  <tr key={e._id}
                      className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">

                    <td className="px-4 py-3 text-gray-900 dark:text-white">{e.name}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{e.phone}</td>
                    <td className="px-4 py-3 capitalize text-gray-700 dark:text-gray-300">
                      {e.enquiryType.replace('_', ' ')}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 max-w-xs truncate">
                      {e.message}
                    </td>

                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[e.status]}`}>
                        {e.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <select
                        value={e.status}
                        onChange={(ev) => updateStatus(e._id, ev.target.value)}
                        className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600
                                   bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                                   focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default AdminEnquiries;
