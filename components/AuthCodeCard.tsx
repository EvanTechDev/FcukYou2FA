"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash, Star } from "lucide-react"
import { generateTOTP } from "@/lib/totp"
import { motion } from "framer-motion"
import ServiceIcon from "./ServiceIcon"

interface AuthCodeCardProps {
  id: string
  issuer: string
  account: string
  secret: string
  isPinned: boolean
  service: string
  onPin: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function AuthCodeCard({
  id,
  issuer,
  account,
  secret,
  isPinned,
  service,
  onPin,
  onEdit,
  onDelete,
}: AuthCodeCardProps) {
  const [code, setCode] = useState("")
  const [timeLeft, setTimeLeft] = useState(30)

  useEffect(() => {
    const generateCode = async () => {
      const newCode = await generateTOTP(secret)
      setCode(newCode)
      setTimeLeft(30)
    }

    generateCode()
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          generateCode()
          return 30
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [secret])

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="flex justify-between items-center text-base">
          <span className="font-semibold text-gray-800 dark:text-gray-200">{issuer}</span>
          <ServiceIcon service={service} className="h-5 w-5" />
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4 px-4 pt-0">
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{account}</p>
        <div className="flex justify-between items-center">
          <motion.div
            key={code}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-2xl font-mono font-bold text-accent"
          >
            {code}
          </motion.div>
          <div className="relative w-12 h-12">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-gray-200 dark:stroke-gray-700"
                strokeWidth="4"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-accent"
                strokeWidth="4"
                strokeDasharray={100}
                strokeDashoffset={100 - (timeLeft / 30) * 100}
                transform="rotate(-90 18 18)"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-medium">
              {timeLeft}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-1 p-2 bg-gray-50 dark:bg-gray-800/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPin(id)}
          className={`text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 ${
            isPinned ? "text-yellow-500" : ""
          }`}
        >
          <Star className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(id)}
          className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-1"
        >
          <Pencil className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(id)}
          className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-1"
        >
          <Trash className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  )
}

