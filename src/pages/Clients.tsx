import { useState } from "react";
import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

// Mock data - will be replaced with real Google Sheets data
const mockClients = [
  {
    id: "CL001",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 234 567 8900",
    type: "Premium",
    interests: "Spa, Fine Dining",
    traits: "High Spender, Frequent Visitor",
    category: "VIP",
  },
  {
    id: "CL002",
    name: "Emma Johnson",
    email: "emma.j@email.com",
    phone: "+1 234 567 8901",
    type: "Standard",
    interests: "Room Service, Local Tours",
    traits: "Budget Conscious",
    category: "Regular",
  },
  {
    id: "CL003",
    name: "Michael Brown",
    email: "m.brown@email.com",
    phone: "+1 234 567 8902",
    type: "Premium",
    interests: "Conference Rooms, Business Center",
    traits: "Corporate Client",
    category: "Business",
  },
];

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = mockClients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadCSV = () => {
    // CSV export functionality - to be implemented
    const csv = [
      ["Client ID", "Name", "Email", "Phone", "Type", "Interests", "Traits", "Category"],
      ...filteredClients.map((c) => [
        c.id,
        c.name,
        c.email,
        c.phone,
        c.type,
        c.interests,
        c.traits,
        c.category,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clients-report.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all your client information
          </p>
        </div>
        <Button onClick={downloadCSV} className="bg-primary hover:bg-primary/90">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Client Database</CardTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Interests</TableHead>
                  <TableHead>Traits</TableHead>
                  <TableHead>Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.id}</TableCell>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>
                      <Badge
                        variant={client.type === "Premium" ? "default" : "secondary"}
                      >
                        {client.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {client.interests}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {client.traits}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          client.category === "VIP"
                            ? "default"
                            : client.category === "Business"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {client.category}
                      </Badge>
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
