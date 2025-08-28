import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { PencilSimple, BookmarkSimple, Sparkles, Calendar } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ContentTopic {
  title: string
  description: string
  targetAudience: string
  seoKeywords: string[]
  contentType: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedLength: string
}

const specializations = [
  'Anxiety Therapy',
  'Depression Counseling',
  'Couples Therapy', 
  'Family Therapy',
  'Child Psychology',
  'Trauma Therapy',
  'Addiction Counseling',
  'EMDR Therapy',
  'Cognitive Behavioral Therapy',
  'Grief Counseling'
]

const contentGoals = [
  'Educate Potential Clients',
  'Establish Expertise',
  'Address Common Concerns',
  'Improve Local SEO',
  'Build Trust and Rapport',
  'Explain Treatment Methods'
]

const contentTypes = ['Blog Post', 'FAQ Page', 'Resource Guide', 'Video Script', 'Social Media Series']

export function ContentTopicGenerator() {
  const [specialization, setSpecialization] = useState('')
  const [contentGoal, setContentGoal] = useState('')
  const [topics, setTopics] = useState<ContentTopic[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [savedTopics, setSavedTopics] = useKV<ContentTopic[]>('saved-topics', [])

  const generateTopics = async () => {
    if (!specialization || !contentGoal) {
      toast.error('Please select a specialization and content goal')
      return
    }

    setIsGenerating(true)
    
    await new Promise(resolve => setTimeout(resolve, 1800))
    
    const topicTemplates = {
      'Anxiety Therapy': [
        {
          title: '5 Breathing Techniques to Manage Anxiety Attacks',
          description: 'Practical breathing exercises that clients can use immediately when experiencing anxiety. Include step-by-step instructions and the science behind why these techniques work.',
          targetAudience: 'People experiencing anxiety attacks',
          seoKeywords: ['anxiety breathing techniques', 'panic attack help', 'anxiety management'],
          contentType: 'Blog Post',
          difficulty: 'Beginner' as const,
          estimatedLength: '800-1000 words'
        },
        {
          title: 'Understanding the Difference Between Anxiety and Stress',
          description: 'Educational content explaining the clinical differences between normal stress and anxiety disorders, helping readers understand when to seek professional help.',
          targetAudience: 'Individuals questioning if they have anxiety',
          seoKeywords: ['anxiety vs stress', 'anxiety symptoms', 'when to see therapist'],
          contentType: 'Blog Post',
          difficulty: 'Intermediate' as const,
          estimatedLength: '1200-1500 words'
        },
        {
          title: 'How Cognitive Behavioral Therapy Treats Anxiety',
          description: 'Explain CBT techniques for anxiety treatment, including thought challenging and behavioral experiments. Position your expertise in evidence-based treatments.',
          targetAudience: 'People considering therapy for anxiety',
          seoKeywords: ['CBT for anxiety', 'anxiety therapy techniques', 'cognitive behavioral therapy'],
          contentType: 'Blog Post',
          difficulty: 'Advanced' as const,
          estimatedLength: '1500-2000 words'
        }
      ],
      'Depression Counseling': [
        {
          title: 'Signs of Depression: When Sadness Becomes Something More',
          description: 'Help readers identify the difference between temporary sadness and clinical depression. Include a gentle call-to-action for professional support.',
          targetAudience: 'People experiencing persistent sadness',
          seoKeywords: ['depression symptoms', 'signs of depression', 'depression vs sadness'],
          contentType: 'Blog Post',
          difficulty: 'Beginner' as const,
          estimatedLength: '1000-1200 words'
        },
        {
          title: 'Building Daily Routines to Support Mental Health',
          description: 'Practical advice for creating structure and routine to support recovery from depression. Include actionable tips and the importance of consistency.',
          targetAudience: 'People managing depression',
          seoKeywords: ['depression routine', 'mental health habits', 'depression self-care'],
          contentType: 'Resource Guide',
          difficulty: 'Intermediate' as const,
          estimatedLength: '1200-1500 words'
        },
        {
          title: 'Understanding Different Types of Depression Therapy',
          description: 'Compare various therapeutic approaches for depression including CBT, DBT, and interpersonal therapy. Help readers make informed treatment decisions.',
          targetAudience: 'People considering depression treatment',
          seoKeywords: ['depression therapy types', 'therapy for depression', 'depression treatment options'],
          contentType: 'Blog Post',
          difficulty: 'Advanced' as const,
          estimatedLength: '1800-2000 words'
        }
      ],
      'Couples Therapy': [
        {
          title: 'Communication Exercises Couples Can Practice at Home',
          description: 'Provide practical communication techniques that couples can implement between therapy sessions to improve their relationship.',
          targetAudience: 'Couples working on their relationship',
          seoKeywords: ['couples communication', 'relationship exercises', 'improve relationship'],
          contentType: 'Resource Guide',
          difficulty: 'Beginner' as const,
          estimatedLength: '1000-1300 words'
        },
        {
          title: 'When to Consider Couples Therapy: 7 Key Indicators',
          description: 'Help couples identify when professional help might benefit their relationship. Address common hesitations about seeking therapy.',
          targetAudience: 'Couples considering therapy',
          seoKeywords: ['when to seek couples therapy', 'relationship problems', 'couples counseling'],
          contentType: 'Blog Post',
          difficulty: 'Intermediate' as const,
          estimatedLength: '1200-1500 words'
        },
        {
          title: 'The Gottman Method: Science-Based Relationship Therapy',
          description: 'Explain the Gottman approach to couples therapy, including the Four Horsemen and building love maps. Showcase evidence-based methodology.',
          targetAudience: 'Couples researching therapy approaches',
          seoKeywords: ['Gottman method', 'evidence-based couples therapy', 'relationship research'],
          contentType: 'Blog Post',
          difficulty: 'Advanced' as const,
          estimatedLength: '1500-1800 words'
        }
      ]
    }

    // Generate topics based on specialization, or use general templates
    const relevantTemplates = topicTemplates[specialization as keyof typeof topicTemplates] || [
      {
        title: `Understanding ${specialization}: What You Need to Know`,
        description: `Comprehensive overview of ${specialization}, including symptoms, treatment approaches, and when to seek help.`,
        targetAudience: 'People seeking information about this therapy type',
        seoKeywords: [specialization.toLowerCase(), `${specialization.toLowerCase()} therapy`, 'mental health treatment'],
        contentType: 'Blog Post',
        difficulty: 'Intermediate' as const,
        estimatedLength: '1200-1500 words'
      },
      {
        title: `Common Myths About ${specialization} Debunked`,
        description: `Address misconceptions and stigma around ${specialization} to help potential clients feel more comfortable seeking help.`,
        targetAudience: 'People with concerns about this therapy type',
        seoKeywords: [`${specialization.toLowerCase()} myths`, 'therapy misconceptions', 'mental health stigma'],
        contentType: 'Blog Post',
        difficulty: 'Beginner' as const,
        estimatedLength: '800-1000 words'
      },
      {
        title: `Self-Care Strategies for Those in ${specialization}`,
        description: `Practical self-care techniques that complement professional ${specialization} treatment.`,
        targetAudience: 'Current clients and people managing these issues',
        seoKeywords: [`${specialization.toLowerCase()} self-care`, 'mental health tips', 'therapy support'],
        contentType: 'Resource Guide',
        difficulty: 'Intermediate' as const,
        estimatedLength: '1000-1200 words'
      }
    ]

    // Add a few more general mental health topics
    const generalTopics = [
      {
        title: 'How to Prepare for Your First Therapy Session',
        description: 'Guide nervous first-time therapy clients through what to expect and how to get the most out of their initial appointment.',
        targetAudience: 'First-time therapy clients',
        seoKeywords: ['first therapy session', 'what to expect in therapy', 'therapy preparation'],
        contentType: 'Blog Post',
        difficulty: 'Beginner' as const,
        estimatedLength: '800-1000 words'
      },
      {
        title: 'The Benefits of Telehealth Therapy: Is Online Counseling Right for You?',
        description: 'Explore the advantages and considerations of online therapy, addressing common concerns about virtual mental health care.',
        targetAudience: 'People considering online therapy',
        seoKeywords: ['telehealth therapy', 'online counseling', 'virtual therapy benefits'],
        contentType: 'Blog Post',
        difficulty: 'Intermediate' as const,
        estimatedLength: '1200-1400 words'
      }
    ]

    const allTopics = [...relevantTemplates, ...generalTopics]
    
    // Shuffle and select topics based on content goal
    const selectedTopics = allTopics
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.min(5, allTopics.length))

    setTopics(selectedTopics)
    setIsGenerating(false)
    toast.success(`Generated ${selectedTopics.length} content topics`)
  }

  const saveTopic = (topic: ContentTopic) => {
    if (savedTopics.some(t => t.title === topic.title)) {
      setSavedTopics(current => current.filter(t => t.title !== topic.title))
      toast.success('Topic removed from saved')
    } else {
      setSavedTopics(current => [...current, topic])
      toast.success('Topic saved to content calendar')
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="specialization-content">Therapy Specialization</Label>
          <Select value={specialization} onValueChange={setSpecialization}>
            <SelectTrigger id="specialization-content">
              <SelectValue placeholder="Select your specialization" />
            </SelectTrigger>
            <SelectContent>
              {specializations.map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content-goal">Content Goal</Label>
          <Select value={contentGoal} onValueChange={setContentGoal}>
            <SelectTrigger id="content-goal">
              <SelectValue placeholder="What's your content goal?" />
            </SelectTrigger>
            <SelectContent>
              {contentGoals.map((goal) => (
                <SelectItem key={goal} value={goal}>
                  {goal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        onClick={generateTopics} 
        disabled={isGenerating}
        className="w-full md:w-auto"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
            Generating Topics...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Content Topics
          </>
        )}
      </Button>

      {topics.length > 0 && (
        <div className="space-y-4">
          <Separator />
          
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generated Content Topics ({topics.length})</h3>
            {savedTopics.length > 0 && (
              <Badge variant="secondary" className="gap-1">
                <Calendar size={12} />
                {savedTopics.length} saved
              </Badge>
            )}
          </div>

          <div className="grid gap-4">
            {topics.map((topic, index) => (
              <Card key={index} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-foreground mb-2">
                        {topic.title}
                      </h4>
                      <p className="text-muted-foreground mb-3">
                        {topic.description}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => saveTopic(topic)}
                      className={savedTopics.some(t => t.title === topic.title) ? 'text-accent' : ''}
                    >
                      <BookmarkSimple 
                        size={16} 
                        weight={savedTopics.some(t => t.title === topic.title) ? 'fill' : 'regular'}
                      />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                      {topic.contentType}
                    </Badge>
                    <Badge className={getDifficultyColor(topic.difficulty)} variant="secondary">
                      {topic.difficulty}
                    </Badge>
                    <Badge variant="secondary">
                      {topic.estimatedLength}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Target Audience:</span> {topic.targetAudience}
                    </div>
                    
                    <div className="text-sm">
                      <span className="font-medium">SEO Keywords:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {topic.seoKeywords.map((keyword, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {savedTopics.length > 0 && (
        <div className="space-y-4">
          <Separator />
          
          <h3 className="text-lg font-semibold">Content Calendar ({savedTopics.length} topics)</h3>
          
          <div className="grid gap-3">
            {savedTopics.slice(0, 3).map((topic, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {topic.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {topic.contentType} • {topic.difficulty} • {topic.estimatedLength}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => saveTopic(topic)}
                  >
                    <BookmarkSimple size={16} weight="fill" className="text-accent" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          
          {savedTopics.length > 3 && (
            <div className="text-center text-sm text-muted-foreground">
              And {savedTopics.length - 3} more saved topics...
            </div>
          )}
        </div>
      )}
    </div>
  )
}