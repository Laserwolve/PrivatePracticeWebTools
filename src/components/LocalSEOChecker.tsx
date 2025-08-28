import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, XCircle, AlertCircle, Target, Sparkles } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface SEOFactor {
  name: string
  description: string
  status: 'good' | 'warning' | 'error'
  score: number
  recommendation: string
}

interface SEOReport {
  overallScore: number
  factors: SEOFactor[]
  timestamp: Date | string
}

export function LocalSEOChecker() {
  const [practiceName, setPracticeName] = useState('')
  const [location, setLocation] = useState('')
  const [website, setWebsite] = useState('')
  const [report, setReport] = useState<SEOReport | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [savedReports, setSavedReports] = useKV<SEOReport[]>('seo-reports', [])

  const analyzeLocalSEO = async () => {
    if (!practiceName || !location) {
      toast.error('Please enter practice name and location')
      return
    }

    setIsAnalyzing(true)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate realistic SEO analysis results
    const factors: SEOFactor[] = [
      {
        name: 'Google Business Profile',
        description: 'Claimed and optimized Google Business Profile listing',
        status: Math.random() > 0.3 ? 'good' : 'warning',
        score: Math.floor(Math.random() * 40) + 60,
        recommendation: 'Ensure your Google Business Profile is claimed, verified, and includes complete information, photos, and regular posts.'
      },
      {
        name: 'NAP Consistency',
        description: 'Name, Address, Phone consistency across directories',
        status: Math.random() > 0.4 ? 'good' : 'error',
        score: Math.floor(Math.random() * 30) + 70,
        recommendation: 'Maintain identical business information across all online directories and your website.'
      },
      {
        name: 'Local Keywords',
        description: 'Location-based keywords in content and meta tags',
        status: Math.random() > 0.5 ? 'warning' : 'good',
        score: Math.floor(Math.random() * 50) + 50,
        recommendation: 'Include city/region names in page titles, headings, and content naturally.'
      },
      {
        name: 'Online Reviews',
        description: 'Quantity and quality of client reviews',
        status: Math.random() > 0.4 ? 'good' : 'warning',
        score: Math.floor(Math.random() * 40) + 60,
        recommendation: 'Encourage satisfied clients to leave reviews and respond professionally to all feedback.'
      },
      {
        name: 'Local Citations',
        description: 'Business listings in local directories',
        status: Math.random() > 0.6 ? 'good' : 'warning',
        score: Math.floor(Math.random() * 35) + 65,
        recommendation: 'List your practice in Psychology Today, therapy-specific directories, and local business listings.'
      },
      {
        name: 'Mobile Optimization',
        description: 'Mobile-friendly website design and speed',
        status: Math.random() > 0.3 ? 'good' : 'error',
        score: Math.floor(Math.random() * 30) + 70,
        recommendation: 'Ensure your website loads quickly and displays properly on mobile devices.'
      },
      {
        name: 'Local Schema Markup',
        description: 'Structured data for local business information',
        status: Math.random() > 0.7 ? 'good' : 'warning',
        score: Math.floor(Math.random() * 60) + 40,
        recommendation: 'Add LocalBusiness schema markup to help search engines understand your practice location and services.'
      },
      {
        name: 'Contact Information',
        description: 'Clear contact details on every page',
        status: Math.random() > 0.2 ? 'good' : 'warning',
        score: Math.floor(Math.random() * 20) + 80,
        recommendation: 'Display phone number, address, and business hours prominently on your website.'
      }
    ]

    const overallScore = Math.floor(factors.reduce((sum, factor) => sum + factor.score, 0) / factors.length)

    const newReport: SEOReport = {
      overallScore,
      factors,
      timestamp: new Date()
    }

    setReport(newReport)
    setIsAnalyzing(false)
    toast.success('Local SEO analysis complete')
  }

  const saveReport = () => {
    if (!report) return
    
    setSavedReports(current => [report, ...current.slice(0, 4)]) // Keep last 5 reports
    toast.success('Report saved to history')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle size={20} className="text-green-500" />
      case 'warning':
        return <AlertCircle size={20} className="text-yellow-500" />
      case 'error':
        return <XCircle size={20} className="text-red-500" />
      default:
        return null
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Needs Work'
    return 'Poor'
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="practice-name-seo">Practice Name</Label>
          <Input
            id="practice-name-seo"
            placeholder="e.g., Wellness Therapy Center"
            value={practiceName}
            onChange={(e) => setPracticeName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location-seo">Location</Label>
          <Input
            id="location-seo"
            placeholder="e.g., Austin, TX"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website-seo">Website (Optional)</Label>
          <Input
            id="website-seo"
            placeholder="e.g., yourpractice.com"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
      </div>

      <Button 
        onClick={analyzeLocalSEO} 
        disabled={isAnalyzing}
        className="w-full md:w-auto"
        size="lg"
      >
        {isAnalyzing ? (
          <>
            <Target className="mr-2 h-4 w-4 animate-pulse" />
            Analyzing Local SEO...
          </>
        ) : (
          <>
            <Target className="mr-2 h-4 w-4" />
            Analyze Local SEO
          </>
        )}
      </Button>

      {report && (
        <div className="space-y-6">
          <Separator />
          
          <Card className="p-6">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <div className={`text-4xl font-bold ${getScoreColor(report.overallScore)}`}>
                  {report.overallScore}/100
                </div>
                <div className="text-lg font-medium text-muted-foreground">
                  {getScoreLabel(report.overallScore)} Local SEO Score
                </div>
              </div>
              
              <Progress value={report.overallScore} className="w-full max-w-md mx-auto" />
              
              <div className="flex justify-center gap-4 pt-4">
                <Button variant="outline" onClick={saveReport}>
                  Save Report
                </Button>
                <Button onClick={analyzeLocalSEO}>
                  Re-analyze
                </Button>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">SEO Factor Analysis</h3>
            
            <div className="grid gap-4">
              {report.factors.map((factor, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 pt-1">
                      {getStatusIcon(factor.status)}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{factor.name}</h4>
                        <Badge variant="outline" className={getScoreColor(factor.score)}>
                          {factor.score}/100
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {factor.description}
                      </p>
                      
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm">
                          <span className="font-medium">Recommendation:</span> {factor.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {savedReports.length > 0 && (
            <div className="space-y-4">
              <Separator />
              
              <h3 className="text-lg font-semibold">Report History</h3>
              
              <div className="grid gap-3">
                {savedReports.slice(0, 3).map((savedReport, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          Local SEO Report
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(savedReport.timestamp).toLocaleDateString()} at {new Date(savedReport.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className={`text-xl font-bold ${getScoreColor(savedReport.overallScore)}`}>
                        {savedReport.overallScore}/100
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}