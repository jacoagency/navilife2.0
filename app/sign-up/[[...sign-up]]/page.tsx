import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
      <div className="bg-navy-800 p-8 rounded-lg shadow-xl border border-navy-700">
        <h1 className="text-3xl font-bold mb-6 text-white text-center
                     [text-shadow:_0_0_10px_rgb(59_130_246_/_0.5)]">
          Join NaviLife
        </h1>
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-all",
              card: "bg-transparent shadow-none",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "bg-navy-700 border border-navy-600 hover:bg-navy-600",
              formFieldInput: "bg-navy-900 border-navy-700 text-white",
              formFieldLabel: "text-gray-200",
              dividerLine: "bg-navy-700",
              dividerText: "text-gray-200",
              footerActionLink: "text-blue-400 hover:text-blue-300",
              formFieldLabelRow: "text-gray-200",
              identityPreviewText: "text-gray-200",
            },
          }}
        />
      </div>
    </div>
  );
}