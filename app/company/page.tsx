"use client"

import Link from "next/link"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Building2, Shield, Calendar } from "lucide-react"
import { Footer } from "@/components/footer"
import { countries } from '@selfxyz/qrcode';
import { v4 as uuidv4 } from 'uuid';
import { countryCodes } from '@selfxyz/core';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

export default function CompanyPage() {
  const [companyName, setCompanyName] = useState("")
  const [userId, setUserId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date>()
  const [endTime, setEndTime] = useState<Date>()

  useEffect(() => {
    setUserId(uuidv4());
  }, []);

  const [disclosures, setDisclosures] = useState({
    issuing_state: false,
    name: false,
    nationality: true,
    date_of_birth: false,
    passport_number: false,
    gender: false,
    expiry_date: false,
    minimumAge: 18,
    excludedCountries: [
      countries.IRAN,
      countries.IRAQ,
      countries.NORTH_KOREA,
      countries.RUSSIA,
      countries.SYRIAN_ARAB_REPUBLIC,
      countries.VENEZUELA
    ],
    ofac: true,
  });

  const [showCountryModal, setShowCountryModal] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([
    countries.IRAN,
    countries.IRAQ,
    countries.NORTH_KOREA,
    countries.RUSSIA,
    countries.SYRIAN_ARAB_REPUBLIC,
    countries.VENEZUELA
  ]);

  const [countrySelectionError, setCountrySelectionError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleCompanyName = (name: string) => {
    setCompanyName(name);
    setUserId(uuidv4());
    setSubmitSuccess(false);
    setSubmitError(null);
    setIsSubmitting(false);
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAge = parseInt(e.target.value);
    setDisclosures(prev => ({ ...prev, minimumAge: newAge }));
  };

  const handleCountryToggle = (country: string) => {
    setSelectedCountries(prev => {
      if (prev.includes(country)) {
        setCountrySelectionError(null);
        return prev.filter(c => c !== country);
      }

      if (prev.length >= 40) {
        setCountrySelectionError('Maximum 40 countries can be excluded');
        return prev;
      }

      return [...prev, country];
    });
  };

  const saveCountrySelection = () => {
    const codes = selectedCountries.map(countryName => {
      const entry = Object.entries(countryCodes).find(([_, name]) => name === countryName);
      return entry ? entry[0] : countryName.substring(0, 3).toUpperCase();
    });

    setDisclosures(prev => ({ ...prev, excludedCountries: codes }));
    setShowCountryModal(false);
  };

  const handleCheckboxChange = (field: string) => {
    setDisclosures(prev => {
      const newValue = !prev[field as keyof typeof prev];
      if (typeof newValue === 'boolean') {
        return {
          ...prev,
          [field]: newValue
        };
      }
      return prev;
    });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await fetch('/api/saveOptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId: userId,
          companyName,
          start: startTime,
          end: endTime,
          options: {
            minimumAge: disclosures.minimumAge > 0 ? disclosures.minimumAge : undefined,
            excludedCountries: disclosures.excludedCountries,
            ofac: disclosures.ofac,
            issuing_state: disclosures.issuing_state,
            name: disclosures.name,
            nationality: disclosures.nationality,
            date_of_birth: disclosures.date_of_birth,
            passport_number: disclosures.passport_number,
            gender: disclosures.gender,
            expiry_date: disclosures.expiry_date
          }
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Expected JSON response but received ${contentType || 'unknown content type'}`);
      }
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save configuration');
      }

      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error saving configuration:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to save configuration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCountries = Object.entries(countryCodes).filter(([_, country]) =>
    country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2 -ml-2 mb-4 hover:bg-indigo-50">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <div className="text-center mb-12">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Company Setup</h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Configure your company's verification requirements
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Company Information Card */}
            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="rounded-full bg-indigo-100 p-3 text-indigo-600">
                  <Building2 className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Company Information</h2>
              </div>

              <div className="mb-6">
                <label htmlFor="company-name" className="block mb-2 text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <Input
                  id="company-name"
                  placeholder="Enter company name"
                  value={companyName}
                  onChange={(e) => handleCompanyName(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    KYC Start Time
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startTime && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {startTime ? format(startTime, "PPP") : "Select start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={startTime}
                        onSelect={setStartTime}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    KYC End Time
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endTime && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {endTime ? format(endTime, "PPP") : "Select end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={endTime}
                        onSelect={setEndTime}
                        initialFocus
                        disabled={(date: Date) => 
                          startTime ? date < startTime : false
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </Card>

            {/* Verification Options Card */}
            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="rounded-full bg-indigo-100 p-3 text-indigo-600">
                  <Shield className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Verification Options</h2>
              </div>

              <div className="space-y-8">
                {/* Personal Information Section */}
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { key: 'issuing_state', label: 'Disclose Issuing State' },
                      { key: 'name', label: 'Disclose Name' },
                      { key: 'nationality', label: 'Disclose Nationality' },
                      { key: 'date_of_birth', label: 'Disclose Date of Birth' },
                      { key: 'passport_number', label: 'Disclose Passport Number' },
                      { key: 'gender', label: 'Disclose Gender' },
                      { key: 'expiry_date', label: 'Disclose Expiry Date' }
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center space-x-3 p-3 rounded-md hover:bg-white transition-colors">
                        <input
                          type="checkbox"
                          checked={typeof disclosures[key as keyof typeof disclosures] === 'boolean' 
                            ? disclosures[key as keyof typeof disclosures] as boolean 
                            : false}
                          onChange={() => handleCheckboxChange(key)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Age Requirement Section */}
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Age Requirement</h3>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="number"
                      min="0"
                      value={disclosures.minimumAge}
                      onChange={handleAgeChange}
                      className="w-24"
                    />
                    <span className="text-gray-700">Minimum Age</span>
                  </div>
                </div>

                {/* Country Restrictions Section */}
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Country Restrictions</h3>
                    <Button
                      onClick={() => setShowCountryModal(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      Manage Countries
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {disclosures.excludedCountries.slice(0, 8).map((country) => (
                      <span
                        key={country}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {country}
                      </span>
                    ))}
                    {disclosures.excludedCountries.length > 8 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        +{disclosures.excludedCountries.length - 8} more
                      </span>
                    )}
                  </div>
                </div>

                {/* OFAC Check Section */}
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={disclosures.ofac}
                      onChange={() => handleCheckboxChange('ofac')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700">Enable OFAC Sanctions Check</span>
                  </label>
                </div>

                {/* Submit Section */}
                <div className="flex flex-col items-center space-y-4 pt-6">
                  {submitError && (
                    <div className="w-full p-4 bg-red-50 text-red-700 rounded-lg">
                      {submitError}
                    </div>
                  )}
                  {submitSuccess && (
                    <div className="w-full p-4 bg-green-50 text-green-700 rounded-lg">
                      Configuration saved successfully! Your company ID is: {userId}
                    </div>
                  )}
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !companyName.trim()}
                    className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      'Save Configuration'
                    )}
                  </Button>
                </div>
              </div>
            </Card>
            {showCountryModal && (
                <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-300">
                        <h3 className="text-xl font-semibold mb-4">Select Countries to Exclude</h3>
                        
                        {countrySelectionError && (
                            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                                {countrySelectionError}
                            </div>
                        )}
                        
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Search countries..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-6 max-h-80 overflow-y-auto">
                            {filteredCountries.map(([code, country]) => (
                                <label key={code} className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded">
                                    <input
                                        type="checkbox"
                                        checked={selectedCountries.includes(code)}
                                        onChange={() => handleCountryToggle(code)}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-sm">{country}</span>
                                </label>
                            ))}
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowCountryModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveCountrySelection}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
