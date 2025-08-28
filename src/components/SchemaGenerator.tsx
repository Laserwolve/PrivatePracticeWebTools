import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

interface Address {
  "@type": string
  streetAddress?: string
  addressLocality?: string
  addressRegion?: string
  postalCode?: string
  addressCountry?: string
}

interface Coordinates {
  "@type": string
  latitude: string
  longitude: string
}

export function SchemaGenerator() {
  const [type, setType] = useState('LocalBusiness')
  const [formData, setFormData] = useState({
    url: '',
    contactPage: '',
    specialtyUrls: '',
    specialtyNames: '',
    FAQs: '',
    name: '',
    streetAddress: '',
    addressRegion: '',
    lowPrice: '0',
    highPrice: '1000',
    priceCurrency: 'USD',
    specialty: '',
    logoUrl: '',
    schedulerPage: '',
    socialMediaLinks: '',
    description: '',
    answers: '',
    telephone: '',
    addressLocality: '',
    postalCode: '',
    latitude: '',
    longitude: '',
    addressCountry: 'USA',
    // Opening hours
    mondayOpens: '09:00',
    mondayCloses: '17:00',
    tuesdayOpens: '09:00',
    tuesdayCloses: '17:00',
    wednesdayOpens: '09:00',
    wednesdayCloses: '17:00',
    thursdayOpens: '09:00',
    thursdayCloses: '17:00',
    fridayOpens: '09:00',
    fridayCloses: '17:00',
    saturdayOpens: '00:00',
    saturdayCloses: '00:00',
    sundayOpens: '00:00',
    sundayCloses: '00:00',
  })

  const [additionalAddresses, setAdditionalAddresses] = useState<Address[]>([])
  const [additionalCoordinates, setAdditionalCoordinates] = useState<Coordinates[]>([])
  const [generatedSchema, setGeneratedSchema] = useState('')

  const isSpecialtyPage = type === 'Product'

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addAddress = () => {
    const { streetAddress, addressLocality, addressRegion, postalCode, addressCountry, latitude, longitude } = formData

    if (streetAddress.trim()) {
      const address: Address = {
        "@type": "PostalAddress",
        ...(streetAddress && { streetAddress }),
        ...(addressLocality && { addressLocality }),
        ...(addressRegion && { addressRegion }),
        ...(postalCode && { postalCode }),
        ...(addressCountry && { addressCountry })
      }
      setAdditionalAddresses(prev => [...prev, address])

      if (latitude && longitude) {
        setAdditionalCoordinates(prev => [...prev, {
          "@type": "GeoCoordinates",
          latitude,
          longitude
        }])
      }

      // Clear address fields
      setFormData(prev => ({
        ...prev,
        streetAddress: '',
        addressLocality: '',
        addressRegion: '',
        postalCode: '',
        addressCountry: 'USA',
        latitude: '',
        longitude: ''
      }))
    }
  }

  const clearAddresses = () => {
    setAdditionalAddresses([])
    setAdditionalCoordinates([])
  }

  const generateSchema = () => {
    const name = isSpecialtyPage ? formData.specialty : formData.name
    const { description, telephone, url, streetAddress, addressLocality, addressRegion, 
            postalCode, addressCountry, priceCurrency, lowPrice, highPrice, logoUrl,
            socialMediaLinks, contactPage, schedulerPage, specialtyNames, specialtyUrls,
            FAQs, answers, latitude, longitude } = formData

    const socialLinks = socialMediaLinks ? socialMediaLinks.split(',').map(link => link.trim()) : undefined
    const specialtyNamesArray = specialtyNames ? specialtyNames.split(',').map(name => name.trim()) : undefined
    const specialtyUrlsArray = specialtyUrls ? specialtyUrls.split(',').map(url => url.trim()) : undefined
    const faqQuestions = FAQs ? FAQs.split(',').map(question => question.trim()) : undefined
    const faqAnswers = answers ? answers.split(',').map(answer => answer.trim()) : undefined

    const hasOfferCatalog = specialtyNamesArray && specialtyUrlsArray ? {
      "@type": "OfferCatalog",
      "name": "Specialties",
      "itemListElement": specialtyNamesArray.map((name, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": name,
          "url": specialtyUrlsArray[index] || ""
        }
      }))
    } : undefined

    const openingHoursSpecification = [
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Monday", "opens": formData.mondayOpens, "closes": formData.mondayCloses },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Tuesday", "opens": formData.tuesdayOpens, "closes": formData.tuesdayCloses },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Wednesday", "opens": formData.wednesdayOpens, "closes": formData.wednesdayCloses },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Thursday", "opens": formData.thursdayOpens, "closes": formData.thursdayCloses },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Friday", "opens": formData.fridayOpens, "closes": formData.fridayCloses },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": formData.saturdayOpens, "closes": formData.saturdayCloses },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": formData.sundayOpens, "closes": formData.sundayCloses }
    ]

    const address: Address = {
      "@type": "PostalAddress",
      ...(streetAddress && { streetAddress }),
      ...(addressLocality && { addressLocality }),
      ...(addressRegion && { addressRegion }),
      ...(postalCode && { postalCode }),
      ...(addressCountry && { addressCountry })
    }

    const allAddresses: Address[] = []
    if (Object.keys(address).length > 1) {
      allAddresses.push(address)
    }
    allAddresses.push(...additionalAddresses)

    const allCoordinates: Coordinates[] = []
    if (latitude && longitude) {
      allCoordinates.push({
        "@type": "GeoCoordinates",
        "latitude": latitude,
        "longitude": longitude
      })
    }
    allCoordinates.push(...additionalCoordinates)

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

    const hasFAQ = faqQuestions && faqAnswers && faqQuestions.length > 0 && faqAnswers.length > 0 ? {
      "@type": "FAQPage",
      "mainEntity": faqQuestions.map((question, index) => ({
        "@type": "Question",
        "name": question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faqAnswers[index] || ""
        }
      }))
    } : undefined

    const schema: any = {
      "@context": "https://schema.org",
      "@type": type,
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
      ...(openingHoursSpecification && { "openingHoursSpecification": openingHoursSpecification })
    }

    if (!isSpecialtyPage) {
      if (potentialAction.length) schema.potentialAction = potentialAction
      if (hasOfferCatalog) schema.hasOfferCatalog = hasOfferCatalog
    }

    if (isSpecialtyPage) {
      schema.offers = {
        "@type": "AggregateOffer",
        ...(lowPrice && { "lowPrice": lowPrice }),
        ...(highPrice && { "highPrice": highPrice }),
        ...(priceCurrency && { "priceCurrency": priceCurrency })
      }

      const availableAtOrFromAddresses: Address[] = []
      if (Object.keys(address).length > 1) {
        availableAtOrFromAddresses.push(address)
      }
      availableAtOrFromAddresses.push(...additionalAddresses)

      if (availableAtOrFromAddresses.length > 0) {
        if (availableAtOrFromAddresses.length === 1) {
          schema.availableAtOrFrom = {
            "@type": "Place",
            "name": formData.name || '',
            "address": availableAtOrFromAddresses[0]
          }
        } else {
          schema.availableAtOrFrom = availableAtOrFromAddresses.map(addr => ({
            "@type": "Place",
            "name": formData.name || '',
            "address": addr
          }))
        }
      }

      if (hasFAQ) schema.hasFAQ = hasFAQ
    }

    const schemaJson = JSON.stringify(schema, null, 2)
    const schemaHTML = `<script type="application/ld+json">${schemaJson}</script>`
    setGeneratedSchema(schemaHTML)
  }

  const highlightText = () => {
    const output = document.getElementById('schema-output')
    if (output) {
      const range = document.createRange()
      range.selectNodeContents(output)
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }

  useEffect(() => {
    generateSchema()
  }, [type, formData, additionalAddresses, additionalCoordinates])

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
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
                      <SelectItem value="LocalBusiness">Homepage</SelectItem>
                      <SelectItem value="Product">Specialty Page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty Name</Label>
                  <Input
                    id="specialty"
                    placeholder="e.g., Anxiety Therapy"
                    value={formData.specialty}
                    onChange={(e) => handleInputChange('specialty', e.target.value)}
                    disabled={!isSpecialtyPage}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">URL of Homepage/Specialty Page</Label>
                  <Input
                    id="url"
                    placeholder="e.g., https://www.counselingwise.com/"
                    value={formData.url}
                    onChange={(e) => handleInputChange('url', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    placeholder="e.g., https://www.example.com/logo.png"
                    value={formData.logoUrl}
                    onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                    disabled={isSpecialtyPage}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPage">Contact Page</Label>
                  <Input
                    id="contactPage"
                    placeholder="e.g., https://www.example.com/contact"
                    value={formData.contactPage}
                    onChange={(e) => handleInputChange('contactPage', e.target.value)}
                    disabled={isSpecialtyPage}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schedulerPage">Scheduler Page</Label>
                  <Input
                    id="schedulerPage"
                    placeholder="e.g., https://www.example.com/schedule"
                    value={formData.schedulerPage}
                    onChange={(e) => handleInputChange('schedulerPage', e.target.value)}
                    disabled={isSpecialtyPage}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Business Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., John Doe Clinic"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telephone">Phone</Label>
                  <Input
                    id="telephone"
                    placeholder="e.g., (303) 209-1832"
                    value={formData.telephone}
                    onChange={(e) => handleInputChange('telephone', e.target.value)}
                  />
                </div>
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specialtyUrls">Specialty URLs</Label>
                  <Textarea
                    id="specialtyUrls"
                    placeholder="Separate URLs with a comma"
                    value={formData.specialtyUrls}
                    onChange={(e) => handleInputChange('specialtyUrls', e.target.value)}
                    disabled={isSpecialtyPage}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="socialMediaLinks">Social Media URLs</Label>
                  <Textarea
                    id="socialMediaLinks"
                    placeholder="Separate URLs with a comma"
                    value={formData.socialMediaLinks}
                    onChange={(e) => handleInputChange('socialMediaLinks', e.target.value)}
                    disabled={isSpecialtyPage}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialtyNames">Specialty Names</Label>
                  <Textarea
                    id="specialtyNames"
                    placeholder="Separate names with a comma"
                    value={formData.specialtyNames}
                    onChange={(e) => handleInputChange('specialtyNames', e.target.value)}
                    disabled={isSpecialtyPage}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="FAQs">FAQs</Label>
                  <Textarea
                    id="FAQs"
                    placeholder="Separate questions with a comma"
                    value={formData.FAQs}
                    onChange={(e) => handleInputChange('FAQs', e.target.value)}
                    disabled={!isSpecialtyPage}
                    rows={2}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="answers">Answers</Label>
                  <Textarea
                    id="answers"
                    placeholder="Separate answers with a comma"
                    value={formData.answers}
                    onChange={(e) => handleInputChange('answers', e.target.value)}
                    disabled={!isSpecialtyPage}
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
              <CardDescription>
                Add your business address and location details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="streetAddress">Street Address</Label>
                  <Input
                    id="streetAddress"
                    placeholder="e.g., 7345 Buckingham Rd"
                    value={formData.streetAddress}
                    onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLocality">City</Label>
                  <Input
                    id="addressLocality"
                    placeholder="e.g., Boulder"
                    value={formData.addressLocality}
                    onChange={(e) => handleInputChange('addressLocality', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressRegion">State</Label>
                  <Input
                    id="addressRegion"
                    placeholder="e.g., CO"
                    value={formData.addressRegion}
                    onChange={(e) => handleInputChange('addressRegion', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    placeholder="e.g., 80301"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressCountry">Country</Label>
                  <Input
                    id="addressCountry"
                    placeholder="e.g., USA"
                    value={formData.addressCountry}
                    onChange={(e) => handleInputChange('addressCountry', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    placeholder="e.g., 40.0682202"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    placeholder="e.g., -105.1819251"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={addAddress} variant="outline">
                  Add Another Address
                </Button>
                <Button onClick={clearAddresses} variant="outline">
                  Clear Additional Addresses
                </Button>
              </div>

              {additionalAddresses.length > 0 && (
                <div className="space-y-2">
                  <Label>Additional Addresses ({additionalAddresses.length})</Label>
                  <div className="text-sm text-muted-foreground">
                    {additionalAddresses.map((addr, index) => (
                      <div key={index}>
                        {addr.streetAddress}, {addr.addressLocality}, {addr.addressRegion} {addr.postalCode}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

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

        {/* Opening Hours */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Opening Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {days.map((day, index) => (
                <div key={day} className="space-y-2">
                  <Label>{dayLabels[index]}</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="time"
                      value={formData[`${day}Opens` as keyof typeof formData]}
                      onChange={(e) => handleInputChange(`${day}Opens`, e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-sm">to</span>
                    <Input
                      type="time"
                      value={formData[`${day}Closes` as keyof typeof formData]}
                      onChange={(e) => handleInputChange(`${day}Closes`, e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Generated Schema Output */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Schema</CardTitle>
          <CardDescription>
            Copy this JSON-LD schema markup and add it to your website's head section
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button onClick={highlightText}>Highlight Text</Button>
            <div className="relative">
              <pre
                id="schema-output"
                className="bg-muted p-4 rounded-lg text-sm overflow-x-auto max-h-96 overflow-y-auto"
              >
                <code>{generatedSchema}</code>
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
