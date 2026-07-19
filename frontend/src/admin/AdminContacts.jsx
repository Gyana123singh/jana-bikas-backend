import React, { useEffect, useState } from 'react';
import { Mail, CheckCircle2, RefreshCw, Trash2, Check, X, Calendar, User, Phone, Info, Eye } from 'lucide-react';
import { contactApi } from '../api';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [filterRead, setFilterRead] = useState('unread');
  const [selectedContact, setSelectedContact] = useState(null);

  const fetchContacts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await contactApi.getContactsAdmin();
      setContacts(data || []);
    } catch (err) {
      setError('Failed to fetch contact inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleMarkRead = async (id) => {
    setMessage('');
    try {
      await contactApi.updateContactAdmin(id);
      setMessage('Message successfully marked as read / resolved.');
      setSelectedContact(null);
      fetchContacts();
    } catch (err) {
      setError('Failed to update message status.');
    }
  };

  const handleDelete = async (id) => {
    setMessage('');
    if (!window.confirm('Are you sure you want to permanently delete this contact inquiry?')) {
      return;
    }
    try {
      await contactApi.deleteContactAdmin(id);
      setMessage('Message deleted successfully.');
      setSelectedContact(null);
      fetchContacts();
    } catch (err) {
      setError('Failed to delete message.');
    }
  };

  const filteredList = contacts.filter(c => {
    if (filterRead === 'unread') return !c.isRead;
    if (filterRead === 'read') return c.isRead;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Inquiry desk</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Manage Contact Messages</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">
              Review and audit inquiries, check user messages, and mark items resolved or remove junk records.
            </p>
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4 text-left">
        <div className="flex flex-wrap items-center gap-4">
          <label className="block text-xs text-slate-450 uppercase font-bold tracking-wider">
            <span className="mb-1.5 block">Filter Status</span>
            <select 
              value={filterRead} 
              onChange={(e) => setFilterRead(e.target.value)}
              className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-slate-200 text-xs outline-none focus:border-emerald-400"
            >
              <option value="unread">Unread / Active</option>
              <option value="read">Read / Resolved</option>
              <option value="">All Messages</option>
            </select>
          </label>
        </div>

        <div className="flex items-center gap-2 self-end">
          <span className="text-xs text-slate-400 font-medium">Total listed: <strong>{filteredList.length}</strong> messages</span>
          <button 
            onClick={fetchContacts}
            className="text-slate-400 hover:text-white p-2 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {message && <p className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300 text-left">{message}</p>}
      {error && <p className="rounded-2xl border border-rose-450/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-350 text-left">{error}</p>}

      {/* Messages Grid */}
      <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl text-left">
        {loading ? (
          <div className="py-12 text-center text-slate-500 font-semibold flex items-center justify-center gap-2">
            <RefreshCw className="animate-spin text-emerald-400" />
            <span>Auditing message logs...</span>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-16 text-center text-slate-500 font-medium">
            No contact inquiries match this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-slate-355 text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-white/5 uppercase text-[9px] tracking-wider font-bold">
                  <th className="pb-3 pt-1">User Details</th>
                  <th className="pb-3 pt-1">Subject</th>
                  <th className="pb-3 pt-1">Message Preview</th>
                  <th className="pb-3 pt-1">Received Date</th>
                  <th className="pb-3 pt-1">Status</th>
                  <th className="pb-3 pt-1 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredList.map((c) => (
                  <tr key={c._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <span className="font-bold text-white block">{c.fullName}</span>
                      <span className="text-[10px] text-slate-500 block font-mono">{c.mobile || 'No Mobile'}</span>
                    </td>
                    <td className="py-4 font-semibold text-slate-300 truncate max-w-[150px]" title={c.subject}>
                      {c.subject || 'Inquiry'}
                    </td>
                    <td className="py-4 text-slate-400 truncate max-w-[250px]" title={c.message}>
                      {c.message}
                    </td>
                    <td className="py-4 text-slate-400">{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="py-4">
                      <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${c.isRead ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                        {c.isRead ? 'Resolved' : 'Active'}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button 
                          onClick={() => { setSelectedContact(c); if(!c.isRead) handleMarkRead(c._id); }}
                          className="text-slate-400 hover:text-white p-1.5 rounded bg-white/5 border border-white/5"
                          title="Open Message"
                        >
                          <Eye size={14} />
                        </button>
                        {!c.isRead && (
                          <button 
                            onClick={() => handleMarkRead(c._id)}
                            className="text-emerald-400 hover:text-emerald-300 p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20"
                            title="Mark Resolved"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(c._id)}
                          className="text-rose-450 hover:text-rose-350 p-1.5 rounded bg-rose-500/10 border border-rose-500/20"
                          title="Delete Message"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* INSPECTOR MODAL */}
      {selectedContact && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-[30px] border border-white/10 bg-slate-900 p-6 md:p-8 shadow-2xl text-left space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Mail className="text-emerald-300" />
                <span>Message: {selectedContact.fullName}</span>
              </h3>
              <button onClick={() => setSelectedContact(null)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Profile details */}
            <div className="space-y-4 text-xs text-slate-350">
              
              {/* User details */}
              <div className="bg-white/5 p-4 rounded-2xl space-y-2">
                <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider border-b border-white/5 pb-1">Sender info</span>
                <div className="space-y-1 text-slate-300">
                  <span className="font-bold text-white block text-sm">{selectedContact.fullName}</span>
                  <span className="block"><a href={`mailto:${selectedContact.email}`} className="text-primary-400 hover:underline">{selectedContact.email}</a></span>
                  {selectedContact.mobile && <span className="block font-mono text-slate-400">Mobile: {selectedContact.mobile}</span>}
                  <span className="block text-[10px] text-slate-500 mt-1">Received: {new Date(selectedContact.createdAt).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Message Details */}
              <div className="bg-white/5 p-4 rounded-2xl space-y-2">
                <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Subject: <strong className="text-white">{selectedContact.subject || 'Inquiry'}</strong></span>
                <p className="text-slate-200 leading-relaxed font-sans text-xs bg-slate-950/40 p-3 rounded-xl border border-white/5 whitespace-pre-line">
                  {selectedContact.message}
                </p>
              </div>

            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
              <button 
                onClick={() => setSelectedContact(null)}
                className="rounded-2xl border border-white/10 px-4 py-2.5 font-semibold text-slate-350 hover:text-white text-xs"
              >
                Close View
              </button>
              {!selectedContact.isRead && (
                <button 
                  onClick={() => handleMarkRead(selectedContact._id)}
                  className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-5 py-2.5 font-semibold text-slate-950 hover:scale-[1.01] text-xs transition"
                >
                  <CheckCircle2 size={14} /> Mark as Resolved
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminContacts;
