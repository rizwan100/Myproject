"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import Logo from "@/components/Logo";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function TermsConditionsPage() {
  return (
    <div className=min-h-screen bg-gradient-to-b from-rose-50 to-white>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Terms & Conditions Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="h-8 w-8 text-rose-600" />
                Terms & Conditions
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Please read these terms and conditions carefully before using our service.
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Terms & Conditions for Aasan Rishte</CardTitle>
            <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <div className="space-y-6 text-sm leading-relaxed">
              <p>
                The terms We / Us / Our/Company individually and collectively refer to Aasan Rishte and the terms Visitor User refer to the users.
              </p>

              <p>
                This page states the Terms and Conditions under which you (Visitor) may visit this website Aasan Rishte (Website). Please read this page carefully. If you do not accept the Terms and Conditions stated here, we would request you to exit this site. The business, any of its business divisions and / or its subsidiaries, associate companies or subsidiaries to subsidiaries or such other investment companies (in India or abroad) reserve their respective rights to revise these Terms and Conditions at any time by updating this posting. You should visit this page periodically to re-appraise yourself of the Terms and Conditions, because they are binding on all users of this Website.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">USE OF CONTENT</h3>
              <p>
                All logos, brands, marks headings, labels, names, signatures, numerals, shapes or any combinations thereof, appearing in this site, except as otherwise noted, are properties either owned, or used under license, by the business and / or its associate entities who feature on this Website. The use of these properties or any other content on this site, except as provided in these terms and conditions or in the site content, is strictly prohibited.
              </p>

              <p>
                You may not sell or modify the content of this Website or reproduce, display, publicly perform, distribute, or otherwise use the materials in any way for any public or commercial purpose without the respective organization's or entity's written permission.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">ACCEPTABLE WEBSITE USE</h3>
              
              <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">(A) Security Rules</h4>
              <p>
                Visitors are prohibited from violating or attempting to violate the security of the Web site, including, without limitation, (1) accessing data not intended for such user or logging into a server or account which the user is not authorized to access, (2) attempting to probe, scan or test the vulnerability of a system or network or to breach security or authentication measures without proper authorization, (3) attempting to interfere with service to any user, host or network, including, without limitation, via means of submitting a virus or &quot;Trojan horse&quot; to the Website, overloading, flooding, mail bombing or crashing, or (4) sending unsolicited electronic mail, including promotions and/or advertising of products or services. Violations of system or network security may result in civil or criminal liability. The business and / or its associate entities will have the right to investigate occurrences that they suspect as involving such violations and will have the right to involve, and cooperate with, law enforcement authorities in prosecuting users who are involved in such violations.
              </p>

              <h4 className=text-base font-semibold text-gray-900 mt-6 mb-3>(B) General Rules</h4>
              <p>
                Visitors may not use the Web Site in order to transmit, distribute, store or destroy material (a) that could constitute or encourage conduct that would be considered a criminal offence or violate any applicable law or regulation, (b) in a manner that will infringe the copyright, trademark, trade secret or other intellectual property rights of others or violate the privacy or publicity of other personal rights of others, or (c) that is libellous, defamatory, pornographic, profane, obscene, threatening, abusive or hateful.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">INDEMNITY</h3>
              <p>
                The User unilaterally agree to indemnify and hold harmless, without objection, the Company, its officers, directors, employees and agents from and against any claims, actions and/or demands and/or liabilities and/or losses and/or damages whatsoever arising from or resulting from their use of Aasan Rishte or their breach of the terms.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">LIABILITY</h3>
              <p>
                User agrees that neither Company nor its group companies, directors, officers or employee shall be liable for any direct or/and indirect or/and incidental or/and special or/and consequential or/and exemplary damages, resulting from the use or/and the inability to use the service or/and for cost of procurement of substitute goods or/and services or resulting from any goods or/and data or/and information or/and services purchased or/and obtained or/and messages received or/and transactions entered into through or/and from the service or/and resulting from unauthorized access to or/and alteration of user's transmissions or/and data or/and arising from any other matter relating to the service, including but not limited to, damages for loss of profits or/and use or/and data or other intangible, even if Company has been advised of the possibility of such damages.
              </p>

              <p>
                User further agrees that Company shall not be liable for any damages arising from interruption, suspension or termination of service, including but not limited to direct or/and indirect or/and incidental or/and special consequential or/and exemplary damages, whether such interruption or/and suspension or/and termination was justified or not, negligent or intentional, inadvertent or advertent.
              </p>

              <p>
                User agrees that Company shall not be responsible or liable to user, or anyone, for the statements or conduct of any third party of the service. In sum, in no event shall Company's total liability to the User for all damages or/and losses or/and causes of action exceed the amount paid by the User to Company, if any, that is related to the cause of action.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">DISCLAIMER OF CONSEQUENTIAL DAMAGES</h3>
              <p>
                In no event shall Company or any parties, organizations or entities associated with the corporate brand name us or otherwise, mentioned at this Website be liable for any damages whatsoever (including, without limitations, incidental and consequential damages, lost profits, or damage to computer hardware or loss of data information or business interruption) resulting from the use or inability to use the Website and the Website material, whether based on warranty, contract, tort, or any other legal theory, and whether or not, such organization or entities were advised of the possibility of such damages.
              </p>

              <div className="mt-8 p-4 bg-rose-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                <p className="text-sm text-gray-700">
                  For any queries regarding these Terms & Conditions, please contact us at:
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  Email: aasanrishtecontact@gmail.com<br />
                  Phone: +917569319126
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <WhatsAppButton variant="floating" />
    </div>
  );
}
