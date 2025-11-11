import { useState, useMemo } from "react";
import { Plus, Play, Pause, Edit, RefreshCw } from "lucide-react";
import { Chatbot } from "@/components/Chatbot";
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
  const { data, loading, refetch, appendData } = useGoogleSheets('Campaigns', 'A2:N');
  
  const [formData, setFormData] = useState({
    text: "",
    targetCategory: "",
    startDateTime: "",
    endDateTime: "",
    targetCount: "",
    messageTemplate1: "",
    messageTiming1: "",
    messageTemplate2: "",
    messageTiming2: "",
    messageTemplate3: "",
    messageTiming3: "",
  });

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
      messageTemplate1: row[8] || '',
      messageTiming1: row[9] || '',
      messageTemplate2: row[10] || '',
      messageTiming2: row[11] || '',
      messageTemplate3: row[12] || '',
      messageTiming3: row[13] || '',
    }));
  }, [data]);
  
  const handleCreateCampaign = async () => {
    const newId = `CP${String(campaigns.length + 1).padStart(3, '0')}`;
    const newRow = [
      newId,
      formData.text,
      formData.targetCategory,
      formData.startDateTime,
      formData.endDateTime,
      formData.targetCount,
      "0",
      "Scheduled",
      formData.messageTemplate1,
      formData.messageTiming1,
      formData.messageTemplate2,
      formData.messageTiming2,
      formData.messageTemplate3,
      formData.messageTiming3,
    ];
    
    await appendData([newRow]);
    setIsCreateOpen(false);
    setFormData({
      text: "",
      targetCategory: "",
      startDateTime: "",
      endDateTime: "",
      targetCount: "",
      messageTemplate1: "",
      messageTiming1: "",
      messageTemplate2: "",
      messageTiming2: "",
      messageTemplate3: "",
      messageTiming3: "",
    });
  };

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
                  value={formData.text}
                  onChange={(e) => setFormData({...formData, text: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target-category">Target Category</Label>
                  <Select value={formData.targetCategory} onValueChange={(value) => setFormData({...formData, targetCategory: value})}>
                    <SelectTrigger id="target-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VIP">VIP</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Regular">Regular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target-count">Target Count</Label>
                  <Input 
                    id="target-count" 
                    type="number" 
                    placeholder="0" 
                    value={formData.targetCount}
                    onChange={(e) => setFormData({...formData, targetCount: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date & Time</Label>
                  <Input 
                    id="start-date" 
                    type="datetime-local" 
                    value={formData.startDateTime}
                    onChange={(e) => setFormData({...formData, startDateTime: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date & Time</Label>
                  <Input 
                    id="end-date" 
                    type="datetime-local" 
                    value={formData.endDateTime}
                    onChange={(e) => setFormData({...formData, endDateTime: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold">Message Templates</h3>
                <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                  <Label>Message #1</Label>
                  <Textarea
                    placeholder="Template for message 1..."
                    rows={2}
                    value={formData.messageTemplate1}
                    onChange={(e) => setFormData({...formData, messageTemplate1: e.target.value})}
                  />
                  <Input 
                    type="datetime-local" 
                    placeholder="Send timing" 
                    value={formData.messageTiming1}
                    onChange={(e) => setFormData({...formData, messageTiming1: e.target.value})}
                  />
                </div>
                <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                  <Label>Message #2</Label>
                  <Textarea
                    placeholder="Template for message 2..."
                    rows={2}
                    value={formData.messageTemplate2}
                    onChange={(e) => setFormData({...formData, messageTemplate2: e.target.value})}
                  />
                  <Input 
                    type="datetime-local" 
                    placeholder="Send timing" 
                    value={formData.messageTiming2}
                    onChange={(e) => setFormData({...formData, messageTiming2: e.target.value})}
                  />
                </div>
                <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                  <Label>Message #3</Label>
                  <Textarea
                    placeholder="Template for message 3..."
                    rows={2}
                    value={formData.messageTemplate3}
                    onChange={(e) => setFormData({...formData, messageTemplate3: e.target.value})}
                  />
                  <Input 
                    type="datetime-local" 
                    placeholder="Send timing" 
                    value={formData.messageTiming3}
                    onChange={(e) => setFormData({...formData, messageTiming3: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCampaign} className="bg-primary">Create Campaign</Button>
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
                  <TableHead>ID</TableHead>
                  <TableHead className="min-w-[150px]">Campaign Text</TableHead>
                  <TableHead>Target Category</TableHead>
                  <TableHead>Start Date-Time</TableHead>
                  <TableHead>End Date-Time</TableHead>
                  <TableHead>Target Count</TableHead>
                  <TableHead>Msgs Sent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="min-w-[120px]">Template #1</TableHead>
                  <TableHead>Timing #1</TableHead>
                  <TableHead className="min-w-[120px]">Template #2</TableHead>
                  <TableHead>Timing #2</TableHead>
                  <TableHead className="min-w-[120px]">Template #3</TableHead>
                  <TableHead>Timing #3</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.id}</TableCell>
                    <TableCell className="min-w-[150px]">
                      <div className="max-h-20 overflow-y-auto text-sm">
                        {campaign.text}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{campaign.targetCategory}</Badge>
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">{campaign.startDateTime}</TableCell>
                    <TableCell className="text-sm whitespace-nowrap">{campaign.endDateTime}</TableCell>
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
                    <TableCell className="min-w-[120px]">
                      <div className="max-h-20 overflow-y-auto text-sm text-muted-foreground">
                        {campaign.messageTemplate1}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">{campaign.messageTiming1}</TableCell>
                    <TableCell className="min-w-[120px]">
                      <div className="max-h-20 overflow-y-auto text-sm text-muted-foreground">
                        {campaign.messageTemplate2}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">{campaign.messageTiming2}</TableCell>
                    <TableCell className="min-w-[120px]">
                      <div className="max-h-20 overflow-y-auto text-sm text-muted-foreground">
                        {campaign.messageTemplate3}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">{campaign.messageTiming3}</TableCell>
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
      <Chatbot />
    </div>
  );
}
