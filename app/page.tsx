"use client"

import { useEffect, useState } from "react"
import OnboardingFlow from "@/components/onboarding-flow"
import QuestionFlow from "@/components/question-flow"
import Dashboard from "@/components/dashboard"

export default function Home() {
  const [currentView, setCurrentView] = useState<"onboarding" | "questions" | "dashboard">("onboarding")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const onboardingComplete = localStorage.getItem("onboarding_complete")
    const categoryData = localStorage.getItem("category_data")

    if (onboardingComplete === "true" && categoryData) {
      const userData = JSON.parse(localStorage.getItem("user_data") || "{}")
      const completedCategories = Object.keys(JSON.parse(categoryData))

      // Check if all selected categories have been answered
      if (userData.interests && userData.interests.length > 0) {
        const allAnswered = userData.interests.every((cat: string) => completedCategories.includes(cat))
        if (allAnswered) {
          setCurrentView("dashboard")
        } else {
          setSelectedCategories(userData.interests)
          setCurrentView("questions")
        }
      }
    }
    setIsLoading(false)
  }, [])

  const handleOnboardingComplete = (interests: string[]) => {
    setSelectedCategories(interests)
    setCurrentCategoryIndex(0)
    setCurrentView("questions")
  }

  const handleQuestionComplete = () => {
    if (currentCategoryIndex < selectedCategories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1)
    } else {
      localStorage.setItem("onboarding_complete", "true")
      setCurrentView("dashboard")
    }
  }

  const handleQuestionBack = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1)
    } else {
      setCurrentView("onboarding")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      {currentView === "onboarding" && <OnboardingFlow onComplete={handleOnboardingComplete} />}

      {currentView === "questions" && selectedCategories.length > 0 && (
        <QuestionFlow
          category={selectedCategories[currentCategoryIndex]}
          onComplete={handleQuestionComplete}
          onBack={handleQuestionBack}
        />
      )}

      {currentView === "dashboard" && <Dashboard />}
    </main>
  )
}
