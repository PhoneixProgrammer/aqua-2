"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import ChatButton from "./ChatWindow"
import {
  DollarSign,
  GraduationCap,
  Heart,
  Users,
  Palmtree,
  Menu,
  ChevronRight,
  Settings,
  LogOut,
  TrendingUp,
  Mic,
  Plus,
} from "lucide-react"
import GoalCircle from "@/components/goal-circle"
import QuizCard from "@/components/quiz-card"
import TipCard from "@/components/tip-card"
import CategoryView from "@/components/category-view"

export default function Dashboard() {
  const [userData, setUserData] = useState<any>(null)
  const [categoryData, setCategoryData] = useState<any>({})
  const [currentView, setCurrentView] = useState<"dashboard" | "category">("dashboard")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showMenu, setShowMenu] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("user_data")
    const catData = localStorage.getItem("category_data")
    if (data) {
      setUserData(JSON.parse(data))
    }
    if (catData) {
      setCategoryData(JSON.parse(catData))
    }
  }, [])

  const calculateBudget = () => {
    if (!categoryData.finance) return null
    const { income, savings_goal, rent_budget } = categoryData.finance
    const monthlyIncome = Number.parseFloat(income) || 0
    const savings = Number.parseFloat(savings_goal) || 0
    const rent = Number.parseFloat(rent_budget) || 0
    const food = monthlyIncome * 0.15 // Estimate 15% for food
    const leisure = monthlyIncome * 0.1 // Estimate 10% for leisure
    const spent = rent + food + leisure
    const percentage = monthlyIncome > 0 ? (spent / monthlyIncome) * 100 : 0

    return {
      spent: spent.toFixed(0),
      total: monthlyIncome.toFixed(0),
      percentage: percentage.toFixed(1),
      savings,
      rent,
      food: food.toFixed(0),
      leisure: leisure.toFixed(0),
    }
  }

  const calculateEducationProgress = () => {
    if (!categoryData.education) return null
    const { study_hours, target_role, certification } = categoryData.education
    const targetHours = 20 // Recommended hours per week
    const progress = Math.min((Number.parseFloat(study_hours) / targetHours) * 100, 100)
    const difference = targetHours - Number.parseFloat(study_hours)

    return {
      progress: progress.toFixed(0),
      difference: difference.toFixed(0),
      targetRole: target_role || "your goal",
      certification: certification || "your certification",
      isOnTrack: difference <= 0,
    }
  }

  const calculateDailyGoals = () => {
    const goals = []

    if (categoryData.finance) {
      const budget = calculateBudget()
      const moneyProgress = budget
        ? Math.min((Number.parseFloat(budget.savings) / Number.parseFloat(budget.total)) * 100, 100)
        : 0
      goals.push({ label: "Money", value: Math.round(moneyProgress), color: "amber" })
    }

    if (categoryData.education) {
      const edu = calculateEducationProgress()
      goals.push({ label: "Study", value: Number.parseInt(edu?.progress || "0"), color: "indigo" })
    }

    if (categoryData.friends) {
      const { social_frequency } = categoryData.friends
      const socialProgress = Math.min((Number.parseFloat(social_frequency) / 10) * 100, 100)
      goals.push({ label: "Social", value: Math.round(socialProgress), color: "purple" })
    }

    if (categoryData.activities) {
      const { activity_frequency } = categoryData.activities
      const activityProgress = Math.min((Number.parseFloat(activity_frequency) / 8) * 100, 100)
      goals.push({ label: "Active", value: Math.round(activityProgress), color: "rose" })
    }

    if (categoryData.family) {
      const { contact_frequency, goal_frequency } = categoryData.family
      const familyProgress = Math.min(
        (Number.parseFloat(contact_frequency) / Number.parseFloat(goal_frequency || 10)) * 100,
        100,
      )
      goals.push({ label: "Family", value: Math.round(familyProgress), color: "emerald" })
    }

    return goals.slice(0, 3) // Show top 3 goals
  }

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setCurrentView("category")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setSelectedCategory(null)
  }

  const handleResetOnboarding = () => {
    localStorage.removeItem("onboarding_complete")
    localStorage.removeItem("user_data")
    localStorage.removeItem("category_data")
    window.location.reload()
  }

  if (currentView === "category" && selectedCategory) {
    return <CategoryView category={selectedCategory} onBack={handleBackToDashboard} />
  }

  const budget = calculateBudget()
  const education = calculateEducationProgress()
  const dailyGoals = calculateDailyGoals()

  const overallProgress =
    dailyGoals.length > 0 ? Math.round(dailyGoals.reduce((sum, goal) => sum + goal.value, 0) / dailyGoals.length) : 0

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3 flex-1">
            <div className="bg-muted px-4 py-2 rounded-full flex items-center gap-2">
              <span className="text-sm font-semibold">{overallProgress}% goal reached</span>
            </div>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Mic className="h-4 w-4" />
            </Button>
          </div>
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setShowMenu(!showMenu)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {showMenu && (
          <div className="absolute right-4 top-14 bg-card border border-border rounded-lg shadow-lg p-2 w-48 z-50">
            <Button variant="ghost" className="w-full justify-start" onClick={() => setShowMenu(false)}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={handleResetOnboarding}>
              <LogOut className="h-4 w-4 mr-2" />
              Reset Demo
            </Button>
          </div>
        )}
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6 pb-24">
        {budget ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">This Month's Budget</CardTitle>
              <Badge variant="secondary">May</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-2xl font-bold">
                  ${budget.spent} / ${budget.total}
                </div>
                <Progress value={Number.parseFloat(budget.percentage)} className="mt-2 h-2" />
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                  <span className="text-muted-foreground">Savings ${budget.savings}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                  <span className="text-muted-foreground">Food ${budget.food}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                  <span className="text-muted-foreground">Leisure ${budget.leisure}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          userData?.interests?.includes("finance") && (
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-xl font-bold mb-2">💰 Let's talk money!</div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Set up your finance profile to get personalized budgeting tips and track your savings goals.
                    </p>
                    <Button size="sm" onClick={() => handleCategoryClick("finance")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Set Up Finance
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        )}

        {education ? (
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-indigo-200 dark:border-indigo-800">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="text-2xl font-bold mb-2">
                    {education.isOnTrack ? "🔥 You're crushing it!" : `${education.difference}hrs behind this week`}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {education.isOnTrack
                      ? `Keep up the momentum! ${education.certification} is within reach.`
                      : `Stay focused! ${education.certification} is key to becoming ${education.targetRole}.`}
                  </p>
                  <Button variant="outline" size="sm" className="bg-background">
                    Details
                  </Button>
                </div>
                <div className="bg-background/50 p-3 rounded-full">
                  <GraduationCap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          userData?.interests?.includes("education") && (
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-xl font-bold mb-2">📚 Level up your skills!</div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Tell us about your learning goals and we'll help you stay on track with personalized study plans.
                    </p>
                    <Button size="sm" onClick={() => handleCategoryClick("education")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Set Up Education
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        )}

        {dailyGoals.length > 0 ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg">My Goals For Today</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary">
                Edit
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {dailyGoals.map((goal) => (
                  <GoalCircle key={goal.label} label={goal.label} value={goal.value} color={goal.color} />
                ))}
              </div>
              {budget && (
                <>
                  <Button
                    variant="link"
                    className="w-full text-sm p-0 h-auto"
                    onClick={() => handleCategoryClick("finance")}
                  >
                    View ways to optimize your ${budget.total} budget →
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    Save ${(Number.parseFloat(budget.total) * 0.11).toFixed(0)} on transport costs!
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
            <CardContent className="pt-6 text-center">
              <div className="text-xl font-bold mb-2">🎯 No goals yet? Let's fix that!</div>
              <p className="text-sm text-muted-foreground mb-4">
                Set up your interests to get personalized daily goals and track your progress.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Quiz and Tip Cards */}
        <div className="grid grid-cols-2 gap-4">
          <QuizCard />
          <TipCard />
        </div>

        {budget && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">This month's savings goal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <div className="text-3xl font-bold">
                  {Math.round((Number.parseFloat(budget.savings) / Number.parseFloat(budget.total)) * 100)}%
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />${budget.savings}
                  </div>
                  <div className="text-xs text-muted-foreground">monthly goal</div>
                </div>
              </div>
              <Progress
                value={(Number.parseFloat(budget.savings) / Number.parseFloat(budget.total)) * 100}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                You're saving ${budget.savings} out of ${budget.total} income. Keep it up! 💪
              </p>
            </CardContent>
          </Card>
        )}

        {/* Category Navigation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Explore Your Interests</CardTitle>
            <CardDescription>Get personalized guidance in areas that matter to you</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {userData?.interests?.includes("finance") && (
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2 bg-transparent relative"
                onClick={() => handleCategoryClick("finance")}
              >
                <DollarSign className="h-6 w-6 text-emerald-500" />
                <span className="text-sm font-medium">Finance</span>
                {!categoryData.finance && (
                  <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                    Setup
                  </Badge>
                )}
              </Button>
            )}
            {userData?.interests?.includes("education") && (
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2 bg-transparent relative"
                onClick={() => handleCategoryClick("education")}
              >
                <GraduationCap className="h-6 w-6 text-blue-500" />
                <span className="text-sm font-medium">Education</span>
                {!categoryData.education && (
                  <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                    Setup
                  </Badge>
                )}
              </Button>
            )}
            {userData?.interests?.includes("family") && (
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2 bg-transparent relative"
                onClick={() => handleCategoryClick("family")}
              >
                <Heart className="h-6 w-6 text-rose-500" />
                <span className="text-sm font-medium">Family</span>
                {!categoryData.family && (
                  <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                    Setup
                  </Badge>
                )}
              </Button>
            )}
            {userData?.interests?.includes("friends") && (
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2 bg-transparent relative"
                onClick={() => handleCategoryClick("friends")}
              >
                <Users className="h-6 w-6 text-purple-500" />
                <span className="text-sm font-medium">Friends</span>
                {!categoryData.friends && (
                  <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                    Setup
                  </Badge>
                )}
              </Button>
            )}
            {userData?.interests?.includes("activities") && (
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2 bg-transparent relative"
                onClick={() => handleCategoryClick("activities")}
              >
                <Palmtree className="h-6 w-6 text-amber-500" />
                <span className="text-sm font-medium">Activities</span>
                {!categoryData.activities && (
                  <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                    Setup
                  </Badge>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </main>
      <ChatButton userProfile={userData} isOpen={isChatOpen} setIsOpen={setIsChatOpen}/>
    </div>
  )
}
