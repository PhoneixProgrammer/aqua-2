interface GoalCircleProps {
  label: string
  value: number
  color: "emerald" | "amber" | "indigo" | "rose" | "purple"
}

export default function GoalCircle({ label, value, color }: GoalCircleProps) {
  const colorClasses = {
    emerald: "text-emerald-500",
    amber: "text-amber-500",
    indigo: "text-indigo-500",
    rose: "text-rose-500",
    purple: "text-purple-500",
  }

  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <svg className="transform -rotate-90 w-20 h-20">
          <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="none" className="text-muted" />
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={colorClasses[color]}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">{value}%</span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  )
}
