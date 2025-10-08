import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react"

export function ColorDemo() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Buttons Demo */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg text-[#374151] mb-4">Buttons</h3>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-[#005a5e] hover:bg-[#005a5e]/90 text-white">Primary Action</Button>
          <Button className="bg-[#7c3aed] hover:bg-[#7c3aed]/90 text-white">Secondary Action</Button>
          <Button className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white">Tertiary Action</Button>
        </div>
      </Card>

      {/* Badges Demo */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg text-[#374151] mb-4">Badges</h3>
        <div className="flex flex-wrap gap-3">
          <Badge className="bg-[#005a5e] text-white hover:bg-[#005a5e]/90">Primary</Badge>
          <Badge className="bg-[#7c3aed] text-white hover:bg-[#7c3aed]/90">Featured</Badge>
          <Badge className="bg-[#0d9488] text-white hover:bg-[#0d9488]/90">Active</Badge>
          <Badge className="bg-[#6b7280] text-white hover:bg-[#6b7280]/90">Default</Badge>
        </div>
      </Card>

      {/* Alerts Demo */}
      <Card className="p-6 md:col-span-2">
        <h3 className="font-semibold text-lg text-[#374151] mb-4">Alert States</h3>
        <div className="space-y-3">
          <Alert className="border-[#059669] bg-[#059669]/10">
            <CheckCircle2 className="h-4 w-4 text-[#059669]" />
            <AlertDescription className="text-[#374151]">
              Success! Your changes have been saved successfully.
            </AlertDescription>
          </Alert>
          <Alert className="border-[#d97706] bg-[#d97706]/10">
            <AlertTriangle className="h-4 w-4 text-[#d97706]" />
            <AlertDescription className="text-[#374151]">
              Warning: Please review your information before proceeding.
            </AlertDescription>
          </Alert>
          <Alert className="border-[#dc2626] bg-[#dc2626]/10">
            <XCircle className="h-4 w-4 text-[#dc2626]" />
            <AlertDescription className="text-[#374151]">
              Error: Unable to process your request. Please try again.
            </AlertDescription>
          </Alert>
        </div>
      </Card>
    </div>
  )
}
