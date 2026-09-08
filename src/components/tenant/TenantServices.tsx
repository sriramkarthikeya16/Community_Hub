import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Input, Select } from '../ui/Input';
import { storage } from '../../services/storage';
import { NearbyService } from '../../types';
import { Store, Phone, Star, CheckCircle, Search, MapPin } from 'lucide-react';

export const TenantServices: React.FC = () => {
  const [services, setServices] = useState<NearbyService[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');

  useEffect(() => {
    setServices(storage.getServices());
  }, []);

  const filtered = services.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'ALL' || s.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Community & Nearby Services</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Vetted directory of water tankers, electricians, plumbers, housekeepers, and local shops.
        </p>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            placeholder="Search vendor name, service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
          <Select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)}>
            <option value="ALL">All Categories</option>
            <option value="Water service">Water Tankers</option>
            <option value="Plumber">Plumbing</option>
            <option value="Electrician">Electrical</option>
            <option value="Maid">Housekeeping / Maid</option>
            <option value="Chef">Chef / Cook</option>
            <option value="Laundry">Laundry Service</option>
            <option value="Grocery">Grocery Store</option>
            <option value="Pharmacy">Pharmacy</option>
          </Select>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <Card key={s.id} className="p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded">
                  {s.category}
                </span>
                {s.is_verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle className="w-3 h-3" /> Society Verified
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-slate-900">{s.name}</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{s.description}</p>

              {s.address && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate">{s.address}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs font-semibold text-slate-800">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{s.rating}</span>
              </div>
              <a
                href={`tel:${s.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {s.phone}</span>
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
