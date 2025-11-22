import Link from "next/link";
import Image from "next/image";
import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background">

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <Link href="/auth/sign-in" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
                    ← Back to Sign In
                </Link>

                <div className="flex items-center gap-3 mb-6">
                    <div className="relative w-12 h-12">
                        <Image src="/logo.png" alt="Pixn" fill className="object-contain" />
                    </div>
                    <h1 className="text-4xl font-bold">Privacy Policy</h1>
                </div>

                <div className="bg-background/80 backdrop-blur rounded-2xl p-8 shadow-lg space-y-6">
                    <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-lg">
                        <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                        <p className="text-sm text-muted-foreground">
                            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </p>
                    </div>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold">Introduction</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Welcome to Pixn ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our image gallery service.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold">Information We Collect</h2>
                        <div className="space-y-2 text-muted-foreground">
                            <p className="leading-relaxed"><strong className="text-foreground">Account Information:</strong> When you sign up, we collect your email address and any profile information you provide through Google OAuth or email authentication.</p>
                            <p className="leading-relaxed"><strong className="text-foreground">Images:</strong> We store the images you upload to our service, along with associated metadata (file name, size, upload date).</p>
                            <p className="leading-relaxed"><strong className="text-foreground">Usage Data:</strong> We collect information about how you interact with our service, including access times and features used.</p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
                        <div className="space-y-2 text-muted-foreground">
                            <p className="leading-relaxed">• To provide and maintain our image gallery service</p>
                            <p className="leading-relaxed">• To authenticate your account and ensure security</p>
                            <p className="leading-relaxed">• To store and organize your uploaded images</p>
                            <p className="leading-relaxed">• To improve our service and user experience</p>
                            <p className="leading-relaxed">• To communicate important updates or changes</p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold">AI-Powered Features</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We use artificial intelligence (AI) technology to analyze your uploaded images and generate descriptions for search functionality. This processing helps you find your images more easily through natural language search. The AI-generated descriptions are stored alongside your images but are only used to enhance your search experience. No AI-generated content is shared with third parties.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold">Data Storage and Security</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Your images are stored securely using cloud infrastructure with industry-standard encryption. We implement appropriate security measures to protect against unauthorized access, alteration, or disclosure of your data. However, no method of transmission over the internet is 100% secure.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold">Your Rights</h2>
                        <div className="space-y-2 text-muted-foreground">
                            <p className="leading-relaxed">• <strong className="text-foreground">Access:</strong> You can access your data at any time through your account</p>
                            <p className="leading-relaxed">• <strong className="text-foreground">Delete:</strong> You can delete your images individually or your entire account</p>
                            <p className="leading-relaxed">• <strong className="text-foreground">Export:</strong> You can download your images at any time</p>
                            <p className="leading-relaxed">• <strong className="text-foreground">Withdraw Consent:</strong> You can stop using our service at any time</p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold">Third-Party Services</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We use secure cloud services for data storage and authentication, and Google OAuth for sign-in services. These services have their own privacy policies governing the use of your information.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold">Changes to This Policy</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last updated" date at the top of this policy.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold">Contact Us</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact us through our{" "}
                            <a href="https://t.me/plxor" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                Telegram
                            </a>{" "}
                            or{" "}
                            <a href="https://github.com/braveram/pixn" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                GitHub
                            </a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
