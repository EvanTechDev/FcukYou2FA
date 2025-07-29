"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface GroupManagerProps {
  groups: string[]
  onAddGroup: (groupName: string) => void
  onRemoveGroup: (groupName: string) => void
}

export default function GroupManager({ groups, onAddGroup, onRemoveGroup }: GroupManagerProps) {
  const [newGroup, setNewGroup] = useState("")

  const handleAddGroup = () => {
    if (newGroup && !groups.includes(newGroup)) {
      onAddGroup(newGroup)
      setNewGroup("")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input value={newGroup} onChange={(e) => setNewGroup(e.target.value)} placeholder="New group name" />
        <Button onClick={handleAddGroup}>Add Group</Button>
      </div>
      <div className="space-y-2">
        <Label>Existing Groups:</Label>
        {groups.map((group) => (
          <div key={group} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded">
            <span>{group}</span>
            {group !== "All" && (
              <Button variant="ghost" size="sm" onClick={() => onRemoveGroup(group)}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

