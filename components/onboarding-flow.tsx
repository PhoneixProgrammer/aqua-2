"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, DollarSign, GraduationCap, Heart, Users, Palmtree, Sparkles } from "lucide-react"

interface OnboardingFlowProps {
  onComplete: (interests: string[]) => void
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0)
  const [userData, setUserData] = useState({
    name: "",
    age: "",
    interests: [] as string[],
    goals: [] as string[],
  })

  const categories = [
    { id: "finance", label: "Finance", icon: DollarSign, color: "text-emerald-500" },
    { id: "education", label: "Education", icon: GraduationCap, color: "text-blue-500" },
    { id: "family", label: "Family", icon: Heart, color: "text-rose-500" },
    { id: "friends", label: "Friends", icon: Users, color: "text-purple-500" },
    { id: "activities", label: "Weekend Activities", icon: Palmtree, color: "text-amber-500" },
  ]

  const handleInterestToggle = (interest: string) => {
    setUserData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      localStorage.setItem("user_data", JSON.stringify(userData))
      onComplete(userData.interests)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 0:
        return true
      case 1:
        return userData.name.length > 0 && userData.age.length > 0
      case 2:
        return userData.interests.length > 0
      case 3:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 p-4 rounded-full">
              <Sparkles className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-balance">
            {step === 0 && "Welcome to Aqua Thistle"}
            {step === 1 && "Let's Get to Know You"}
            {step === 2 && "What Matters Most to You?"}
            {step === 3 && "You're All Set!"}
          </CardTitle>
          <CardDescription className="text-base">
            {step === 0 && "Your AI companion for making better life decisions"}
            {step === 1 && "Tell us a bit about yourself"}
            {step === 2 && "Select the areas where you need guidance"}
            {step === 3 && "Let's start making smarter decisions together"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-indigo-50 dark:bg-indigo-950/50">
                  <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-lg">
                    <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Unbiased Answers</h3>
                    <p className="text-sm text-muted-foreground">
                      Get clear, personalized guidance on life's most pressing questions
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-purple-50 dark:bg-purple-950/50">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Plan Ahead</h3>
                    <p className="text-sm text-muted-foreground">
                      Discover important decisions coming your way and prepare in advance
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-pink-50 dark:bg-pink-950/50">
                  <div className="bg-pink-100 dark:bg-pink-900 p-2 rounded-lg">
                    <Heart className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Stay on Track</h3>
                    <p className="text-sm text-muted-foreground">
                      Your AI assistant ensures you're making progress toward your goals
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">What's your name?</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  className="text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">How old are you?</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={userData.age}
                  onChange={(e) => setUserData({ ...userData, age: e.target.value })}
                  className="text-lg"
                />
              </div>
            </div>
          )}

          {/* Step 2: Interests */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Select all that apply (choose at least one)</p>
              <div className="grid gap-3">
                {categories.map((category) => {
                  const Icon = category.icon
                  const isSelected = userData.interests.includes(category.id)
                  return (
                    <div
                      key={category.id}
                      onClick={() => handleInterestToggle(category.id)}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50"
                          : "border-border hover:border-indigo-300 dark:hover:border-indigo-700"
                      }`}
                    >
                      <Checkbox checked={isSelected} />
                      <Icon className={`h-6 w-6 ${category.color}`} />
                      <span className="font-medium">{category.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 3: Ready */}
          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-2">Welcome, {userData.name}!</h3>
                <p className="text-muted-foreground">
                  We've personalized your dashboard based on your interests. Let's start making better decisions
                  together!
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {userData.interests.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Focus Areas</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">0</div>
                  <div className="text-sm text-muted-foreground">Goals Set</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">100%</div>
                  <div className="text-sm text-muted-foreground">Ready</div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 pt-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === step
                    ? "w-8 bg-indigo-600 dark:bg-indigo-400"
                    : i < step
                      ? "w-2 bg-indigo-600 dark:bg-indigo-400"
                      : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            <Button onClick={handleNext} disabled={!canProceed()} className="ml-auto">
              {step === 3 ? "Get Started" : "Continue"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
