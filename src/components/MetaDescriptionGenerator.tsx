import React, { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Copy, Sparkles, Eye } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface MetaDescription {
  text: string
  length: number
  version: number
}

const pageTypes = [
  'Homepage',
  'About Page', 
  'Services Page',
  'Contact Page',
  'Blog Post',
  'Specialty Service Page',
  'Therapist Bio Page',
  'Appointment Booking Page'
]

export function MetaDescriptionGenerator() {
  const [pageType, setPageType] = useState('')
  const [practiceName, setPracticeName] = useState('')
  const [location, setLocation] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [uniqueValue, setUniqueValue] = useState('')
  const [descriptions, setDescriptions] = useState<MetaDescription[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [savedDescriptions, setSavedDescriptions] = useKV<string[]>('saved-descriptions', [])

  const generateDescriptions = async () => {
    if (!pageType || !practiceName || !location) {
      toast.error('Please fill in page type, practice name, and location')
      return
    }

    setIsGenerating(true)
    
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    const templates = {
      'Homepage': [
        `${practiceName} offers professional ${specialization || 'therapy'} services in ${location}. Book your consultation today and start your journey to better mental health.`,
        `Professional therapy and counseling services at ${practiceName} in ${location}. ${specialization || 'Mental health'} support with compassionate, licensed therapists.`,
        `${practiceName} - ${location}'s trusted therapy practice. Specializing in ${specialization || 'mental health counseling'} with personalized treatment plans.`
      ],
      'About Page': [
        `Learn about ${practiceName}'s experienced therapists in ${location}. Our team specializes in ${specialization || 'comprehensive mental health care'} with a client-centered approach.`,
        `Meet the licensed therapists at ${practiceName} in ${location}. Dedicated to providing ${specialization || 'quality mental health services'} in a supportive environment.`,
        `About ${practiceName} - ${location}'s premier therapy practice. Our mission is to provide ${specialization || 'accessible mental health care'} with proven results.`
      ],
      'Services Page': [
        `${practiceName} provides ${specialization || 'comprehensive therapy'} services in ${location}. Individual, couples, and family counseling available.`,
        `Professional ${specialization || 'therapy'} services at ${practiceName} in ${location}. Evidence-based treatments tailored to your specific needs.`,
        `Explore therapy services at ${practiceName} in ${location}. ${specialization || 'Mental health'} treatments designed to help you achieve lasting wellness.`
      ],
      'Contact Page': [
        `Contact ${practiceName} in ${location} to schedule your ${specialization || 'therapy'} appointment. Call, email, or book online for convenient scheduling.`,
        `Get in touch with ${practiceName} for ${specialization || 'therapy'} services in ${location}. Easy online booking and flexible appointment scheduling available.`,
        `Schedule your consultation with ${practiceName} in ${location}. Professional ${specialization || 'therapy'} services with convenient appointment options.`
      ],
      'Blog Post': [
        `${practiceName} shares insights on ${specialization || 'mental health'} topics. Expert advice from licensed therapists in ${location} to support your wellness journey.`,
        `Mental health resources and tips from ${practiceName} in ${location}. Professional guidance on ${specialization || 'therapy'} and wellness strategies.`,
        `Read the latest from ${practiceName}'s blog. ${specialization || 'Mental health'} insights and practical advice from ${location}'s trusted therapists.`
      ],
      'Specialty Service Page': [
        `${specialization || 'Specialized therapy'} services at ${practiceName} in ${location}. Expert treatment with proven techniques and personalized care plans.`,
        `Professional ${specialization || 'therapy'} at ${practiceName} in ${location}. Evidence-based treatment approaches for lasting mental health improvement.`,
        `${practiceName} offers specialized ${specialization || 'therapy'} in ${location}. Comprehensive care with experienced, licensed mental health professionals.`
      ],
      'Therapist Bio Page': [
        `Meet [Therapist Name] at ${practiceName} in ${location}. Licensed therapist specializing in ${specialization || 'mental health care'} with years of experience.`,
        `[Therapist Name] - Licensed therapist at ${practiceName} in ${location}. Expertise in ${specialization || 'therapy'} with a compassionate, client-focused approach.`,
        `Learn about [Therapist Name] at ${practiceName} in ${location}. Professional ${specialization || 'therapy'} services with personalized treatment methods.`
      ],
      'Appointment Booking Page': [
        `Book your appointment with ${practiceName} in ${location}. Online scheduling for ${specialization || 'therapy'} services with flexible time options.`,
        `Schedule ${specialization || 'therapy'} sessions at ${practiceName} in ${location}. Easy online booking with immediate confirmation and appointment reminders.`,
        `Convenient appointment booking for ${practiceName} in ${location}. Schedule your ${specialization || 'therapy'} consultation online in just a few clicks.`
      ]
    }

    const baseDescriptions = templates[pageType as keyof typeof templates] || templates['Homepage']
    
    const generatedDescriptions: MetaDescription[] = baseDescriptions.map((text, index) => {
      let finalText = text
      if (uniqueValue) {
        finalText = text.replace(/\. /, `. ${uniqueValue}. `)
      }
      
      return {
        text: finalText,
        length: finalText.length,
        version: index + 1
      }
    })

    setDescriptions(generatedDescriptions)
    setIsGenerating(false)
    toast.success(`Generated ${generatedDescriptions.length} meta descriptions`)
  }

  const copyDescription = (description: string) => {
    navigator.clipboard.writeText(description)
    toast.success('Meta description copied to clipboard')
  }

  const saveDescription = (description: string) => {
    if (savedDescriptions.includes(description)) {
      setSavedDescriptions(current => current.filter(d => d !== description))
      toast.success('Description removed from saved')
    } else {
      setSavedDescriptions(current => [...current, description])
      toast.success('Description saved')
    }
  }

  const getLengthColor = (length: number) => {
    if (length <= 160) return 'text-green-600'
    if (length <= 170) return 'text-yellow-600'
    return 'text-red-600'
  }

  const SearchPreview = ({ description }: { description: string }) => (
    <div className="bg-muted p-4 rounded-lg border">
      <div className="text-blue-600 text-lg font-medium mb-1">
        {practiceName} | {pageType} | {location}
      </div>
      <div className="text-green-600 text-sm mb-2">
        https://example-therapy-practice.com
      </div>
      <div className="text-gray-700 text-sm leading-relaxed">
        {description}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="page-type">Page Type</Label>
          <Select value={pageType} onValueChange={setPageType}>
            <SelectTrigger id="page-type">
              <SelectValue placeholder="Select page type" />
            </SelectTrigger>
            <SelectContent>
              {pageTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="practice-name">Practice Name</Label>
          <Input
            id="practice-name"
            placeholder="e.g., Wellness Therapy Center"
            value={practiceName}
            onChange={(e) => setPracticeName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location-meta">Location</Label>
          <Input
            id="location-meta"
            placeholder="e.g., Austin, TX"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialization-meta">Specialization (Optional)</Label>
          <Input
            id="specialization-meta"
            placeholder="e.g., anxiety therapy, couples counseling"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="unique-value">Unique Value Proposition (Optional)</Label>
        <Textarea
          id="unique-value"
          placeholder="What makes your practice special? e.g., 'Evening and weekend appointments available' or 'Specializing in evidence-based treatments'"
          value={uniqueValue}
          onChange={(e) => setUniqueValue(e.target.value)}
          rows={2}
        />
      </div>

      <Button 
        onClick={generateDescriptions} 
        disabled={isGenerating}
        className="w-full md:w-auto"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
            Generating Descriptions...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Meta Descriptions
          </>
        )}
      </Button>

      {descriptions.length > 0 && (
        <div className="space-y-4">
          <Separator />
          
          <h3 className="text-lg font-semibold">Generated Meta Descriptions</h3>

          <div className="space-y-6">
            {descriptions.map((desc, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Version {desc.version}</Badge>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getLengthColor(desc.length)}`}>
                        {desc.length}/160 characters
                      </span>
                      {desc.length > 160 && (
                        <Badge variant="destructive">Too long</Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded border font-mono text-sm">
                      {desc.text}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Eye size={16} />
                        <span className="text-sm font-medium">Search Preview</span>
                      </div>
                      <SearchPreview description={desc.text} />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyDescription(desc.text)}
                    >
                      <Copy size={16} className="mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => saveDescription(desc.text)}
                      className={savedDescriptions.includes(desc.text) ? 'bg-accent text-accent-foreground' : ''}
                    >
                      {savedDescriptions.includes(desc.text) ? 'Saved' : 'Save'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}