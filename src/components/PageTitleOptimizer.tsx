import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Copy, Sparkles, Eye, BarChart } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface TitleVariation {
  title: string
  length: number
  seoScore: number
  keywordPlacement: 'Beginning' | 'Middle' | 'End' | 'Multiple'
  readabilityScore: number
  version: number
}

export function PageTitleOptimizer() {
  const [currentTitle, setCurrentTitle] = useState('')
  const [targetKeywords, setTargetKeywords] = useState('')
  const [pageType, setPageType] = useState('')
  const [location, setLocation] = useState('')
  const [variations, setVariations] = useState<TitleVariation[]>([])
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [savedTitles, setSavedTitles] = useKV<string[]>('saved-titles', [])

  const optimizeTitles = async () => {
    if (!currentTitle || !targetKeywords) {
      toast.error('Please enter current title and target keywords')
      return
    }

    setIsOptimizing(true)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const keywords = targetKeywords.split(',').map(k => k.trim())
    const primaryKeyword = keywords[0]
    
    const titleTemplates = [
      // Keyword-first templates
      `${primaryKeyword} ${location ? `in ${location}` : ''} | ${pageType || 'Professional Therapy'}`,
      `${primaryKeyword} Services ${location ? `- ${location}` : ''} | Expert Care`,
      `Professional ${primaryKeyword} ${location ? `${location}` : ''} | Proven Results`,
      
      // Benefit-focused templates
      `Get Help with ${primaryKeyword} | ${location ? `${location}` : 'Local'} Therapy Expert`,
      `${primaryKeyword} Treatment That Works | ${location ? `${location}` : 'Professional'} Therapist`,
      `Overcome ${primaryKeyword} | Expert ${location ? `${location}` : ''} Counseling`,
      
      // Question-based templates
      `Need Help with ${primaryKeyword}? ${location ? `${location}` : ''} Therapy Solutions`,
      `Struggling with ${primaryKeyword}? ${location ? `${location}` : 'Professional'} Support Available`,
      
      // Authority-focused templates
      `${location ? `${location}'s` : ''} Leading ${primaryKeyword} Specialist | Book Today`,
      `Expert ${primaryKeyword} Therapy ${location ? `in ${location}` : ''} | Licensed Professional`
    ]

    const variations: TitleVariation[] = titleTemplates.map((template, index) => {
      const title = template.replace(/\s+/g, ' ').trim()
      const length = title.length
      
      // Calculate SEO score based on various factors
      let seoScore = 50 // Base score
      
      // Length optimization (50-60 characters is ideal)
      if (length >= 50 && length <= 60) seoScore += 20
      else if (length >= 40 && length <= 70) seoScore += 10
      else if (length > 70) seoScore -= 15
      
      // Keyword placement
      const titleLower = title.toLowerCase()
      const primaryKeywordLower = primaryKeyword.toLowerCase()
      const keywordIndex = titleLower.indexOf(primaryKeywordLower)
      let keywordPlacement: 'Beginning' | 'Middle' | 'End' | 'Multiple' = 'Middle'
      
      if (keywordIndex === 0) {
        keywordPlacement = 'Beginning'
        seoScore += 15
      } else if (keywordIndex > title.length * 0.7) {
        keywordPlacement = 'End'
        seoScore += 5
      } else if (keywordIndex > 0) {
        keywordPlacement = 'Middle'
        seoScore += 10
      }
      
      // Check for multiple keywords
      const keywordCount = keywords.filter(k => 
        titleLower.includes(k.toLowerCase())
      ).length
      
      if (keywordCount > 1) {
        keywordPlacement = 'Multiple'
        seoScore += 10
      }
      
      // Readability factors
      let readabilityScore = 70 // Base readability
      
      // Penalize very long titles
      if (length > 65) readabilityScore -= 15
      
      // Reward clear structure
      if (title.includes('|') || title.includes('-')) readabilityScore += 10
      
      // Penalize too many special characters
      const specialChars = (title.match(/[^\w\s]/g) || []).length
      if (specialChars > 3) readabilityScore -= 10
      
      // Reward location inclusion
      if (location && titleLower.includes(location.toLowerCase())) {
        seoScore += 10
        readabilityScore += 5
      }
      
      // Ensure scores are within bounds
      seoScore = Math.max(0, Math.min(100, seoScore))
      readabilityScore = Math.max(0, Math.min(100, readabilityScore))
      
      return {
        title,
        length,
        seoScore,
        keywordPlacement,
        readabilityScore,
        version: index + 1
      }
    })

    // Sort by combined score (SEO + readability)
    variations.sort((a, b) => (b.seoScore + b.readabilityScore) - (a.seoScore + a.readabilityScore))
    
    setVariations(variations.slice(0, 6)) // Show top 6 variations
    setIsOptimizing(false)
    toast.success(`Generated ${variations.length} optimized title variations`)
  }

  const copyTitle = (title: string) => {
    navigator.clipboard.writeText(title)
    toast.success('Title copied to clipboard')
  }

  const saveTitle = (title: string) => {
    if (savedTitles.includes(title)) {
      setSavedTitles(current => current.filter(t => t !== title))
      toast.success('Title removed from saved')
    } else {
      setSavedTitles(current => [...current, title])
      toast.success('Title saved')
    }
  }

  const getLengthColor = (length: number) => {
    if (length >= 50 && length <= 60) return 'text-green-600'
    if (length >= 40 && length <= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const SearchPreview = ({ title }: { title: string }) => (
    <div className="bg-muted p-4 rounded-lg border">
      <div className="text-blue-600 text-lg font-medium mb-1 hover:underline cursor-pointer">
        {title}
      </div>
      <div className="text-green-600 text-sm mb-2">
        https://yourpractice.com/page-url
      </div>
      <div className="text-gray-700 text-sm leading-relaxed">
        Professional therapy services helping you achieve better mental health...
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="current-title">Current Page Title</Label>
          <Input
            id="current-title"
            placeholder="e.g., About Our Therapy Practice"
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="target-keywords">Target Keywords (comma-separated)</Label>
          <Textarea
            id="target-keywords"
            placeholder="e.g., anxiety therapy, Austin therapist, mental health counseling"
            value={targetKeywords}
            onChange={(e) => setTargetKeywords(e.target.value)}
            rows={2}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="page-type-title">Page Type (Optional)</Label>
            <Input
              id="page-type-title"
              placeholder="e.g., Therapy Services, About Us"
              value={pageType}
              onChange={(e) => setPageType(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location-title">Location (Optional)</Label>
            <Input
              id="location-title"
              placeholder="e.g., Austin, TX"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Button 
        onClick={optimizeTitles} 
        disabled={isOptimizing}
        className="w-full md:w-auto"
        size="lg"
      >
        {isOptimizing ? (
          <>
            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
            Optimizing Titles...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Optimized Titles
          </>
        )}
      </Button>

      {variations.length > 0 && (
        <div className="space-y-4">
          <Separator />
          
          <h3 className="text-lg font-semibold">Optimized Title Variations</h3>

          <div className="space-y-6">
            {variations.map((variation, index) => (
              <Card key={index} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Version {variation.version}</Badge>
                    <div className="flex items-center gap-4">
                      <div className="text-sm space-x-4">
                        <span className={`font-medium ${getLengthColor(variation.length)}`}>
                          {variation.length} chars
                        </span>
                        <span className={`font-medium ${getScoreColor(variation.seoScore)}`}>
                          SEO: {variation.seoScore}/100
                        </span>
                        <span className={`font-medium ${getScoreColor(variation.readabilityScore)}`}>
                          Readability: {variation.readabilityScore}/100
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded border font-medium">
                      {variation.title}
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">SEO Score:</span>
                          <Progress value={variation.seoScore} className="mt-1" />
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Readability:</span>
                          <Progress value={variation.readabilityScore} className="mt-1" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="secondary">
                            Keywords: {variation.keywordPlacement}
                          </Badge>
                          {variation.length >= 50 && variation.length <= 60 && (
                            <Badge className="bg-green-100 text-green-800">
                              Optimal Length
                            </Badge>
                          )}
                          {variation.seoScore >= 80 && (
                            <Badge className="bg-blue-100 text-blue-800">
                              High SEO
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Eye size={16} />
                        <span className="text-sm font-medium">Search Preview</span>
                      </div>
                      <SearchPreview title={variation.title} />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyTitle(variation.title)}
                    >
                      <Copy size={16} className="mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => saveTitle(variation.title)}
                      className={savedTitles.includes(variation.title) ? 'bg-accent text-accent-foreground' : ''}
                    >
                      {savedTitles.includes(variation.title) ? 'Saved' : 'Save'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {savedTitles.length > 0 && (
        <div className="space-y-4">
          <Separator />
          
          <h3 className="text-lg font-semibold">Saved Titles ({savedTitles.length})</h3>
          
          <div className="grid gap-3">
            {savedTitles.slice(0, 3).map((title, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 font-medium text-sm">
                    {title}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyTitle(title)}
                    >
                      <Copy size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => saveTitle(title)}
                      className="text-red-500"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {savedTitles.length > 3 && (
            <div className="text-center text-sm text-muted-foreground">
              And {savedTitles.length - 3} more saved titles...
            </div>
          )}
        </div>
      )}
    </div>
  )
}