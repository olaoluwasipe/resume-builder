"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Wand2, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Experience = {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

type ExperienceFormProps = {
  experiences: Experience[]
  onChange: (experiences: Experience[]) => void
}

export function ExperienceForm({ experiences, onChange }: ExperienceFormProps) {
  const { toast } = useToast()
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  const handleChange = (index: number, field: keyof Experience, value: string | boolean) => {
    const updatedExperiences = [...experiences]
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value,
    }
    onChange(updatedExperiences)
  }

  const handleAddExperience = () => {
    const newExperience: Experience = {
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }
    onChange([...experiences, newExperience])
    setExpandedIndex(experiences.length)
  }

  const handleRemoveExperience = (index: number) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index)
    onChange(updatedExperiences)
    if (expandedIndex === index) {
      setExpandedIndex(null)
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1)
    }
  }

  const handleCopyExperience = (index: number) => {
    const experienceToCopy = { ...experiences[index] }
    const updatedExperiences = [...experiences, experienceToCopy]
    onChange(updatedExperiences)
    toast({
      title: "Experience copied",
      description: "The experience has been duplicated.",
    })
  }

  const handleAIImprove = (index: number) => {
    toast({
      title: "AI Improvement",
      description: "Enhancing your experience description...",
    })
    // In a real app, this would call an AI service to improve the description

    // Simulate AI improvement with a better description
    setTimeout(() => {
      const improvedDescription = `Led a cross-functional team to ${experiences[index].title.toLowerCase()} initiatives, resulting in a 30% increase in efficiency. Collaborated with stakeholders to identify opportunities and implement solutions that aligned with business objectives.`

      const updatedExperiences = [...experiences]
      updatedExperiences[index] = {
        ...updatedExperiences[index],
        description: improvedDescription,
      }
      onChange(updatedExperiences)

      toast({
        title: "Description improved",
        description: "Your experience description has been enhanced by AI.",
      })
    }, 1500)
  }

  return (
    <div className="space-y-4">
      {experiences.map((experience, index) => (
        <Card key={index} className="overflow-hidden">
          <div
            className="p-4 border-b bg-gray-50 flex justify-between items-center cursor-pointer"
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
          >
            <div>
              <h3 className="font-medium">{experience.title || "New Experience"}</h3>
              {experience.company && (
                <p className="text-sm text-gray-600">
                  {experience.company}
                  {experience.location && `, ${experience.location}`}
                </p>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopyExperience(index)
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
                  handleRemoveExperience(index)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {expandedIndex === index && (
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`title-${index}`}>Job Title</Label>
                  <Input
                    id={`title-${index}`}
                    value={experience.title}
                    onChange={(e) => handleChange(index, "title", e.target.value)}
                    placeholder="e.g. Senior UX Designer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`company-${index}`}>Company</Label>
                  <Input
                    id={`company-${index}`}
                    value={experience.company}
                    onChange={(e) => handleChange(index, "company", e.target.value)}
                    placeholder="e.g. Acme Inc."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`location-${index}`}>Location</Label>
                <Input
                  id={`location-${index}`}
                  value={experience.location}
                  onChange={(e) => handleChange(index, "location", e.target.value)}
                  placeholder="e.g. New York, NY"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                  <Input
                    id={`startDate-${index}`}
                    value={experience.startDate}
                    onChange={(e) => handleChange(index, "startDate", e.target.value)}
                    placeholder="e.g. Jan 2020"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`endDate-${index}`}>End Date</Label>
                  <div className="space-y-2">
                    <Input
                      id={`endDate-${index}`}
                      value={experience.endDate}
                      onChange={(e) => handleChange(index, "endDate", e.target.value)}
                      placeholder="e.g. Present"
                      disabled={experience.current}
                    />
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`current-${index}`}
                        checked={experience.current}
                        onCheckedChange={(checked) => handleChange(index, "current", checked === true)}
                      />
                      <label
                        htmlFor={`current-${index}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I currently work here
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`description-${index}`}>Description</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAIImprove(index)}
                    className="gap-1 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                  >
                    <Wand2 className="h-3 w-3" />
                    Improve with AI
                  </Button>
                </div>
                <Textarea
                  id={`description-${index}`}
                  value={experience.description}
                  onChange={(e) => handleChange(index, "description", e.target.value)}
                  placeholder="Describe your responsibilities and achievements..."
                  rows={4}
                />
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      <Button variant="outline" onClick={handleAddExperience} className="w-full gap-2">
        <Plus className="h-4 w-4" />
        Add Experience
      </Button>
    </div>
  )
}

