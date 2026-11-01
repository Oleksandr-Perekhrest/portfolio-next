// local dependencies
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Contact from "@/components/Contact/Contact";
import Experience from "@/components/experience/Experience/Experience";

export default function Home() {
    return (
        <>
            <Hero />
            <Experience />
            <About />
            <Contact />
        </>
    );
}
