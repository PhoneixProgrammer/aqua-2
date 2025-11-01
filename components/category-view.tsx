"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  GraduationCap,
  Heart,
  Users,
  Palmtree,
  Target,
  Edit,
} from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import QuestionFlow from "./question-flow"

interface CategoryViewProps {
  category: string
  onBack: () => void
}

const generateCategoryData = (category: string, userData: any) => {
  const baseData = {
    finance: {
      title: "Finance",
      icon: DollarSign,
      color: "emerald",
      insights: [
        {
          label: "Monthly Savings",
          value: userData?.savings_goal ? `$${userData.savings_goal}` : "$425",
          change: "+$75",
          trend: "up",
        },
        { label: "Budget Adherence", value: "78%", change: "+12%", trend: "up" },
        { label: "Investment Growth", value: "$2,340", change: "+18%", trend: "up" },
      ],
      chartData: [
        { month: "Jan", savings: 250, spending: 1800 },
        { month: "Feb", savings: 300, spending: 1750 },
        { month: "Mar", savings: 350, spending: 1700 },
        {
          month: "Apr",
          savings: userData?.savings_goal ? Number.parseInt(userData.savings_goal) : 425,
          spending: 1650,
        },
      ],
      tips: [
        userData?.location && userData?.income
          ? `With $${userData.income}/month in ${userData.location}, consider roommates to save 30-40% on housing costs.`
          : "How could I afford housing in San Francisco with $75k income? Explore roommate options and neighborhoods.",
        userData?.financial_priority === "save"
          ? "Set up automatic transfers to savings on payday to build wealth effortlessly."
          : "Track your subscriptions - the average person spends $273/month on services they barely use.",
        userData?.rent_budget
          ? `With a $${userData.rent_budget} housing budget, you have ${(((Number.parseInt(userData.income || "0") - Number.parseInt(userData.rent_budget)) / Number.parseInt(userData.income || "1")) * 100).toFixed(0)}% of income for other expenses.`
          : "The 50/30/20 rule: 50% needs, 30% wants, 20% savings helps maintain financial balance.",
      ],
    },
    education: {
      title: "Education",
      icon: GraduationCap,
      color: "blue",
      insights: [
        {
          label: "Study Hours",
          value: userData?.study_hours ? `${userData.study_hours}h/wk` : "18h/wk",
          change: "-2h",
          trend: "down",
        },
        { label: "Course Progress", value: "76%", change: "+8%", trend: "up" },
        { label: "Certifications", value: "3", change: "+1", trend: "up" },
      ],
      chartData: [
        { week: "W1", hours: 22 },
        { week: "W2", hours: 20 },
        { week: "W3", hours: 19 },
        { week: "W4", hours: userData?.study_hours ? Number.parseInt(userData.study_hours) : 18 },
      ],
      tips: [
        userData?.certification
          ? `The ${userData.certification} is crucial for becoming a ${userData.target_role || "your target role"} - dedicate consistent daily time.`
          : "The ABC Certification is crucial for becoming a Program Manager - dedicate 2 hours daily.",
        userData?.learning_style === "group"
          ? "Study groups can improve retention by 40% - find peers working toward similar goals."
          : "Online learning platforms offer certifications that employers value - explore Coursera and LinkedIn Learning.",
        userData?.study_hours && Number.parseInt(userData.study_hours) < 10
          ? "Consider increasing study time to 10-15 hours/week for faster progress toward your certification."
          : "Consistency beats intensity - regular daily study sessions are more effective than cramming.",
      ],
    },
    family: {
      title: "Family",
      icon: Heart,
      color: "rose",
      insights: [
        {
          label: "Quality Time",
          value: userData?.goal_frequency
            ? `${Math.round(Number.parseInt(userData.goal_frequency) * 0.5)}h/wk`
            : "12h/wk",
          change: "+3h",
          trend: "up",
        },
        {
          label: "Connections",
          value: userData?.contact_frequency ? `${userData.contact_frequency}/mo` : "8/mo",
          change: "+2",
          trend: "up",
        },
        { label: "Family Events", value: "3", change: "+1", trend: "up" },
      ],
      chartData: [
        { week: "W1", hours: 8 },
        { week: "W2", hours: 10 },
        { week: "W3", hours: 11 },
        {
          week: "W4",
          hours: userData?.goal_frequency ? Math.round(Number.parseInt(userData.goal_frequency) * 0.5) : 12,
        },
      ],
      tips: [
        userData?.distance === "very_far"
          ? "For long-distance family, schedule regular video calls at consistent times to maintain strong bonds."
          : "Schedule regular family activities to create lasting memories and strengthen relationships.",
        userData?.connection_type === "video"
          ? "Video calls create stronger connections than text - aim for at least one video call per week."
          : "Mix communication methods - video calls, phone calls, and messages each serve different purposes.",
        userData?.goal_frequency &&
        userData?.contact_frequency &&
        Number.parseInt(userData.goal_frequency) > Number.parseInt(userData.contact_frequency)
          ? `You want to connect ${userData.goal_frequency} times/month but currently do ${userData.contact_frequency}. Start with small increases.`
          : "Share your career goals with family - their support and advice can be invaluable.",
      ],
    },
    friends: {
      title: "Friends",
      icon: Users,
      color: "purple",
      insights: [
        {
          label: "Social Events",
          value: userData?.social_frequency ? `${userData.social_frequency}/mo` : "6/mo",
          change: "+2",
          trend: "up",
        },
        { label: "Close Friends", value: userData?.close_friends || "4", change: "+4", trend: "up" },
        { label: "Group Activities", value: "8", change: "+3", trend: "up" },
      ],
      chartData: [
        { month: "Jan", events: 3 },
        { month: "Feb", events: 4 },
        { month: "Mar", events: 5 },
        { month: "Apr", events: userData?.social_frequency ? Number.parseInt(userData.social_frequency) : 6 },
      ],
      tips: [
        userData?.interests
          ? `Join clubs or groups focused on ${userData.interests} to meet like-minded people.`
          : "Join clubs or groups aligned with your interests to meet like-minded people.",
        userData?.new_connections === "yes_active"
          ? "Attend networking events and say yes to social invitations - new friendships require consistent effort."
          : "Maintain friendships by reaching out regularly - a simple text can strengthen bonds.",
        userData?.social_style === "one_on_one"
          ? "One-on-one hangouts create deeper connections - schedule regular coffee chats with friends."
          : "Balance social time with personal goals - quality connections matter more than quantity.",
      ],
    },
    activities: {
      title: "Weekend Activities",
      icon: Palmtree,
      color: "amber",
      insights: [
        {
          label: "Activities",
          value: userData?.activity_frequency ? `${userData.activity_frequency}/mo` : "12/mo",
          change: "+4",
          trend: "up",
        },
        { label: "New Experiences", value: "5", change: "+2", trend: "up" },
        {
          label: "Avg Cost",
          value: userData?.activity_budget
            ? `$${Math.round(Number.parseInt(userData.activity_budget) / (Number.parseInt(userData.activity_frequency) || 12))}`
            : "$45",
          change: "-$12",
          trend: "up",
        },
      ],
      chartData: [
        { month: "Jan", activities: 6, cost: 65 },
        { month: "Feb", activities: 8, cost: 55 },
        { month: "Mar", activities: 10, cost: 50 },
        {
          month: "Apr",
          activities: userData?.activity_frequency ? Number.parseInt(userData.activity_frequency) : 12,
          cost: userData?.activity_budget
            ? Math.round(
                Number.parseInt(userData.activity_budget) / (Number.parseInt(userData.activity_frequency) || 12),
              )
            : 45,
        },
      ],
      tips: [
        userData?.planning_style === "advance"
          ? "Planning ahead is great! Book popular activities early for better prices and availability."
          : "Plan weekend activities in advance to maximize enjoyment and minimize last-minute stress.",
        userData?.activity_type === "outdoor"
          ? "Explore free outdoor activities like hiking, parks, and beaches to stay within budget."
          : "Explore free local events like concerts, festivals, and community gatherings.",
        userData?.travel_interest === "very"
          ? "For frequent travelers, consider travel rewards credit cards to maximize your budget."
          : "Balance adventure with rest - downtime is essential for mental health and productivity.",
      ],
    },
  }

  return baseData[category as keyof typeof baseData]
}

export default function CategoryView({ category, onBack }: CategoryViewProps) {
  const [showQuestionFlow, setShowQuestionFlow] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    // Load user data for this category
    const categoryData = JSON.parse(localStorage.getItem("category_data") || "{}")
    const userCategoryData = categoryData[category]
    setUserData(userCategoryData)

    // Generate dynamic data based on user inputs
    const generatedData = generateCategoryData(category, userCategoryData)
    setData(generatedData)

    // Show question flow if no data exists
    if (!userCategoryData) {
      setShowQuestionFlow(true)
    }
  }, [category])

  const handleQuestionFlowComplete = (answers: any) => {
    setUserData(answers)
    setShowQuestionFlow(false)
    // Regenerate data with new answers
    const generatedData = generateCategoryData(category, answers)
    setData(generatedData)
  }

  const handleEditAnswers = () => {
    setShowQuestionFlow(true)
  }

  if (showQuestionFlow) {
    return (
      <QuestionFlow
        category={category}
        onComplete={handleQuestionFlowComplete}
        onBack={() => {
          if (userData) {
            setShowQuestionFlow(false)
          } else {
            onBack()
          }
        }}
      />
    )
  }

  if (!data) return null

  const Icon = data.icon
  const colorClasses = {
    emerald: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950",
    blue: "text-blue-500 bg-blue-50 dark:bg-blue-950",
    rose: "text-rose-500 bg-rose-50 dark:bg-rose-950",
    purple: "text-purple-500 bg-purple-50 dark:bg-purple-950",
    amber: "text-amber-500 bg-amber-50 dark:bg-amber-950",
  }

  const chartColors = {
    emerald: "#10b981",
    blue: "#3b82f6",
    rose: "#f43f5e",
    purple: "#a855f7",
    amber: "#f59e0b",
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <Button size="icon" variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className={`p-2 rounded-lg ${colorClasses[data.color as keyof typeof colorClasses]}`}>
            <Icon className={`h-5 w-5`} />
          </div>
          <h1 className="text-xl font-bold flex-1">{data.title}</h1>
          <Button size="icon" variant="ghost" onClick={handleEditAnswers}>
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-3">
          {data.insights.map((insight: any, index: number) => (
            <Card key={index}>
              <CardContent className="pt-4 space-y-1">
                <div className="text-xs text-muted-foreground">{insight.label}</div>
                <div className="text-lg font-bold">{insight.value}</div>
                <div
                  className={`text-xs flex items-center gap-1 ${
                    insight.trend === "up"
                      ? "text-emerald-500"
                      : insight.trend === "down"
                        ? "text-rose-500"
                        : "text-muted-foreground"
                  }`}
                >
                  {insight.trend === "up" && <TrendingUp className="h-3 w-3" />}
                  {insight.trend === "down" && <TrendingDown className="h-3 w-3" />}
                  {insight.change}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Progress Tracking</CardTitle>
            <CardDescription>Your journey over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              {category === "finance" || category === "activities" ? (
                <BarChart data={data.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey={Object.keys(data.chartData[0])[0]}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey={Object.keys(data.chartData[0])[1]}
                    fill={chartColors[data.color as keyof typeof chartColors]}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              ) : (
                <LineChart data={data.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey={Object.keys(data.chartData[0])[0]}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={Object.keys(data.chartData[0])[1]}
                    stroke={chartColors[data.color as keyof typeof chartColors]}
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--card))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Personalized Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personalized Insights</CardTitle>
            <CardDescription>Guidance based on your responses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.tips.map((tip: string, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className={`p-1.5 rounded-full ${colorClasses[data.color as keyof typeof colorClasses]} mt-0.5`}>
                  <Target className="h-3 w-3" />
                </div>
                <p className="text-sm flex-1">{tip}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button className="w-full" size="lg" onClick={handleEditAnswers}>
          Update My Information
        </Button>
      </main>
    </div>
  )
}
