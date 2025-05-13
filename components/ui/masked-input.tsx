import React, { forwardRef } from "react"
import { Input } from "@/components/ui/input"

export interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask?: string
}

const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ className, mask, value, onChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = event.target.value

      if (mask === "+{1}(000)000-0000") {
        // Remove all non-digit characters
        newValue = newValue.replace(/\D/g, "")

        // Format the phone number
        if (newValue.length > 0) {
          newValue = "+1" + newValue
          if (newValue.length > 2) {
            newValue = newValue.slice(0, 2) + "(" + newValue.slice(2)
          }
          if (newValue.length > 6) {
            newValue = newValue.slice(0, 6) + ")" + newValue.slice(6)
          }
          if (newValue.length > 10) {
            newValue = newValue.slice(0, 10) + "-" + newValue.slice(10)
          }
        }

        // Limit to 14 characters (+1(234)567-8900)
        newValue = newValue.slice(0, 14)
      }

      if (onChange) {
        const syntheticEvent = {
          ...event,
          target: {
            ...event.target,
            value: newValue
          }
        }
        onChange(syntheticEvent)
      }
    }

    return (
      <Input
        className={className}
        ref={ref}
        value={value}
        onChange={handleChange}
        {...props}
      />
    )
  }
)

MaskedInput.displayName = "MaskedInput"

export { MaskedInput } 