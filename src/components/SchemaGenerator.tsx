import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
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
    lowPrice: '0',
    highPrice: '1000',
    priceCurrency: 'USD',
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

  // State with localStorage initialization
  const [type, setType] = useState(() => loadFromLocalStorage('type', 'LocalBusiness'))
  const [formData, setFormData] = useState(() => loadFromLocalStorage('formData', defaultFormData))
  const [additionalAddresses, setAdditionalAddresses] = useState<Address[]>(() => loadFromLocalStorage('additionalAddresses', []))
  const [additionalCoordinates, setAdditionalCoordinates] = useState<Coordinates[]>(() => loadFromLocalStorage('additionalCoordinates', []))
  const [addresses, setAddresses] = useState<Address[]>(() => loadFromLocalStorage('addresses', []))
  const [specialties, setSpecialties] = useState<Specialty[]>(() => loadFromLocalStorage('specialties', []))
  const [faqs, setFaqs] = useState<FAQ[]>(() => loadFromLocalStorage('faqs', []))
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMedia[]>(() => loadFromLocalStorage('socialMediaLinks', []))
  const [openingHours, setOpeningHours] = useState<OpeningHours[]>(() => loadFromLocalStorage('openingHours', defaultOpeningHours))
  const [generatedSchema, setGeneratedSchema] = useState('')

  // Memoized page type checks for better performance
  const isSpecialtyPage = useMemo(() => type === 'Product', [type])
  const isOrganizationPage = useMemo(() => type === 'Organization', [type])
  const isFAQPage = useMemo(() => type === 'FAQPage', [type])

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

  // Reset all fields function
  const hasDataToReset = useMemo(() => {
    const hasFormData = Object.values(formData).some(value => value !== '')
    const hasAddresses = addresses.length > 0
    const hasSpecialties = specialties.length > 0
    const hasFaqs = faqs.length > 0
    const hasSocialMedia = socialMediaLinks.length > 0
    const hasCustomOpeningHours = openingHours.length !== defaultOpeningHours.length || 
      openingHours.some((hour, index) => {
        const defaultHour = defaultOpeningHours[index]
        return !defaultHour || hour.dayOfWeek !== defaultHour.dayOfWeek || 
               hour.opens !== defaultHour.opens || hour.closes !== defaultHour.closes
      })
    
    return hasFormData || hasAddresses || hasSpecialties || hasFaqs || hasSocialMedia || hasCustomOpeningHours
  }, [formData, addresses, specialties, faqs, socialMediaLinks, openingHours, defaultOpeningHours])

  const resetAllFields = useCallback(() => {
    setType('LocalBusiness')
    setFormData(defaultFormData)
    setAdditionalAddresses([])
    setAdditionalCoordinates([])
    setAddresses([])
    setSpecialties([])
    setFaqs([])
    setSocialMediaLinks([])
    setOpeningHours(defaultOpeningHours)
    clearLocalStorage()
    toast.success('All fields have been reset')
  }, [clearLocalStorage, defaultFormData, defaultOpeningHours])

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const addAddress = useCallback(() => {
    const newAddress: Address = {
      "@type": "PostalAddress",
      streetAddress: '',
      addressLocality: '',
      addressRegion: '',
      postalCode: '',
      addressCountry: 'United States of America',
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
  }, [])

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
  }, [])

  const removeSocialMedia = useCallback((id: string) => {
    setSocialMediaLinks(prev => prev.filter(social => social.id !== id))
  }, [])

  const addOpeningHours = useCallback(() => {
    const newOpeningHours: OpeningHours = {
      id: Date.now().toString(),
      dayOfWeek: 'Monday',
      opens: '09:00',
      closes: '17:00'
    }
    setOpeningHours(prev => [...prev, newOpeningHours])
  }, [])

  const updateOpeningHours = useCallback((id: string, field: keyof Omit<OpeningHours, 'id'>, value: string) => {
    setOpeningHours(prev => prev.map(hours => 
      hours.id === id ? { ...hours, [field]: value } : hours
    ))
  }, [])

  const removeOpeningHours = useCallback((id: string) => {
    setOpeningHours(prev => prev.filter(hours => hours.id !== id))
  }, [])

  const generateSchema = useCallback(() => {
    // Handle Organization type with simplified schema
    if (isOrganizationPage) {
      const { name, telephone, url } = formData
      
      const schema: any = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${url}/#organization`,
        ...(name && { "name": name }),
        ...(url && { "url": url }),
        ...(telephone && { "telephone": telephone }),
        ...(addresses.length > 0 && { "address": addresses[0] })
      }

      const schemaJson = JSON.stringify(schema, null, 2)
      const schemaHTML = `<script type="application/ld+json">${schemaJson}</script>`
      setGeneratedSchema(schemaHTML)
      return
    }

    // Handle FAQ Page type with simplified schema
    if (isFAQPage) {
      const { name, url } = formData
      
      const schema: any = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${url}/#faq`,
        ...(name && { "name": `${name} – FAQs` }),
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

      const schemaJson = JSON.stringify(schema, null, 2)
      const schemaHTML = `<script type="application/ld+json">${schemaJson}</script>`
      setGeneratedSchema(schemaHTML)
      return
    }

    // Handle Specialty Page (Service) type with Service schema
    if (isSpecialtyPage) {
      const { specialty, url, description, name } = formData
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
        ...(description && { "description": description }),
        "provider": { "@id": `${url.replace(/\/[^\/]*$/, '')}/#localbusiness` },
        ...(formData.areaServed && { 
          "areaServed": [
            { "@type": "City", "name": formData.areaServed }
          ]
        }),
        "audience": { "@type": "Audience", "audienceType": "Adults seeking therapy" },
        ...(availableChannel.length > 0 && { "availableChannel": availableChannel }),
        "brand": { "@id": `${url.replace(/\/[^\/]*$/, '')}/#organization` },
        "inLanguage": "en"
      }

      // Add FAQ page if FAQs exist
      if (faqs.length > 0) {
        const faqSchema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        }
        
        // For specialty pages with FAQs, we might want to include both schemas
        // For now, just include the FAQ in the service schema
        schema.hasFAQ = {
          "@type": "FAQPage",
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        }
      }

      const schemaJson = JSON.stringify(schema, null, 2)
      const schemaHTML = `<script type="application/ld+json">${schemaJson}</script>`
      setGeneratedSchema(schemaHTML)
      return
    }

    // Handle LocalBusiness type (existing logic)
    const name = formData.name
    const { description, telephone, url, priceCurrency, lowPrice, highPrice, logoUrl,
            contactPage, schedulerPage } = formData

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
    const allCoordinates: Coordinates[] = addresses
      .filter(addr => addr.latitude && addr.longitude)
      .map(addr => ({
        "@type": "GeoCoordinates" as const,
        latitude: addr.latitude!,
        longitude: addr.longitude!
      }))

    const potentialAction = [
      contactPage && {
        "@type": "ContactAction",
        "target": contactPage,
        "name": "Contact"
      },
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
      ...(allAddresses.length === 1 && { "address": allAddresses[0] }),
      ...(allAddresses.length > 1 && { "address": allAddresses }),
      ...(allCoordinates.length === 1 && { "geo": allCoordinates[0] }),
      ...(allCoordinates.length > 1 && { "geo": allCoordinates }),
      ...(openingHoursSpecification.length > 0 && { "openingHoursSpecification": openingHoursSpecification }),
      ...(formData.areaServed && { "areaServed": { "@type": "AdministrativeArea", "name": formData.areaServed } }),
      ...(formData.hasMap && { "hasMap": formData.hasMap }),
      "parentOrganization": { "@id": `${url}/#organization` }
    }

    if (potentialAction.length) schema.potentialAction = potentialAction
    if (makesOffer) schema.makesOffer = makesOffer

    const schemaJson = JSON.stringify(schema, null, 2)
    const schemaHTML = `<script type="application/ld+json">${schemaJson}</script>`
    setGeneratedSchema(schemaHTML)
  }, [type, formData, addresses, specialties, faqs, socialMediaLinks, openingHours, isOrganizationPage, isFAQPage, isSpecialtyPage])

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(generatedSchema)
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
  }, [type, formData, addresses, specialties, faqs, socialMediaLinks, openingHours])

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
                    {isSpecialtyPage ? 'URL of Specialty Page' : 
                     isOrganizationPage ? 'URL of Page' : 
                     isFAQPage ? 'URL of FAQ Page' : 'URL of Home Page'}
                  </Label>
                  <Input
                    id="url"
                    placeholder="e.g., https://www.counselingwise.com/"
                    value={formData.url}
                    onChange={(e) => handleInputChange('url', e.target.value)}
                  />
                </div>

                {!isOrganizationPage && !isFAQPage && (
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      placeholder="e.g., https://www.example.com/logo.png"
                      value={formData.logoUrl}
                      onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                    />
                  </div>
                )}

                {!isSpecialtyPage && !isOrganizationPage && !isFAQPage && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="contactPage">Contact Page</Label>
                      <Input
                        id="contactPage"
                        placeholder="e.g., https://www.example.com/contact"
                        value={formData.contactPage}
                        onChange={(e) => handleInputChange('contactPage', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="schedulerPage">Scheduler Page</Label>
                      <Input
                        id="schedulerPage"
                        placeholder="e.g., https://www.example.com/schedule"
                        value={formData.schedulerPage}
                        onChange={(e) => handleInputChange('schedulerPage', e.target.value)}
                      />
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

                {!isSpecialtyPage && !isOrganizationPage && (
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

                    <div className="space-y-2">
                      <Label htmlFor="hasMap">Google Business Profile CID URL</Label>
                      <Input
                        id="hasMap"
                        placeholder="e.g., https://maps.google.com/?cid=..."
                        value={formData.hasMap}
                        onChange={(e) => handleInputChange('hasMap', e.target.value)}
                      />
                    </div>
                  </>
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
                      <div key={specialty.id} className="flex gap-2 items-center p-3 border rounded-lg">
                        <div className="flex-1">
                          <Input
                            placeholder="Specialty name (e.g., Anxiety Therapy)"
                            value={specialty.name}
                            onChange={(e) => updateSpecialty(specialty.id, 'name', e.target.value)}
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            placeholder="URL (e.g., /anxiety-therapy)"
                            value={specialty.url}
                            onChange={(e) => updateSpecialty(specialty.id, 'url', e.target.value)}
                          />
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
                      <div key={social.id} className="flex gap-2 items-center p-3 border rounded-lg">
                        <div className="flex-1">
                          <Input
                            placeholder="Social media URL (e.g., https://facebook.com/yourpractice)"
                            value={social.url}
                            onChange={(e) => updateSocialMedia(social.id, e.target.value)}
                          />
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
              {(isSpecialtyPage || isFAQPage) && (
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
                    <Label>Business Addresses</Label>
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
                          <Input
                            id={`addressCountry-${index}`}
                            placeholder="e.g., USA"
                            value={address.addressCountry}
                            onChange={(e) => updateAddress(index, 'addressCountry', e.target.value)}
                          />
                        </div>

                        {!isOrganizationPage && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor={`latitude-${index}`}>Latitude (Optional)</Label>
                              <Input
                                id={`latitude-${index}`}
                                placeholder="e.g., 40.0682202"
                                value={address.latitude || ''}
                                onChange={(e) => updateAddress(index, 'latitude', e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`longitude-${index}`}>Longitude (Optional)</Label>
                              <Input
                                id={`longitude-${index}`}
                                placeholder="e.g., -105.1819251"
                                value={address.longitude || ''}
                                onChange={(e) => updateAddress(index, 'longitude', e.target.value)}
                              />
                            </div>
                          </>
                        )}
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
                    <Label>Opening Hours</Label>
                    <Button 
                      type="button"
                      onClick={addOpeningHours}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Hours
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
                              <option value="Monday">Monday</option>
                              <option value="Tuesday">Tuesday</option>
                              <option value="Wednesday">Wednesday</option>
                              <option value="Thursday">Thursday</option>
                              <option value="Friday">Friday</option>
                              <option value="Saturday">Saturday</option>
                              <option value="Sunday">Sunday</option>
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
                            <Input
                              type="time"
                              value={hours.closes}
                              onChange={(e) => updateOpeningHours(hours.id, 'closes', e.target.value)}
                              className="text-sm"
                            />
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

          {/* Secondary Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Pricing (Specialty Page Only) */}
              {isSpecialtyPage && (
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lowPrice">Low Price</Label>
                    <Input
                      id="lowPrice"
                      placeholder="e.g., 100"
                      value={formData.lowPrice}
                      onChange={(e) => handleInputChange('lowPrice', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="highPrice">High Price</Label>
                    <Input
                      id="highPrice"
                      placeholder="e.g., 500"
                      value={formData.highPrice}
                      onChange={(e) => handleInputChange('highPrice', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priceCurrency">Price Currency</Label>
                    <Input
                      id="priceCurrency"
                      placeholder="e.g., USD"
                      value={formData.priceCurrency}
                      onChange={(e) => handleInputChange('priceCurrency', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
            </div>
          </div>

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
            <Button onClick={copyText} variant="outline">Copy Text</Button>
            <div className="relative">
              <SyntaxHighlighter
                language="json"
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
                {generatedSchema}
              </SyntaxHighlighter>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
