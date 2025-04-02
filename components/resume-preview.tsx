"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { Check } from "lucide-react"

type ResumeData = {
  personal: {
    jobTitle: string
    firstName: string
    lastName: string
    address: string
    email: string
    phone: string
    website: string
    bio: string
  }
  experience: Array<{
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }>
  education: Array<{
    degree: string
    institution: string
    location: string
    startDate: string
    endDate: string
    description: string
  }>
  skills: string[]
  languages: Array<{
    language: string
    proficiency: string
  }>
}

type ResumePreviewProps = {
  data: ResumeData
  template: string
  currentPage: number
  onPagesChange: (pages: number) => void
}

// A4 dimensions in pixels at 96 DPI
// A4 is 210mm × 297mm, which is approximately 794px × 1123px at 96 DPI
// const container = document.querySelector('.resume-preview') as HTMLDivElement;
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1143;
const PAGE_MARGIN_PX = 40 // Margin on all sides
const CONTENT_HEIGHT_PX = A4_HEIGHT_PX - PAGE_MARGIN_PX * 2

export function ResumePreview({ data, template, currentPage, onPagesChange }: ResumePreviewProps) {
  const [avatarUrl, setAvatarUrl] = useState("/placeholder.svg?height=150&width=150")
  const [pages, setPages] = useState<React.ReactNode[]>([])
  const contentRef = useRef<HTMLDivElement>(null)

  // Calculate pages based on content height
  useEffect(() => {
    if (!contentRef.current) return

    // Function to create pages based on content
    const calculatePages = () => {
      // Create a temporary container to measure content
      const tempContainer = document.createElement("div")
      tempContainer.style.width = `${A4_WIDTH_PX - PAGE_MARGIN_PX * 2}px`
      tempContainer.style.position = "absolute"
      tempContainer.style.visibility = "hidden"
      tempContainer.style.left = "-9999px"
      document.body.appendChild(tempContainer)

      // Clone the content for measurement
      const contentClone = contentRef.current!.cloneNode(true) as HTMLElement
      tempContainer.appendChild(contentClone)

      // Initialize pages array
      const newPages: React.ReactNode[] = []

      // Create the first page container
      let currentPageContainer = document.createElement("div")
      let currentPageHeight = 0
      let pageIndex = 0

      // Process each section
      Array.from(contentClone.children).forEach((section) => {
        const sectionElement = section as HTMLElement
        const sectionType = sectionElement.className

        // If this is a section with items (experience, education)
        if (sectionType === "experience-section" || sectionType === "education-section") {
          // Create a section header element
          const sectionHeader = document.createElement("div")
          sectionHeader.className = sectionType + "-header"

          // Set the header text based on section type
          if (sectionType === "experience-section") {
            sectionHeader.innerHTML = "<h2>Experience</h2>"
          } else if (sectionType === "education-section") {
            sectionHeader.innerHTML = "<h2>Education</h2>"
          }

          // Check if adding the section header would exceed page height
          const headerHeight = 40 // Approximate height for section header

          if (currentPageHeight + headerHeight > CONTENT_HEIGHT_PX && currentPageHeight > 0) {
            // Create a new page with current elements
            newPages.push(renderPage(template, data, currentPageContainer, pageIndex + 1))

            // Reset for next page
            currentPageContainer = document.createElement("div")
            currentPageHeight = 0
            pageIndex++
          }

          // Add section header to current page
          if (
            currentPageHeight === 0 ||
            Array.from(currentPageContainer.children).some((el) => el.className === sectionType + "-header")
          ) {
            // Only add header if it's the first element on the page or if this section already has a header on this page
          } else {
            currentPageContainer.appendChild(sectionHeader.cloneNode(true))
            currentPageHeight += headerHeight
          }

          // Process each item in the section
          Array.from(sectionElement.children).forEach((item) => {
            const itemElement = item as HTMLElement
            const itemHeight = itemElement.offsetHeight

            // If adding this item would exceed page height, create a new page
            if (currentPageHeight + itemHeight > CONTENT_HEIGHT_PX && currentPageHeight > 0) {
              // Create a page with current elements
              newPages.push(renderPage(template, data, currentPageContainer, pageIndex + 1))

              // Reset for next page
              currentPageContainer = document.createElement("div")
              currentPageHeight = 0
              pageIndex++

              // Add section header to the new page
              const newPageHeader = sectionHeader.cloneNode(true)
              currentPageContainer.appendChild(newPageHeader)
              currentPageHeight += headerHeight
            }

            // Add item to current page
            currentPageContainer.appendChild(itemElement.cloneNode(true))
            currentPageHeight += itemHeight
          })
        } else {
          // For non-item sections (personal info, skills, languages)
          const sectionHeight = sectionElement.offsetHeight

          // If adding this section would exceed page height, create a new page
          if (currentPageHeight + sectionHeight > CONTENT_HEIGHT_PX && currentPageHeight > 0) {
            // Create a page with current elements
            newPages.push(renderPage(template, data, currentPageContainer, pageIndex + 1))

            // Reset for next page
            currentPageContainer = document.createElement("div")
            currentPageHeight = 0
            pageIndex++
          }

          // Add section to current page
          currentPageContainer.appendChild(sectionElement.cloneNode(true))
          currentPageHeight += sectionHeight
        }
      })

      // Add the last page if there are remaining elements
      if (currentPageContainer.children.length > 0) {
        newPages.push(renderPage(template, data, currentPageContainer, pageIndex + 1))
      }

      // Clean up
      document.body.removeChild(tempContainer)

      return newPages
    }

    // Calculate pages and update state
    const newPages = calculatePages()
    setPages(newPages)
    onPagesChange(newPages.length)
  }, [data, template, onPagesChange])

  // Function to render a page based on template and elements
  const renderPage = (template: string, data: ResumeData, container: HTMLElement, pageNumber: number) => {
    // Create a deep copy of the elements to avoid reference issues
    const elementsCopy = Array.from(container.children).map((el) => el.cloneNode(true) as HTMLElement)

    // Render the appropriate template with these elements
    switch (template) {
      case "professional":
        return (
          <ProfessionalTemplate
            key={`page-${pageNumber}`}
            data={data}
            pageNumber={pageNumber}
            elements={elementsCopy}
            avatarUrl={avatarUrl}
          />
        )
      case "modern":
        return (
          <ModernTemplate
            key={`page-${pageNumber}`}
            data={data}
            pageNumber={pageNumber}
            elements={elementsCopy}
            avatarUrl={avatarUrl}
          />
        )
      case "minimal":
        return (
          <MinimalTemplate
            key={`page-${pageNumber}`}
            data={data}
            pageNumber={pageNumber}
            elements={elementsCopy}
            avatarUrl={avatarUrl}
          />
        )
      case "creative":
        return (
          <CreativeTemplate
            key={`page-${pageNumber}`}
            data={data}
            pageNumber={pageNumber}
            elements={elementsCopy}
            avatarUrl={avatarUrl}
          />
        )
      case "executive":
        return (
          <ExecutiveTemplate
            key={`page-${pageNumber}`}
            data={data}
            pageNumber={pageNumber}
            elements={elementsCopy}
            avatarUrl={avatarUrl}
          />
        )
      case "academic":
        return (
          <AcademicTemplate
            key={`page-${pageNumber}`}
            data={data}
            pageNumber={pageNumber}
            elements={elementsCopy}
            avatarUrl={avatarUrl}
          />
        )
      default:
        return (
          <ProfessionalTemplate
            key={`page-${pageNumber}`}
            data={data}
            pageNumber={pageNumber}
            elements={elementsCopy}
            avatarUrl={avatarUrl}
          />
        )
    }
  }

  // Hidden content for measurement
  const hiddenContent = (
    <div
      ref={contentRef}
      style={{
        position: "absolute",
        visibility: "hidden",
        left: "-9999px",
        width: `${A4_WIDTH_PX - PAGE_MARGIN_PX * 2}px`,
      }}
    >
      {/* Header Section */}
      <div className="header-section">
        <h1 className="text-2xl font-bold">
          {data.personal.firstName} {data.personal.lastName}
        </h1>
        <p className="text-lg text-gray-600">{data.personal.jobTitle}</p>
        <p className="text-sm text-gray-500">
          {data.personal.email} | {data.personal.phone}
        </p>
      </div>

      {/* Profile Section */}
      <div className="profile-section">
        <h2 className="text-lg font-semibold mb-2">Profile</h2>
        <p className="text-sm">{data.personal.bio}</p>
      </div>

      {/* Experience Section */}
      <div className="experience-section">
        {data.experience.map((exp, index) => (
          <div key={index} className="experience-item mb-4">
            <div className="flex justify-between">
              <h3 className="font-medium">{exp.title}</h3>
              <span className="text-sm text-gray-600">
                {exp.startDate} - {exp.current ? "Present" : exp.endDate}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600">
              {exp.company}, {exp.location}
            </p>
            <p className="text-sm mt-1">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* Education Section */}
      <div className="education-section">
        {data.education.map((edu, index) => (
          <div key={index} className="education-item mb-4">
            <div className="flex justify-between">
              <h3 className="font-medium">{edu.degree}</h3>
              <span className="text-sm text-gray-600">
                {edu.startDate} - {edu.endDate}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600">
              {edu.institution}, {edu.location}
            </p>
            <p className="text-sm mt-1">{edu.description}</p>
          </div>
        ))}
      </div>

      {/* Skills Section */}
      <div className="skills-section">
        <h2 className="text-lg font-semibold mb-2">Skills</h2>
        <ul className="space-y-1">
          {data.skills.map((skill, index) => (
            <li key={index} className="text-sm">
              {skill}
            </li>
          ))}
        </ul>
      </div>

      {/* Languages Section */}
      <div className="languages-section">
        <h2 className="text-lg font-semibold mb-2">Languages</h2>
        <ul className="space-y-1">
          {data.languages.map((lang, index) => (
            <li key={index} className="text-sm">
              {lang.language} - {lang.proficiency}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  // Render the current page
  return (
    <>
      {hiddenContent}
      <div
        style={{
          width: "100%",
          height: "0",
          paddingBottom: `${(A4_HEIGHT_PX / A4_WIDTH_PX) * 100}%`,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
          className="pdf-container"
        >
          {pages.length > 0 && currentPage <= pages.length
            ? pages[currentPage - 1]
            : // Fallback rendering if dynamic pagination fails
              renderTemplateContent(template, data, currentPage, avatarUrl)}
        </div>
      </div>
    </>
  )
}

// Fallback template rendering function
function renderTemplateContent(template: string, data: ResumeData, currentPage: number, avatarUrl: string) {
  switch (template) {
    case "professional":
      return <ProfessionalTemplateFallback data={data} currentPage={currentPage} avatarUrl={avatarUrl} />
    case "modern":
      return <ModernTemplateFallback data={data} currentPage={currentPage} avatarUrl={avatarUrl} />
    case "minimal":
      return <MinimalTemplateFallback data={data} currentPage={currentPage} avatarUrl={avatarUrl} />
    case "creative":
      return <CreativeTemplateFallback data={data} currentPage={currentPage} avatarUrl={avatarUrl} />
    case "executive":
      return <ExecutiveTemplateFallback data={data} currentPage={currentPage} avatarUrl={avatarUrl} />
    case "academic":
      return <AcademicTemplateFallback data={data} currentPage={currentPage} avatarUrl={avatarUrl} />
    default:
      return <ProfessionalTemplateFallback data={data} currentPage={currentPage} avatarUrl={avatarUrl} />
  }
}

// Dynamic page templates
function ProfessionalTemplate({
  data,
  pageNumber,
  elements,
  avatarUrl,
}: { data: ResumeData; pageNumber: number; elements: HTMLElement[]; avatarUrl: string }) {
  return (
    <div className="p-6 font-sans h-full ats-friendly-content" style={{ backgroundColor: "white" }}>
      {pageNumber === 1 ? (
        // First page header
        <div className="flex items-center border-b border-gray-300 pb-4 mb-6">
          <div className="mr-4">
            <img
              src={avatarUrl || "/placeholder.svg"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {data.personal.firstName} {data.personal.lastName}
            </h1>
            <p className="text-lg text-gray-600">{data.personal.jobTitle}</p>
          </div>
          <div className="ml-auto">
            <Check className="h-6 w-6 text-green-600" />
          </div>
        </div>
      ) : (
        // Continuation page header
        <div className="border-b border-gray-300 pb-4 mb-6">
          <h1 className="text-xl font-bold">
            {data.personal.firstName} {data.personal.lastName} - Page {pageNumber}
          </h1>
        </div>
      )}

      <div className="dynamic-content">
        {elements.map((element, index) => {
          // Extract the class names from the element
          const className = element.className || ""

          // Create a properly styled version based on element type
          if (element.classList.contains("header-section")) {
            return (
              <div key={index} className="mb-6">
                <div dangerouslySetInnerHTML={{ __html: element.innerHTML }} className={className} />
              </div>
            )
          } else if (element.classList.contains("profile-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-3">Profile</h2>
                <div dangerouslySetInnerHTML={{ __html: element.innerHTML }} className={className} />
              </div>
            )
          } else if (element.classList.contains("experience-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-3">Experience</h2>
                <div className="space-y-4">
                  {Array.from(element.children).map((child, childIndex) => (
                    <div key={childIndex} dangerouslySetInnerHTML={{ __html: child.innerHTML }} className="mb-4" />
                  ))}
                </div>
              </div>
            )
          } else if (element.classList.contains("education-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-3">Education</h2>
                <div className="space-y-4">
                  {Array.from(element.children).map((child, childIndex) => (
                    <div key={childIndex} dangerouslySetInnerHTML={{ __html: child.innerHTML }} className="mb-4" />
                  ))}
                </div>
              </div>
            )
          } else if (element.classList.contains("skills-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-3">Skills</h2>
                <div dangerouslySetInnerHTML={{ __html: element.innerHTML }} className={className} />
              </div>
            )
          } else if (element.classList.contains("languages-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-3">Languages</h2>
                <div dangerouslySetInnerHTML={{ __html: element.innerHTML }} className={className} />
              </div>
            )
          } else {
            return <div key={index} dangerouslySetInnerHTML={{ __html: element.outerHTML }} className={className} />
          }
        })}
      </div>
    </div>
  )
}

function ModernTemplate({
  data,
  pageNumber,
  elements,
  avatarUrl,
}: { data: ResumeData; pageNumber: number; elements: HTMLElement[]; avatarUrl: string }) {
  return (
    <div className="font-sans h-full ats-friendly-content" style={{ backgroundColor: "white" }}>
      {pageNumber === 1 ? (
        // First page header
        <div className="bg-gray-800 text-white p-6 text-center">
          <img
            src={avatarUrl || "/placeholder.svg"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-white mx-auto mb-3"
          />
          <h1 className="text-2xl font-bold">
            {data.personal.firstName} {data.personal.lastName}
          </h1>
          <p className="text-lg text-gray-300">{data.personal.jobTitle}</p>
          <div className="flex justify-center gap-3 mt-2 text-sm text-gray-300">
            <span>{data.personal.email}</span>
            <span>•</span>
            <span>{data.personal.phone}</span>
          </div>
        </div>
      ) : (
        // Continuation page header
        <div className="bg-gray-800 text-white p-4">
          <h1 className="text-xl font-bold">
            {data.personal.firstName} {data.personal.lastName} - Page {pageNumber}
          </h1>
        </div>
      )}

      <div className="p-6 dynamic-content">
        {elements.map((element, index) => {
          // Extract the class names from the element
          const className = element.className || ""

          // Create a properly styled version based on element type
          if (element.classList.contains("profile-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-3 text-gray-800">About Me</h2>
                <div dangerouslySetInnerHTML={{ __html: element.innerHTML }} className={className} />
              </div>
            )
          } else if (element.classList.contains("experience-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-3 text-gray-800">Experience</h2>
                <div className="space-y-4">
                  {Array.from(element.children).map((child, childIndex) => (
                    <div key={childIndex} dangerouslySetInnerHTML={{ __html: child.innerHTML }} className="mb-4" />
                  ))}
                </div>
              </div>
            )
          } else if (element.classList.contains("education-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-3 text-gray-800">Education</h2>
                <div className="space-y-4">
                  {Array.from(element.children).map((child, childIndex) => (
                    <div key={childIndex} dangerouslySetInnerHTML={{ __html: child.innerHTML }} className="mb-4" />
                  ))}
                </div>
              </div>
            )
          } else if (element.classList.contains("skills-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-3 text-gray-800">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )
          } else if (element.classList.contains("languages-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-3 text-gray-800">Languages</h2>
                <div className="space-y-1" dangerouslySetInnerHTML={{ __html: element.innerHTML }} />
              </div>
            )
          } else {
            return <div key={index} dangerouslySetInnerHTML={{ __html: element.outerHTML }} className={className} />
          }
        })}
      </div>
    </div>
  )
}

function MinimalTemplate({
  data,
  pageNumber,
  elements,
  avatarUrl,
}: { data: ResumeData; pageNumber: number; elements: HTMLElement[]; avatarUrl: string }) {
  return (
    <div className="p-6 font-sans h-full ats-friendly-content" style={{ backgroundColor: "white" }}>
      {pageNumber === 1 ? (
        // First page header
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-2xl font-bold">
            {data.personal.firstName} {data.personal.lastName}
          </h1>
          <p className="text-gray-600">{data.personal.jobTitle}</p>
          <div className="flex gap-4 mt-2 text-sm text-gray-600">
            <span>{data.personal.email}</span>
            <span>{data.personal.phone}</span>
            <span>{data.personal.address}</span>
          </div>
        </div>
      ) : (
        // Continuation page header
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-xl font-bold">
            {data.personal.firstName} {data.personal.lastName} - Page {pageNumber}
          </h1>
        </div>
      )}

      <div className="dynamic-content">
        {elements.map((element, index) => {
          // Extract the class names from the element
          const className = element.className || ""

          // Create a properly styled version based on element type
          if (element.classList.contains("profile-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-md font-semibold uppercase tracking-wider mb-3">Profile</h2>
                <div dangerouslySetInnerHTML={{ __html: element.innerHTML }} className={className} />
              </div>
            )
          } else if (element.classList.contains("experience-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-md font-semibold uppercase tracking-wider mb-3">Experience</h2>
                <div className="space-y-4">
                  {Array.from(element.children).map((child, childIndex) => (
                    <div key={childIndex} dangerouslySetInnerHTML={{ __html: child.innerHTML }} className="mb-4" />
                  ))}
                </div>
              </div>
            )
          } else if (element.classList.contains("education-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-md font-semibold uppercase tracking-wider mb-3">Education</h2>
                <div className="space-y-4">
                  {Array.from(element.children).map((child, childIndex) => (
                    <div key={childIndex} dangerouslySetInnerHTML={{ __html: child.innerHTML }} className="mb-4" />
                  ))}
                </div>
              </div>
            )
          } else if (element.classList.contains("skills-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-md font-semibold uppercase tracking-wider mb-3">Skills</h2>
                <div className="space-y-1" dangerouslySetInnerHTML={{ __html: element.innerHTML }} />
              </div>
            )
          } else if (element.classList.contains("languages-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-md font-semibold uppercase tracking-wider mb-3">Languages</h2>
                <div className="space-y-1" dangerouslySetInnerHTML={{ __html: element.innerHTML }} />
              </div>
            )
          } else {
            return <div key={index} dangerouslySetInnerHTML={{ __html: element.outerHTML }} className={className} />
          }
        })}
      </div>
    </div>
  )
}

function CreativeTemplate({
  data,
  pageNumber,
  elements,
  avatarUrl,
}: { data: ResumeData; pageNumber: number; elements: HTMLElement[]; avatarUrl: string }) {
  return (
    <div className="font-sans h-full ats-friendly-content" style={{ backgroundColor: "white" }}>
      {pageNumber === 1 ? (
        // First page header
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 text-center">
          <img
            src={avatarUrl || "/placeholder.svg"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-white mx-auto mb-3"
          />
          <h1 className="text-2xl font-bold">
            {data.personal.firstName} {data.personal.lastName}
          </h1>
          <p className="text-lg">{data.personal.jobTitle}</p>
          <div className="flex justify-center gap-4 mt-3 text-sm">
            <span>{data.personal.email}</span>
            <span>{data.personal.phone}</span>
          </div>
        </div>
      ) : (
        // Continuation page header
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4">
          <h1 className="text-xl font-bold">
            {data.personal.firstName} {data.personal.lastName} - Page {pageNumber}
          </h1>
        </div>
      )}

      <div className="p-6 dynamic-content">
        {elements.map((element, index) => {
          // Extract the class names from the element
          const className = element.className || ""

          // Create a properly styled version based on element type
          if (element.classList.contains("profile-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-semibold text-green-600 mb-3">About Me</h2>
                <div dangerouslySetInnerHTML={{ __html: element.innerHTML }} className={className} />
              </div>
            )
          } else if (element.classList.contains("experience-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-semibold text-green-600 mb-3">Experience</h2>
                <div className="space-y-4">
                  {Array.from(element.children).map((child, childIndex) => (
                    <div
                      key={childIndex}
                      className="border-l-2 border-green-200 pl-4 mb-4"
                      dangerouslySetInnerHTML={{ __html: child.innerHTML }}
                    />
                  ))}
                </div>
              </div>
            )
          } else if (element.classList.contains("education-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-semibold text-green-600 mb-3">Education</h2>
                <div className="space-y-4">
                  {Array.from(element.children).map((child, childIndex) => (
                    <div
                      key={childIndex}
                      className="border-l-2 border-green-200 pl-4 mb-4"
                      dangerouslySetInnerHTML={{ __html: child.innerHTML }}
                    />
                  ))}
                </div>
              </div>
            )
          } else if (element.classList.contains("skills-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-semibold text-green-600 mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )
          } else if (element.classList.contains("languages-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-semibold text-green-600 mb-3">Languages</h2>
                <div className="space-y-1" dangerouslySetInnerHTML={{ __html: element.innerHTML }} />
              </div>
            )
          } else {
            return <div key={index} dangerouslySetInnerHTML={{ __html: element.outerHTML }} className={className} />
          }
        })}
      </div>
    </div>
  )
}

function ExecutiveTemplate({
  data,
  pageNumber,
  elements,
  avatarUrl,
}: { data: ResumeData; pageNumber: number; elements: HTMLElement[]; avatarUrl: string }) {
  return (
    <div className="font-serif h-full ats-friendly-content" style={{ backgroundColor: "white" }}>
      {pageNumber === 1 ? (
        // First page header
        <div className="bg-gray-900 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">
                {data.personal.firstName} {data.personal.lastName}
              </h1>
              <p className="text-lg text-gray-300">{data.personal.jobTitle}</p>
            </div>
            <div className="text-right text-sm">
              <p>{data.personal.email}</p>
              <p>{data.personal.phone}</p>
              <p>{data.personal.address}</p>
            </div>
          </div>
        </div>
      ) : (
        // Continuation page header
        <div className="bg-gray-900 text-white p-4">
          <h1 className="text-xl font-bold">
            {data.personal.firstName} {data.personal.lastName} - Page {pageNumber}
          </h1>
        </div>
      )}

      <div className="p-6 dynamic-content">
        {elements.map((element, index) => {
          // Extract the class names from the element
          const className = element.className || ""

          // Create a properly styled version based on element type
          if (element.classList.contains("profile-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">Professional Summary</h2>
                <div dangerouslySetInnerHTML={{ __html: element.innerHTML }} className={className} />
              </div>
            )
          } else if (element.classList.contains("experience-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">Professional Experience</h2>
                <div className="space-y-5">
                  {Array.from(element.children).map((child, childIndex) => (
                    <div key={childIndex} dangerouslySetInnerHTML={{ __html: child.innerHTML }} className="mb-4" />
                  ))}
                </div>
              </div>
            )
          } else if (element.classList.contains("education-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">Education</h2>
                <div className="space-y-4">
                  {Array.from(element.children).map((child, childIndex) => (
                    <div key={childIndex} dangerouslySetInnerHTML={{ __html: child.innerHTML }} className="mb-4" />
                  ))}
                </div>
              </div>
            )
          } else if (element.classList.contains("skills-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">Skills & Expertise</h2>
                <div className="space-y-1" dangerouslySetInnerHTML={{ __html: element.innerHTML }} />
              </div>
            )
          } else if (element.classList.contains("languages-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">Languages</h2>
                <div className="space-y-1" dangerouslySetInnerHTML={{ __html: element.innerHTML }} />
              </div>
            )
          } else {
            return <div key={index} dangerouslySetInnerHTML={{ __html: element.outerHTML }} className={className} />
          }
        })}
      </div>
    </div>
  )
}

function AcademicTemplate({
  data,
  pageNumber,
  elements,
  avatarUrl,
}: { data: ResumeData; pageNumber: number; elements: HTMLElement[]; avatarUrl: string }) {
  return (
    <div className="p-6 font-serif h-full ats-friendly-content" style={{ backgroundColor: "white" }}>
      {pageNumber === 1 ? (
        // First page header
        <div className="text-center border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-2xl font-bold">
            {data.personal.firstName} {data.personal.lastName}
          </h1>
          <p className="text-lg">{data.personal.jobTitle}</p>
          <div className="mt-2 text-sm">
            <p>{data.personal.address}</p>
            <p>
              {data.personal.email} | {data.personal.phone}
            </p>
          </div>
        </div>
      ) : (
        // Continuation page header
        <div className="text-center border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-xl font-bold">
            {data.personal.firstName} {data.personal.lastName} - Page {pageNumber}
          </h1>
        </div>
      )}

      <div className="dynamic-content">
        {elements.map((element, index) => {
          // Extract the class names from the element
          const className = element.className || ""

          // Create a properly styled version based on element type
          if (element.classList.contains("profile-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-md font-bold uppercase tracking-wider mb-3">Profile</h2>
                <div
                  className="border-l-2 border-gray-300 pl-4"
                  dangerouslySetInnerHTML={{ __html: element.innerHTML }}
                />
              </div>
            )
          } else if (element.classList.contains("experience-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-md font-bold uppercase tracking-wider mb-3">Professional Experience</h2>
                <div className="space-y-4">
                  {Array.from(element.children).map((child, childIndex) => (
                    <div
                      key={childIndex}
                      className="border-l-2 border-gray-300 pl-4 mb-4"
                      dangerouslySetInnerHTML={{ __html: child.innerHTML }}
                    />
                  ))}
                </div>
              </div>
            )
          } else if (element.classList.contains("education-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-md font-bold uppercase tracking-wider mb-3">Education</h2>
                <div className="space-y-4">
                  {Array.from(element.children).map((child, childIndex) => (
                    <div
                      key={childIndex}
                      className="border-l-2 border-gray-300 pl-4 mb-4"
                      dangerouslySetInnerHTML={{ __html: child.innerHTML }}
                    />
                  ))}
                </div>
              </div>
            )
          } else if (element.classList.contains("skills-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-md font-bold uppercase tracking-wider mb-3">Skills</h2>
                <div className="border-l-2 border-gray-300 pl-4">
                  <ul className="list-disc ml-4 space-y-1" dangerouslySetInnerHTML={{ __html: element.innerHTML }} />
                </div>
              </div>
            )
          } else if (element.classList.contains("languages-section")) {
            return (
              <div key={index} className="mb-6">
                <h2 className="text-md font-bold uppercase tracking-wider mb-3">Languages</h2>
                <div className="border-l-2 border-gray-300 pl-4">
                  <ul className="list-disc ml-4 space-y-1" dangerouslySetInnerHTML={{ __html: element.innerHTML }} />
                </div>
              </div>
            )
          } else {
            return <div key={index} dangerouslySetInnerHTML={{ __html: element.outerHTML }} className={className} />
          }
        })}
      </div>
    </div>
  )
}

// Fallback templates (used if dynamic pagination fails)
function ProfessionalTemplateFallback({
  data,
  currentPage,
  avatarUrl,
}: { data: ResumeData; currentPage: number; avatarUrl: string }) {
  if (currentPage === 1) {
    return (
      <div className="p-6 font-sans" style={{ backgroundColor: "white", height: "100%" }}>
        <div className="flex items-center border-b pb-4 mb-6">
          <div className="mr-4">
            <img
              src={avatarUrl || "/placeholder.svg"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {data.personal.firstName} {data.personal.lastName}
            </h1>
            <p className="text-lg text-gray-600">{data.personal.jobTitle}</p>
          </div>
          <div className="ml-auto">
            <Check className="h-6 w-6 text-green-600" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Contact</h2>
              <div className="space-y-1 text-sm">
                <p>{data.personal.address}</p>
                <p>{data.personal.email}</p>
                <p>{data.personal.phone}</p>
                <p>{data.personal.website}</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Skills</h2>
              <ul className="space-y-1">
                {data.skills.map((skill, index) => (
                  <li key={index} className="text-sm">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Languages</h2>
              <ul className="space-y-1">
                {data.languages.map((lang, index) => (
                  <li key={index} className="text-sm">
                    {lang.language} - {lang.proficiency}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-span-2">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Profile</h2>
              <p className="text-sm">{data.personal.bio}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Experience</h2>
              <div className="space-y-4">
                {data.experience.slice(0, 2).map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between">
                      <h3 className="font-medium">{exp.title}</h3>
                      <span className="text-sm text-gray-600">
                        {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                      {exp.company}, {exp.location}
                    </p>
                    <p className="text-sm mt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">Education</h2>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <div className="flex justify-between">
                      <h3 className="font-medium">{edu.degree}</h3>
                      <span className="text-sm text-gray-600">
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                      {edu.institution}, {edu.location}
                    </p>
                    <p className="text-sm mt-1">{edu.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    // Second page content (additional experiences, projects, etc.)
    return (
      <div className="p-6 font-sans" style={{ backgroundColor: "white", height: "100%" }}>
        <h1 className="text-xl font-bold mb-4">
          {data.personal.firstName} {data.personal.lastName} - Continued
        </h1>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Additional Experience</h2>
          <div className="space-y-4">
            {data.experience.slice(2).map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between">
                  <h3 className="font-medium">{exp.title}</h3>
                  <span className="text-sm text-gray-600">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-600">
                  {exp.company}, {exp.location}
                </p>
                <p className="text-sm mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">References</h2>
          <p className="text-sm italic">References available upon request</p>
        </div>
      </div>
    )
  }
}

function ModernTemplateFallback({
  data,
  currentPage,
  avatarUrl,
}: { data: ResumeData; currentPage: number; avatarUrl: string }) {
  if (currentPage === 1) {
    return (
      <div className="font-sans" style={{ backgroundColor: "white", height: "100%" }}>
        <div className="bg-gray-800 text-white p-6 text-center">
          <img
            src={avatarUrl || "/placeholder.svg"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-white mx-auto mb-3"
          />
          <h1 className="text-2xl font-bold">
            {data.personal.firstName} {data.personal.lastName}
          </h1>
          <p className="text-lg text-gray-300">{data.personal.jobTitle}</p>
          <div className="flex justify-center gap-3 mt-2 text-sm text-gray-300">
            <span>{data.personal.email}</span>
            <span>•</span>
            <span>{data.personal.phone}</span>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-3">About Me</h2>
            <p className="text-sm">{data.personal.bio}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-3">Experience</h2>
            <div className="space-y-4">
              {data.experience.slice(0, 2).map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium">{exp.title}</h3>
                    <span className="text-sm text-gray-600">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-600">
                    {exp.company}, {exp.location}
                  </p>
                  <p className="text-sm mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-3">Education</h2>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-medium">{edu.degree}</h3>
                    <p className="text-sm text-gray-600">
                      {edu.institution}, {edu.location}
                    </p>
                    <p className="text-sm text-gray-600">
                      {edu.startDate} - {edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                    {skill}
                  </span>
                ))}
              </div>

              <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-3 mt-4">Languages</h2>
              <div className="space-y-1">
                {data.languages.map((lang, index) => (
                  <p key={index} className="text-sm">
                    {lang.language} - {lang.proficiency}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    // Second page content
    return (
      <div className="p-6 font-sans" style={{ backgroundColor: "white", height: "100%" }}>
        <h1 className="text-xl font-bold mb-4">
          {data.personal.firstName} {data.personal.lastName} - Page 2
        </h1>

        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-3">Additional Experience</h2>
          <div className="space-y-4">
            {data.experience.slice(2).map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between">
                  <h3 className="font-medium">{exp.title}</h3>
                  <span className="text-sm text-gray-600">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {exp.company}, {exp.location}
                </p>
                <p className="text-sm mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

function MinimalTemplateFallback({
  data,
  currentPage,
  avatarUrl,
}: { data: ResumeData; currentPage: number; avatarUrl: string }) {
  if (currentPage === 1) {
    return (
      <div className="p-6 font-sans" style={{ backgroundColor: "white", height: "100%" }}>
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-2xl font-bold">
            {data.personal.firstName} {data.personal.lastName}
          </h1>
          <p className="text-gray-600">{data.personal.jobTitle}</p>
          <div className="flex gap-4 mt-2 text-sm text-gray-600">
            <span>{data.personal.email}</span>
            <span>{data.personal.phone}</span>
            <span>{data.personal.address}</span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-md font-semibold uppercase tracking-wider mb-3">Profile</h2>
          <p className="text-sm">{data.personal.bio}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-md font-semibold uppercase tracking-wider mb-3">Experience</h2>
          <div className="space-y-4">
            {data.experience.slice(0, 2).map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between">
                  <h3 className="font-medium">{exp.title}</h3>
                  <span className="text-sm text-gray-600">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {exp.company}, {exp.location}
                </p>
                <p className="text-sm mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-md font-semibold uppercase tracking-wider mb-3">Education</h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <h3 className="font-medium">{edu.degree}</h3>
                  <p className="text-sm text-gray-600">
                    {edu.institution}, {edu.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-md font-semibold uppercase tracking-wider mb-3">Skills</h2>
            <div className="space-y-1">
              {data.skills.map((skill, index) => (
                <p key={index} className="text-sm">
                  {skill}
                </p>
              ))}
            </div>

            <h2 className="text-md font-semibold uppercase tracking-wider mb-3 mt-4">Languages</h2>
            <div className="space-y-1">
              {data.languages.map((lang, index) => (
                <p key={index} className="text-sm">
                  {lang.language} - {lang.proficiency}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="p-6 font-sans" style={{ backgroundColor: "white", height: "100%" }}>
        <h1 className="text-xl font-bold mb-4">
          {data.personal.firstName} {data.personal.lastName} - Continued
        </h1>
        <div className="mb-6">
          <h2 className="text-md font-semibold uppercase tracking-wider mb-3">Additional Experience</h2>
          <div className="space-y-4">
            {data.experience.slice(2).map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between">
                  <h3 className="font-medium">{exp.title}</h3>
                  <span className="text-sm text-gray-600">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {exp.company}, {exp.location}
                </p>
                <p className="text-sm mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

function CreativeTemplateFallback({
  data,
  currentPage,
  avatarUrl,
}: { data: ResumeData; currentPage: number; avatarUrl: string }) {
  if (currentPage === 1) {
    return (
      <div className="font-sans" style={{ backgroundColor: "white", height: "100%" }}>
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 text-center">
          <img
            src={avatarUrl || "/placeholder.svg"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-white mx-auto mb-3"
          />
          <h1 className="text-2xl font-bold">
            {data.personal.firstName} {data.personal.lastName}
          </h1>
          <p className="text-lg">{data.personal.jobTitle}</p>
          <div className="flex justify-center gap-4 mt-3 text-sm">
            <span>{data.personal.email}</span>
            <span>{data.personal.phone}</span>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-green-600 mb-3">About Me</h2>
            <p className="text-sm">{data.personal.bio}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-green-600 mb-3">Experience</h2>
            <div className="space-y-4">
              {data.experience.slice(0, 2).map((exp, index) => (
                <div key={index} className="border-l-2 border-green-200 pl-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium">{exp.title}</h3>
                    <span className="text-sm text-gray-600">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-600">
                    {exp.company}, {exp.location}
                  </p>
                  <p className="text-sm mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-green-600 mb-3">Education</h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="border-l-2 border-green-200 pl-4">
                  <h3 className="font-medium">{edu.degree}</h3>
                  <p className="text-sm text-gray-600">
                    {edu.institution}, {edu.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-green-600 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                  {skill}
                </span>
              ))}
            </div>

            <h2 className="text-lg font-semibold text-green-600 mb-3 mt-4">Languages</h2>
            <div className="space-y-1">
              {data.languages.map((lang, index) => (
                <p key={index} className="text-sm">
                  {lang.language} - {lang.proficiency}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="p-6 font-sans" style={{ backgroundColor: "white", height: "100%" }}>
        <h1 className="text-xl font-bold text-green-600 mb-4">
          {data.personal.firstName} {data.personal.lastName} - Page 2
        </h1>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-green-600 mb-3">Additional Experience</h2>
          <div className="space-y-4">
            {data.experience.slice(2).map((exp, index) => (
              <div key={index} className="border-l-2 border-green-200 pl-4">
                <div className="flex justify-between">
                  <h3 className="font-medium">{exp.title}</h3>
                  <span className="text-sm text-gray-600">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {exp.company}, {exp.location}
                </p>
                <p className="text-sm mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

function ExecutiveTemplateFallback({
  data,
  currentPage,
  avatarUrl,
}: { data: ResumeData; currentPage: number; avatarUrl: string }) {
  if (currentPage === 1) {
    return (
      <div className="font-serif" style={{ backgroundColor: "white", height: "100%" }}>
        <div className="bg-gray-900 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">
                {data.personal.firstName} {data.personal.lastName}
              </h1>
              <p className="text-lg text-gray-300">{data.personal.jobTitle}</p>
            </div>
            <div className="text-right text-sm">
              <p>{data.personal.email}</p>
              <p>{data.personal.phone}</p>
              <p>{data.personal.address}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">Professional Summary</h2>
            <p className="text-sm">{data.personal.bio}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">Professional Experience</h2>
            <div className="space-y-5">
              {data.experience.slice(0, 2).map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between">
                    <h3 className="font-bold">{exp.title}</h3>
                    <span className="text-sm">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <p className="text-sm font-semibold">
                    {exp.company}, {exp.location}
                  </p>
                  <p className="text-sm mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">Education</h2>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-bold">{edu.degree}</h3>
                    <p className="text-sm">
                      {edu.institution}, {edu.location}
                    </p>
                    <p className="text-sm">
                      {edu.startDate} - {edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">Skills & Expertise</h2>
              <div className="space-y-1">
                {data.skills.map((skill, index) => (
                  <p key={index} className="text-sm">
                    {skill}
                  </p>
                ))}
              </div>

              <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3 mt-4">Languages</h2>
              <div className="space-y-1">
                {data.languages.map((lang, index) => (
                  <p key={index} className="text-sm">
                    {lang.language} - {lang.proficiency}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="p-6 font-serif" style={{ backgroundColor: "white", height: "100%" }}>
        <h1 className="text-xl font-bold mb-4">
          {data.personal.firstName} {data.personal.lastName} - Continued
        </h1>
        <div className="mb-6">
          <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">Additional Experience</h2>
          <div className="space-y-5">
            {data.experience.slice(2).map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between">
                  <h3 className="font-bold">{exp.title}</h3>
                  <span className="text-sm">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="text-sm font-semibold">
                  {exp.company}, {exp.location}
                </p>
                <p className="text-sm mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

function AcademicTemplateFallback({
  data,
  currentPage,
  avatarUrl,
}: { data: ResumeData; currentPage: number; avatarUrl: string }) {
  if (currentPage === 1) {
    return (
      <div className="p-6 font-serif" style={{ backgroundColor: "white", height: "100%" }}>
        <div className="text-center border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-2xl font-bold">
            {data.personal.firstName} {data.personal.lastName}
          </h1>
          <p className="text-lg">{data.personal.jobTitle}</p>
          <div className="mt-2 text-sm">
            <p>{data.personal.address}</p>
            <p>
              {data.personal.email} | {data.personal.phone}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-md font-bold uppercase tracking-wider mb-3">Education</h2>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index} className="border-l-2 border-gray-300 pl-4">
                <div className="flex justify-between">
                  <h3 className="font-bold">{edu.degree}</h3>
                  <span className="text-sm">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <p className="text-sm">
                  {edu.institution}, {edu.location}
                </p>
                <p className="text-sm mt-1">{edu.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-md font-bold uppercase tracking-wider mb-3">Professional Experience</h2>
          <div className="space-y-4">
            {data.experience.slice(0, 2).map((exp, index) => (
              <div key={index} className="border-l-2 border-gray-300 pl-4">
                <div className="flex justify-between">
                  <h3 className="font-bold">{exp.title}</h3>
                  <span className="text-sm">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="text-sm">
                  {exp.company}, {exp.location}
                </p>
                <p className="text-sm mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-md font-bold uppercase tracking-wider mb-3">Skills</h2>
            <div className="border-l-2 border-gray-300 pl-4">
              <ul className="list-disc ml-4 space-y-1">
                {data.skills.map((skill, index) => (
                  <li key={index} className="text-sm">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-md font-bold uppercase tracking-wider mb-3">Languages</h2>
            <div className="border-l-2 border-gray-300 pl-4">
              <ul className="list-disc ml-4 space-y-1">
                {data.languages.map((lang, index) => (
                  <li key={index} className="text-sm">
                    {lang.language} - {lang.proficiency}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="p-6 font-serif" style={{ backgroundColor: "white", height: "100%" }}>
        <h1 className="text-xl font-bold mb-4">
          {data.personal.firstName} {data.personal.lastName} - Continued
        </h1>
        <div className="mb-6">
          <h2 className="text-md font-bold uppercase tracking-wider mb-3">Additional Experience</h2>
          <div className="space-y-4">
            {data.experience.slice(2).map((exp, index) => (
              <div key={index} className="border-l-2 border-gray-300 pl-4">
                <div className="flex justify-between">
                  <h3 className="font-bold">{exp.title}</h3>
                  <span className="text-sm">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="text-sm">
                  {exp.company}, {exp.location}
                </p>
                <p className="text-sm mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

