"use client"

import { useEffect, useState, useRef, forwardRef } from "react"
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

const usePageOverflow = (data: ResumeData) => { // Accept data as a dependency
  const containerRef = useRef<HTMLDivElement>(null);
  const [overflowIndex, setOverflowIndex] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [splitSection, setSplitSection] = useState<number[] | null>([]);
  const [sectionBreakIndex, setSectionBreakIndex] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      setHeight(containerRef.current.offsetHeight);
    }
  }, []); // Runs once on mount

  useEffect(() => {
    if (containerRef.current && height !== null) {
      const maxHeight = height ?? 1123;
      let sectionHeights: Record<string, number> = {}; // Stores heights of sections
      
      if (containerRef.current.scrollHeight > maxHeight) {
        let totalHeight = 0;
        const containerElement = containerRef.current?.firstElementChild as HTMLDivElement | null;

        totalHeight += containerElement?.offsetHeight ?? 0;
        console.log(totalHeight);
        if (totalHeight > maxHeight) {
          const pages = Math.ceil(totalHeight / maxHeight);
          setOverflowIndex(pages);
        }

        const sections = Array.from(containerElement?.querySelector('.grid')?.querySelectorAll('.content') ?? []) as HTMLDivElement[];
        // const sectionHeights: Record<string, number> = {};

        sections.forEach((section) => {
          const sects = Array.from(section.children) as HTMLElement[];
          // console.log(sect)
          
          if (sects) {
            sects.forEach((sect) => {
              const sectionName = sect.getAttribute("data-section") || "unknown";
              const sectionHeight = sect.offsetHeight;
              sectionHeights[sectionName] = sectionHeight;
            })
            sectionHeights['total'] = maxHeight;
            setSplitSection(sectionHeights);
          }
        });

        console.log("Section Heights:", sectionHeights);
      } else {
        setOverflowIndex(null);
      }
    }
  }, [height, data]); // 👈 Re-run when `height` or `data` updates

  return { containerRef, overflowIndex, splitSection };
};

export function ResumePreview({ data, template, currentPage, onPagesChange }: ResumePreviewProps) {
  const [avatarUrl, setAvatarUrl] = useState("/placeholder.svg?height=150&width=150")
  const { containerRef, overflowIndex, splitSection } = usePageOverflow(data);

  useEffect(() => {
    // In a real app, this would calculate the number of pages based on content
    console.log(overflowIndex)
    onPagesChange(overflowIndex ? overflowIndex : 1)
  }, [data, onPagesChange, overflowIndex])

  // Render different templates based on the template prop
  switch (template) {
    case "professional":
      return <ProfessionalTemplate ref={containerRef} data={data} sectionSizes={splitSection} totalPages={overflowIndex ? overflowIndex : 1} currentPage={currentPage} avatarUrl={avatarUrl} />
    case "modern":
      return <ModernTemplate data={data} currentPage={currentPage} avatarUrl={avatarUrl} />
    case "minimal":
      return <MinimalTemplate data={data} currentPage={currentPage} avatarUrl={avatarUrl} />
    case "creative":
      return <CreativeTemplate data={data} currentPage={currentPage} avatarUrl={avatarUrl} />
    case "executive":
      return <ExecutiveTemplate data={data} currentPage={currentPage} avatarUrl={avatarUrl} />
    case "academic":
      return <AcademicTemplate data={data} currentPage={currentPage} avatarUrl={avatarUrl} />
    default:
      return <ProfessionalTemplate ref={containerRef} data={data} sectionSizes={splitSection} currentPage={currentPage} avatarUrl={avatarUrl} />
  }
}

const ProfessionalTemplate = forwardRef<HTMLDivElement, { data: ResumeData; currentPage: number; avatarUrl: string, totalPages?: number, sectionSizes?: Record<string, number> }>(
  ({ data, currentPage, avatarUrl, totalPages, sectionSizes }, ref) => {
    const [firstPageExp, setFirstPageExp] = useState(data.experience);
    const [firstPageEducation, setFirstPageEducation] = useState(data.education);
    let whatsLeft = 5;

    const sectionSettings = {
      contact: 148,
      education: 192,
      experience: 312,
      languages: 100,
      profile: 100,
      skills: 152,
    };

    useEffect(() => {
      console.log("Current Page:", currentPage);
      
      let experienceList = [...data.experience]; // Clone the experience array
      let educationList = [...data.education]; // Clone the education array
      let totalHeight = 
        sectionSizes?.profile + 
        sectionSizes?.education + 
        sectionSizes?.experience;

      if (sectionSizes?.experience) {
        const experienceItemHeight = sectionSettings.experience / whatsLeft; // Average expected height per experience item
        let newExperienceHeight = sectionSizes?.experience;
        let newExperienceItemHeight = sectionSizes?.experience / experienceList.length;
        whatsLeft = Math.floor((sectionSizes?.total - sectionSizes?.profile - (experienceItemHeight * 7)) / newExperienceItemHeight);
        console.log(whatsLeft, sectionSizes?.total, newExperienceItemHeight, experienceItemHeight)
        // while (
        //   newExperienceHeight > (sectionSizes?.total - (newExperienceItemHeight * 2)) 
        // ) {
        //   console.log("Reducing experience height:", experienceList.length);
        //   experienceList.pop(); // Remove the last item to reduce height
        //   newExperienceHeight -= newExperienceItemHeight; // Decrease total experience height
        // }
      }
      setFirstPageExp(experienceList.slice(0, whatsLeft));
      console.log(experienceList.slice(0, whatsLeft))
      setFirstPageEducation(experienceList.length < data.experience.length ? [] : educationList);
      
    }, [currentPage, data, sectionSizes]);

    
  if (currentPage === 1) {
    return (
      <div ref={ref} className="p-6 font-sans resume-container">
        <div className="children">
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
          <div className="content col-span-1">
            <div data-section="contact" className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Contact</h2>
              <div className="space-y-1 text-sm">
                <p>{data.personal.address}</p>
                <p>{data.personal.email}</p>
                <p>{data.personal.phone}</p>
                <p>{data.personal.website}</p>
              </div>
            </div>

            <div data-section="skills" className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Skills</h2>
              <ul className="space-y-1">
                {data.skills.map((skill, index) => (
                  <li key={index} className="text-sm">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            <div data-section="languages">
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

          <div data-section="main-content" className="content col-span-2">
            <div data-section="profile" className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Profile</h2>
              <p className="text-sm">{data.personal.bio}</p>
            </div>

            <div data-section="experience" className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Experience</h2>
              <div className="space-y-4">
                {firstPageExp?.map((exp, index) => (
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

            {firstPageEducation.length > 0 && (
              <div data-section="education" className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Education</h2>
                <div className="space-y-4">
                  {firstPageEducation.map((edu, index) => (
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
            )}
          </div>
        </div>
        </div>
      </div>
    )
  } else {
    // Second page content (additional experiences, projects, etc.)
    return (
      <div className="p-6 font-sans">
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
})

function ModernTemplate({
  data,
  currentPage,
  avatarUrl,
}: { data: ResumeData; currentPage: number; avatarUrl: string }) {
  if (currentPage === 1) {
    return (
      <div className="font-sans">
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
              {data.experience.map((exp, index) => (
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
      <div className="p-6 font-sans">
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
                <p className="text-sm font-medium text-gray-600">
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

function MinimalTemplate({
  data,
  currentPage,
  avatarUrl,
}: { data: ResumeData; currentPage: number; avatarUrl: string }) {
  if (currentPage === 1) {
    return (
      <div className="p-6 font-sans">
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
            {data.experience.map((exp, index) => (
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
      <div className="p-6 font-sans">
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

function CreativeTemplate({
  data,
  currentPage,
  avatarUrl,
}: { data: ResumeData; currentPage: number; avatarUrl: string }) {
  if (currentPage === 1) {
    return (
      <div className="font-sans">
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
              {data.experience.map((exp, index) => (
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
      <div className="p-6 font-sans">
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

function ExecutiveTemplate({
  data,
  currentPage,
  avatarUrl,
}: { data: ResumeData; currentPage: number; avatarUrl: string }) {
  if (currentPage === 1) {
    return (
      <div className="font-serif">
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
              {data.experience.map((exp, index) => (
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
      <div className="p-6 font-serif">
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

function AcademicTemplate({
  data,
  currentPage,
  avatarUrl,
}: { data: ResumeData; currentPage: number; avatarUrl: string }) {
  if (currentPage === 1) {
    return (
      <div className="p-6 font-serif">
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
            {data.experience.map((exp, index) => (
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
      <div className="p-6 font-serif">
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

