import React, { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Heart, Copy, Sparkles } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface Keyword {
  text: string
  volume: 'High' | 'Medium' | 'Low'
  competition: 'High' | 'Medium' | 'Low'
  intent: 'Commercial' | 'Informational' | 'Local'
}

const therapySpecializations = [
  'Anxiety Therapy',
  'Depression Counseling', 
  'Couples Therapy',
  'Family Therapy',
  'Child Psychology',
  'Trauma Therapy',
  'Addiction Counseling',
  'EMDR Therapy',
  'Cognitive Behavioral Therapy',
  'Marriage Counseling'
]

const demographics = [
  'Adults',
  'Children',
  'Teenagers',
  'Couples', 
  'Families',
  'LGBTQ+',
  'Veterans',
  'Seniors'
]

export function KeywordPlanner() {
  const [specialization, setSpecialization] = useState('')
  const [location, setLocation] = useState('')
  const [targetDemo, setTargetDemo] = useState('')
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [savedKeywords, setSavedKeywords] = useKV<string[]>('saved-keywords', [])

  const generateKeywords = async () => {
    if (!specialization || !location) {
      toast.error('Please select a specialization and enter a location')
      return
    }

    setIsGenerating(true)
    
    // Simulate keyword generation with realistic therapy-related keywords
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const baseKeywords = [
      `${specialization.toLowerCase()} ${location.toLowerCase()}`,
      `therapist near me ${location.toLowerCase()}`,
      `${specialization.toLowerCase()} counselor ${location.toLowerCase()}`,
      `mental health ${location.toLowerCase()}`,
      `therapy services ${location.toLowerCase()}`,
      `${targetDemo.toLowerCase()} therapy ${location.toLowerCase()}`,
      `best therapist ${location.toLowerCase()}`,
      `counseling center ${location.toLowerCase()}`,
      `psychological services ${location.toLowerCase()}`,
      `therapy sessions ${location.toLowerCase()}`,
      `mental wellness ${location.toLowerCase()}`,
      `emotional support ${location.toLowerCase()}`,
      `therapy practice ${location.toLowerCase()}`,
      `licensed therapist ${location.toLowerCase()}`,
      `therapy appointments ${location.toLowerCase()}`,
      `mental health counselor ${location.toLowerCase()}`,
      `therapy clinic ${location.toLowerCase()}`,
      `counseling services ${location.toLowerCase()}`,
      `therapy office ${location.toLowerCase()}`,
      `mental health support ${location.toLowerCase()}`
    ]

    const volumes: Array<'High' | 'Medium' | 'Low'> = ['High', 'Medium', 'Low']
    const competitions: Array<'High' | 'Medium' | 'Low'> = ['High', 'Medium', 'Low'] 
    const intents: Array<'Commercial' | 'Informational' | 'Local'> = ['Commercial', 'Informational', 'Local']

    const generatedKeywords: Keyword[] = baseKeywords.map(keyword => ({
      text: keyword,
      volume: volumes[Math.floor(Math.random() * volumes.length)],
      competition: competitions[Math.floor(Math.random() * competitions.length)],
      intent: intents[Math.floor(Math.random() * intents.length)]
    }))

    setKeywords(generatedKeywords)
    setIsGenerating(false)
    toast.success(`Generated ${generatedKeywords.length} keywords for your practice`)
  }

  const saveKeyword = (keyword: string) => {
    if (savedKeywords.includes(keyword)) {
      setSavedKeywords(current => current.filter(k => k !== keyword))
      toast.success('Keyword removed from favorites')
    } else {
      setSavedKeywords(current => [...current, keyword])
      toast.success('Keyword saved to favorites')
    }
  }

  const copyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword)
    toast.success('Keyword copied to clipboard')
  }

  const getVolumeColor = (volume: string) => {
    switch (volume) {
      case 'High': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-orange-100 text-orange-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="specialization">Therapy Specialization</Label>
          <Select value={specialization} onValueChange={setSpecialization}>
            <SelectTrigger id="specialization">
              <SelectValue placeholder="Select your specialization" />
            </SelectTrigger>
            <SelectContent>
              {therapySpecializations.map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location (City, State)</Label>
          <Input
            id="location"
            placeholder="e.g., Austin, TX"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="demographics">Target Demographics</Label>
          <Select value={targetDemo} onValueChange={setTargetDemo}>
            <SelectTrigger id="demographics">
              <SelectValue placeholder="Select target group" />
            </SelectTrigger>
            <SelectContent>
              {demographics.map((demo) => (
                <SelectItem key={demo} value={demo}>
                  {demo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        onClick={generateKeywords} 
        disabled={isGenerating}
        className="w-full md:w-auto"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
            Generating Keywords...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Keywords
          </>
        )}
      </Button>

      {keywords.length > 0 && (
        <div className="space-y-4">
          <Separator />
          
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generated Keywords ({keywords.length})</h3>
            {savedKeywords.length > 0 && (
              <Badge variant="secondary" className="gap-1">
                <Heart size={12} />
                {savedKeywords.length} saved
              </Badge>
            )}
          </div>

          <div className="grid gap-3">
            {keywords.map((keyword, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-medium text-foreground mb-2">
                      {keyword.text}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className={getVolumeColor(keyword.volume)} variant="secondary">
                        Volume: {keyword.volume}
                      </Badge>
                      <Badge className={getCompetitionColor(keyword.competition)} variant="secondary">
                        Competition: {keyword.competition}
                      </Badge>
                      <Badge variant="outline">
                        {keyword.intent}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyKeyword(keyword.text)}
                    >
                      <Copy size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => saveKeyword(keyword.text)}
                      className={savedKeywords.includes(keyword.text) ? 'text-red-500' : ''}
                    >
                      <Heart 
                        size={16} 
                        weight={savedKeywords.includes(keyword.text) ? 'fill' : 'regular'}
                      />
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