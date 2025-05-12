"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarEvent } from "@/lib/hooks/use-calendar-events"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"

// Define the form schema with validation rules
const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  eventType: z.enum(["expiration", "maintenance", "reminder"]),
  startDate: z.string().refine(date => !isNaN(new Date(date).getTime()), {
    message: "Please enter a valid date",
  }),
  allDay: z.boolean().default(true),
  color: z.string().optional(),
  relatedWarranty: z.string().optional(),
  notifications: z.object({
    enabled: z.boolean().default(true),
    reminderTime: z.number().min(0).default(24),
  }).optional(),
})

type EventFormValues = z.infer<typeof eventFormSchema>

interface EventFormProps {
  onSubmit: (data: Omit<CalendarEvent, "_id">) => Promise<boolean>
  onCancel: () => void
  isSubmitting?: boolean
  defaultValues?: Partial<EventFormValues>
  warranties?: Array<{ _id: string; title: string }>
}

export function EventForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
  defaultValues,
  warranties = [],
}: EventFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Initialize the form with default values
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      eventType: "expiration",
      startDate: new Date().toISOString().split("T")[0],
      allDay: true,
      color: "#3498db",
      notifications: {
        enabled: true,
        reminderTime: 24,
      },
      ...defaultValues,
    },
  })

  // Handle form submission
  async function handleSubmit(data: EventFormValues) {
    // Process and normalize the data
    const formattedData = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      notifications: data.notifications || {
        enabled: true,
        reminderTime: 24,
      },
    } as Omit<CalendarEvent, "_id">;
    
    await onSubmit(formattedData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., TV Warranty Expiration" 
                  className="border-2 border-amber-800 bg-amber-50"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Date</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  className="border-2 border-amber-800 bg-amber-50"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="eventType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="border-2 border-amber-800 bg-amber-50">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="expiration">Warranty Expiration</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {warranties.length > 0 && (
          <FormField
            control={form.control}
            name="relatedWarranty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Related Warranty (Optional)</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border-2 border-amber-800 bg-amber-50">
                      <SelectValue placeholder="Select warranty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">No warranty</SelectItem>
                    {warranties.map(warranty => (
                      <SelectItem key={warranty._id} value={warranty._id}>
                        {warranty.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Link this event to a specific warranty
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add details about this event..."
                  className="border-2 border-amber-800 bg-amber-50 min-h-[80px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allDay"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>All-day Event</FormLabel>
                <FormDescription>
                  Event lasts the entire day
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {showAdvanced && (
          <>
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <Input 
                        type="color"
                        className="w-16 h-10 border-2 border-amber-800"
                        {...field} 
                      />
                      <span 
                        className="w-8 h-8 rounded-full border-2 border-amber-800" 
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notifications.enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Enable Notifications</FormLabel>
                    <FormDescription>
                      Get reminded about this event
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("notifications.enabled") && (
              <FormField
                control={form.control}
                name="notifications.reminderTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reminder Time (hours before)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="0"
                        className="border-2 border-amber-800 bg-amber-50"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))} 
                      />
                    </FormControl>
                    <FormDescription>
                      How many hours before the event to send a reminder
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </>
        )}

        <Button
          type="button"
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full border-amber-800 text-amber-800"
        >
          {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
        </Button>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-2 border-amber-800 text-amber-800"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Event"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
} 