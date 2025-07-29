"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"

interface ManageGroupsDialogProps {
  groups: string[]
  onAddGroup: (groupName: string) => void
  onRemoveGroup: (groupName: string) => void
  onClose: () => void
}

export default function ManageGroupsDialog({ groups, onAddGroup, onRemoveGroup, onClose }: ManageGroupsDialogProps) {
  const [newGroup, setNewGroup] = useState("")

  const handleAddGroup = () => {
    if (newGroup && !groups.includes(newGroup)) {
      onAddGroup(newGroup)
      setNewGroup("")
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Groups</DialogTitle>
          <DialogDescription>Create and manage groups to organize your authentication codes.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex space-x-2">
            <Input
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              placeholder="New group name"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddGroup()
                }
              }}
            />
            <Button onClick={handleAddGroup}>Add Group</Button>
          </div>
          <div className="space-y-2">
            <Label>Existing Groups:</Label>
            <AnimatePresence>
              {groups.map((group) => (
                <motion.div
                  key={group}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded"
                >
                  <span>{group}</span>
                  {group !== "All" && (
                    <Button variant="ghost" size="sm" onClick={() => onRemoveGroup(group)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

