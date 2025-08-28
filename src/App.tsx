import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { KeywordPlanner } from '@/components/KeywordPlanner'
import { MetaDescriptionGenerator } from '@/components/MetaDescriptionGenerator'
import { LocalSEOChecker } from '@/components/LocalSEOChecker'
import { ContentTopicGenerator } from '@/components/ContentTopicGenerator'
import { PageTitleOptimizer } from '@/components/PageTitleOptimizer'
import { MagnifyingGlass, Target, MapPin, PencilSimple, TextAa } from '@phosphor-icons/react'

function App() {
  const [activeTab, setActiveTab] = useState('keywords')

  const tools = [
    {
      id: 'keywords',
      title: 'Keyword Planner',
      description: 'Discover relevant keywords for your therapy practice',
      icon: MagnifyingGlass,
      component: KeywordPlanner
    },
    {
      id: 'meta',
      title: 'Meta Description Generator',
      description: 'Create compelling meta descriptions for better CTR',
      icon: Target,
      component: MetaDescriptionGenerator
    },
    {
      id: 'local',
      title: 'Local SEO Checker',
      description: 'Analyze and improve your local search presence',
      icon: MapPin,
      component: LocalSEOChecker
    },
    {
      id: 'content',
      title: 'Content Topic Generator',
      description: 'Get blog post ideas that attract clients',
      icon: PencilSimple,
      component: ContentTopicGenerator
    },
    {
      id: 'titles',
      title: 'Page Title Optimizer',
      description: 'Optimize page titles for search and clicks',
      icon: TextAa,
      component: PageTitleOptimizer
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            TherapyToolkit
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional SEO tools designed specifically for therapist websites. 
            Improve your online visibility and connect with more clients.
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
            {tools.map((tool) => {
              const Icon = tool.icon
              return (
                <TabsTrigger
                  key={tool.id}
                  value={tool.id}
                  className="flex flex-col gap-2 p-4 h-auto"
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium hidden sm:block">
                    {tool.title}
                  </span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {tools.map((tool) => {
            const Component = tool.component
            return (
              <TabsContent key={tool.id} value={tool.id}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <tool.icon size={24} className="text-primary" />
                      {tool.title}
                    </CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Component />
                  </CardContent>
                </Card>
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </div>
  )
}

export default App