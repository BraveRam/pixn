import Link from "next/link";
import Image from "next/image";
import { FileText } from "lucide-react";

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-background">

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <Link href="/auth/sign-in" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
                    ← Back to Sign In
                </Link>

                <div className="flex items-center gap-3 mb-6">
                    <div className="relative w-12 h-12">
                        <Image src="/logo.png" alt="Pixn" fill sizes="48px" className="object-contain" />
                    </div>
                    <h1 className="text-4xl font-bold">Terms of Service</h1>
                </div>

                <div className="bg-background/80 backdrop-blur rounded-2xl p-8 shadow-lg space-y-6">
                    <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-lg">
                        <FileText className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                        <p className="text-sm text-muted-foreground">
                            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </p>
                    </div>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold">Agreement to Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            By accessing or using Pixn (&quot;Service&quot;), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold">Use of Service</h2>
                        <div className="space-y-2 text-muted-foreground">
                            <p className="leading-relaxed"><strong className="text-foreground">Eligibility:</strong> You must be at least 13 years old to use this Service.</p>
                            <p className="leading-relaxed"><strong className="text-foreground">Account:</strong> You are responsible for maintaining the security of your account and any activity under your account.</p>
                            <p className="leading-relaxed"><strong className="text-foreground">Free Service:</strong> Pixn is provided free of charge with no subscription fees.</p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold">Image Upload Guidelines</h2>
                        <div className="space-y-2 text-muted-foreground">
                            <p className="leading-relaxed">• You may upload up to 3 images at a time</p>
                            <p className="leading-relaxed">• Maximum file size per image is 5MB</p>
                            <p className="leading-relaxed">• You may store a maximum of 20 images in your gallery</p>
                            <p className="leading-relaxed">• You retain all rights to images you upload</p>
                            <p className="leading-relaxed">• You must have the right to upload and share the images</p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold">Prohibited Content</h2>
                        <div className="space-y-2 text-muted-foreground">
                            <p className="leading-relaxed">You may not upload images that:</p>
                            <p className="leading-relaxed">• Violate any laws or regulations</p>
                            <p className="leading-relaxed">• Infringe on intellectual property rights</p>
                            <p className="leading-relaxed">• Contain malware or harmful code</p>
                            <p className="leading-relaxed">• Are hateful, threatening, or harassing</p>
                            <p className="leading-relaxed">• Contain explicit or illegal content</p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold">Your Content</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            You retain all ownership rights to the images you upload. By uploading content, you grant us a license to store, display, and process your images solely for the purpose of providing the Service to you. We do not claim ownership of your content.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold">Service Availability</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We strive to maintain high availability but do not guarantee uninterrupted access. We may modify, suspend, or discontinue any part of the Service at any time. We are not liable for any modification, suspension, or discontinuation of the Service.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold">Termination</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We reserve the right to terminate or suspend your account at any time for violations of these Terms. You may delete your account at any time through the Service.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold">Disclaimer of Warranties</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            The Service is provided &quot;as is&quot; without warranties of any kind. We do not guarantee that the Service will be error-free, secure, or uninterrupted.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, including but not limited to loss of data or images.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold">Changes to Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We reserve the right to modify these Terms at any time. We will notify users of any material changes by updating the &quot;Last updated&quot; date. Continued use of the Service after changes constitutes acceptance of the new Terms.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold">Contact</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            For questions about these Terms, please reach out via{" "}
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
