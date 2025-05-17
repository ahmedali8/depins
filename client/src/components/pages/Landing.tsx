import { Navbar } from "@/components/molecules";
import {
  Hero,
  Problem,
  HowItWorks,
  Example,
  Features,
  Ecosystem,
  Architecture,
  Roadmap,
  Vision,
} from "@/components/sections/landing";

export default function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <Problem />
      <HowItWorks />
      <Example />
      <Features />
      <Ecosystem />
      <Architecture />
      <Roadmap />
      <Vision />
    </>
  );
}
