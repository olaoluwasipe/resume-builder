"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

type Language = {
  language: string
  proficiency: string
}

type SkillsFormProps = {
  skills: string[]
  languages: Language[]
  onChange: (data: { skills: string[]; languages: Language[] }) => void
}

export function SkillsForm({ skills, languages, onChange }: SkillsFormProps) {
  const [newSkill, setNewSkill] = useState("")
  const [newLanguage, setNewLanguage] = useState("")
  const [newProficiency, setNewProficiency] = useState("")

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const updatedSkills = [...skills, newSkill.trim()]
      onChange({ skills: updatedSkills, languages })
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index)
    onChange({ skills: updatedSkills, languages })
  }

  const handleAddLanguage = () => {
    if (newLanguage.trim() && newProficiency.trim()) {
      const updatedLanguages = [...languages, { language: newLanguage.trim(), proficiency: newProficiency.trim() }]
      onChange({ skills, languages: updatedLanguages })
      setNewLanguage("")
      setNewProficiency("")
    }
  }

  const handleRemoveLanguage = (index: number) => {
    const updatedLanguages = languages.filter((_, i) => i !== index)
    onChange({ skills, languages: updatedLanguages })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="font-medium">Skills</h3>

          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="gap-1 px-3 py-1">
                {skill}
                <button onClick={() => handleRemoveSkill(index)} className="ml-1 text-gray-500 hover:text-gray-700">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {skills.length === 0 && <p className="text-sm text-gray-500">No skills added yet</p>}
          </div>

          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill (e.g. JavaScript)"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddSkill()
                }
              }}
            />
            <Button onClick={handleAddSkill} type="button">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="font-medium">Languages</h3>

          <div className="space-y-2 mb-4">
            {languages.map((lang, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{lang.language}</span>
                  <span className="text-sm text-gray-600 ml-2">({lang.proficiency})</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleRemoveLanguage(index)}>
                  <X className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            ))}
            {languages.length === 0 && <p className="text-sm text-gray-500">No languages added yet</p>}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <Input
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                placeholder="Language (e.g. English)"
              />
            </div>
            <div className="col-span-1">
              <Input
                value={newProficiency}
                onChange={(e) => setNewProficiency(e.target.value)}
                placeholder="Level (e.g. Fluent)"
              />
            </div>
          </div>

          <Button
            onClick={handleAddLanguage}
            type="button"
            className="w-full"
            disabled={!newLanguage.trim() || !newProficiency.trim()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Language
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

