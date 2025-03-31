"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Share, Copy, Check, Twitter, Linkedin, Facebook, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareModalProps {
  resumeName: string
  templateId: string
}

export function ShareModal({ resumeName, templateId }: ShareModalProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  // In a real app, this would be a unique URL for the shared resume
  const shareUrl = `https://resumebuilder.com/view/${templateId}/${encodeURIComponent(resumeName.replace(/\s+/g, "-").toLowerCase())}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)

    toast({
      title: "Link copied",
      description: "Share link has been copied to clipboard",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (platform: string) => {
    let shareLink = ""
    const text = `Check out my professional resume created with ResumeBuilder!`

    switch (platform) {
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`
        break
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        break
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case "email":
        shareLink = `mailto:?subject=${encodeURIComponent("My Professional Resume")}&body=${encodeURIComponent(text + "\n\n" + shareUrl)}`
        break
    }

    if (shareLink) {
      window.open(shareLink, "_blank")
    }

    toast({
      title: "Sharing resume",
      description: `Opening ${platform} to share your resume`,
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share your resume</DialogTitle>
          <DialogDescription>Share your resume with others or on social media</DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <Input readOnly value={shareUrl} className="w-full" />
          </div>
          <Button size="sm" className="px-3 gap-2" onClick={handleCopyLink}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">Share on social media</h4>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 bg-[#1DA1F2] text-white hover:bg-[#1a94e0] hover:text-white"
              onClick={() => handleShare("twitter")}
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Share on Twitter</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 bg-[#0077B5] text-white hover:bg-[#006da7] hover:text-white"
              onClick={() => handleShare("linkedin")}
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">Share on LinkedIn</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 bg-[#4267B2] text-white hover:bg-[#3b5998] hover:text-white"
              onClick={() => handleShare("facebook")}
            >
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Share on Facebook</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 bg-gray-600 text-white hover:bg-gray-700 hover:text-white"
              onClick={() => handleShare("email")}
            >
              <Mail className="h-5 w-5" />
              <span className="sr-only">Share via Email</span>
            </Button>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
          <h4 className="text-sm font-medium mb-2">Boost your job search</h4>
          <p className="text-sm text-gray-600">
            Share your resume with recruiters and increase your chances of landing your dream job. Our professional
            templates are proven to get more interviews.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

