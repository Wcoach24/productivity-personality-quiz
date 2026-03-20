import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Productivity Personality Quiz | What Type of Productive Are You?',
  description: 'Discover your unique productivity personality in 2 minutes. Are you a Chaos Creative, Silent Grinder, or Meeting Survivor? Take the quiz and share your result.',
  openGraph: {
    title: 'Productivity Personality Quiz',
    description: 'I just discovered my productivity personality. What type are you?',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Productivity Personality Quiz',
    description: 'I just discovered my productivity personality. What type are you?',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
