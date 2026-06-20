import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/dashboard/AppShell";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings · Harshil's Salon Suite" }] }),
  component: () => <AppShell><SettingsPage /></AppShell>,
});

function SettingsPage() {
  const [step, setStep] = useState(1);
  const [provider, setProvider] = useState("meta");
  const [tested, setTested] = useState(false);

  return (
    <>
      <PageHeader title="Settings" subtitle="Business info, staff, notifications, and WhatsApp API." />
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp API</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card><CardHeader><CardTitle>General</CardTitle></CardHeader>
            <CardContent className="space-y-4 max-w-lg">
              <div><Label>App name</Label><Input defaultValue="Harshil's Salon Suite" /></div>
              <div><Label>Timezone</Label><Input defaultValue="Asia/Kolkata" /></div>
              <div><Label>Currency</Label><Input defaultValue="INR (₹)" /></div>
              <Button>Save</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="mt-6">
          <Card><CardHeader><CardTitle>Business information</CardTitle></CardHeader>
            <CardContent className="space-y-4 max-w-lg">
              <div><Label>Legal name</Label><Input defaultValue="Harshil's Salon LLP" /></div>
              <div><Label>GSTIN</Label><Input placeholder="22AAAAA0000A1Z5" /></div>
              <div><Label>Address</Label><Input defaultValue="2nd Floor, MG Road, Bengaluru 560001" /></div>
              <Button>Save</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="mt-6">
          <Card><CardHeader><CardTitle>Staff & permissions</CardTitle></CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">5 active staff members. Roles: owner, manager, stylist, front desk.</div>
              <Button className="mt-3">Manage staff</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card><CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
            <CardContent className="space-y-3 max-w-lg">
              {["New appointment", "Cancellation", "Payment received", "Low inventory", "Campaign completed"].map((n) => (
                <div key={n} className="flex items-center justify-between">
                  <span className="text-sm">{n}</span>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MessageCircle className="size-5 text-emerald-600" />WhatsApp API integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-6">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="flex items-center gap-2">
                    <div className={`size-7 rounded-full flex items-center justify-center text-xs font-medium ${step >= n ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{n}</div>
                    {n < 4 && <div className={`w-12 h-0.5 ${step > n ? "bg-primary" : "bg-muted"}`} />}
                  </div>
                ))}
                <div className="ml-4 text-sm text-muted-foreground">
                  {["Choose provider","Enter credentials","Test connection","Save"][step - 1]}
                </div>
              </div>

              {step === 1 && (
                <div className="max-w-md space-y-3">
                  <Label>Provider</Label>
                  <Select value={provider} onValueChange={setProvider}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meta">Meta Cloud API</SelectItem>
                      <SelectItem value="360dialog">360dialog</SelectItem>
                      <SelectItem value="wati">WATI</SelectItem>
                      <SelectItem value="twilio">Twilio WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setStep(2)}>Continue</Button>
                </div>
              )}

              {step === 2 && (
                <div className="max-w-md space-y-3">
                  <div><Label>API key</Label><Input placeholder="••••••••" type="password" /></div>
                  <div><Label>Access token</Label><Input placeholder="EAAG..." type="password" /></div>
                  <div><Label>Phone number ID</Label><Input placeholder="1234567890" /></div>
                  <div><Label>Webhook URL</Label><Input readOnly defaultValue="https://app.harshilsalon.com/api/public/whatsapp/webhook" /></div>
                  <div className="flex gap-2"><Button variant="outline" onClick={() => setStep(1)}>Back</Button><Button onClick={() => setStep(3)}>Continue</Button></div>
                </div>
              )}

              {step === 3 && (
                <div className="max-w-md space-y-3">
                  <Button onClick={() => setTested(true)}>Run test message</Button>
                  {tested && (
                    <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg p-3">
                      <CheckCircle2 className="size-4" /> Connected. Test message delivered to +91 ••• ••• 4521.
                    </div>
                  )}
                  <div className="flex gap-2"><Button variant="outline" onClick={() => setStep(2)}>Back</Button><Button disabled={!tested} onClick={() => setStep(4)}>Continue</Button></div>
                </div>
              )}

              {step === 4 && (
                <div className="max-w-md space-y-3">
                  <div className="rounded-lg border p-4 text-sm space-y-2">
                    <div className="flex justify-between"><span className="text-muted-foreground">Provider</span><span className="font-medium capitalize">{provider}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge className="bg-emerald-100 text-emerald-700 border-0">Connected</Badge></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Last sync</span><span>Just now</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Webhook</span><Badge className="bg-emerald-100 text-emerald-700 border-0">Active</Badge></div>
                  </div>
                  <Button>Save configuration</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
