import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input, Select } from '../ui/Input';
import { storage } from '../../services/storage';
import { useToast } from '../ui/Toast';
import { NearbyService, ServiceCategory } from '../../types';
import { Store, Plus, Phone, Star, CheckCircle, Search, MapPin, Tag } from 'lucide-react';

export const ServicesManagement: React.FC = () => {
  const { success, error } = useToast();
  const [services, setServices] = useState<NearbyService[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Add Service Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('Plumber');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(4.7);
  const [verified, setVerified] = useState(true);

  const refresh = () => {
    setServices(storage.getServices());
  };

  useEffect(() => {
    refresh();
    const unsub = storage.subscribe(refresh);
    return () => unsub();
  }, []);

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());

    const matchesCat = selectedCategory === 'ALL' || s.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      error('Missing details', 'Service name and contact phone are required.');
      return;
    }

    storage.createService({
      community_id: 'comm-101',
      name,
      category,
      provider_name: name,
      phone,
      address,
      city: 'Bangalore',
      description,
      rating: Number(rating),
      is_approved: verified,
      is_verified: verified,
    });

    success('Vendor Listed', `${name} added to community service directory.`);
    setIsAddOpen(false);
    setName('');
    setPhone('');
    setAddress('');
    setDescription('');
  };

  const handleToggleVerified = (service: NearbyService) => {
    storage.updateService(service.id, { is_verified: !service.is_verified });
    success('Verification Updated', `${service.name} verification status changed.`);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Local & Nearby Services Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Curate vetted local businesses: water tankers, plumbers, electricians, maids, and grocery supplies.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddOpen(true)}
        >
          Add Service Vendor
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            placeholder="Search service name, specialty, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
          <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="ALL">All Categories</option>
            <option value="Water service">Water Tankers</option>
            <option value="Plumber">Plumbing</option>
            <option value="Electrician">Electrical</option>
            <option value="Maid">Housekeeping / Maid</option>
            <option value="Chef">Cook / Chef</option>
            <option value="Laundry">Dry Cleaning / Laundry</option>
            <option value="Grocery">Grocery & Mart</option>
            <option value="Pharmacy">Pharmacy</option>
          </Select>
        </div>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((s) => (
          <Card key={s.id} className="p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded">
                  {s.category}
                </span>
                {s.is_verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-slate-900">{s.name}</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                {s.description}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-800">{s.phone}</span>
                </div>
                {s.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{s.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs font-semibold text-slate-800">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{s.rating} / 5.0</span>
              </div>
              <button
                onClick={() => handleToggleVerified(s)}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                {s.is_verified ? 'Revoke Badge' : 'Mark Verified'}
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Vendor Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Local Service Provider"
        subtitle="List trusted community vendors for resident access"
        maxWidth="md"
      >
        <form onSubmit={handleCreateService} className="space-y-3.5 text-left">
          <Input
            label="Service / Business Name"
            required
            placeholder="e.g. Crystal Clean Water Tankers"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Service Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ServiceCategory)}
            >
              <option value="Water service">Water Tankers</option>
              <option value="Plumber">Plumber</option>
              <option value="Electrician">Electrician</option>
              <option value="Maid">Maid / Housekeeper</option>
              <option value="Chef">Chef / Cook</option>
              <option value="Laundry">Laundry & Ironing</option>
              <option value="Grocery">Grocery Store</option>
              <option value="Pharmacy">Pharmacy / Chemist</option>
              <option value="Other">Other Service</option>
            </Select>

            <Input
              label="Contact Phone"
              type="tel"
              required
              placeholder="e.g. +91 99000 88776"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <Input
            label="Street Address / Location"
            placeholder="e.g. Shop #12, Palm Avenue Market"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <Input
            label="Service Highlights / Description"
            placeholder="e.g. 10,000L & 5,000L potable RO-tested water delivered within 45 mins"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="verifyCheck"
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="verifyCheck" className="text-xs text-slate-700 cursor-pointer">
              Mark as society verified vendor (Show green shield badge)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Publish Service
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
