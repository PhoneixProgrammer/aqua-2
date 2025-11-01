"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, DollarSign, GraduationCap, Heart, Users, Palmtree, CheckCircle2 } from "lucide-react"

interface QuestionFlowProps {
  category: string
  onComplete: (data: any) => void
  onBack: () => void
}

const categoryQuestions = {
  finance: {
    title: "Finance Setup",
    icon: DollarSign,
    color: "emerald",
    questions: [
      {
        id: "income",
        type: "number",
        label: "What's your monthly income?",
        placeholder: "e.g., 5000",
        prefix: "$",
      },
      {
        id: "savings_goal",
        type: "number",
        label: "How much do you want to save monthly?",
        placeholder: "e.g., 1000",
        prefix: "$",
      },
      {
        id: "rent_budget",
        type: "number",
        label: "What's your monthly rent/housing budget?",
        placeholder: "e.g., 1500",
        prefix: "$",
      },
      {
        id: "location",
        type: "text",
        label: "Where do you live or want to live?",
        placeholder: "e.g., San Francisco",
      },
      {
        id: "financial_priority",
        type: "radio",
        label: "What's your top financial priority?",
        options: [
          { value: "save", label: "Building savings" },
          { value: "invest", label: "Growing investments" },
          { value: "debt", label: "Paying off debt" },
          { value: "budget", label: "Sticking to budget" },
        ],
      },
    ],
  },
  education: {
    title: "Education Goals",
    icon: GraduationCap,
    color: "blue",
    questions: [
      {
        id: "current_role",
        type: "text",
        label: "What's your current role or field?",
        placeholder: "e.g., Software Developer",
      },
      {
        id: "target_role",
        type: "text",
        label: "What role are you working towards?",
        placeholder: "e.g., Program Manager",
      },
      {
        id: "study_hours",
        type: "slider",
        label: "How many hours per week can you dedicate to learning?",
        min: 0,
        max: 40,
        step: 1,
        suffix: " hours/week",
      },
      {
        id: "certification",
        type: "text",
        label: "What certification or course are you pursuing?",
        placeholder: "e.g., ABC Certification",
      },
      {
        id: "learning_style",
        type: "radio",
        label: "What's your preferred learning style?",
        options: [
          { value: "online", label: "Online courses" },
          { value: "books", label: "Books and reading" },
          { value: "practice", label: "Hands-on practice" },
          { value: "group", label: "Study groups" },
        ],
      },
    ],
  },
  family: {
    title: "Family Connections",
    icon: Heart,
    color: "rose",
    questions: [
      {
        id: "family_size",
        type: "number",
        label: "How many close family members do you have?",
        placeholder: "e.g., 5",
      },
      {
        id: "distance",
        type: "radio",
        label: "How far away does most of your family live?",
        options: [
          { value: "same_city", label: "Same city" },
          { value: "nearby", label: "Nearby (1-2 hours)" },
          { value: "far", label: "Far (different state)" },
          { value: "very_far", label: "Very far (different country)" },
        ],
      },
      {
        id: "contact_frequency",
        type: "slider",
        label: "How often do you currently connect with family?",
        min: 0,
        max: 30,
        step: 1,
        suffix: " times/month",
      },
      {
        id: "goal_frequency",
        type: "slider",
        label: "How often would you like to connect?",
        min: 0,
        max: 30,
        step: 1,
        suffix: " times/month",
      },
      {
        id: "connection_type",
        type: "radio",
        label: "What's your preferred way to stay connected?",
        options: [
          { value: "video", label: "Video calls" },
          { value: "phone", label: "Phone calls" },
          { value: "text", label: "Text messages" },
          { value: "visits", label: "In-person visits" },
        ],
      },
    ],
  },
  friends: {
    title: "Social Life",
    icon: Users,
    color: "purple",
    questions: [
      {
        id: "close_friends",
        type: "number",
        label: "How many close friends do you have?",
        placeholder: "e.g., 8",
      },
      {
        id: "social_frequency",
        type: "slider",
        label: "How many social events do you attend monthly?",
        min: 0,
        max: 20,
        step: 1,
        suffix: " events/month",
      },
      {
        id: "new_connections",
        type: "radio",
        label: "Are you looking to make new friends?",
        options: [
          { value: "yes_active", label: "Yes, actively seeking" },
          { value: "yes_open", label: "Yes, but casually" },
          { value: "maintain", label: "Just maintaining current friendships" },
          { value: "no", label: "Not a priority right now" },
        ],
      },
      {
        id: "social_style",
        type: "radio",
        label: "What's your preferred social setting?",
        options: [
          { value: "large", label: "Large group gatherings" },
          { value: "small", label: "Small intimate groups" },
          { value: "one_on_one", label: "One-on-one hangouts" },
          { value: "mixed", label: "Mix of all" },
        ],
      },
      {
        id: "interests",
        type: "text",
        label: "What hobbies or interests do you want to explore with friends?",
        placeholder: "e.g., hiking, gaming, cooking",
      },
    ],
  },
  activities: {
    title: "Weekend Activities",
    icon: Palmtree,
    color: "amber",
    questions: [
      {
        id: "activity_budget",
        type: "number",
        label: "What's your monthly budget for activities?",
        placeholder: "e.g., 300",
        prefix: "$",
      },
      {
        id: "activity_frequency",
        type: "slider",
        label: "How many activities do you want to do monthly?",
        min: 0,
        max: 20,
        step: 1,
        suffix: " activities/month",
      },
      {
        id: "activity_type",
        type: "radio",
        label: "What type of activities do you prefer?",
        options: [
          { value: "outdoor", label: "Outdoor adventures" },
          { value: "cultural", label: "Cultural events (museums, concerts)" },
          { value: "sports", label: "Sports and fitness" },
          { value: "relaxation", label: "Relaxation and wellness" },
        ],
      },
      {
        id: "planning_style",
        type: "radio",
        label: "How do you prefer to plan activities?",
        options: [
          { value: "advance", label: "Plan weeks in advance" },
          { value: "week", label: "Plan at start of week" },
          { value: "spontaneous", label: "Spontaneous decisions" },
          { value: "mix", label: "Mix of planned and spontaneous" },
        ],
      },
      {
        id: "travel_interest",
        type: "radio",
        label: "How interested are you in travel?",
        options: [
          { value: "very", label: "Very interested - travel often" },
          { value: "moderate", label: "Moderate - few times a year" },
          { value: "occasional", label: "Occasional - once or twice a year" },
          { value: "not_much", label: "Not much - prefer local activities" },
        ],
      },
    ],
  },
}

export default function QuestionFlow({ category, onComplete, onBack }: QuestionFlowProps) {
  const categoryData = categoryQuestions[category as keyof typeof categoryQuestions]
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})

  useEffect(() => {
    setCurrentStep(0)
    setAnswers({})
  }, [category])

  if (!categoryData) return null

  const Icon = categoryData.icon
  const currentQuestion = categoryData.questions[currentStep]
  const progress = ((currentStep + 1) / categoryData.questions.length) * 100

  const handleNext = () => {
    if (currentStep < categoryData.questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      const existingData = JSON.parse(localStorage.getItem("category_data") || "{}")
      existingData[category] = answers
      localStorage.setItem("category_data", JSON.stringify(existingData))
      onComplete(answers)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      onBack()
    }
  }

  const handleAnswerChange = (value: any) => {
    setAnswers({ ...answers, [currentQuestion.id]: value })
  }

  const isAnswered = answers[currentQuestion.id] !== undefined && answers[currentQuestion.id] !== ""

  const colorClasses = {
    emerald: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950",
    blue: "text-blue-500 bg-blue-50 dark:bg-blue-950",
    rose: "text-rose-500 bg-rose-50 dark:bg-rose-950",
    purple: "text-purple-500 bg-purple-50 dark:bg-purple-950",
    amber: "text-amber-500 bg-amber-50 dark:bg-amber-950",
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <Button size="icon" variant="ghost" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className={`p-2 rounded-lg ${colorClasses[categoryData.color as keyof typeof colorClasses]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold">{categoryData.title}</h1>
            <p className="text-xs text-muted-foreground">
              Question {currentStep + 1} of {categoryData.questions.length}
            </p>
          </div>
        </div>
        <div className="max-w-md mx-auto mt-3">
          <Progress value={progress} className="h-1.5" />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto px-4 py-8">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-xl">{currentQuestion.label}</CardTitle>
            <CardDescription>Help us personalize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentQuestion.type === "number" && (
              <div className="space-y-2">
                <Label htmlFor="answer">Your answer</Label>
                <div className="relative">
                  {currentQuestion.prefix && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {currentQuestion.prefix}
                    </span>
                  )}
                  <Input
                    id="answer"
                    type="number"
                    placeholder={currentQuestion.placeholder}
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    className={currentQuestion.prefix ? "pl-8" : ""}
                  />
                </div>
              </div>
            )}

            {currentQuestion.type === "text" && (
              <div className="space-y-2">
                <Label htmlFor="answer">Your answer</Label>
                <Input
                  id="answer"
                  type="text"
                  placeholder={currentQuestion.placeholder}
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                />
              </div>
            )}

            {currentQuestion.type === "slider" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Your answer</Label>
                  <span className="text-2xl font-bold">
                    {answers[currentQuestion.id] || currentQuestion.min || 0}
                    {currentQuestion.suffix}
                  </span>
                </div>
                <Slider
                  value={[answers[currentQuestion.id] || currentQuestion.min || 0]}
                  onValueChange={(value) => handleAnswerChange(value[0])}
                  min={currentQuestion.min}
                  max={currentQuestion.max}
                  step={currentQuestion.step}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {currentQuestion.min}
                    {currentQuestion.suffix}
                  </span>
                  <span>
                    {currentQuestion.max}
                    {currentQuestion.suffix}
                  </span>
                </div>
              </div>
            )}

            {currentQuestion.type === "radio" && (
              <RadioGroup value={answers[currentQuestion.id]} onValueChange={handleAnswerChange}>
                <div className="space-y-3">
                  {currentQuestion.options?.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleAnswerChange(option.value)}
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                        {option.label}
                      </Label>
                      {answers[currentQuestion.id] === option.value && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}

            <Button onClick={handleNext} disabled={!isAnswered} className="w-full" size="lg">
              {currentStep < categoryData.questions.length - 1 ? "Next Question" : "Complete Setup"}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
