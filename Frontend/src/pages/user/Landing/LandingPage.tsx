import React from 'react'
import Header from '../../../components/Landing/Header'
import FeaturesSection from '../../../components/Landing/FeaturesSection'
import Footer from '../../../components/Landing/Footer'

function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header/>
      <FeaturesSection/>
      <Footer/>
    </div>
  )
}

export default LandingPage
