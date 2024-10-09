import React from "react";
import Header from "../components/LandingPage/Header";
import Benefits from "../components/LandingPage/Benefits";
import Testimonials from "../components/LandingPage/Testimonials";
import Download from "../components/LandingPage/Download";
import Footer from "../components/LandingPage/Footer";

const LandingPage:React.FC = () => {
    return (
        <>
            <Header />
            <Benefits />
            <Testimonials />
            <Download />
            <Footer />
        </>
    );
}

export default LandingPage;