
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Sparkles, 
  FileText, 
  Image, 
  Video,
  Share2,
  Copy,
  Download,
  RefreshCw,
  Brain,
  Target,
  Palette,
  Zap,
  Star,
  TrendingUp
} from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface GeneratedContent {
  content: any
  contentType: string
  generatedAt: string
  metadata: any
}

interface ContentTemplate {
  id: string
  name: string
  description: string
  type: string
  prompts: string[]
  style: string
}

export default function AIContentGenerator({ projectId }: { projectId?: string }) {
  const [generating, setGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [contentType, setContentType] = useState('TEXT')
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('professional')
  const [targetAudience, setTargetAudience] = useState('')
  const [brandVoice, setBrandVoice] = useState('professional')
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null)

  const contentTypes = [
    { value: 'TEXT', label: 'General Text', icon: FileText, description: 'Any type of text content' },
    { value: 'MARKETING_COPY', label: 'Marketing Copy', icon: Target, description: 'Sales and marketing materials' },
    { value: 'SOCIAL_MEDIA', label: 'Social Media', icon: Share2, description: 'Social media posts and content' },
    { value: 'BLOG_POST', label: 'Blog Post', icon: FileText, description: 'Structured blog articles' },
  ]

  const styles = [
    'Professional', 'Casual', 'Formal', 'Creative', 'Technical', 'Persuasive', 'Informative', 'Conversational'
  ]

  const brandVoices = [
    'Professional', 'Friendly', 'Authoritative', 'Playful', 'Inspiring', 'Trustworthy', 'Innovative', 'Expert'
  ]

  const templates: ContentTemplate[] = [
    {
      id: '1',
      name: 'Product Launch',
      description: 'Announce new product or feature',
      type: 'MARKETING_COPY',
      prompts: [
        'Create compelling copy for our new product launch',
        'Focus on key benefits and unique value proposition',
        'Include clear call-to-action for early adopters'
      ],
      style: 'persuasive'
    },
    {
      id: '2',
      name: 'Social Media Campaign',
      description: 'Multi-platform social content',
      type: 'SOCIAL_MEDIA',
      prompts: [
        'Create engaging social media content for our campaign',
        'Make it shareable and platform-optimized',
        'Include relevant hashtags and engagement hooks'
      ],
      style: 'conversational'
    },
    {
      id: '3',
      name: 'Technical Documentation',
      description: 'Clear technical explanations',
      type: 'TEXT',
      prompts: [
        'Create clear technical documentation',
        'Make complex concepts accessible',
        'Include practical examples and use cases'
      ],
      style: 'technical'
    }
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt for content generation')
      return
    }

    setGenerating(true)
    try {
      const response = await fetch('/api/wecreate/ai-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contentType,
          prompt,
          projectId,
          style,
          targetAudience,
          brandVoice
        })
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedContent(data.data)
        toast.success('Content generated successfully!')
      } else {
        toast.error(data.error || 'Failed to generate content')
      }
    } catch (error) {
      console.error('Error generating content:', error)
      toast.error('Failed to generate content')
    } finally {
      setGenerating(false)
    }
  }

  const useTemplate = (template: ContentTemplate) => {
    setSelectedTemplate(template)
    setContentType(template.type)
    setStyle(template.style)
    setPrompt(template.prompts.join('. '))
    toast.success(`Template "${template.name}" applied`)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Content copied to clipboard!')
  }

  const renderGeneratedContent = () => {
    if (!generatedContent) return null

    const { content, contentType: type } = generatedContent

    if (type === 'TEXT') {
      return (
        <div className="space-y-4">
          <div className="prose max-w-none">
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap font-sans text-gray-800">{content}</pre>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(content)}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
        </div>
      )
    }

    if (type === 'MARKETING_COPY') {
      return (
        <div className="space-y-6">
          {content.headline && (
            <div>
              <Label className="text-sm font-medium text-gray-700">Headline</Label>
              <div className="mt-1 p-3 bg-blue-50 rounded-lg">
                <h2 className="text-xl font-bold text-blue-900">{content.headline}</h2>
              </div>
            </div>
          )}

          {content.subheadline && (
            <div>
              <Label className="text-sm font-medium text-gray-700">Subheadline</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{content.subheadline}</p>
              </div>
            </div>
          )}

          {content.bodyCopy && (
            <div>
              <Label className="text-sm font-medium text-gray-700">Body Copy</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{content.bodyCopy}</p>
                </div>
              </div>
            </div>
          )}

          {content.bulletPoints && content.bulletPoints.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-700">Key Points</Label>
              <div className="mt-1 p-3 bg-green-50 rounded-lg">
                <ul className="space-y-1">
                  {content.bulletPoints.map((point: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {content.callToAction && (
            <div>
              <Label className="text-sm font-medium text-gray-700">Call to Action</Label>
              <div className="mt-1 p-3 bg-orange-50 rounded-lg">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  {content.callToAction}
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(JSON.stringify(content, null, 2))}>
              <Copy className="w-4 h-4 mr-2" />
              Copy All
            </Button>
          </div>
        </div>
      )
    }

    if (type === 'SOCIAL_MEDIA') {
      return (
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-gray-800">{content.content}</p>
            </div>
            
            {content.hashtags && content.hashtags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {content.hashtags.map((hashtag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-blue-600">
                    {hashtag}
                  </Badge>
                ))}
              </div>
            )}

            {content.callToAction && (
              <div className="mt-3 p-2 bg-white rounded border-l-4 border-blue-500">
                <span className="text-sm font-medium text-blue-700">CTA: </span>
                <span className="text-gray-700">{content.callToAction}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(content.content + '\n\n' + content.hashtags?.join(' '))}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Post
            </Button>
          </div>
        </div>
      )
    }

    if (type === 'BLOG_POST') {
      return (
        <div className="space-y-6">
          {content.title && (
            <div>
              <Label className="text-sm font-medium text-gray-700">Title</Label>
              <div className="mt-1 p-3 bg-purple-50 rounded-lg">
                <h1 className="text-2xl font-bold text-purple-900">{content.title}</h1>
              </div>
            </div>
          )}

          {content.metaDescription && (
            <div>
              <Label className="text-sm font-medium text-gray-700">Meta Description</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{content.metaDescription}</p>
              </div>
            </div>
          )}

          {content.introduction && (
            <div>
              <Label className="text-sm font-medium text-gray-700">Introduction</Label>
              <div className="mt-1 p-3 bg-blue-50 rounded-lg">
                <p className="text-gray-700">{content.introduction}</p>
              </div>
            </div>
          )}

          {content.sections && content.sections.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-700">Sections</Label>
              <div className="mt-1 space-y-4">
                {content.sections.map((section: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">{section.heading}</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{section.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {content.conclusion && (
            <div>
              <Label className="text-sm font-medium text-gray-700">Conclusion</Label>
              <div className="mt-1 p-3 bg-green-50 rounded-lg">
                <p className="text-gray-700">{content.conclusion}</p>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(JSON.stringify(content, null, 2))}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Article
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <pre className="whitespace-pre-wrap text-sm text-gray-700">
          {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
        </pre>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Content Generator</h2>
        <p className="text-gray-600">Create compelling content with AI assistance</p>
      </div>

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generator">Content Generator</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                  Content Settings
                </CardTitle>
                <CardDescription>Configure your content generation preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contentType">Content Type</Label>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center">
                            <type.icon className="w-4 h-4 mr-2" />
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-gray-500">{type.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="prompt">Content Brief</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe what content you want to generate..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="style">Style</Label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {styles.map((s) => (
                          <SelectItem key={s} value={s.toLowerCase()}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="brandVoice">Brand Voice</Label>
                    <Select value={brandVoice} onValueChange={setBrandVoice}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {brandVoices.map((voice) => (
                          <SelectItem key={voice} value={voice.toLowerCase()}>
                            {voice}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="targetAudience">Target Audience (Optional)</Label>
                  <Input
                    id="targetAudience"
                    placeholder="e.g., Tech professionals, young entrepreneurs..."
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={generating || !prompt.trim()}
                  className="w-full"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>

                {generating && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>AI is analyzing your brief...</span>
                    </div>
                    <Progress value={generating ? 70 : 0} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generated Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-green-600" />
                  Generated Content
                </CardTitle>
                {generatedContent && (
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{generatedContent.contentType}</Badge>
                    <span className="text-xs text-gray-500">
                      Generated at {new Date(generatedContent.generatedAt).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {generatedContent ? (
                  renderGeneratedContent()
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Generated content will appear here</p>
                    <p className="text-sm">Use the form to create AI-powered content</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => useTemplate(template)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </div>
                      <Badge variant="outline">{template.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Palette className="w-4 h-4 mr-1" />
                        Style: {template.style}
                      </div>
                      <div className="text-sm text-gray-500">
                        {template.prompts.length} prompts included
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      <Star className="w-4 h-4 mr-2" />
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
