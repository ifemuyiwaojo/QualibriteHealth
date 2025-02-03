import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary/10 py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight">About QualiBrite Family Psychiatry</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Committed to providing prompt and timely attention to your urgent mental health wellness.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold">Our Mission</h2>
                <p className="mt-4 text-muted-foreground">
                  At Qualibrite Family Psychiatry, we take your mental health very seriously! We understand the importance of providing prompt and timely attention to your urgent mental health wellness.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold">Our Vision</h2>
                <p className="mt-4 text-muted-foreground">
                  Our commitment to you is a personalized, timely response to your urgent mental health needs without the usual wait encountered at outpatient service centers. Try our services today and you will be glad you did.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Online Services Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">Modern Online Care</h2>
              <p className="mt-4 text-muted-foreground">
                Through our state-of-the-art telehealth platform, we provide convenient and secure mental health services directly to you. Our virtual consultations ensure you receive professional care from the comfort of your own home, eliminating the barriers of traditional in-person visits while maintaining the highest standards of psychiatric care.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d"
                alt="Virtual Healthcare"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}