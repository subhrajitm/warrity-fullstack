import { toast } from "sonner"

interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

export const authApi = {
  changePassword: async (data: ChangePasswordData) => {
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        return { error: error.message || "Failed to change password" }
      }

      return { success: true }
    } catch (error) {
      console.error("Change password error:", error)
      return { error: "An unexpected error occurred" }
    }
  },
} 