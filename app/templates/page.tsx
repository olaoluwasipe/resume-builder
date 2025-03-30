import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function TemplatesPage() {
  const templates = [
    {
      id: "professional",
      name: "Professional",
      description: "A clean, traditional template perfect for corporate roles",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: "modern",
      name: "Modern",
      description: "A contemporary design with a creative touch",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "A simple, elegant template that lets your content shine",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: "creative",
      name: "Creative",
      description: "Stand out with this bold, unique design",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: "executive",
      name: "Executive",
      description: "Sophisticated template for senior positions",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: "academic",
      name: "Academic",
      description: "Ideal for academic and research positions",
      image: "/placeholder.svg?height=400&width=300",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold">ResumeBuilder</h1>
          </Link>
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

      <main className="flex-1 container mx-auto py-8 px-6">
        <h1 className="text-3xl font-bold mb-8">Choose a Template</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[3/4] relative bg-gray-50">
                {template.id === "professional" && (
                  <div className="absolute inset-0 p-4">
                    <div className="bg-white h-full rounded-md shadow-sm p-4 flex flex-col">
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-gray-200 mr-3"></div>
                        <div>
                          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 w-24 bg-gray-100 rounded"></div>
                        </div>
                      </div>
                      <div className="flex-1 flex">
                        <div className="w-1/3 pr-2">
                          <div className="h-3 w-full bg-gray-100 rounded mb-2"></div>
                          <div className="h-3 w-full bg-gray-100 rounded mb-2"></div>
                          <div className="h-3 w-full bg-gray-100 rounded mb-2"></div>
                          <div className="h-3 w-3/4 bg-gray-100 rounded mb-4"></div>

                          <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 w-full bg-gray-100 rounded mb-2"></div>
                          <div className="h-3 w-full bg-gray-100 rounded mb-2"></div>
                          <div className="h-3 w-3/4 bg-gray-100 rounded"></div>
                        </div>
                        <div className="w-2/3 pl-2">
                          <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 w-full bg-gray-100 rounded mb-2"></div>
                          <div className="h-3 w-full bg-gray-100 rounded mb-2"></div>
                          <div className="h-3 w-full bg-gray-100 rounded mb-4"></div>

                          <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 w-full bg-gray-100 rounded mb-2"></div>
                          <div className="h-3 w-full bg-gray-100 rounded mb-2"></div>
                          <div className="h-3 w-full bg-gray-100 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {template.id === "modern" && (
                  <div className="absolute inset-0 p-4">
                    <div className="bg-white h-full rounded-md shadow-sm overflow-hidden">
                      <div className="h-1/6 bg-gray-800"></div>
                      <div className="p-4 relative">
                        <div className="w-20 h-20 rounded-full bg-gray-200 absolute -top-10 left-4 border-4 border-white"></div>
                        <div className="pt-12">
                          <div className="h-4 w-32 bg-gray-800 rounded mb-2"></div>
                          <div className="h-3 w-24 bg-gray-400 rounded mb-4"></div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <div className="h-4 w-3/4 bg-gray-800 rounded mb-2"></div>
                              <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
                              <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
                              <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                            </div>
                            <div>
                              <div className="h-4 w-3/4 bg-gray-800 rounded mb-2"></div>
                              <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
                              <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
                              <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                            </div>
                          </div>

                          <div className="h-4 w-3/4 bg-gray-800 rounded mb-2"></div>
                          <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
                          <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
                          <div className="h-3 w-full bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {template.id === "minimal" && (
                  <div className="absolute inset-0 p-4">
                    <div className="bg-white h-full rounded-md shadow-sm p-4">
                      <div className="border-b border-gray-200 pb-4 mb-4">
                        <div className="h-5 w-40 bg-gray-800 rounded mb-2"></div>
                        <div className="h-3 w-32 bg-gray-400 rounded"></div>
                      </div>

                      <div className="mb-4">
                        <div className="h-4 w-24 bg-gray-800 rounded mb-2"></div>
                        <div className="h-3 w-full bg-gray-100 rounded mb-1"></div>
                        <div className="h-3 w-full bg-gray-100 rounded mb-1"></div>
                        <div className="h-3 w-3/4 bg-gray-100 rounded"></div>
                      </div>

                      <div className="mb-4">
                        <div className="h-4 w-24 bg-gray-800 rounded mb-2"></div>
                        <div className="flex justify-between mb-1">
                          <div className="h-3 w-32 bg-gray-800 rounded"></div>
                          <div className="h-3 w-24 bg-gray-400 rounded"></div>
                        </div>
                        <div className="h-3 w-40 bg-gray-400 rounded mb-1"></div>
                        <div className="h-3 w-full bg-gray-100 rounded mb-1"></div>
                        <div className="h-3 w-full bg-gray-100 rounded"></div>
                      </div>

                      <div>
                        <div className="h-4 w-24 bg-gray-800 rounded mb-2"></div>
                        <div className="flex justify-between mb-1">
                          <div className="h-3 w-32 bg-gray-800 rounded"></div>
                          <div className="h-3 w-24 bg-gray-400 rounded"></div>
                        </div>
                        <div className="h-3 w-40 bg-gray-400 rounded mb-1"></div>
                        <div className="h-3 w-full bg-gray-100 rounded"></div>
                      </div>
                    </div>
                  </div>
                )}

                {template.id === "creative" && (
                  <div className="absolute inset-0 p-4">
                    <div className="bg-white h-full rounded-md shadow-sm overflow-hidden">
                      <div className="h-1/3 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-white"></div>
                      </div>
                      <div className="p-4">
                        <div className="text-center mb-4">
                          <div className="h-5 w-40 bg-gray-800 rounded mb-2 mx-auto"></div>
                          <div className="h-3 w-32 bg-gray-400 rounded mx-auto"></div>
                        </div>

                        <div className="mb-4">
                          <div className="h-4 w-24 bg-purple-500 rounded mb-2"></div>
                          <div className="h-3 w-full bg-gray-100 rounded mb-1"></div>
                          <div className="h-3 w-full bg-gray-100 rounded"></div>
                        </div>

                        <div>
                          <div className="h-4 w-24 bg-purple-500 rounded mb-2"></div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            <div className="h-6 w-16 bg-pink-100 rounded-full"></div>
                            <div className="h-6 w-20 bg-purple-100 rounded-full"></div>
                            <div className="h-6 w-14 bg-pink-100 rounded-full"></div>
                            <div className="h-6 w-18 bg-purple-100 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {template.id === "executive" && (
                  <div className="absolute inset-0 p-4">
                    <div className="bg-white h-full rounded-md shadow-sm overflow-hidden">
                      <div className="h-1/6 bg-gray-900"></div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <div className="h-6 w-40 bg-gray-900 rounded mb-1"></div>
                            <div className="h-3 w-32 bg-gray-500 rounded"></div>
                          </div>
                          <div className="text-right">
                            <div className="h-3 w-32 bg-gray-300 rounded mb-1"></div>
                            <div className="h-3 w-24 bg-gray-300 rounded mb-1"></div>
                            <div className="h-3 w-28 bg-gray-300 rounded"></div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="h-4 w-32 bg-gray-900 rounded mb-2"></div>
                          <div className="h-3 w-full bg-gray-100 rounded mb-1"></div>
                          <div className="h-3 w-full bg-gray-100 rounded mb-1"></div>
                          <div className="h-3 w-3/4 bg-gray-100 rounded"></div>
                        </div>

                        <div>
                          <div className="h-4 w-32 bg-gray-900 rounded mb-2"></div>
                          <div className="flex justify-between mb-1">
                            <div className="h-3 w-40 bg-gray-700 rounded"></div>
                            <div className="h-3 w-24 bg-gray-400 rounded"></div>
                          </div>
                          <div className="h-3 w-48 bg-gray-400 rounded mb-1"></div>
                          <div className="h-3 w-full bg-gray-100 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {template.id === "academic" && (
                  <div className="absolute inset-0 p-4">
                    <div className="bg-white h-full rounded-md shadow-sm p-4">
                      <div className="text-center border-b border-gray-200 pb-4 mb-4">
                        <div className="h-5 w-48 bg-gray-800 rounded mb-2 mx-auto"></div>
                        <div className="h-3 w-40 bg-gray-500 rounded mx-auto mb-1"></div>
                        <div className="h-3 w-32 bg-gray-400 rounded mx-auto"></div>
                      </div>

                      <div className="mb-4">
                        <div className="h-4 w-40 bg-gray-800 rounded mb-2 uppercase text-xs font-bold"></div>
                        <div className="border-l-2 border-gray-300 pl-3 mb-2">
                          <div className="h-4 w-full bg-gray-700 rounded mb-1"></div>
                          <div className="h-3 w-40 bg-gray-400 rounded mb-1"></div>
                          <div className="h-3 w-32 bg-gray-400 rounded mb-1"></div>
                          <div className="h-3 w-full bg-gray-100 rounded"></div>
                        </div>
                        <div className="border-l-2 border-gray-300 pl-3">
                          <div className="h-4 w-full bg-gray-700 rounded mb-1"></div>
                          <div className="h-3 w-40 bg-gray-400 rounded mb-1"></div>
                          <div className="h-3 w-32 bg-gray-400 rounded mb-1"></div>
                          <div className="h-3 w-full bg-gray-100 rounded"></div>
                        </div>
                      </div>

                      <div>
                        <div className="h-4 w-40 bg-gray-800 rounded mb-2 uppercase text-xs font-bold"></div>
                        <div className="border-l-2 border-gray-300 pl-3">
                          <div className="h-4 w-full bg-gray-700 rounded mb-1"></div>
                          <div className="h-3 w-40 bg-gray-400 rounded mb-1"></div>
                          <div className="h-3 w-full bg-gray-100 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                <p className="text-gray-600 mb-4">{template.description}</p>
                <Link href={`/editor/${template.id}`}>
                  <Button className="w-full">Use This Template</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <footer className="bg-gray-100 py-6 mt-auto">
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-600">© 2025 ResumeBuilder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

