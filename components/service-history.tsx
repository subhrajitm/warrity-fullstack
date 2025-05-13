"use client"

import type React from "react"

import { useState } from "react"
import { CalendarPlus, PenToolIcon as Tool } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ServiceHistoryProps {
  productId: string
}

export function ServiceHistory({ productId }: ServiceHistoryProps) {
  const [open, setOpen] = useState(false)
  // In a real app, this would be fetched from the server
  const [serviceHistory, setServiceHistory] = useState([
    {
      id: "1",
      date: "2023-03-15",
      type: "Repair",
      description: "Screen replacement due to dead pixels",
      technician: "John Smith",
      cost: "$299.00",
    },
    {
      id: "2",
      date: "2023-05-20",
      type: "Maintenance",
      description: "Software update and system optimization",
      technician: "Sarah Johnson",
      cost: "$99.00",
    },
  ])

  const [newService, setNewService] = useState({
    date: "",
    type: "",
    description: "",
    technician: "",
    cost: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would call a server action
    setServiceHistory([
      ...serviceHistory,
      {
        id: Date.now().toString(),
        ...newService,
      },
    ])
    setNewService({
      date: "",
      type: "",
      description: "",
      technician: "",
      cost: "",
    })
    setOpen(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewService({
      ...newService,
      [name]: value,
    })
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <CalendarPlus className="mr-2 h-4 w-4" />
              Add Service Record
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add Service Record</DialogTitle>
                <DialogDescription>Add a new service or repair record for this product.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Service Date</Label>
                    <Input id="date" name="date" type="date" value={newService.date} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Service Type</Label>
                    <Input
                      id="type"
                      name="type"
                      placeholder="Repair, Maintenance, etc."
                      value={newService.type}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the service or repair"
                    value={newService.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="technician">Technician</Label>
                    <Input
                      id="technician"
                      name="technician"
                      placeholder="Technician name"
                      value={newService.technician}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost</Label>
                    <Input id="cost" name="cost" placeholder="$0.00" value={newService.cost} onChange={handleChange} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Service Record</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {serviceHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="rounded-full bg-muted p-3">
            <Tool className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="mt-4 text-center text-muted-foreground">No service records found</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {serviceHistory.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{new Date(service.date).toLocaleDateString()}</TableCell>
                <TableCell>{service.type}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell>{service.technician}</TableCell>
                <TableCell>{service.cost}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

