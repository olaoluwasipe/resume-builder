import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">ResumeBuilder</h1>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto py-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Create Professional Resumes in Minutes</h2>
            <p className="text-xl text-gray-600 mb-8">
              Choose from proven templates, edit with ease, and download your perfect resume
            </p>
            <Link href="/templates">
              <Button size="lg" className="gap-2 cursor-pointer">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="bg-gray-50 py-16 px-6">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                title="Professional Templates"
                description="Choose from multiple professionally designed templates that employers love."
                icon="📄"
              />
              <FeatureCard
                title="AI-Powered Assistance"
                description="Get smart suggestions for your experience, skills, and more with our AI tools."
                icon="🤖"
              />
              <FeatureCard
                title="Easy Editing"
                description="Simple interface with real-time preview to perfect your resume."
                icon="✏️"
              />
              <FeatureCard
                title="Save & Edit Later"
                description="Create an account to save your progress and edit your resume anytime."
                icon="💾"
              />
              <FeatureCard
                title="Multiple Pages"
                description="Create comprehensive resumes with support for multiple pages."
                icon="📚"
              />
              <FeatureCard
                title="Download Options"
                description="Download your resume as PDF or print it directly from the browser."
                icon="⬇️"
              />
            </div>
          </div>
        </section>

        <section className="container mx-auto py-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Build Your Resume?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of job seekers who have created winning resumes with our platform
            </p>
            <Link href="/templates">
              <Button size="lg">Choose a Template</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600">© 2025 ResumeBuilder. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-gray-900">
                Terms
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

