import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatCurrencyXOF(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' XOF'
}

export function toPublicImageUrl(url: string): string {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  const base = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ''
  if (!base) return url
  const cleanBase = base.replace(/\/+$/, '')
  const cleanPath = url.replace(/^\/+/, '')
  return `${cleanBase}/${cleanPath}`
}

