"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Save, Download, Printer, ArrowLeft, ArrowRight } from "lucide-react"
import { ResumePreview } from "@/components/resume-preview"
import { PersonalInfoForm } from "@/components/personal-info-form"
import { ExperienceForm } from "@/components/experience-form"
import { EducationForm } from "@/components/education-form"
import { SkillsForm } from "@/components/skills-form"
import { useToast } from "@/hooks/use-toast"
import html2canvas from "html2canvas-pro"
import jsPDF from "jspdf"

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const templateId = params.template as string
  const resumePreviewRef = useRef<HTMLDivElement>(null)

  const [activeTab, setActiveTab] = useState("personal")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [progress, setProgress] = useState(25)
  const [resumeData, setResumeData] = useState({
    personal: {
      jobTitle: "Service Designer",
      firstName: "Matthew",
      lastName: "Smith",
      address: "3808 Kuphal Cove Apt. 338",
      email: "schuppe_angie@hotmail.com",
      phone: "(123) 456-7890",
      website: "info@example.com",
      bio: "Be concise - The harsh reality is that hiring managers only spent an average of 6 seconds on each resume.",
    },
    experience: [
      {
        title: "Creative Director",
        company: "Uber",
        location: "New York City",
        startDate: "Sep 2018",
        endDate: "Jan 2020",
        current: false,
        description:
          "My role as a team lead at Uber consisted out of leading the team that built up there first Design System that spread all across their services.",
      },
    ],
    education: [
      {
        degree: "Here comes your Degree",
        institution: "University",
        location: "Location",
        startDate: "MM YYYY",
        endDate: "MM YYYY",
        description:
          "Here is the place where your description will appear. Be concise - The harsh reality is that hiring managers only spent an average of 6 seconds on each resume.",
      },
    ],
    skills: ["UX Design", "UI Design", "Prototyping", "Wireframing", "User Research"],
    languages: [
      { language: "English", proficiency: "Native" },
      { language: "Spanish", proficiency: "Intermediate" },
    ],
  })

  // Calculate progress based on filled sections
  useEffect(() => {
    let filledSections = 0
    const totalSections = 4 // personal, experience, education, skills

    if (resumeData.personal.firstName && resumeData.personal.lastName) filledSections++
    if (resumeData.experience.length > 0) filledSections++
    if (resumeData.education.length > 0) filledSections++
    if (resumeData.skills.length > 0) filledSections++

    setProgress(Math.round((filledSections / totalSections) * 100))
  }, [resumeData])

  const handleSave = () => {
    // In a real app, this would save to a database
    localStorage.setItem("resumeData", JSON.stringify(resumeData))
    toast({
      title: "Resume saved",
      description: "Your resume has been saved successfully.",
    })
  }

  const handleDownload = async () => {
    if (!resumePreviewRef.current) return

    toast({
      title: "Preparing download",
      description: "Your resume is being prepared for download...",
    })

    try {
      // Create a PDF document
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Capture the first page
      const canvas = await html2canvas(resumePreviewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 0

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio)

      // If there are multiple pages, add them
      if (totalPages > 1) {
        // In a real app, we would capture each page
        // For this demo, we'll just add a second page with a message
        pdf.addPage()
        pdf.setFontSize(16)
        pdf.text("Additional resume pages would be added here", 20, 20)
      }

      // Download the PDF
      pdf.save(`${resumeData.personal.firstName}_${resumeData.personal.lastName}_Resume.pdf`)

      toast({
        title: "Download complete",
        description: "Your resume has been downloaded successfully.",
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Download failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleAIAssist = (section: string) => {
    toast({
      title: "AI Assistant",
      description: `Generating suggestions for your ${section}...`,
    })

    // Simulate AI assistance with a timeout
    setTimeout(() => {
      if (section === "personal") {
        setResumeData({
          ...resumeData,
          personal: {
            ...resumeData.personal,
            bio: "Experienced Service Designer with a proven track record of creating user-centered solutions that drive business growth. Skilled in research, prototyping, and cross-functional collaboration to deliver exceptional customer experiences.",
          },
        })
      } else if (section === "skills") {
        setResumeData({
          ...resumeData,
          skills: [
            ...resumeData.skills,
            "User Research",
            "Journey Mapping",
            "Design Thinking",
            "Stakeholder Management",
            "Figma",
          ],
        })
      }

      toast({
        title: "AI Suggestions Added",
        description: `Your ${section} section has been enhanced with AI suggestions.`,
      })
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto py-3 px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/templates">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-xl font-bold">Resume Editor</h1>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button size="sm" onClick={handleDownload} className="bg-green-600 hover:bg-green-700">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Completion:</span>
              <Progress value={progress} className="w-40 h-2 bg-gray-200" />
              <span className="text-sm font-medium">{progress}%</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Template:</span>
              <span className="text-sm font-medium capitalize">{templateId}</span>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/templates">Change</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-6 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Panel */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Your Details</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAIAssist("personal")}
                    className="border-green-200 text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    AI Assist
                  </Button>
                </div>

                <PersonalInfoForm
                  data={resumeData.personal}
                  onChange={(personal) => setResumeData({ ...resumeData, personal })}
                />
              </TabsContent>

              <TabsContent value="experience" className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Work Experience</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAIAssist("experience")}
                    className="border-green-200 text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    AI Assist
                  </Button>
                </div>

                <ExperienceForm
                  experiences={resumeData.experience}
                  onChange={(experience) => setResumeData({ ...resumeData, experience })}
                />
              </TabsContent>

              <TabsContent value="education" className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Education</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAIAssist("education")}
                    className="border-green-200 text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    AI Assist
                  </Button>
                </div>

                <EducationForm
                  education={resumeData.education}
                  onChange={(education) => setResumeData({ ...resumeData, education })}
                />
              </TabsContent>

              <TabsContent value="skills" className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Skills & Languages</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAIAssist("skills")}
                    className="border-green-200 text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    AI Suggest Skills
                  </Button>
                </div>

                <SkillsForm
                  skills={resumeData.skills}
                  languages={resumeData.languages}
                  onChange={(data) =>
                    setResumeData({
                      ...resumeData,
                      skills: data.skills,
                      languages: data.languages,
                    })
                  }
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Panel */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Preview</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-white border rounded-md shadow-sm overflow-hidden" ref={resumePreviewRef}>
              <ResumePreview
                data={resumeData}
                template={templateId}
                currentPage={currentPage}
                onPagesChange={setTotalPages}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

