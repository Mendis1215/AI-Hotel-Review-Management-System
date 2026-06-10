import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';

const AdminCustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');

  const loadCustomers = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/auth/users');
      setCustomers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load customers');
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const deleteCustomer = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/users/${id}`);
      setCustomers(customers.filter((customer) => customer._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete customer');
    }
  };

  return (
    <div className="bg-secondary min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-text-main">Customer Management</h1>
            <p className="mt-2 text-text-muted">Search customer records and manage account actions.</p>
          </div>
          <button className="btn-gold inline-flex items-center justify-center gap-2"><Plus size={18} /> Add Customer</button>
        </div>
        {error && <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-md text-sm">{error}</div>}
        <div className="luxury-card mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 text-text-muted" size={18} />
            <input placeholder="Search customers" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
        </div>
        <div className="luxury-card overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-secondary text-left text-text-muted">
              <tr>
                {['Name', 'Email', 'Phone', 'Role', 'Status', 'Actions'].map((heading) => (
                  <th key={heading} className="px-4 py-3">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.length === 0 && <tr><td colSpan="6" className="px-4 py-6 text-center text-text-muted">No customers found.</td></tr>}
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td className="px-4 py-4 font-medium">{customer.name}</td>
                  <td className="px-4 py-4 text-text-muted">{customer.email}</td>
                  <td className="px-4 py-4 text-text-muted">{customer.phone || '-'}</td>
                  <td className="px-4 py-4 text-text-muted">{customer.role}</td>
                  <td className="px-4 py-4"><span className="rounded-full bg-green-50 px-3 py-1 text-xs text-green-700">Active</span></td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button className="text-accent-dark hover:text-accent" title="Edit"><Edit size={19} /></button>
                      <button onClick={() => deleteCustomer(customer._id)} className="text-red-600 hover:text-red-800" title="Delete"><Trash2 size={19} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerManagement;
