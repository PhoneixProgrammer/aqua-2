"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"
import { useState, useEffect } from "react"

const lifeTips = [
  "Did you know registering for Selective Service may qualify you for student aid?",
  "Building an emergency fund of 3-6 months expenses can provide financial security.",
  "Networking early in your career can open doors to unexpected opportunities.",
  "Investing just $100/month starting at age 22 can grow to over $200k by retirement.",
  "Learning to cook at home can save you over $3,000 per year compared to eating out.",
  "Setting up automatic savings transfers helps you save without thinking about it.",
  "Your credit score impacts loan rates - check it regularly and pay bills on time.",
  "Taking online courses can boost your skills and make you more competitive in the job market.",
]

export default function TipCard() {
  const [tip, setTip] = useState("")

  useEffect(() => {
    const randomTip = lifeTips[Math.floor(Math.random() * lifeTips.length)]
    setTip(randomTip)
  }, [])

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-amber-200 dark:border-amber-800">
      <CardContent className="pt-6 space-y-3">
        <div className="bg-background/50 p-2 rounded-full w-fit">
          <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h3 className="font-bold text-sm mb-1">Today's Tip</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{tip || "Loading tip..."}</p>
        </div>
      </CardContent>
    </Card>
  )
}
