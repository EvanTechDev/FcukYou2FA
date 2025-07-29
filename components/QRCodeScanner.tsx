"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import QrScanner from "qr-scanner"

interface QRCodeScannerProps {
  onScan: (result: { issuer: string; account: string; secret: string }) => void
}

export default function QRCodeScanner({ onScan }: QRCodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    let scanner: QrScanner | null = null

    if (isScanning) {
      const videoElement = document.getElementById("qr-video") as HTMLVideoElement
      if (videoElement) {
        scanner = new QrScanner(
          videoElement,
          (result) => {
            try {
              const url = new URL(result.data)
              const params = new URLSearchParams(url.search)
              const secret = params.get("secret")
              const issuer = params.get("issuer")
              const account = url.pathname.split(":")[1]

              if (secret && issuer && account) {
                onScan({ issuer, account, secret })
                setIsScanning(false)
                toast({
                  title: "QR Code Scanned",
                  description: "Authentication code details have been extracted.",
                })
              } else {
                throw new Error("Invalid QR code format")
              }
            } catch (error) {
              toast({
                title: "Invalid QR Code",
                description: "The scanned QR code is not in the correct format.",
                variant: "destructive",
              })
            }
          },
          { highlightScanRegion: true },
        )
        scanner.start()
      }
    }

    return () => {
      if (scanner) {
        scanner.stop()
      }
    }
  }, [isScanning, onScan, toast])

  return (
    <div className="space-y-4">
      {isScanning ? (
        <div className="aspect-video">
          <video id="qr-video" className="w-full h-full"></video>
        </div>
      ) : (
        <p className="text-center">Click the button below to start scanning a QR code.</p>
      )}
      <Button onClick={() => setIsScanning(!isScanning)} className="w-full">
        {isScanning ? "Stop Scanning" : "Start Scanning"}
      </Button>
    </div>
  )
}

