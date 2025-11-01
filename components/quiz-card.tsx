import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift } from "lucide-react"

export default function QuizCard() {
  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-indigo-200 dark:border-indigo-800">
      <CardContent className="pt-6 space-y-3">
        <div className="bg-background/50 p-2 rounded-full w-fit">
          <Gift className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h3 className="font-bold text-sm mb-1">Today's 10-sec Quiz!</h3>
          <p className="text-xs text-muted-foreground">Get rewarded</p>
        </div>
        <Button
          size="sm"
          className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white"
        >
          Start Quiz
        </Button>
      </CardContent>
    </Card>
  )
}
