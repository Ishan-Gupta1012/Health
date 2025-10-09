import { AnimatedCounter } from "./animated-counter";
import { HeartbeatAnimation } from "./heartbeat-animation";

export function AboutSection() {
    return (
        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
                <div className="space-y-3 flex flex-col items-center">
                    <HeartbeatAnimation />
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About HealthNest</h2>
                    <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Our mission is to empower individuals with AI-driven tools for preventive care, fostering better patient-doctor connections and making healthcare management seamless and accessible for everyone.
                    </p>
                </div>
                <div className="grid w-full grid-cols-1 items-stretch justify-center gap-8 md:grid-cols-2">
                    <div className="mx-auto flex w-full flex-col items-center justify-center space-y-2 rounded-lg bg-card p-6 shadow-sm">
                        <p className="text-5xl font-bold tracking-tighter gradient-text">
                            <AnimatedCounter value={100} />K+
                        </p>
                        <p className="text-sm font-medium text-muted-foreground">Patients Helped</p>
                    </div>
                    <div className="mx-auto flex w-full flex-col items-center justify-center space-y-2 rounded-lg bg-card p-6 shadow-sm">
                         <p className="text-5xl font-bold tracking-tighter gradient-text">
                            <AnimatedCounter value={500} />+
                        </p>
                        <p className="text-sm font-medium text-muted-foreground">Verified Doctors</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
