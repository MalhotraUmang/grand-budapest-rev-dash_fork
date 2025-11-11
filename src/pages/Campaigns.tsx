import { useState, useMemo } from "react";
import { Plus, Play, Pause, Edit, RefreshCw } from "lucide-react";
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
import { useGoogleSheets } from "@/hooks/useGoogleSheets";
import { Skeleton } from "@/components/ui/skeleton";

export default function Campaigns() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data, loading, refetch } = useGoogleSheets('Campaigns', 'A2:H');

  const campaigns = useMemo(() => {
    if (!data?.values) return [];
    return data.values.map((row, index) => ({
      id: row[0] || `CP${String(index + 1).padStart(3, '0')}`,
      text: row[1] || '',
      targetCategory: row[2] || '',
      startDateTime: row[3] || '',
      endDateTime: row[4] || '',
      targetCount: parseInt(row[5]) || 0,
      messageCount: parseInt(row[6]) || 0,
      status: row[7] || 'Scheduled',
    }));
  }, [data]);

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Campaigns</h1>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full mb-2" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campaigns</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your marketing campaigns
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync
          </Button>
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
                {campaigns.map((campaign) => (
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
