import React, { useEffect, useState } from 'react';
import { Heart, CheckCircle2, XCircle, Info, RefreshCw, Trash2, Check, X, Calendar, User, Phone, Mail, Award, MapPin } from 'lucide-react';
import { volunteerApi } from '../api';

const AdminVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  const fetchVolunteers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await volunteerApi.getVolunteersAdmin();
      setVolunteers(data || []);
    } catch (err) {
      setError('Failed to fetch volunteer applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    setMessage('');
    try {
      await volunteerApi.updateVolunteerAdmin(id, status);
      setMessage(`Application status updated to ${status}`);
      setSelectedVolunteer(null);
      fetchVolunteers();
    } catch (err) {
      setError('Failed to update volunteer status.');
    }
  };

  const handleDelete = async (id) => {
    setMessage('');
    if (!window.confirm('Are you sure you want to permanently delete this volunteer application?')) {
      return;
    }
    try {
      await volunteerApi.deleteVolunteerAdmin(id);
      setMessage('Volunteer application deleted successfully.');
      setSelectedVolunteer(null);
      fetchVolunteers();
    } catch (err) {
      setError('Failed to delete application.');
    }
  };

  const filteredList = volunteers.filter(v => {
    if (!filterStatus) return true;
    return v.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Volunteer desk</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Review volunteer applications</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">
              Manage registrations, view skills alignment, and approve or decline participants for field activities.
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
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-slate-200 text-xs outline-none focus:border-emerald-400"
            >
              <option value="pending">Pending review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="">All Applications</option>
            </select>
          </label>
        </div>

        <div className="flex items-center gap-2 self-end">
          <span className="text-xs text-slate-400 font-medium">Total listed: <strong>{filteredList.length}</strong> applicants</span>
          <button 
            onClick={fetchVolunteers}
            className="text-slate-400 hover:text-white p-2 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {message && <p className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300 text-left">{message}</p>}
      {error && <p className="rounded-2xl border border-rose-450/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-350 text-left">{error}</p>}

      {/* Applications Grid */}
      <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl text-left">
        {loading ? (
          <div className="py-12 text-center text-slate-500 font-semibold flex items-center justify-center gap-2">
            <RefreshCw className="animate-spin text-emerald-400" />
            <span>Auditing volunteer records...</span>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-16 text-center text-slate-500 font-medium">
            No volunteer applications match this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-slate-350 text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-white/5 uppercase text-[9px] tracking-wider font-bold">
                  <th className="pb-3 pt-1">Volunteer Info</th>
                  <th className="pb-3 pt-1">Contact details</th>
                  <th className="pb-3 pt-1">Primary Skill / Interest</th>
                  <th className="pb-3 pt-1">Availability</th>
                  <th className="pb-3 pt-1">Applied Date</th>
                  <th className="pb-3 pt-1">Status</th>
                  <th className="pb-3 pt-1 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredList.map((v) => (
                  <tr key={v._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <span className="font-bold text-white block">{v.fullName}</span>
                      <span className="text-[10px] text-slate-500 block">{v.occupation || 'Volunteer'}</span>
                    </td>
                    <td className="py-4 font-medium">
                      <span className="block font-mono text-slate-300">{v.mobile}</span>
                      <span className="block text-[10px] text-slate-500">{v.email}</span>
                    </td>
                    <td className="py-4 font-mono text-[10px] font-semibold text-slate-300 capitalize">{v.skills || 'General'}</td>
                    <td className="py-4 font-medium text-slate-400 capitalize">{v.availability}</td>
                    <td className="py-4 text-slate-400">{new Date(v.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="py-4">
                      <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${v.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : v.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button 
                          onClick={() => setSelectedVolunteer(v)}
                          className="text-slate-400 hover:text-white p-1.5 rounded bg-white/5 border border-white/5"
                          title="Inspect Details"
                        >
                          <Info size={14} />
                        </button>
                        {v.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(v._id, 'approved')}
                              className="text-emerald-400 hover:text-emerald-300 p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20"
                              title="Approve Applicant"
                            >
                              <Check size={14} />
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(v._id, 'rejected')}
                              className="text-rose-450 hover:text-rose-350 p-1.5 rounded bg-rose-500/10 border border-rose-500/20"
                              title="Reject Applicant"
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleDelete(v._id)}
                          className="text-rose-400 hover:text-rose-350 p-1.5 rounded bg-rose-500/10 border border-rose-500/20"
                          title="Delete Application"
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
      {selectedVolunteer && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-[30px] border border-white/10 bg-slate-900 p-6 md:p-8 shadow-2xl text-left space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="text-emerald-300" />
                <span>Reviewing: {selectedVolunteer.fullName}</span>
              </h3>
              <button onClick={() => setSelectedVolunteer(null)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Profile details */}
            <div className="space-y-4 text-xs text-slate-350">
              
              <div className="grid gap-3 grid-cols-2">
                <div className="bg-white/5 p-3 rounded-2xl">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Interest Allocation</span>
                  <span className="text-xs font-bold text-white mt-1 block capitalize">{selectedVolunteer.skills || 'General'}</span>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Weekly Availability</span>
                  <span className="text-xs font-bold text-white mt-1 block capitalize">{selectedVolunteer.availability}</span>
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-white/5 p-4 rounded-2xl space-y-2">
                <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider border-b border-white/5 pb-1">Contact details</span>
                <div className="space-y-1 text-slate-300">
                  <span className="flex items-center gap-1.5"><Mail size={12} /> {selectedVolunteer.email}</span>
                  <span className="flex items-center gap-1.5"><Phone size={12} /> {selectedVolunteer.mobile}</span>
                  {selectedVolunteer.address && (
                    <span className="flex items-start gap-1.5 pt-1 block"><MapPin size={12} className="mt-0.5" /> Address: {selectedVolunteer.address}</span>
                  )}
                </div>
              </div>

              {/* Statement details */}
              <div className="bg-white/5 p-4 rounded-2xl space-y-2">
                <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Cover / Motivation Statement</span>
                <p className="text-slate-300 leading-relaxed font-serif italic text-xs">
                  "{selectedVolunteer.reason || 'No statement provided'}"
                </p>
              </div>

            </div>

            {/* Accept / reject keys */}
            <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
              <button 
                onClick={() => setSelectedVolunteer(null)}
                className="rounded-2xl border border-white/10 px-4 py-2.5 font-semibold text-slate-350 hover:text-white text-xs"
              >
                Close View
              </button>
              {selectedVolunteer.status === 'pending' && (
                <>
                  <button 
                    onClick={() => handleUpdateStatus(selectedVolunteer._id, 'rejected')}
                    className="flex items-center gap-1.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 font-semibold text-rose-350 hover:bg-rose-500/20 text-xs transition"
                  >
                    <XCircle size={14} /> Decline Application
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedVolunteer._id, 'approved')}
                    className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-405 px-5 py-2.5 font-semibold text-slate-950 hover:scale-[1.01] text-xs transition"
                  >
                    <CheckCircle2 size={14} /> Approve Volunteer
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminVolunteers;
