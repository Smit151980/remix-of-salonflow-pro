/**
 * Provider-agnostic WhatsApp service layer.
 * Swap the `provider` impl for Meta Cloud API / 360dialog / WATI / Twilio.
 */

export type TemplateStatus = "approved" | "pending" | "rejected";
export type CampaignStatus = "draft" | "scheduled" | "running" | "completed" | "failed";
export type MessageStatus = "queued" | "sent" | "delivered" | "read" | "failed";

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: "marketing" | "utility" | "authentication";
  language: string;
  header?: string;
  body: string;
  footer?: string;
  buttons?: Array<{ type: "url" | "call" | "quick_reply"; text: string; value?: string }>;
  status: TemplateStatus;
  createdAt: string;
}

export interface WhatsAppCampaign {
  id: string;
  name: string;
  templateId: string;
  audience: string;
  scheduledAt?: string;
  status: CampaignStatus;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  createdAt: string;
}

export interface CampaignLog {
  id: string;
  campaignId: string;
  campaignName: string;
  recipient: string;
  messageId: string;
  status: MessageStatus;
  createdAt: string;
}

export interface WhatsAppProvider {
  createTemplate(input: Omit<WhatsAppTemplate, "id" | "status" | "createdAt">): Promise<WhatsAppTemplate>;
  updateTemplate(id: string, patch: Partial<WhatsAppTemplate>): Promise<WhatsAppTemplate>;
  deleteTemplate(id: string): Promise<void>;
  listTemplates(): Promise<WhatsAppTemplate[]>;

  sendCampaign(id: string): Promise<{ ok: true; queued: number }>;
  scheduleCampaign(id: string, at: string): Promise<{ ok: true }>;
  listCampaigns(): Promise<WhatsAppCampaign[]>;

  listLogs(filters?: { campaignId?: string; status?: MessageStatus; q?: string }): Promise<CampaignLog[]>;
  getAnalytics(): Promise<{
    sent: number; delivered: number; read: number; failed: number;
    daily: Array<{ d: string; sent: number; delivered: number; read: number; failed: number }>;
  }>;
}

/* ---------- mock implementation ---------- */

import {
  mockTemplates, mockCampaigns, mockLogs, mockWhatsAppAnalytics,
} from "@/lib/mock-data";

const mockProvider: WhatsAppProvider = {
  async createTemplate(input) {
    const t: WhatsAppTemplate = {
      ...input, id: crypto.randomUUID(), status: "pending",
      createdAt: new Date().toISOString(),
    };
    mockTemplates.unshift(t);
    return t;
  },
  async updateTemplate(id, patch) {
    const i = mockTemplates.findIndex((t) => t.id === id);
    if (i < 0) throw new Error("template not found");
    mockTemplates[i] = { ...mockTemplates[i], ...patch };
    return mockTemplates[i];
  },
  async deleteTemplate(id) {
    const i = mockTemplates.findIndex((t) => t.id === id);
    if (i >= 0) mockTemplates.splice(i, 1);
  },
  async listTemplates() { return [...mockTemplates]; },

  async sendCampaign(id) {
    const c = mockCampaigns.find((c) => c.id === id);
    if (!c) throw new Error("campaign not found");
    c.status = "running";
    return { ok: true, queued: c.sent };
  },
  async scheduleCampaign(id, at) {
    const c = mockCampaigns.find((c) => c.id === id);
    if (!c) throw new Error("campaign not found");
    c.status = "scheduled"; c.scheduledAt = at;
    return { ok: true };
  },
  async listCampaigns() { return [...mockCampaigns]; },

  async listLogs(filters) {
    let rows = [...mockLogs];
    if (filters?.campaignId) rows = rows.filter((r) => r.campaignId === filters.campaignId);
    if (filters?.status) rows = rows.filter((r) => r.status === filters.status);
    if (filters?.q) {
      const q = filters.q.toLowerCase();
      rows = rows.filter((r) => r.recipient.toLowerCase().includes(q) || r.campaignName.toLowerCase().includes(q));
    }
    return rows;
  },
  async getAnalytics() { return mockWhatsAppAnalytics; },
};

export const whatsappService: WhatsAppProvider = mockProvider;
