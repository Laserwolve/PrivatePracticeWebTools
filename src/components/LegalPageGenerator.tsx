import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface FormData {
  companyName: string
  address1: string
  address2: string
  city: string
  state: string
  postalCode: string
  country: string
  websiteUrl: string
  contactUrl: string
  date: string
}

export function LegalPageGenerator() {
  const [pageType, setPageType] = useState('terms')
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    websiteUrl: '',
    contactUrl: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [generatedContent, setGeneratedContent] = useState('')

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const generatePage = () => {
    const data = {
      ...formData,
      date: formatDate(formData.date)
    }

    let content = ''

    switch (pageType) {
      case 'terms':
        content = `
          <h1>Terms of Service</h1>
          <p><br> Last updated: ${data.date}<br> Please read these terms and conditions carefully before using Our Service.</p>
          <h2>Interpretation and Definitions</h2>
          <h3>Interpretation</h3>
          <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
          <h3>Definitions</h3>
          <p>For the purposes of these Terms and Conditions:</p>
          <p>Affiliate means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</p>
          <p>Country refers to: ${data.country}</p>
          <p>Company (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to ${data.companyName}, ${data.address1}${data.address2 ? ', ' + data.address2 : ''}, ${data.city}, ${data.state} ${data.postalCode}.</p>
          <p>Device means any device that can access the Service such as a computer, a cell phone or a digital tablet.</p>
          <p>Service refers to the Website.</p>
          <p>Terms and Conditions (also referred as "Terms") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.</p>
          <p>Third-party Social Media Service means any services or content (including data, information, products or services) provided by a third-party that may be displayed, included or made available by the Service.</p>
          <p>Website refers to ${data.companyName}, accessible from ${data.websiteUrl}</p>
          <p>You means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</p>
          <h2>Acknowledgment</h2>
          <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p>
          <p>Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.</p>
          <p>By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.</p>
          <p>You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.</p>
          <p>Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Privacy Policy of the Company. Our Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your personal information when You use the Application or the Website and tells You about Your privacy rights and how the law protects You. Please read Our Privacy Policy carefully before using Our Service.</p>
          <h2>Links to Other Websites</h2>
          <p>Our Service may contain links to third-party web sites or services that are not owned or controlled by the Company.</p>
          <p>The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such web sites or services.</p>
          <p>We strongly advise You to read the terms and conditions and privacy policies of any third-party web sites or services that You visit.</p>
          <h2>Termination</h2>
          <p>We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.</p>
          <p>Upon termination, Your right to use the Service will cease immediately.</p>
          <h2>Limitation of Liability</h2>
          <p>Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of this Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service or 100 USD if You haven't purchased anything through the Service.</p>
          <p>To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the Service, third-party software and/or third-party hardware used with the Service, or otherwise in connection with any provision of this Terms), even if the Company or any supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose.</p>
          <p>Some states do not allow the exclusion of implied warranties or limitation of liability for incidental or consequential damages, which means that some of the above limitations may not apply. In these states, each party's liability will be limited to the greatest extent permitted by law.</p>
          <h2>"AS IS" and "AS AVAILABLE" Disclaimer</h2>
          <p>The Service is provided to You "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company, on its own behalf and on behalf of its Affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service, including all implied warranties of merchantability, fitness for a particular purpose, title and non-infringement, and warranties that may arise out of course of dealing, course of performance, usage or trade practice. Without limitation to the foregoing, the Company provides no warranty or undertaking, and makes no representation of any kind that the Service will meet Your requirements, achieve any intended results, be compatible or work with any other software, applications, systems or services, operate without interruption, meet any performance or reliability standards or be error free or that any errors or defects can or will be corrected.</p>
          <p>Without limiting the foregoing, neither the Company nor any of the company's provider makes any representation or warranty of any kind, express or implied: (i) as to the operation or availability of the Service, or the information, content, and materials or products included thereon; (ii) that the Service will be uninterrupted or error-free; (iii) as to the accuracy, reliability, or currency of any information or content provided through the Service; or (iv) that the Service, its servers, the content, or e-mails sent from or on behalf of the Company are free of viruses, scripts, trojan horses, worms, malware, timebombs or other harmful components.</p>
          <p>Some jurisdictions do not allow the exclusion of certain types of warranties or limitations on applicable statutory rights of a consumer, so some or all of the above exclusions and limitations may not apply to You. But in such a case the exclusions and limitations set forth in this section shall be applied to the greatest extent enforceable under applicable law.</p>
          <h2>Governing Law</h2>
          <p>The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws.</p>
          <h2>Disputes Resolution</h2>
          <p>If You have any concern or dispute about the Service, You agree to first try to resolve the dispute informally by contacting the Company.</p>
          <p>For European Union (EU) Users</p>
          <p>If You are a European Union consumer, you will benefit from any mandatory provisions of the law of the country in which you are resident in.</p>
          <h2>United States Legal Compliance</h2>
          <p>You represent and warrant that (i) You are not located in a country that is subject to the United States government embargo, or that has been designated by the United States government as a "terrorist supporting" country, and (ii) You are not listed on any United States government list of prohibited or restricted parties.</p>
          <h2>Severability and Waiver</h2>
          <p>Severability</p>
          <p>If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.</p>
          <p>Waiver</p>
          <p>Except as provided herein, the failure to exercise a right or to require performance of an obligation under these Terms shall not effect a party's ability to exercise such right or require such performance at any time thereafter nor shall the waiver of a breach constitute a waiver of any subsequent breach.</p>
          <h2>Translation Interpretation</h2>
          <p>These Terms and Conditions may have been translated if We have made them available to You on our Service. You agree that the original English text shall prevail in the case of a dispute.</p>
          <h2>Changes to These Terms and Conditions</h2>
          <p>We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion.</p>
          <p>By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the website and the Service.</p>
          <h2>Contact Us</h2>
          <p>If you have any questions about these Terms and Conditions, You can <a href="${data.contactUrl}">contact us</a>.</p>
          <p> </p>
        `
        break

      case 'privacy':
        content = `
          <h1>Privacy Policy</h1>
          <p>Last updated: ${data.date}</p>
          <p>
            This Privacy Policy describes Our policies and procedures on the collection, use, and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
          </p>
          <p>
            We use Your Personal Data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
          </p>
          <h2>Interpretation and Definitions</h2>
          <h3>Interpretation</h3>
          <p>
            The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
          </p>
          <h3>Definitions</h3>
          <p>For the purposes of this Privacy Policy:</p>
          <ul>
            <li><p>Account: A unique account created for You to access our Service or parts of our Service.</p></li>
            <li><p>Company (referred to as either "the Company", "We", "Us" or "Our" in this Agreement): refers to ${data.companyName}, located at ${data.address1}${data.address2 ? ', ' + data.address2 : ''}, ${data.city}, ${data.state}, ${data.postalCode}.</p></li>
            <li><p>Cookies: Small files that are placed on Your computer, mobile device, or any other device by a website, containing details of Your browsing history and other purposes.</p></li>
            <li><p>Country: Refers to ${data.country}.</p></li>
            <li><p>Device: Any device that can access the Service, such as a computer, a cellphone, or a digital tablet.</p></li>
            <li><p>Personal Data: Any information that relates to an identified or identifiable individual.</p></li>
            <li><p>Service: Refers to the Website.</p></li>
            <li><p>Service Provider: Any natural or legal person who processes the data on behalf of the Company, including third-party companies or individuals employed by the Company to facilitate or analyze the Service.</p></li>
            <li><p>Usage Data: Data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (e.g., the duration of a page visit).</p></li>
            <li><p>Website: Refers to ${data.companyName}, accessible from <a href="${data.websiteUrl}">${data.websiteUrl}</a>.</p></li>
            <li><p>You: The individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</p></li>
          </ul>
          <p>---</p>
          <h2>Collecting and Using Your Personal Data</h2>
          <h3>Types of Data Collected</h3>
          <h4>Personal Data</h4>
          <p>
            While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
          </p>
          <ul>
            <li><p>Address, State, Province, ZIP/Postal code, City</p></li>
          </ul>
          <h4>Usage Data</h4>
          <p>Usage Data is collected automatically when using the Service.</p>
          <p>
            Usage Data may include information such as Your Device's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.
          </p>
          <p>
            When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers, and other diagnostic data.
          </p>
          <p>
            We may also collect information that Your browser sends whenever You visit our Service or when You access the Service by or through a mobile device.
          </p>
          <h4>Tracking Technologies and Cookies</h4>
          <p>
            We use Cookies and similar tracking technologies to track activity on Our Service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze Our Service. The technologies We use may include:
          </p>
          <ul>
            <li><p>Cookies or Browser Cookies: A cookie is a small file placed on Your Device. You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of our Service. Unless You have adjusted Your browser settings to refuse Cookies, our Service may use Cookies.</p></li>
            <li><p>Flash Cookies: Certain features of our Service may use local stored objects (or Flash Cookies) to collect and store information about Your preferences or activity. Flash Cookies are not managed by the same browser settings as Browser Cookies.</p></li>
            <li><p>Web Beacons: Certain sections of our Service and emails may contain small electronic files known as web beacons (clear gifs, pixel tags, single-pixel gifs) that permit the Company to count users who have visited pages or opened emails and for related statistics.</p></li>
          </ul>
          <p>
            Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies remain on Your device when You go offline, while Session Cookies are deleted as soon as You close Your web browser.
          </p>
          <p>
            We use both Session and Persistent Cookies for purposes including:
          </p>
          <p>1. Necessary / Essential Cookies:</p>
          <ul>
            <li><p>Type: Session Cookies</p></li>
            <li><p>Administered by: Us</p></li>
            <li><p>Purpose: Essential to provide You with services available through the Website and enable certain functionalities. These Cookies authenticate users and prevent fraudulent use.</p></li>
          </ul>
          <p>2. Cookies Policy / Notice Acceptance Cookies:</p>
          <ul>
            <li><p>Type: Persistent Cookies</p></li>
            <li><p>Administered by: Us</p></li>
            <li><p>Purpose: Identify whether users have accepted the use of cookies on the Website.</p></li>
          </ul>
          <p>3. Functionality Cookies:</p>
          <ul>
            <li><p>Type: Persistent Cookies</p></li>
            <li><p>Administered by: Us</p></li>
            <li><p>Purpose: Remember choices You make when You use the Website, such as language preferences or login details, for a personalized experience.</p></li>
          </ul>
          <p>---</p>
          <h2>Use of Your Personal Data</h2>
          <p>
            The Company may use Personal Data for purposes such as:
          </p>
          <ul>
            <li><p>To provide and maintain our Service, including monitoring usage.</p></li>
            <li><p>To manage Your Account and provide access to functionalities.</p></li>
            <li><p>To perform contractual obligations.</p></li>
            <li><p>To contact You regarding updates, changes, or other relevant communication.</p></li>
            <li><p>To manage Your requests and inquiries.</p></li>
            <li><p>To conduct business transfers, such as mergers or acquisitions.</p></li>
            <li><p>For analytics, marketing improvements, or promotional evaluations.</p></li>
          </ul>
          <p>---</p>
          <h2>Retention of Your Personal Data</h2>
          <p>
            The Company will retain Your Personal Data as long as necessary to fulfill the purposes outlined in this Privacy Policy. Specific retention periods will be provided upon request or specified in applicable legal obligations.
          </p>
          <p>---</p>
          <h2>Sale of Personal Data</h2>
          <p>
            The Company does not sell, rent, or trade Your Personal Data to third parties.
          </p>
          <p>---</p>
          <h2>International Transfers and Legal Basis</h2>
          <p>
            If Your data is transferred internationally, We ensure compliance with applicable laws, including GDPR provisions, through Standard Contractual Clauses or similar safeguards.
          </p>
          <p>---</p>
          <h2>Security, Children's Privacy, and Changes</h2>
          <ul>
            <li><p>Security: No system is entirely secure, but we take reasonable measures to protect your data.</p></li>
            <li><p>Children: Services are not directed at individuals under 13 years. We do not knowingly collect their data.</p></li>
            <li><p>Changes: Updates are announced via prominent notifications or email as required.</p></li>
          </ul>
          <p>
            For further inquiries, <a href="${data.contactUrl}">contact us</a>.
          </p>
          <p></p>
          <p></p>
          <p><br></p>
        `
        break

      case 'goodfaith':
        content = `
          <h2>
            YOU HAVE THE RIGHT TO RECEIVE A "GOOD FAITH ESTIMATE" EXPLAINING HOW MUCH YOUR MEDICAL CARE WILL COST
          </h2>
          <p>
            Under the law, health care providers need to give patients who don't have insurance or who are not using insurance an estimate of the bill for medical items and services.
          </p>
          <ul>
            <li>
              <p>
                You have the right to receive a Good Faith Estimate for the total expected cost of any non-emergency items or services. This includes related costs like medical tests, prescription drugs, equipment, and hospital fees.
              </p>
            </li>
            <li>
              <p>
                Make sure your health care provider gives you a Good Faith Estimate in writing at least 1 business day before your medical service or item. You can also ask your health care provider, and any other provider you choose, for a Good Faith Estimate before you schedule an item or service.
              </p>
            </li>
            <li>
              <p>
                If you receive a bill that is at least $400 more than your Good Faith Estimate, you can dispute the bill.
              </p>
            </li>
            <li>
              <p>
                Make sure to save a copy or picture of your Good Faith Estimate.
              </p>
            </li>
          </ul>
          <p>
            For questions or more information about your right to a Good Faith Estimate, visit
            <a href="http://www.cms.gov/nosurprises" target="_blank">http://www.cms.gov/nosurprises</a>
            or call 800-985-3059.
          </p>
        `
        break
    }

    setGeneratedContent(content)
  }

  const highlightText = () => {
    const output = document.getElementById('legal-output')
    if (output && output.innerText.trim()) {
      const range = document.createRange()
      range.selectNodeContents(output)
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }

  useEffect(() => {
    generatePage()
  }, [pageType, formData])

  return (
    <div className="space-y-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Legal Page Generator</CardTitle>
          <CardDescription>
            Generate legal pages for your therapy practice website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pageType">Page Type</Label>
              <Select value={pageType} onValueChange={setPageType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="terms">Terms of Service</SelectItem>
                  <SelectItem value="privacy">Privacy Policy</SelectItem>
                  <SelectItem value="goodfaith">Good Faith Estimate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="Your Practice Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address1">Address Line 1</Label>
              <Input
                id="address1"
                value={formData.address1}
                onChange={(e) => handleInputChange('address1', e.target.value)}
                placeholder="123 Main Street"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address2">Address Line 2</Label>
              <Input
                id="address2"
                value={formData.address2}
                onChange={(e) => handleInputChange('address2', e.target.value)}
                placeholder="Suite 100 (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Your City"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="CO"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                placeholder="80301"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="United States"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                placeholder="https://yourpractice.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactUrl">Contact Page URL</Label>
              <Input
                id="contactUrl"
                type="url"
                value={formData.contactUrl}
                onChange={(e) => handleInputChange('contactUrl', e.target.value)}
                placeholder="https://yourpractice.com/contact"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button onClick={highlightText} variant="outline">
                Highlight Text
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Content */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Legal Page</CardTitle>
          <CardDescription>
            Copy the content below and add it to your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            id="legal-output"
            className="prose prose-sm max-w-none bg-muted p-6 rounded-lg max-h-96 overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: generatedContent }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
