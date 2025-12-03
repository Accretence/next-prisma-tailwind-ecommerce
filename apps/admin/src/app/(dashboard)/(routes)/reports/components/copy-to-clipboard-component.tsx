'use client'

import { Copy } from 'lucide-react'
import React from 'react'
import toast from 'react-hot-toast'

export default function CopyToClipboardComponent({ text }: { text: string }) {
   const handleCopy = () => {
      navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
   }
   return (
      <Copy
         className="w-4 h-4 cursor-pointer opacity-60 hover:opacity-100 shrink-0 translate-y-[-7px]"
         onClick={handleCopy}
      />
   )
}
