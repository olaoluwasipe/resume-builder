"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HelpCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type PersonalInfo = {
  jobTitle: string
  firstName: string
  lastName: string
  address: string
  email: string
  phone: string
  website: string
  bio: string
}

type PersonalInfoFormProps = {
  data: PersonalInfo
  onChange: (data: PersonalInfo) => void
}

export function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer">
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div className="p-2 max-w-xs">
                  <p className="text-sm">
                    Your current or desired job title. This will be displayed prominently on your resume.
                  </p>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Input
            id="jobTitle"
            value={data.jobTitle}
            onChange={(e) => handleChange("jobTitle", e.target.value)}
            placeholder="e.g. Senior UX Designer"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={data.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            placeholder="e.g. John"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={data.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            placeholder="e.g. Smith"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={data.address}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="e.g. 123 Main St, City, State, Zip"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="e.g. john.smith@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="e.g. (123) 456-7890"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website/LinkedIn</Label>
        <Input
          id="website"
          value={data.website}
          onChange={(e) => handleChange("website", e.target.value)}
          placeholder="e.g. linkedin.com/in/johnsmith"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="bio">Professional Summary</Label>
          <span className="text-xs text-gray-500">{data.bio.length}/400 characters</span>
        </div>
        <Textarea
          id="bio"
          value={data.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
          placeholder="Write a brief summary of your professional background and key strengths..."
          maxLength={400}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Cover Letter Language</Label>
        <Select defaultValue="english">
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">
              <div className="flex items-center">
                <span className="mr-2">🇬🇧</span>
                English
              </div>
            </SelectItem>
            <SelectItem value="dutch">
              <div className="flex items-center">
                <span className="mr-2">🇳🇱</span>
                Dutch
              </div>
            </SelectItem>
            <SelectItem value="danish">
              <div className="flex items-center">
                <span className="mr-2">🇩🇰</span>
                Danish
              </div>
            </SelectItem>
            <SelectItem value="spanish">
              <div className="flex items-center">
                <span className="mr-2">🇪🇸</span>
                Spanish
              </div>
            </SelectItem>
            <SelectItem value="german">
              <div className="flex items-center">
                <span className="mr-2">🇩🇪</span>
                German
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

