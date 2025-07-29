"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, Download, Upload, FolderTree } from "lucide-react"
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
import ManageGroupsDialog from "./ManageGroupsDialog"

interface MainMenuProps {
  onExport: () => void
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void
  onOpenSettings: () => void
  groups: string[]
  onAddGroup: (groupName: string) => void
  onRemoveGroup: (groupName: string) => void
}

export default function MainMenu({
  onExport,
  onImport,
  onOpenSettings,
  groups,
  onAddGroup,
  onRemoveGroup,
}: MainMenuProps) {
  const [showManageGroups, setShowManageGroups] = useState(false)
  const { theme } = useTheme()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Menu</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onOpenSettings}>
            <Menu className="mr-2 h-4 w-4" />
            <span>Add New Code</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowManageGroups(true)}>
            <FolderTree className="mr-2 h-4 w-4" />
            <span>Manage Groups</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            <span>Export Data</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Upload className="mr-2 h-4 w-4" />
            <label htmlFor="import-file" className="cursor-pointer flex-grow">
              Import Data
            </label>
            <Input id="import-file" type="file" onChange={onImport} accept=".json" className="hidden" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {showManageGroups && (
        <ManageGroupsDialog
          groups={groups}
          onAddGroup={onAddGroup}
          onRemoveGroup={onRemoveGroup}
          onClose={() => setShowManageGroups(false)}
        />
      )}
    </>
  )
}

