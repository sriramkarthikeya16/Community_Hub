// ==========================================
// CommunityHub Master TypeScript Definitions
// Corresponds strictly to Document 05 Schema
// ==========================================

export type UserRole = 'ADMIN' | 'OWNER' | 'TENANT' | 'WORKER';

export type WorkerCategory =
  | 'Security'
  | 'Plumber'
  | 'Electrician'
  | 'Cleaner'
  | 'Maid'
  | 'Chef'
  | 'Laundry'
  | 'Maintenance'
  | 'Water service'
  | 'Carpenter'
  | 'AC technician'
  | 'Appliance repair'
  | 'Pest control'
  | 'Other';

export type WorkerAvailability = 'AVAILABLE' | 'BUSY' | 'ON_LEAVE';

export type OccupancyStatus = 'OCCUPIED' | 'VACANT';

export type BillType =
  | 'RENT'
  | 'ELECTRICITY'
  | 'GAS'
  | 'WATER'
  | 'INTERNET'
  | 'MAINTENANCE'
  | 'COMMON_WATER'
  | 'COMMON_ELECTRICITY'
  | 'SECURITY'
  | 'CLEANING'
  | 'OTHER';

export type BillStatus = 'PENDING' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export type AllocationMethod = 'EQUAL' | 'AREA_BASED' | 'CUSTOM';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export type ComplaintCategory =
  | 'Plumbing'
  | 'Electrical'
  | 'Cleaning'
  | 'Security'
  | 'Water'
  | 'Lift'
  | 'Common Area'
  | 'Noise'
  | 'Other';

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
export type Priority = PriorityLevel;

export type ComplaintStatus =
  | 'Submitted'
  | 'Acknowledged'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Closed'
  | 'Rejected';

export type AnnouncementCategory =
  | 'General'
  | 'Maintenance'
  | 'Emergency'
  | 'Event'
  | 'Payment'
  | 'Security'
  | 'Important';

export type NotificationType =
  | 'BILL'
  | 'PAYMENT'
  | 'ANNOUNCEMENT'
  | 'COMPLAINT'
  | 'TASK'
  | 'SYSTEM';

// 5.2 users
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // helper fields for context
  flat_id?: string;
  worker_id?: string;
}

// 5.3 communities
export interface Community {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  created_at: string;
  updated_at: string;
}

// 5.4 buildings
export interface Building {
  id: string;
  community_id: string;
  name: string;
  description?: string;
  total_floors: number;
  created_at: string;
  updated_at: string;
}

// 5.5 flats
export interface Flat {
  id: string;
  building_id: string;
  flat_number: string;
  floor_number: number;
  flat_type: string; // '1BHK' | '2BHK' | '3BHK' | '4BHK' | 'Penthouse'
  area_sqft: number;
  rent_amount: number;
  maintenance_amount: number;
  occupancy_status: OccupancyStatus;
  created_at: string;
  updated_at: string;
}

// 5.6 flat_owners
export interface FlatOwner {
  id: string;
  flat_id: string;
  owner_id: string;
  ownership_start: string;
  ownership_end?: string | null;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

// 5.7 flat_tenants
export interface FlatTenant {
  id: string;
  flat_id: string;
  tenant_id: string;
  move_in_date: string;
  move_out_date?: string | null;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

// 5.8 workers
export interface Worker {
  id: string;
  user_id: string;
  worker_type: WorkerCategory;
  phone: string;
  availability: WorkerAvailability;
  description?: string;
  is_active: boolean;
  rating: number;
  completed_tasks_count: number;
  created_at: string;
  updated_at: string;
}

// 5.9 bills
export interface Bill {
  id: string;
  community_id: string;
  flat_id?: string | null; // null if master common bill before allocation
  bill_type: BillType;
  title: string;
  description: string;
  billing_period_start: string;
  billing_period_end: string;
  amount: number;
  due_date: string;
  status: BillStatus;
  created_by: string; // user id
  created_at: string;
  updated_at: string;
  // If this bill originated from a common bill allocation:
  common_bill_parent_id?: string | null;
}

// 5.10 common_bill_allocations
export interface CommonBillAllocation {
  id: string;
  bill_id: string;
  flat_id: string;
  allocation_method: AllocationMethod;
  allocation_value: number; // e.g. sqft percentage or equal share
  amount: number;
  created_at: string;
  updated_at: string;
}

// 5.11 payments
export interface Payment {
  id: string;
  bill_id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_provider: string; // 'Razorpay' | 'Stripe' | 'UPI' | 'NetBanking'
  provider_reference?: string;
  transaction_id: string;
  status: PaymentStatus;
  payment_date?: string;
  failure_reason?: string;
  receipt_url?: string;
  payment_method_title?: string;
  created_at: string;
  updated_at: string;
}

// 5.12 complaints
export interface Complaint {
  id: string;
  user_id: string;
  flat_id: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  priority: PriorityLevel;
  status: ComplaintStatus;
  assigned_worker_id?: string | null;
  resolution_notes?: string | null;
  created_at: string;
  updated_at: string;
  resolved_at?: string | null;
}

// 5.13 complaint_updates
export interface ComplaintUpdate {
  id: string;
  complaint_id: string;
  updated_by: string; // user id
  old_status?: ComplaintStatus | null;
  new_status: ComplaintStatus;
  comment?: string;
  created_at: string;
}

// 5.14 announcements
export interface Announcement {
  id: string;
  community_id: string;
  title: string;
  description: string;
  category: AnnouncementCategory;
  priority: PriorityLevel;
  target_role?: 'ALL' | UserRole;
  published_at: string;
  expires_at?: string | null;
  created_by: string; // user id
  author_name?: string;
  created_at: string;
  updated_at: string;
}

// 5.15 services
export interface ServiceProvider {
  id: string;
  community_id?: string | null;
  name: string;
  category: WorkerCategory;
  provider_name: string;
  description: string;
  phone: string;
  address: string;
  city: string;
  operating_hours?: string;
  rating: number;
  is_approved: boolean;
  is_verified?: boolean;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export type NearbyService = ServiceProvider;
export type ServiceCategory = WorkerCategory;

// 5.16 notifications
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  reference_id?: string;
  is_read: boolean;
  created_at: string;
}

// 5.17 audit_logs
export interface AuditLog {
  id: string;
  user_id: string;
  user_name?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_values?: Record<string, any> | null;
  new_values?: Record<string, any> | null;
  created_at: string;
}

// Enriched types for UI views
export interface EnrichedFlat extends Flat {
  building_name: string;
  owner?: User | null;
  tenant?: User | null;
  owner_id?: string | null;
  tenant_id?: string | null;
  pending_bills_count?: number;
  total_due_amount?: number;
}

export interface EnrichedBill extends Bill {
  flat_number?: string;
  building_name?: string;
  recipient_name?: string;
}

export interface EnrichedComplaint extends Complaint {
  flat_number?: string;
  building_name?: string;
  creator_name?: string;
  worker_name?: string;
  worker_type?: string;
  worker_phone?: string;
  updates?: ComplaintUpdate[];
}
