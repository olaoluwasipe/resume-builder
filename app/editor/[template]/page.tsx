"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Save, Download, Printer, ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { ResumePreview } from "@/components/resume-preview"
import { PersonalInfoForm } from "@/components/personal-info-form"
import { ExperienceForm } from "@/components/experience-form"
import { EducationForm } from "@/components/education-form"
import { SkillsForm } from "@/components/skills-form"
import { ShareModal } from "@/components/share-modal"
import { useToast } from "@/hooks/use-toast"

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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [pdfGenerationProgress, setPdfGenerationProgress] = useState(0)
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

  // Update the handleDownload function to fix the scaling issue and add progress indicator
  const handleDownload = async () => {
    if (!resumePreviewRef.current) return

    setIsGeneratingPDF(true)
    setPdfGenerationProgress(10)

    toast({
      title: "Preparing download",
      description: "Your resume is being prepared for download...",
    })

    try {
      // Import jsPDF with html capability
      setPdfGenerationProgress(20)
      const { jsPDF } = await import("jspdf")
      // const html2canvas = (await import("html2canvas-pro")).default
      await import("jspdf-html2canvas-pro")
      setPdfGenerationProgress(30)

      // Create a PDF document with A4 dimensions
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4", // A4 is 210mm × 297mm
        putOnlyUsedFonts: true,
        floatPrecision: 16, // or "smart", preserves precision for calculations
      })

      console.log("worked here");

      // For each page in the resume
      for (let i = 1; i <= totalPages; i++) {
        // Set current page to capture
        setCurrentPage(i)

        // Update progress based on current page
        const baseProgress = 30
        const progressPerPage = 60 / totalPages
        setPdfGenerationProgress(baseProgress + Math.round(progressPerPage * (i - 1)))

        // Wait for the page to render
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Get the content to convert
        const element = resumePreviewRef.current

        // Fix unsupported Tailwind CSS colors
        element.style.setProperty("color", "black", "important")
        element.style.setProperty("background-color", "white", "important")

        // Add page to PDF (except for first page)
        if (i > 1) {
          pdf.addPage()
        }

        console.log("wahala")

        // Convert HTML to PDF with text content preserved
        await pdf.html(element, {
          callback: (pdf) => {
            // This callback is executed when the HTML has been rendered to the PDF
            setPdfGenerationProgress(baseProgress + Math.round(progressPerPage * i))
          },
          x: 0,
          y: 0,
          html2canvas: {
            scale: 0.35, // Further reduced scale to fit content properly
            useCORS: true,
            logging: false,
            letterRendering: true,
          },
          width: 210, // A4 width in mm
          windowWidth: 794, // Width in px used for scaling
        })
      }

      console.log("wahala there")

      setPdfGenerationProgress(90)

      // Download the PDF
      pdf.save(`${resumeData.personal.firstName}_${resumeData.personal.lastName}_Resume.pdf`)

      // Reset to first page
      setCurrentPage(1)
      setPdfGenerationProgress(100)

      toast({
        title: "Download complete",
        description: "Your ATS-friendly resume has been downloaded successfully.",
      })

      // Reset the loading state after a short delay
      setTimeout(() => {
        setIsGeneratingPDF(false)
        setPdfGenerationProgress(0)
      }, 500)
    } catch (error) {
      console.error("Error generating PDF:", error)
      setIsGeneratingPDF(false)
      setPdfGenerationProgress(0)

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
      {isGeneratingPDF && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
            <h3 className="text-lg font-semibold mb-2">Generating PDF</h3>
            <p className="text-sm text-gray-600 mb-4">Please wait while we prepare your resume...</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div
                className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${pdfGenerationProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">{pdfGenerationProgress}% complete</p>
          </div>
        </div>
      )}

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
              <ShareModal
                resumeName={`${resumeData.personal.firstName} ${resumeData.personal.lastName} Resume`}
                templateId={templateId}
              />
              <Button
                size="sm"
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700"
                disabled={isGeneratingPDF}
              >
                {isGeneratingPDF ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </>
                )}
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

            <div className="bg-white border rounded-md shadow-sm overflow-hidden resume-preview" ref={resumePreviewRef}>
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

