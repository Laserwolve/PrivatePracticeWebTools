import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from '@/hooks/use-theme'
import { Plus, X } from 'lucide-react'

interface Address {
  "@type": string
  streetAddress?: string
  addressLocality?: string
  addressRegion?: string
  postalCode?: string
  addressCountry?: string
  latitude?: string
  longitude?: string
}

interface Coordinates {
  "@type": string
  latitude: string
  longitude: string
}

interface OpeningHours {
  id: string
  dayOfWeek: string
  opens: string
  closes: string
}

interface Specialty {
  id: string
  name: string
  url: string
}

interface FAQ {
  id: string
  question: string
  answer: string
}

interface SocialMedia {
  id: string
  url: string
}

// ISO-3166 Alpha-2 country codes
const COUNTRY_CODES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'IE', name: 'Ireland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'GR', name: 'Greece' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'PL', name: 'Poland' },
  { code: 'HU', name: 'Hungary' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'HR', name: 'Croatia' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'RO', name: 'Romania' },
  { code: 'EE', name: 'Estonia' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MT', name: 'Malta' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'SG', name: 'Singapore' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'TH', name: 'Thailand' },
  { code: 'PH', name: 'Philippines' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'PE', name: 'Peru' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'EG', name: 'Egypt' },
  { code: 'MA', name: 'Morocco' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'GH', name: 'Ghana' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'IL', name: 'Israel' },
  { code: 'TR', name: 'Turkey' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'QA', name: 'Qatar' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'OM', name: 'Oman' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'JO', name: 'Jordan' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'RU', name: 'Russia' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'BY', name: 'Belarus' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'KG', name: 'Kyrgyzstan' },
  { code: 'TJ', name: 'Tajikistan' },
  { code: 'TM', name: 'Turkmenistan' },
  { code: 'GE', name: 'Georgia' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'MD', name: 'Moldova' },
  { code: 'RS', name: 'Serbia' },
  { code: 'ME', name: 'Montenegro' },
  { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'MK', name: 'North Macedonia' },
  { code: 'AL', name: 'Albania' },
  { code: 'XK', name: 'Kosovo' },
  { code: 'IS', name: 'Iceland' }
].sort((a, b) => a.name.localeCompare(b.name))

export function SchemaGenerator() {
  const { theme } = useTheme()

  // Local storage utility functions
  const saveToLocalStorage = useCallback((key: string, data: any) => {
    try {
      localStorage.setItem(`schemaGenerator_${key}`, JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }, [])

  const loadFromLocalStorage = useCallback((key: string, defaultValue: any) => {
    try {
      const stored = localStorage.getItem(`schemaGenerator_${key}`)
      return stored ? JSON.parse(stored) : defaultValue
    } catch (error) {
      console.warn('Failed to load from localStorage:', error)
      return defaultValue
    }
  }, [])

  const clearLocalStorage = useCallback(() => {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('schemaGenerator_'))
      keys.forEach(key => localStorage.removeItem(key))
      toast.success('All fields reset and local storage cleared!')
    } catch (error) {
      console.warn('Failed to clear localStorage:', error)
    }
  }, [])

  // Default values
  const defaultFormData = {
    url: '',
    contactPage: '',
    name: '',
    specialty: '',
    logoUrl: '',
    schedulerPage: '',
    description: '',
    telephone: '',
    areaServed: '',
    hasMap: '',
  }

  const defaultOpeningHours = [
    { id: '1', dayOfWeek: 'Monday', opens: '09:00', closes: '17:00' },
    { id: '2', dayOfWeek: 'Tuesday', opens: '09:00', closes: '17:00' },
    { id: '3', dayOfWeek: 'Wednesday', opens: '09:00', closes: '17:00' },
    { id: '4', dayOfWeek: 'Thursday', opens: '09:00', closes: '17:00' },
    { id: '5', dayOfWeek: 'Friday', opens: '09:00', closes: '17:00' }
  ]

  const defaultAddresses = [
    {
      "@type": "PostalAddress",
      streetAddress: '',
      addressLocality: '',
      addressRegion: '',
      postalCode: '',
      addressCountry: 'US',
      latitude: '',
      longitude: ''
    }
  ]

  const defaultSpecialties = [
    {
      id: '1',
      name: '',
      url: ''
    }
  ]

  const defaultFaqs = [
    {
      id: '1',
      question: '',
      answer: ''
    },
    {
      id: '2',
      question: '',
      answer: ''
    },
    {
      id: '3',
      question: '',
      answer: ''
    }
  ]

  // State with localStorage initialization
  const [type, setType] = useState(() => loadFromLocalStorage('type', 'LocalBusiness'))
  const [formData, setFormData] = useState(() => loadFromLocalStorage('formData', defaultFormData))
  const [additionalAddresses, setAdditionalAddresses] = useState<Address[]>(() => loadFromLocalStorage('additionalAddresses', []))
  const [additionalCoordinates, setAdditionalCoordinates] = useState<Coordinates[]>(() => loadFromLocalStorage('additionalCoordinates', []))
  const [addresses, setAddresses] = useState<Address[]>(() => loadFromLocalStorage('addresses', defaultAddresses))
  const [specialties, setSpecialties] = useState<Specialty[]>(() => loadFromLocalStorage('specialties', defaultSpecialties))
  const [faqs, setFaqs] = useState<FAQ[]>(() => loadFromLocalStorage('faqs', defaultFaqs))
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMedia[]>(() => loadFromLocalStorage('socialMediaLinks', []))
  const [openingHours, setOpeningHours] = useState<OpeningHours[]>(() => loadFromLocalStorage('openingHours', defaultOpeningHours))
  const [lastEditedHours, setLastEditedHours] = useState<{ opens: string, closes: string }>({ opens: '09:00', closes: '17:00' })
  const [generatedSchema, setGeneratedSchema] = useState('')
  const [showJSONLD, setShowJSONLD] = useState(() => loadFromLocalStorage('showJSONLD', false))
  const [removeSquarespaceSchema, setRemoveSquarespaceSchema] = useState(() => loadFromLocalStorage('removeSquarespaceSchema', true))
  const [cidUrl, setCidUrl] = useState('')

  // URL validation utility function
  const isValidUrl = useCallback((url: string) => {
    if (!url.trim()) return true // Empty URLs are valid (optional fields)
    try {
      new URL(url)
      return url.startsWith('http://') || url.startsWith('https://')
    } catch {
      return false
    }
  }, [])

  // State for URL validation errors
  const [urlErrors, setUrlErrors] = useState<Record<string, string>>({})

  // Function to validate and set URL error
  const validateUrl = useCallback((field: string, url: string) => {
    if (!isValidUrl(url)) {
      setUrlErrors(prev => ({
        ...prev,
        [field]: url.trim() ? 'Please enter a valid URL starting with http:// or https://' : ''
      }))
    } else {
      setUrlErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }, [isValidUrl])

  // Memoized page type checks for better performance
  const isSpecialtyPage = useMemo(() => type === 'Product', [type])
  const isOrganizationPage = useMemo(() => type === 'Organization', [type])
  const isFAQPage = useMemo(() => type === 'FAQPage', [type])

  // Function to parse Google Business Profile URL and extract coordinates and CID
  const parseGoogleBusinessUrl = useCallback(async (url: string) => {
    try {
      // Extract latitude and longitude from URL parameters
      const urlObj = new URL(url)
      
      // Look for coordinates in the path (format: /@40.0682184,-105.1819262,17z)
      const coords = urlObj.pathname.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
      
      let latitude = ''
      let longitude = ''
      let cid = ''

      if (coords) {
        latitude = coords[1]
        longitude = coords[2]
      }

      // Extract CID from the URL - look for the hex format in the URL
      // Format: !1s0x876bf1cafb263f9f:0x5a01627dae1cf2d8
      const cidMatch = url.match(/!1s0x[a-f0-9]+:0x([a-f0-9]+)/)
      if (cidMatch) {
        // Convert hex CID to decimal
        cid = parseInt(cidMatch[1], 16).toString()
      } else {
        // Alternative format: direct CID in URL
        const directCidMatch = url.match(/[?&]cid=(\d+)/)
        if (directCidMatch) {
          cid = directCidMatch[1]
        } else {
          // If CID not found in URL, try to fetch it from the page
          try {
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
            const data = await response.json()
            const html = data.contents
            
            // Look for CID in various formats in the HTML
            const cidRegexes = [
              /"cid":"(\d+)"/,
              /maps\?cid=(\d+)/,
              /ludocid=(\d+)/,
              /"ludocid":"(\d+)"/,
              /!1s0x[a-f0-9]+:0x([a-f0-9]+)/
            ]
            
            for (const regex of cidRegexes) {
              const match = html.match(regex)
              if (match) {
                // If it's a hex value, convert to decimal
                if (regex.source.includes('0x')) {
                  cid = parseInt(match[1], 16).toString()
                } else {
                  cid = match[1]
                }
                break
              }
            }
          } catch (fetchError) {
            console.warn('Could not fetch CID from page:', fetchError)
          }
        }
      }

      return { latitude, longitude, cid }
    } catch (error) {
      console.error('Error parsing Google Business URL:', error)
      return { latitude: '', longitude: '', cid: '' }
    }
  }, [])

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToLocalStorage('type', type)
  }, [type, saveToLocalStorage])

  useEffect(() => {
    saveToLocalStorage('formData', formData)
  }, [formData, saveToLocalStorage])

  useEffect(() => {
    saveToLocalStorage('addresses', addresses)
  }, [addresses, saveToLocalStorage])

  useEffect(() => {
    saveToLocalStorage('specialties', specialties)
  }, [specialties, saveToLocalStorage])

  useEffect(() => {
    saveToLocalStorage('faqs', faqs)
  }, [faqs, saveToLocalStorage])

  useEffect(() => {
    saveToLocalStorage('socialMediaLinks', socialMediaLinks)
  }, [socialMediaLinks, saveToLocalStorage])

  useEffect(() => {
    saveToLocalStorage('openingHours', openingHours)
  }, [openingHours, saveToLocalStorage])

  useEffect(() => {
    saveToLocalStorage('showJSONLD', showJSONLD)
  }, [showJSONLD, saveToLocalStorage])

  useEffect(() => {
    saveToLocalStorage('removeSquarespaceSchema', removeSquarespaceSchema)
  }, [removeSquarespaceSchema, saveToLocalStorage])

  // When removeSquarespaceSchema is toggled, adjust showJSONLD
  useEffect(() => {
    if (removeSquarespaceSchema) {
      setShowJSONLD(false)
    }
  }, [removeSquarespaceSchema])

  // Reset all fields function
  const hasDataToReset = useMemo(() => {
    const hasFormData = Object.values(formData).some(value => value !== '')
    const hasNonDefaultAddresses = addresses.length !== defaultAddresses.length || 
      addresses.some((address, index) => {
        const defaultAddress = defaultAddresses[index]
        return !defaultAddress || Object.keys(address).some(key => 
          address[key as keyof Address] !== defaultAddress[key as keyof Address]
        )
      })
    const hasNonDefaultSpecialties = specialties.length !== defaultSpecialties.length || 
      specialties.some((specialty, index) => {
        const defaultSpecialty = defaultSpecialties[index]
        return !defaultSpecialty || specialty.name !== defaultSpecialty.name || specialty.url !== defaultSpecialty.url
      })
    const hasNonDefaultFaqs = faqs.length !== defaultFaqs.length || 
      faqs.some((faq, index) => {
        const defaultFaq = defaultFaqs[index]
        return !defaultFaq || faq.question !== defaultFaq.question || faq.answer !== defaultFaq.answer
      })
    const hasSocialMedia = socialMediaLinks.length > 0
    const hasCustomOpeningHours = openingHours.length !== defaultOpeningHours.length || 
      openingHours.some((hour, index) => {
        const defaultHour = defaultOpeningHours[index]
        return !defaultHour || hour.dayOfWeek !== defaultHour.dayOfWeek || 
               hour.opens !== defaultHour.opens || hour.closes !== defaultHour.closes
      })
    
    return hasFormData || hasNonDefaultAddresses || hasNonDefaultSpecialties || hasNonDefaultFaqs || hasSocialMedia || hasCustomOpeningHours || showJSONLD !== false || removeSquarespaceSchema !== true
  }, [formData, addresses, specialties, faqs, socialMediaLinks, openingHours, defaultOpeningHours, showJSONLD, removeSquarespaceSchema])

  const resetAllFields = useCallback(() => {
    // Don't reset the type, keep it as currently selected
    setFormData(defaultFormData)
    setAdditionalAddresses([])
    setAdditionalCoordinates([])
    setAddresses(defaultAddresses)
    setSpecialties(defaultSpecialties)
    setFaqs(defaultFaqs)
    setSocialMediaLinks([])
    setOpeningHours(defaultOpeningHours)
    setShowJSONLD(false)
    setRemoveSquarespaceSchema(true)
    clearLocalStorage()
    toast.success('All fields have been reset')
  }, [clearLocalStorage, defaultFormData, defaultAddresses, defaultSpecialties, defaultFaqs, defaultOpeningHours])

  const handleInputChange = useCallback(async (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Validate URL fields
    const urlFields = ['url', 'logoUrl', 'contactPage', 'schedulerPage', 'hasMap']
    if (urlFields.includes(field)) {
      validateUrl(field, value)
    }
    
    // If the field is hasMap (Google Business Profile URL), parse it for coordinates and CID
    if (field === 'hasMap' && value.includes('google.com/maps')) {
      try {
        const { latitude, longitude, cid } = await parseGoogleBusinessUrl(value)
        
        // Update the first address with the parsed coordinates
        if ((latitude && longitude)) {
          setAddresses(prev => 
            prev.map((addr, index) => 
              index === 0 
                ? { ...addr, latitude, longitude }
                : addr
            )
          )
        }
        
        // Update CID URL for schema generation
        if (cid) {
          setCidUrl(`https://www.google.com/maps?cid=${cid}`)
        } else {
          setCidUrl('')
        }
      } catch (error) {
        console.error('Error parsing Google Business URL:', error)
        toast.error('Error parsing Google Business Profile URL')
      }
    } else if (field === 'hasMap') {
      // Clear CID URL if hasMap is cleared or not a Google Maps URL
      setCidUrl('')
    }
  }, [parseGoogleBusinessUrl, validateUrl])

  // Function to get the CID URL for hasMap from the user's Google Business Profile URL
  const getCidUrl = useCallback(async (url: string) => {
    if (!url || !url.includes('google.com/maps')) {
      return url // Return original URL if it's not a Google Maps URL
    }
    
    try {
      const { cid } = await parseGoogleBusinessUrl(url)
      return cid ? `https://www.google.com/maps?cid=${cid}` : url
    } catch (error) {
      console.error('Error getting CID URL:', error)
      return url // Return original URL on error
    }
  }, [parseGoogleBusinessUrl])

  // Calculate duration between opening and closing times
  const calculateDuration = useCallback((opens: string, closes: string) => {
    if (!opens || !closes) return ''
    
    const [openHour, openMin] = opens.split(':').map(Number)
    const [closeHour, closeMin] = closes.split(':').map(Number)
    
    let totalMinutes = (closeHour * 60 + closeMin) - (openHour * 60 + openMin)
    
    // Handle case where closing time is next day (past midnight)
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60
    }
    
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    
    if (minutes === 0) {
      return `Open for ${hours} hour${hours !== 1 ? 's' : ''}`
    } else {
      return `Open for ${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}`
    }
  }, [])

  const addAddress = useCallback(() => {
    const newAddress: Address = {
      "@type": "PostalAddress",
      streetAddress: '',
      addressLocality: '',
      addressRegion: '',
      postalCode: '',
      addressCountry: 'US',
      latitude: '',
      longitude: ''
    }
    setAddresses(prev => [...prev, newAddress])
  }, [])

  const updateAddress = (index: number, field: keyof Address, value: string) => {
    setAddresses(prev => prev.map((addr, i) => 
      i === index ? { ...addr, [field]: value } : addr
    ))
  }

  const removeAddress = (index: number) => {
    setAddresses(prev => prev.filter((_, i) => i !== index))
  }

  const clearAddresses = () => {
    setAdditionalAddresses([])
    setAdditionalCoordinates([])
  }

  const addSpecialty = useCallback(() => {
    const newSpecialty: Specialty = {
      id: Date.now().toString(),
      name: '',
      url: ''
    }
    setSpecialties(prev => [...prev, newSpecialty])
  }, [])

  const updateSpecialty = useCallback((id: string, field: 'name' | 'url', value: string) => {
    setSpecialties(prev => prev.map(specialty => 
      specialty.id === id ? { ...specialty, [field]: value } : specialty
    ))
    // Validate specialty URL
    if (field === 'url') {
      validateUrl(`specialty_${id}`, value)
    }
  }, [validateUrl])

  const removeSpecialty = useCallback((id: string) => {
    setSpecialties(prev => prev.filter(specialty => specialty.id !== id))
  }, [])

  const addFAQ = useCallback(() => {
    const newFAQ: FAQ = {
      id: Date.now().toString(),
      question: '',
      answer: ''
    }
    setFaqs(prev => [...prev, newFAQ])
  }, [])

  const updateFAQ = useCallback((id: string, field: 'question' | 'answer', value: string) => {
    setFaqs(prev => prev.map(faq => 
      faq.id === id ? { ...faq, [field]: value } : faq
    ))
  }, [])

  const removeFAQ = useCallback((id: string) => {
    setFaqs(prev => prev.filter(faq => faq.id !== id))
  }, [])

  const addSocialMedia = useCallback(() => {
    const newSocialMedia: SocialMedia = {
      id: Date.now().toString(),
      url: ''
    }
    setSocialMediaLinks(prev => [...prev, newSocialMedia])
  }, [])

  const updateSocialMedia = useCallback((id: string, value: string) => {
    setSocialMediaLinks(prev => prev.map(social => 
      social.id === id ? { ...social, url: value } : social
    ))
    // Validate social media URL
    validateUrl(`social_${id}`, value)
  }, [validateUrl])

  const removeSocialMedia = useCallback((id: string) => {
    setSocialMediaLinks(prev => prev.filter(social => social.id !== id))
  }, [])

  const addOpeningHours = useCallback(() => {
    // Array of all days of the week in order
    const allDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    
    // Get currently used days
    const usedDays = openingHours.map(hours => hours.dayOfWeek)
    
    // Find the first unused day, or default to Sunday if all days are used
    const nextDay = allDays.find(day => !usedDays.includes(day)) || 'Sunday'
    
    const newOpeningHours: OpeningHours = {
      id: Date.now().toString(),
      dayOfWeek: nextDay,
      opens: lastEditedHours.opens,
      closes: lastEditedHours.closes
    }
    
    setOpeningHours(prev => {
      const updated = [...prev, newOpeningHours]
      // Sort entries in chronological order
      const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      return updated.sort((a, b) => dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek))
    })
  }, [openingHours, lastEditedHours])

  const updateOpeningHours = useCallback((id: string, field: keyof Omit<OpeningHours, 'id'>, value: string) => {
    // If changing dayOfWeek, check for duplicates
    if (field === 'dayOfWeek') {
      const existingEntry = openingHours.find(hours => hours.id !== id && hours.dayOfWeek === value)
      if (existingEntry) {
        toast.error(`An entry for ${value} already exists!`)
        return // Prevent the update
      }
    }

    // If changing closes time, validate it's after opens time
    if (field === 'closes') {
      const currentEntry = openingHours.find(hours => hours.id === id)
      if (currentEntry && currentEntry.opens) {
        const [openHour, openMin] = currentEntry.opens.split(':').map(Number)
        const [closeHour, closeMin] = value.split(':').map(Number)
        
        const openTotalMinutes = openHour * 60 + openMin
        const closeTotalMinutes = closeHour * 60 + closeMin
        
        if (closeTotalMinutes <= openTotalMinutes) {
          toast.error('Unable to modify closing time: The closing time must come after the opening time.')
          return // Prevent the update
        }
      }
    }

    // If changing opens time, validate it's before closes time
    if (field === 'opens') {
      const currentEntry = openingHours.find(hours => hours.id === id)
      if (currentEntry && currentEntry.closes) {
        const [openHour, openMin] = value.split(':').map(Number)
        const [closeHour, closeMin] = currentEntry.closes.split(':').map(Number)
        
        const openTotalMinutes = openHour * 60 + openMin
        const closeTotalMinutes = closeHour * 60 + closeMin
        
        if (openTotalMinutes >= closeTotalMinutes) {
          toast.error('Unable to modify opening time: The opening time must come before the closing time.')
          return // Prevent the update
        }
      }
    }

    setOpeningHours(prev => {
      const updated = prev.map(hours => 
        hours.id === id ? { ...hours, [field]: value } : hours
      )
      
      // Update last edited hours if the field is opens or closes
      if (field === 'opens' || field === 'closes') {
        const editedHour = updated.find(hours => hours.id === id)
        if (editedHour) {
          setLastEditedHours({
            opens: editedHour.opens,
            closes: editedHour.closes
          })
        }
      }
      
      // Sort entries in chronological order
      const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      return updated.sort((a, b) => dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek))
    })
  }, [openingHours])

  const removeOpeningHours = useCallback((id: string) => {
    setOpeningHours(prev => prev.filter(hours => hours.id !== id))
  }, [])

  // Helper function to generate complete schema HTML with optional Squarespace removal script
  const generateSchemaHTML = useCallback((schema: any) => {
    const schemaJson = JSON.stringify(schema, null, 2)
    let schemaHTML = `<script type="application/ld+json">${schemaJson}</script>`

    if (removeSquarespaceSchema) {
      schemaHTML += `\n\n<script>
  window.addEventListener('load', () => {
    const schemaScripts = document.querySelectorAll('script[type="application/ld+json"]');
    schemaScripts.forEach(script => {
      if (script.textContent.includes('squarespace.com')) {
        script.remove();
      }
    });
  });
</script>`
    }

    return schemaHTML
  }, [removeSquarespaceSchema])

  const generateSchema = useCallback(() => {
    // Handle Organization type with simplified schema
    if (isOrganizationPage) {
      const { name, telephone, url, logoUrl } = formData
      
      // Create clean address without latitude/longitude for Organization schema
      const cleanOrgAddress = addresses.length > 0 ? {
        "@type": addresses[0]["@type"],
        ...(addresses[0].streetAddress && { "streetAddress": addresses[0].streetAddress }),
        ...(addresses[0].addressLocality && { "addressLocality": addresses[0].addressLocality }),
        ...(addresses[0].addressRegion && { "addressRegion": addresses[0].addressRegion }),
        ...(addresses[0].postalCode && { "postalCode": addresses[0].postalCode }),
        ...(addresses[0].addressCountry && { "addressCountry": addresses[0].addressCountry })
      } : null
      
      // Create geo coordinates if available
      const orgGeoCoordinates = addresses.length > 0 && addresses[0].latitude && addresses[0].longitude ? {
        "@type": "GeoCoordinates",
        "latitude": parseFloat(addresses[0].latitude),
        "longitude": parseFloat(addresses[0].longitude)
      } : null
      
      const schema: any = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${url}/#organization`,
        ...(name && { "name": name }),
        ...(url && { "url": url }),
        ...(logoUrl && { "image": logoUrl }),
        ...(telephone && { "telephone": telephone }),
        ...(cleanOrgAddress && { "address": cleanOrgAddress }),
        ...(orgGeoCoordinates && { "geo": orgGeoCoordinates })
      }

      setGeneratedSchema(generateSchemaHTML(schema))
      return
    }

    // Handle FAQ Page type with simplified schema
    if (isFAQPage) {
      const { name, url, logoUrl } = formData
      
      const schema: any = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${url}/#faq`,
        ...(name && { "name": `${name} – FAQs` }),
        ...(logoUrl && { "image": logoUrl }),
        ...(faqs.length > 0 && { 
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        })
      }

      setGeneratedSchema(generateSchemaHTML(schema))
      return
    }

    // Handle Specialty Page (Service) type with Service schema
    if (isSpecialtyPage) {
      const { specialty, url, description, name, logoUrl } = formData
      const serviceSlug = specialty.toLowerCase().replace(/\s+/g, '-')
      
      const availableChannel: any[] = []
      
      // Add in-person channel if addresses exist
      if (addresses.length > 0) {
        const address = addresses[0]
        availableChannel.push({
          "@type": "ServiceChannel",
          "name": "In-person",
          "serviceLocation": {
            "@type": "Place",
            "name": name || "Practice Name",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": address.streetAddress,
              "addressLocality": address.addressLocality,
              "addressRegion": address.addressRegion,
              "postalCode": address.postalCode,
              "addressCountry": "US"
            },
            ...(address.latitude && address.longitude && {
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": parseFloat(address.latitude),
                "longitude": parseFloat(address.longitude)
              }
            })
          }
        })
      }
      
      // Add telehealth channel if scheduler page exists
      if (formData.schedulerPage) {
        availableChannel.push({
          "@type": "ServiceChannel",
          "name": "Telehealth",
          "serviceUrl": formData.schedulerPage,
          "availableLanguage": ["English"]
        })
      }

      const schema: any = {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${url}/#service-${serviceSlug}`,
        ...(specialty && { "name": specialty }),
        "serviceType": "Therapy and Counseling",
        ...(url && { "url": url }),
        ...(logoUrl && { "image": logoUrl }),
        ...(description && { "description": description }),
        "provider": { "@id": `${url.replace(/\/[^\/]*$/, '')}/#localbusiness` },
        ...(formData.areaServed && { 
          "areaServed": [
            { "@type": "City", "name": formData.areaServed }
          ]
        }),
        "audience": { "@type": "Audience", "audienceType": "Adults seeking therapy" },
        ...(availableChannel.length > 0 && { "availableChannel": availableChannel }),
        "brand": { "@id": `${url.replace(/\/[^\/]*$/, '')}/#organization` }
      }

      setGeneratedSchema(generateSchemaHTML(schema))
      return
    }

    // Handle LocalBusiness type (existing logic)
    const name = formData.name
    const { description, telephone, url, logoUrl, contactPage, schedulerPage } = formData

    const socialLinks = socialMediaLinks.length > 0 ? socialMediaLinks.map(social => social.url).filter(url => url.trim() !== '') : undefined

    const makesOffer = specialties.length > 0 ? specialties.map((specialty, index) => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "@id": `${url}/#service-${specialty.name.toLowerCase().replace(/\s+/g, '-')}`,
        "name": specialty.name,
        "serviceType": "Therapy and Counseling",
        "url": specialty.url,
        "provider": { "@id": `${url}/#localbusiness` },
        "areaServed": { "@type": "AdministrativeArea", "name": formData.areaServed || "City, State" }
      }
    })) : undefined

    const faqPage = faqs.length > 0 ? {
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    } : undefined

    const openingHoursSpecification = openingHours.map(hour => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": hour.dayOfWeek,
      "opens": hour.opens,
      "closes": hour.closes
    }))

    // Use the addresses array for all addresses
    const allAddresses: Address[] = [...addresses]
    const cleanAddresses = allAddresses.map(addr => ({
      "@type": addr["@type"],
      ...(addr.streetAddress && { "streetAddress": addr.streetAddress }),
      ...(addr.addressLocality && { "addressLocality": addr.addressLocality }),
      ...(addr.addressRegion && { "addressRegion": addr.addressRegion }),
      ...(addr.postalCode && { "postalCode": addr.postalCode }),
      ...(addr.addressCountry && { "addressCountry": addr.addressCountry })
    }))
    const allCoordinates: Coordinates[] = addresses
      .filter(addr => addr.latitude && addr.longitude)
      .map(addr => ({
        "@type": "GeoCoordinates" as const,
        latitude: addr.latitude!,
        longitude: addr.longitude!
      }))

    const potentialAction = [
      schedulerPage && {
        "@type": "ReserveAction",
        "target": schedulerPage,
        "name": "Make an Appointment"
      }
    ].filter(Boolean)

    const schema: any = {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "ProfessionalService"],
      "@id": `${url}/#localbusiness`,
      ...(name && { "name": name }),
      ...(description && { "description": description }),
      ...(logoUrl && { "image": logoUrl }),
      ...(socialLinks && { "sameAs": socialLinks }),
      ...(telephone && { "telephone": telephone }),
      ...(url && { "url": url }),
      ...(cleanAddresses.length === 1 && { "address": cleanAddresses[0] }),
      ...(cleanAddresses.length > 1 && { "address": cleanAddresses }),
      ...(allCoordinates.length === 1 && { "geo": allCoordinates[0] }),
      ...(allCoordinates.length > 1 && { "geo": allCoordinates }),
      ...(openingHoursSpecification.length > 0 && { "openingHoursSpecification": openingHoursSpecification }),
      ...(formData.areaServed && { "areaServed": { "@type": "AdministrativeArea", "name": formData.areaServed } }),
      ...((cidUrl || formData.hasMap) && { "hasMap": cidUrl || formData.hasMap }),
      "parentOrganization": { "@id": `${url}/#organization` }
    }

    if (potentialAction.length) schema.potentialAction = potentialAction
    if (makesOffer) schema.makesOffer = makesOffer

    setGeneratedSchema(generateSchemaHTML(schema))
  }, [type, formData, addresses, specialties, faqs, socialMediaLinks, openingHours, isOrganizationPage, isFAQPage, isSpecialtyPage, cidUrl, generateSchemaHTML])

  const copyText = async () => {
    try {
      let textToCopy = generatedSchema
      if (showJSONLD) {
        // Remove the script tags to get just the JSON-LD
        textToCopy = generatedSchema
          .replace(/^<script type="application\/ld\+json">\s*/, '')
          .replace(/\s*<\/script>$/, '')
      }
      await navigator.clipboard.writeText(textToCopy)
      toast.success('Schema copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy to clipboard')
      console.error('Failed to copy: ', err)
    }
  }

  // Debounced schema generation for better performance
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateSchema()
    }, 300) // 300ms delay

    return () => clearTimeout(timeoutId)
  }, [type, formData, addresses, specialties, faqs, socialMediaLinks, openingHours, removeSquarespaceSchema])

  return (
    <div className="space-y-6">
      {/* Basic Information - Full Width */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Information</CardTitle>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  disabled={!hasDataToReset}
                >
                  Reset all fields
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset all fields?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will clear all form data, addresses, specialties, FAQs, social media links, and opening hours. 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={resetAllFields}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Reset all fields
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LocalBusiness">Home Page</SelectItem>
                    <SelectItem value="Product">Specialty Page</SelectItem>
                    <SelectItem value="FAQPage">FAQ Page</SelectItem>
                    <SelectItem value="Organization">Other Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>                {isSpecialtyPage && (
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty Name</Label>
                    <Input
                      id="specialty"
                      placeholder="e.g., Anxiety Therapy"
                      value={formData.specialty}
                      onChange={(e) => handleInputChange('specialty', e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="url">
                    {isSpecialtyPage ? 'Specialty Page URL' : 
                     isOrganizationPage ? 'Page URL' : 
                     isFAQPage ? 'FAQ Page URL' : 'Home Page URL'}
                  </Label>
                  <Input
                    id="url"
                    placeholder="e.g., https://www.example.com/"
                    value={formData.url}
                    onChange={(e) => handleInputChange('url', e.target.value)}
                    className={urlErrors.url ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                  {urlErrors.url && (
                    <p className="text-xs text-red-600">{urlErrors.url}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    placeholder="e.g., https://www.example.com/logo.png"
                    value={formData.logoUrl}
                    onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                    className={urlErrors.logoUrl ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                  {urlErrors.logoUrl && (
                    <p className="text-xs text-red-600">{urlErrors.logoUrl}</p>
                  )}
                </div>

                {!isSpecialtyPage && !isOrganizationPage && !isFAQPage && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="contactPage">Contact Page URL</Label>
                      <Input
                        id="contactPage"
                        placeholder="e.g., https://www.example.com/contact"
                        value={formData.contactPage}
                        onChange={(e) => handleInputChange('contactPage', e.target.value)}
                        className={urlErrors.contactPage ? 'border-red-500 focus-visible:ring-red-500' : ''}
                      />
                      {urlErrors.contactPage && (
                        <p className="text-xs text-red-600">{urlErrors.contactPage}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="schedulerPage">Scheduler Page URL</Label>
                      <Input
                        id="schedulerPage"
                        placeholder="e.g., https://www.example.com/schedule"
                        value={formData.schedulerPage}
                        onChange={(e) => handleInputChange('schedulerPage', e.target.value)}
                        className={urlErrors.schedulerPage ? 'border-red-500 focus-visible:ring-red-500' : ''}
                      />
                      {urlErrors.schedulerPage && (
                        <p className="text-xs text-red-600">{urlErrors.schedulerPage}</p>
                      )}
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Business Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., John Doe Clinic"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>

                {!isFAQPage && (
                  <div className="space-y-2">
                    <Label htmlFor="telephone">Phone</Label>
                    <Input
                      id="telephone"
                      placeholder="e.g., (303) 209-1832"
                      value={formData.telephone}
                      onChange={(e) => handleInputChange('telephone', e.target.value)}
                    />
                  </div>
                )}

                {!isSpecialtyPage && !isOrganizationPage && !isFAQPage && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="areaServed">Area Served</Label>
                      <Input
                        id="areaServed"
                        placeholder="e.g., Boulder, CO"
                        value={formData.areaServed}
                        onChange={(e) => handleInputChange('areaServed', e.target.value)}
                      />
                    </div>
                  </>
                )}

                {!isFAQPage && (
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="hasMap">Google Business Profile URL</Label>
                    <p className="text-xs text-muted-foreground">
                      Paste the URL from the Google Business Profile on Google Maps — not the Google search results. Wait for the longitude and latitude to populate in the URL before copying.
                    </p>
                    <Input
                      id="hasMap"
                      placeholder="e.g., https://www.google.com/maps/place/Business+Name/@40.0682184,-105.1819262,17z/data=!3m1!4b1!4m6!3m5!1s0x876bf1cafb263f9f:0x5a01627dae1cf2d8!8m2!3d40.0682184!4d-105.1819262!16s%2Fg%2F11fzfdydb2?entry=ttu&g_ep=EgoyMDI1MDgyNS4wIKXMDSoASAFQAw%3D%3D"
                      value={formData.hasMap}
                      onChange={(e) => handleInputChange('hasMap', e.target.value)}
                      className={urlErrors.hasMap ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                    {urlErrors.hasMap && (
                      <p className="text-xs text-red-600">{urlErrors.hasMap}</p>
                    )}
                  </div>
                )}
              </div>

              {!isOrganizationPage && !isFAQPage && (
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="A description of the practice or specialty page"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              {/* Specialties Section */}
              {!isSpecialtyPage && !isOrganizationPage && !isFAQPage && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Specialties</Label>
                    <Button 
                      type="button"
                      onClick={addSpecialty}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Specialty
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {specialties.map((specialty) => (
                      <div key={specialty.id} className="flex gap-2 items-start p-3 border rounded-lg">
                        <div className="flex-1 space-y-1">
                          <Input
                            placeholder="e.g., Anxiety Therapy"
                            value={specialty.name}
                            onChange={(e) => updateSpecialty(specialty.id, 'name', e.target.value)}
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <Input
                            placeholder="e.g., https://example.com/anxiety-therapy"
                            value={specialty.url}
                            onChange={(e) => updateSpecialty(specialty.id, 'url', e.target.value)}
                            className={urlErrors[`specialty_${specialty.id}`] ? 'border-red-500 focus-visible:ring-red-500' : ''}
                          />
                          {urlErrors[`specialty_${specialty.id}`] && (
                            <p className="text-xs text-red-600">{urlErrors[`specialty_${specialty.id}`]}</p>
                          )}
                        </div>
                        <Button
                          type="button"
                          onClick={() => removeSpecialty(specialty.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {specialties.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                        <p>No specialties added yet.</p>
                        <p className="text-sm">Click "Add Specialty" to get started.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Social Media Section */}
              {!isSpecialtyPage && !isOrganizationPage && !isFAQPage && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Social Media URLs</Label>
                    <Button 
                      type="button"
                      onClick={addSocialMedia}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Social Media
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {socialMediaLinks.map((social) => (
                      <div key={social.id} className="flex gap-2 items-start p-3 border rounded-lg">
                        <div className="flex-1 space-y-1">
                          <Input
                            placeholder="Social media URL (e.g., https://facebook.com/yourpractice)"
                            value={social.url}
                            onChange={(e) => updateSocialMedia(social.id, e.target.value)}
                            className={urlErrors[`social_${social.id}`] ? 'border-red-500 focus-visible:ring-red-500' : ''}
                          />
                          {urlErrors[`social_${social.id}`] && (
                            <p className="text-xs text-red-600">{urlErrors[`social_${social.id}`]}</p>
                          )}
                        </div>
                        <Button
                          type="button"
                          onClick={() => removeSocialMedia(social.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {socialMediaLinks.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                        <p>No social media links added yet.</p>
                        <p className="text-sm">Click "Add Social Media" to get started.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* FAQs Section */}
              {isFAQPage && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>FAQs</Label>
                    <Button 
                      type="button"
                      onClick={addFAQ}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add FAQ
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {faqs.map((faq) => (
                      <div key={faq.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">FAQ {faqs.indexOf(faq) + 1}</h4>
                          <Button
                            type="button"
                            onClick={() => removeFAQ(faq.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Input
                            placeholder="Question (e.g., What is cognitive behavioral therapy?)"
                            value={faq.question}
                            onChange={(e) => updateFAQ(faq.id, 'question', e.target.value)}
                          />
                          <Textarea
                            placeholder="Answer"
                            value={faq.answer}
                            onChange={(e) => updateFAQ(faq.id, 'answer', e.target.value)}
                            rows={3}
                          />
                        </div>
                      </div>
                    ))}
                    
                    {faqs.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                        <p>No FAQs added yet.</p>
                        <p className="text-sm">Click "Add FAQ" to get started.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Address Section */}
              {!isFAQPage && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Addresses</Label>
                    <Button 
                      type="button"
                      onClick={addAddress}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Address
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {addresses.map((address, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">Address {index + 1}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeAddress(index)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`streetAddress-${index}`}>Street Address</Label>
                          <Input
                            id={`streetAddress-${index}`}
                            placeholder="e.g., 7345 Buckingham Rd"
                            value={address.streetAddress}
                            onChange={(e) => updateAddress(index, 'streetAddress', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`addressLocality-${index}`}>City</Label>
                          <Input
                            id={`addressLocality-${index}`}
                            placeholder="e.g., Boulder"
                            value={address.addressLocality}
                            onChange={(e) => updateAddress(index, 'addressLocality', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`addressRegion-${index}`}>State</Label>
                          <Input
                            id={`addressRegion-${index}`}
                            placeholder="e.g., CO"
                            value={address.addressRegion}
                            onChange={(e) => updateAddress(index, 'addressRegion', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`postalCode-${index}`}>Postal Code</Label>
                          <Input
                            id={`postalCode-${index}`}
                            placeholder="e.g., 80301"
                            value={address.postalCode}
                            onChange={(e) => updateAddress(index, 'postalCode', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`addressCountry-${index}`}>Country</Label>
                          <Select
                            value={address.addressCountry}
                            onValueChange={(value) => updateAddress(index, 'addressCountry', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                            <SelectContent>
                              {COUNTRY_CODES.map((country) => (
                                <SelectItem key={country.code} value={country.code}>
                                  {country.name} ({country.code})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {addresses.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                      <p>No addresses added yet.</p>
                      <p className="text-sm">Click "Add Address" to get started.</p>
                    </div>
                  )}
                </div>
              </div>
              )}

              {/* Opening Hours Section (Home Page Only) */}
              {!isOrganizationPage && !isFAQPage && !isSpecialtyPage && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Opening Hours</Label>
                      <p className="text-xs text-muted-foreground mt-1">Only include days that the business is open.</p>
                    </div>
                    <Button 
                      type="button"
                      onClick={addOpeningHours}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      disabled={openingHours.length >= 7}
                    >
                      <Plus className="h-4 w-4" />
                      Add Day
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {openingHours.map((hours) => (
                      <div key={hours.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Day</Label>
                            <select
                              value={hours.dayOfWeek}
                              onChange={(e) => updateOpeningHours(hours.id, 'dayOfWeek', e.target.value)}
                              className="w-full p-2 border rounded-md text-sm"
                            >
                              <option value="Sunday">Sunday</option>
                              <option value="Monday">Monday</option>
                              <option value="Tuesday">Tuesday</option>
                              <option value="Wednesday">Wednesday</option>
                              <option value="Thursday">Thursday</option>
                              <option value="Friday">Friday</option>
                              <option value="Saturday">Saturday</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Opens</Label>
                            <Input
                              type="time"
                              value={hours.opens}
                              onChange={(e) => updateOpeningHours(hours.id, 'opens', e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Closes</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="time"
                                value={hours.closes}
                                onChange={(e) => updateOpeningHours(hours.id, 'closes', e.target.value)}
                                className="text-sm"
                              />
                              {hours.opens && hours.closes && (
                                <div className="text-xs text-muted-foreground whitespace-nowrap">
                                  {calculateDuration(hours.opens, hours.closes)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={() => removeOpeningHours(hours.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {openingHours.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                        <p>No opening hours added yet.</p>
                        <p className="text-sm">Click "Add Hours" to get started.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generated Schema Output */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Schema</CardTitle>
              {/* <CardDescription>
                Copy this JSON-LD schema markup and add it to your website's head section
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button onClick={copyText} variant="outline">Copy to Clipboard</Button>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="remove-squarespace-schema" className="text-sm">Remove default Squarespace Schema</Label>
                  <Switch
                    id="remove-squarespace-schema"
                    checked={removeSquarespaceSchema}
                    onCheckedChange={setRemoveSquarespaceSchema}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="show-json-ld" className="text-sm">Remove HTML Wrapper</Label>
                  <Switch
                    id="show-json-ld"
                    checked={showJSONLD}
                    onCheckedChange={setShowJSONLD}
                    disabled={removeSquarespaceSchema}
                  />
                </div>
              </div>
            </div>
            <div className="relative">
              <SyntaxHighlighter
                language={showJSONLD ? "json" : "html"}
                style={theme === 'dark' ? oneDark : oneLight}
                customStyle={{
                  margin: 0,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  maxHeight: '24rem',
                  overflow: 'auto'
                }}
                wrapLongLines
              >
                {showJSONLD 
                  ? generatedSchema
                      .replace(/^<script type="application\/ld\+json">\s*/, '')
                      .replace(/\s*<\/script>$/, '')
                  : generatedSchema
                }
              </SyntaxHighlighter>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
