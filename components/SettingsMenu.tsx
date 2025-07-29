"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import QRCodeScanner from "./QRCodeScanner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ServiceIcon from "./ServiceIcon"
import { motion, AnimatePresence } from "framer-motion"

interface AuthCode {
  id: string
  issuer: string
  account: string
  secret: string
  group: string
  service: string
}

interface SettingsMenuProps {
  onClose: () => void
  onAddCode: (issuer: string, account: string, secret: string, group: string, service: string) => void
  onUpdateCode: (updatedCode: AuthCode) => void
  groups: string[]
  editingCode: AuthCode | null
}

export default function SettingsMenu({ onClose, onAddCode, onUpdateCode, groups, editingCode }: SettingsMenuProps) {
  const [newIssuer, setNewIssuer] = useState(editingCode?.issuer || "")
  const [newAccount, setNewAccount] = useState(editingCode?.account || "")
  const [newSecret, setNewSecret] = useState(editingCode?.secret || "")
  const [selectedGroup, setSelectedGroup] = useState(editingCode?.group || "All")
  const [website, setWebsite] = useState(editingCode?.service || "")
  const { toast } = useToast()

  useEffect(() => {
    if (editingCode) {
      setNewIssuer(editingCode.issuer)
      setNewAccount(editingCode.account)
      setNewSecret(editingCode.secret)
      setSelectedGroup(editingCode.group)
      setWebsite(editingCode.service)
    }
  }, [editingCode])

  const handleAddOrUpdateCode = () => {
    if (newIssuer && newAccount && newSecret) {
      if (editingCode) {
        onUpdateCode({
          ...editingCode,
          issuer: newIssuer,
          account: newAccount,
          secret: newSecret,
          group: selectedGroup,
          service: website,
        })
        toast({
          title: "Auth Code Updated",
          description: "Authentication code has been updated.",
        })
      } else {
        onAddCode(newIssuer, newAccount, newSecret, selectedGroup, website)
        toast({
          title: "Auth Code Added",
          description: "New authentication code has been added.",
        })
      }
      onClose()
    } else {
      toast({
        title: "Invalid Input",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
    }
  }

  const handleQRCodeScanned = (result: { issuer: string; account: string; secret: string }) => {
    setNewIssuer(result.issuer)
    setNewAccount(result.account)
    setNewSecret(result.secret)
    // 尝试从 issuer 中提取域名
    try {
      const domain = result.issuer.toLowerCase()
      setWebsite(domain)
    } catch (e) {
      // 如果无法提取域名,保持网站字段为空
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingCode ? "Edit Auth Code" : "Add New Auth Code"}</DialogTitle>
          <DialogDescription>
            {editingCode ? "Edit authentication code details." : "Add a new authentication code."}
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="manual">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="qr">Scan QR Code</TabsTrigger>
          </TabsList>
          <TabsContent value="manual">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid gap-4 py-4"
            >
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-issuer" className="text-right">
                  Service
                </Label>
                <Input
                  id="new-issuer"
                  value={newIssuer}
                  onChange={(e) => setNewIssuer(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-account" className="text-right">
                  Account
                </Label>
                <Input
                  id="new-account"
                  value={newAccount}
                  onChange={(e) => setNewAccount(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-secret" className="text-right">
                  Secret
                </Label>
                <Input
                  id="new-secret"
                  value={newSecret}
                  onChange={(e) => setNewSecret(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="group" className="text-right">
                  Group
                </Label>
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    <AnimatePresence>
                      {groups.map((group) => (
                        <motion.div
                          key={group}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <SelectItem value={group}>{group}</SelectItem>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="website" className="text-right">
                  Website
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="e.g. google.com (optional)"
                    className="flex-grow"
                  />
                  {website && (
                    <div className="flex-shrink-0">
                      <ServiceIcon service={website} className="h-6 w-6" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </TabsContent>
          <TabsContent value="qr">
            <QRCodeScanner onScan={handleQRCodeScanned} />
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button type="submit" onClick={handleAddOrUpdateCode}>
              {editingCode ? "Update Auth Code" : "Add Auth Code"}
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

