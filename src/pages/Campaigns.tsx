import { useState } from "react";
import { Plus, Play, Pause, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const mockCampaigns = [
  {
    id: "CP001",
    text: "Exclusive Spa Weekend Offer",
    targetCategory: "VIP",
    startDateTime: "2025-01-15 09:00",
    endDateTime: "2025-01-20 18:00",
    targetCount: 45,
    messageCount: 135,
    status: "Active",
  },
  {
    id: "CP002",
    text: "Business Package Promotion",
    targetCategory: "Business",
    startDateTime: "2025-01-10 08:00",
    endDateTime: "2025-01-25 20:00",
    targetCount: 120,
    messageCount: 240,
    status: "Active",
  },
  {
    id: "CP003",
    text: "Summer Early Bird Special",
    targetCategory: "Regular",
    startDateTime: "2025-02-01 00:00",
    endDateTime: "2025-02-28 23:59",
    targetCount: 200,
    messageCount: 0,
    status: "Scheduled",
  },
];

export default function Campaigns() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Scheduled":
        return "secondary";
      case "Paused":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campaigns</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your marketing campaigns
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Set up a new marketing campaign for your targeted clients
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-text">Campaign Text</Label>
                <Textarea
                  id="campaign-text"
                  placeholder="Enter your campaign message..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target-category">Target Category</Label>
                  <Select>
                    <SelectTrigger id="target-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target-count">Target Count</Label>
                  <Input id="target-count" type="number" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date & Time</Label>
                  <Input id="start-date" type="datetime-local" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date & Time</Label>
                  <Input id="end-date" type="datetime-local" />
                </div>
              </div>
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold">Message Templates</h3>
                {[1, 2, 3].map((num) => (
                  <div key={num} className="space-y-2 p-4 bg-muted/50 rounded-lg">
                    <Label>Message #{num}</Label>
                    <Textarea
                      placeholder={`Template for message ${num}...`}
                      rows={2}
                    />
                    <Input type="datetime-local" placeholder="Send timing" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-primary">Create Campaign</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Active & Scheduled Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign ID</TableHead>
                  <TableHead>Campaign Text</TableHead>
                  <TableHead>Target Category</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Target Count</TableHead>
                  <TableHead>Messages Sent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.id}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {campaign.text}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{campaign.targetCategory}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{campaign.startDateTime}</TableCell>
                    <TableCell className="text-sm">{campaign.endDateTime}</TableCell>
                    <TableCell>{campaign.targetCount}</TableCell>
                    <TableCell>
                      <span className="font-semibold">{campaign.messageCount}</span>
                      <span className="text-muted-foreground">
                        {" "}
                        / {campaign.targetCount * 3}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          {campaign.status === "Active" ? (
                            <Pause className="h-3 w-3" />
                          ) : (
                            <Play className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
