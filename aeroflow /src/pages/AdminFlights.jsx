import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AdminFlights() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [formData, setFormData] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [flightToDelete, setFlightToDelete] = useState(null);

  const { data: flights = [], isLoading } = useQuery({
    queryKey: ["adminFlights"],
    queryFn: () => base44.entities.Flight.list("-departure_date", 100),
  });

  const createMutation = useMutation({
    mutationFn: (flightData) => base44.entities.Flight.create(flightData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminFlights"] });
      setDialogOpen(false);
      setFormData({});
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Flight.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminFlights"] });
      setDialogOpen(false);
      setEditingFlight(null);
      setFormData({});
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (flightId) => {
      // Delete associated seats
      const seats = await base44.entities.Seat.filter({ flight_id: flightId });
      for (const seat of seats) {
        await base44.entities.Seat.delete(seat.id);
      }
      // Delete flight
      await base44.entities.Flight.delete(flightId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminFlights"] });
      setDeleteDialogOpen(false);
      setFlightToDelete(null);
    },
  });

  const handleOpenDialog = (flight = null) => {
    if (flight) {
      setEditingFlight(flight);
      setFormData(flight);
    } else {
      setEditingFlight(null);
      setFormData({
        airline: "",
        flight_number: "",
        origin: "",
        destination: "",
        departure_date: "",
        departure_time: "",
        arrival_time: "",
        duration: "",
        status: "On Time",
        price_economy: 0,
        price_business: 0,
        total_seats_economy: 150,
        total_seats_business: 30,
        available_seats_economy: 150,
        available_seats_business: 30,
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingFlight) {
      updateMutation.mutate({ id: editingFlight.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDeleteClick = (flight) => {
    setFlightToDelete(flight);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (flightToDelete) {
      deleteMutation.mutate(flightToDelete.id);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl("AdminDashboard"))}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-slate-900">Manage Flights</h1>
          <p className="text-slate-600 mt-2">Add, edit, or remove flights from the system</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Flight
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flight</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prices</TableHead>
                <TableHead>Seats</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flights.map((flight) => (
                <TableRow key={flight.id}>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{flight.airline}</p>
                      <p className="text-sm text-slate-500">{flight.flight_number}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {flight.origin} → {flight.destination}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{flight.departure_date}</p>
                      <p className="text-sm text-slate-500">{flight.departure_time}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        flight.status === "On Time"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {flight.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>Eco: ${flight.price_economy}</p>
                      <p>Biz: ${flight.price_business}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>Eco: {flight.available_seats_economy}/{flight.total_seats_economy}</p>
                      <p>Biz: {flight.available_seats_business}/{flight.total_seats_business}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenDialog(flight)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteClick(flight)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingFlight ? "Edit Flight" : "Add New Flight"}</DialogTitle>
            <DialogDescription>
              {editingFlight ? "Update flight information" : "Create a new flight in the system"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Airline *</Label>
              <Input
                value={formData.airline || ""}
                onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Flight Number *</Label>
              <Input
                value={formData.flight_number || ""}
                onChange={(e) => setFormData({ ...formData, flight_number: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Origin *</Label>
              <Input
                value={formData.origin || ""}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Destination *</Label>
              <Input
                value={formData.destination || ""}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Departure Date *</Label>
              <Input
                type="date"
                value={formData.departure_date || ""}
                onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Departure Time *</Label>
              <Input
                type="time"
                value={formData.departure_time || ""}
                onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Arrival Time *</Label>
              <Input
                type="time"
                value={formData.arrival_time || ""}
                onChange={(e) => setFormData({ ...formData, arrival_time: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Duration *</Label>
              <Input
                placeholder="e.g. 2h 30m"
                value={formData.duration || ""}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status || "On Time"}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="On Time">On Time</SelectItem>
                  <SelectItem value="Delayed">Delayed</SelectItem>
                  <SelectItem value="Boarding">Boarding</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Departed">Departed</SelectItem>
                  <SelectItem value="Arrived">Arrived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Economy Price *</Label>
              <Input
                type="number"
                value={formData.price_economy || ""}
                onChange={(e) =>
                  setFormData({ ...formData, price_economy: parseFloat(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Business Price *</Label>
              <Input
                type="number"
                value={formData.price_business || ""}
                onChange={(e) =>
                  setFormData({ ...formData, price_business: parseFloat(e.target.value) })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editingFlight ? "Update Flight" : "Create Flight"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Flight</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this flight? This will also delete all associated seats
              and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Flight"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}