"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Education = {
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
  description: string
}

type EducationFormProps = {
  education: Education[]
  onChange: (education: Education[]) => void
}

export function EducationForm({ education, onChange }: EducationFormProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)
  const { toast } = useToast()

  const handleChange = (index: number, field: keyof Education, value: string) => {
    const updatedEducation = [...education]
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    }
    onChange(updatedEducation)
  }

  const handleAddEducation = () => {
    const newEducation: Education = {
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    }
    onChange([...education, newEducation])
    setExpandedIndex(education.length)
  }

  const handleRemoveEducation = (index: number) => {
    const updatedEducation = education.filter((_, i) => i !== index)
    onChange(updatedEducation)
    if (expandedIndex === index) {
      setExpandedIndex(null)
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1)
    }
  }

  const handleCopyEducation = (index: number) => {
    const educationToCopy = { ...education[index] }
    const updatedEducation = [...education, educationToCopy]
    onChange(updatedEducation)
    toast({
      title: "Education copied",
      description: "The education entry has been duplicated.",
    })
  }

  return (
    <div className="space-y-4">
      {education.map((edu, index) => (
        <Card key={index} className="overflow-hidden">
          <div
            className="p-4 border-b bg-gray-50 flex justify-between items-center cursor-pointer"
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
          >
            <div>
              <h3 className="font-medium">{edu.degree || "New Education"}</h3>
              {edu.institution && (
                <p className="text-sm text-gray-600">
                  {edu.institution}
                  {edu.location && `, ${edu.location}`}
                </p>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopyEducation(index)
                }}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveEducation(index)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {expandedIndex === index && (
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`degree-${index}`}>Degree/Certificate</Label>
                <Input
                  id={`degree-${index}`}
                  value={edu.degree}
                  onChange={(e) => handleChange(index, "degree", e.target.value)}
                  placeholder="e.g. Bachelor of Science in Computer Science"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`institution-${index}`}>Institution</Label>
                  <Input
                    id={`institution-${index}`}
                    value={edu.institution}
                    onChange={(e) => handleChange(index, "institution", e.target.value)}
                    placeholder="e.g. University of California"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`location-${index}`}>Location</Label>
                  <Input
                    id={`location-${index}`}
                    value={edu.location}
                    onChange={(e) => handleChange(index, "location", e.target.value)}
                    placeholder="e.g. Berkeley, CA"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                  <Input
                    id={`startDate-${index}`}
                    value={edu.startDate}
                    onChange={(e) => handleChange(index, "startDate", e.target.value)}
                    placeholder="e.g. Sep 2016"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`endDate-${index}`}>End Date</Label>
                  <Input
                    id={`endDate-${index}`}
                    value={edu.endDate}
                    onChange={(e) => handleChange(index, "endDate", e.target.value)}
                    placeholder="e.g. Jun 2020"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`description-${index}`}>Description (Optional)</Label>
                <Textarea
                  id={`description-${index}`}
                  value={edu.description}
                  onChange={(e) => handleChange(index, "description", e.target.value)}
                  placeholder="Describe your studies, achievements, or relevant coursework..."
                  rows={3}
                />
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      <Button variant="outline" onClick={handleAddEducation} className="w-full gap-2">
        <Plus className="h-4 w-4" />
        Add Education
      </Button>
    </div>
  )
}

