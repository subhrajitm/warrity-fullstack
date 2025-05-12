"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { authApi } from "@/lib/api"
import { Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const response = await authApi.requestPasswordReset(data.email)
      if (response.error) {
        toast.error(response.error)
        return
      }
      setEmailSent(true)
      toast.success("Password reset instructions sent to your email")
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-4 border-amber-800 shadow-[8px_8px_0px_0px_rgba(120,53,15,0.5)] bg-amber-100">
        <CardHeader className="border-b-4 border-amber-800 bg-amber-200 px-6 py-4">
          <div className="flex items-center space-x-2">
            <Link href="/login" className="text-amber-800 hover:text-amber-600">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <CardTitle className="text-2xl font-bold text-amber-900">Reset Password</CardTitle>
              <CardDescription className="text-amber-800">
                Enter your email to receive reset instructions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {emailSent ? (
            <div className="text-center space-y-4">
              <div className="bg-amber-100 border-2 border-amber-800 rounded-lg p-4">
                <Mail className="h-12 w-12 text-amber-800 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-amber-900 mb-2">Check Your Email</h3>
                <p className="text-amber-800">
                  We've sent password reset instructions to your email address.
                  Please check your inbox and follow the link to reset your password.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setEmailSent(false)}
                className="w-full border-2 border-amber-800 text-amber-800 hover:bg-amber-200"
              >
                Try Another Email
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-900">Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter your email"
                          className="border-2 border-amber-800 bg-amber-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-amber-800 hover:bg-amber-900 text-amber-100 border-2 border-amber-900"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-amber-100 border-t-transparent rounded-full" />
                      Sending...
                    </div>
                  ) : (
                    "Send Reset Instructions"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 