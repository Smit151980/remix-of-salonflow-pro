import type { WhatsAppTemplate, WhatsAppCampaign, CampaignLog, MessageStatus } from "@/services/whatsappService";

const iso = (daysAgo: number) =>
  new Date(Date.now() - daysAgo * 86400000).toISOString();

export const mockTemplates: WhatsAppTemplate[] = [
  { id: "t1", name: "Appointment Reminder", category: "utility", language: "en", body: "Hi {{1}}, this is a reminder for your appointment on {{2}}.", footer: "Harshil's Salon", status: "approved", createdAt: iso(40) },
  { id: "t2", name: "Promotional Offer", category: "marketing", language: "en", header: "✨ 20% OFF", body: "Hi {{1}}, enjoy 20% off all hair services this weekend!", buttons: [{ type: "quick_reply", text: "Book now" }], status: "approved", createdAt: iso(22) },
  { id: "t3", name: "Birthday Wishes", category: "marketing", language: "en", body: "Happy Birthday {{1}}! 🎉 Here's a free blow-dry on us.", status: "approved", createdAt: iso(60) },
  { id: "t4", name: "Membership Renewal", category: "utility", language: "en", body: "Hi {{1}}, your VIP membership expires on {{2}}. Renew now to keep your perks.", buttons: [{ type: "url", text: "Renew", value: "https://salon.app/renew" }], status: "pending", createdAt: iso(5) },
  { id: "t5", name: "Feedback Request", category: "utility", language: "en", body: "Thanks for visiting {{1}}! How was your experience?", buttons: [{ type: "quick_reply", text: "⭐⭐⭐⭐⭐" }, { type: "quick_reply", text: "Needs work" }], status: "rejected", createdAt: iso(12) },
];

export const mockCampaigns: WhatsAppCampaign[] = [
  { id: "c1", name: "Summer Offer", templateId: "t2", audience: "All active clients", scheduledAt: iso(-2), status: "scheduled", sent: 0, delivered: 0, read: 0, failed: 0, createdAt: iso(3) },
  { id: "c2", name: "Festival Discount", templateId: "t2", audience: "VIP + Gold tier", status: "running", sent: 412, delivered: 396, read: 248, failed: 16, createdAt: iso(1) },
  { id: "c3", name: "VIP Clients", templateId: "t3", audience: "VIP tier", status: "completed", sent: 84, delivered: 82, read: 71, failed: 2, createdAt: iso(7) },
  { id: "c4", name: "Inactive Customers", templateId: "t1", audience: "No visit 90+ days", status: "completed", sent: 326, delivered: 309, read: 188, failed: 17, createdAt: iso(14) },
  { id: "c5", name: "Bridal Pre-launch", templateId: "t2", audience: "Bridal segment", status: "draft", sent: 0, delivered: 0, read: 0, failed: 0, createdAt: iso(0) },
];

const firstNames = ["Priya","Ananya","Riya","Sara","Diya","Kabir","Rohan","Karan","Aisha","Meera","Nikhil","Aarav","Isha","Tara","Vikram","Neha","Aditya","Pooja","Rahul","Sneha"];
const lastNames = ["Sharma","Verma","Iyer","Singh","Khan","Mehta","Patel","Reddy","Nair","Kapoor"];
const statuses: MessageStatus[] = ["delivered","read","failed","queued","sent"];

export const mockLogs: CampaignLog[] = Array.from({ length: 100 }, (_, i) => {
  const c = mockCampaigns[i % mockCampaigns.length];
  const fn = firstNames[i % firstNames.length];
  const ln = lastNames[i % lastNames.length];
  return {
    id: `log_${i + 1}`,
    campaignId: c.id,
    campaignName: c.name,
    recipient: `${fn} ${ln} · +91 9${String(800000000 + i * 137).slice(0, 9)}`,
    messageId: `wamid.${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
    status: statuses[(i * 7) % statuses.length],
    createdAt: iso(i / 12),
  };
});

export const mockWhatsAppAnalytics = {
  sent: 4218, delivered: 3984, read: 2641, failed: 234,
  daily: Array.from({ length: 14 }, (_, i) => {
    const sent = 200 + Math.round(Math.sin(i / 2) * 80 + Math.random() * 60);
    const delivered = Math.round(sent * 0.94);
    const read = Math.round(delivered * 0.66);
    const failed = sent - delivered;
    return { d: `D-${14 - i}`, sent, delivered, read, failed };
  }),
};

/* ---------- core CRM mock data ---------- */

export const mockAppointments = Array.from({ length: 18 }, (_, i) => {
  const fn = firstNames[i % firstNames.length];
  const ln = lastNames[(i * 3) % lastNames.length];
  const services = ["Hair Color + Cut","Beard Styling","Bridal Trial","Deep Tissue Massage","Gel Manicure","Keratin Treatment","Highlights","Pedicure","Facial Glow","Hair Spa"];
  const staff = ["Aisha","Rohan","Meera","Karan","Diya"];
  const stat = ["confirmed","pending","completed","no-show","cancelled"] as const;
  const hour = 9 + (i % 10);
  return {
    id: `apt_${i + 1}`,
    time: `${String(hour).padStart(2, "0")}:${i % 2 ? "30" : "00"}`,
    client: `${fn} ${ln}`,
    phone: `+91 9${String(811000000 + i * 1117).slice(0, 9)}`,
    service: services[i % services.length],
    staff: staff[i % staff.length],
    status: stat[i % stat.length],
    amount: 600 + (i % 8) * 850,
    date: new Date(Date.now() + (i - 4) * 86400000).toISOString().slice(0, 10),
  };
});

export const mockClients = Array.from({ length: 24 }, (_, i) => {
  const fn = firstNames[i % firstNames.length];
  const ln = lastNames[(i * 5) % lastNames.length];
  const tiers = ["New","Active","VIP","Inactive"] as const;
  return {
    id: `cli_${i + 1}`,
    name: `${fn} ${ln}`,
    phone: `+91 9${String(800000000 + i * 1531).slice(0, 9)}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@mail.com`,
    tier: tiers[i % tiers.length],
    visits: 1 + (i * 3) % 28,
    spend: 500 + (i * 1450) % 38000,
    lastVisit: iso(i * 2 + 1).slice(0, 10),
    dob: `${1985 + (i % 20)}-${String(1 + (i % 12)).padStart(2, "0")}-${String(1 + (i % 27)).padStart(2, "0")}`,
  };
});

export const mockServices = [
  { id: "s1", name: "Hair Cut & Style", category: "Hair", duration: 45, price: 1200, bookings: 142 },
  { id: "s2", name: "Hair Color (Global)", category: "Hair", duration: 90, price: 3500, bookings: 86 },
  { id: "s3", name: "Highlights", category: "Hair", duration: 120, price: 4800, bookings: 54 },
  { id: "s4", name: "Keratin Treatment", category: "Hair", duration: 180, price: 6800, bookings: 28 },
  { id: "s5", name: "Gel Manicure", category: "Nails", duration: 45, price: 1200, bookings: 118 },
  { id: "s6", name: "Pedicure Deluxe", category: "Nails", duration: 60, price: 1600, bookings: 92 },
  { id: "s7", name: "Bridal Package", category: "Bridal", duration: 240, price: 18500, bookings: 14 },
  { id: "s8", name: "Deep Tissue Massage", category: "Spa", duration: 60, price: 2400, bookings: 67 },
  { id: "s9", name: "Facial Glow", category: "Skin", duration: 60, price: 2200, bookings: 79 },
  { id: "s10", name: "Beard Styling", category: "Hair", duration: 30, price: 600, bookings: 211 },
];

export const mockInventory = [
  { id: "i1", name: "L'Oréal Majirel 5.0", sku: "LOR-MJ-5.0", category: "Color", stock: 3, reorder: 10, price: 480 },
  { id: "i2", name: "OPI Gel Polish – Rose", sku: "OPI-GP-RS", category: "Nails", stock: 5, reorder: 12, price: 720 },
  { id: "i3", name: "Argan Hair Serum 100ml", sku: "ARG-SR-100", category: "Care", stock: 2, reorder: 8, price: 950 },
  { id: "i4", name: "Disposable Towels", sku: "DSP-TWL", category: "Supplies", stock: 18, reorder: 50, price: 8 },
  { id: "i5", name: "Schwarzkopf Bond Enforcer", sku: "SCH-BE", category: "Care", stock: 14, reorder: 6, price: 1850 },
  { id: "i6", name: "Wax Strips (100 pcs)", sku: "WAX-100", category: "Supplies", stock: 22, reorder: 10, price: 320 },
  { id: "i7", name: "Olaplex No.3", sku: "OLA-N3", category: "Care", stock: 9, reorder: 5, price: 2400 },
];

export const mockPayments = Array.from({ length: 16 }, (_, i) => {
  const fn = firstNames[(i * 2) % firstNames.length];
  const ln = lastNames[(i * 7) % lastNames.length];
  const modes = ["UPI","Card","Cash","Wallet"] as const;
  const stat = ["paid","pending","refunded","failed"] as const;
  return {
    id: `pay_${1000 + i}`,
    invoice: `INV-2026-${String(420 + i).padStart(4, "0")}`,
    client: `${fn} ${ln}`,
    amount: 500 + (i * 875) % 12000,
    mode: modes[i % modes.length],
    status: stat[i % stat.length],
    date: iso(i / 2).slice(0, 10),
  };
});
