import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function ActivityFeed() {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Avatar className="h-9 w-9 mr-3 border-2 border-amber-800">
          <AvatarFallback className="bg-amber-200 text-amber-800">WM</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none text-amber-900">Warranty registered for Samsung TV</p>
          <p className="text-sm text-amber-700">2 days ago</p>
        </div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9 mr-3 border-2 border-amber-800">
          <AvatarFallback className="bg-amber-200 text-amber-800">WM</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none text-amber-900">Warranty extended for MacBook Pro</p>
          <p className="text-sm text-amber-700">5 days ago</p>
        </div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9 mr-3 border-2 border-amber-800">
          <AvatarFallback className="bg-amber-200 text-amber-800">WM</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none text-amber-900">iPhone 13 Pro warranty expired</p>
          <p className="text-sm text-amber-700">1 week ago</p>
        </div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9 mr-3 border-2 border-amber-800">
          <AvatarFallback className="bg-amber-200 text-amber-800">WM</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none text-amber-900">Added new product: AirPods Pro</p>
          <p className="text-sm text-amber-700">2 weeks ago</p>
        </div>
      </div>
    </div>
  )
}