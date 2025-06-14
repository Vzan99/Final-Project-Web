import RegisterForm from "./registerForm";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-100">
      {/* Left side: Greeting + Image – hidden on mobile */}
      <div className="hidden md:flex flex-col items-center justify-start p-10 bg-white text-black">
        {/* Text */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Welcome to QuickDev</h1>
          <p className="text-lg max-w-sm">
            Your gateway to top IT careers and hiring the right tech talent.
          </p>
        </div>

        {/* Image */}
        <div className="w-full max-w-md">
          <Image
            src="/icon_register.png"
            alt="Register illustration"
            width={500}
            height={350}
            className="object-contain"
          />
        </div>
      </div>

      {/* Right side: Register form – always visible */}
      <div className="flex items-center justify-center p-6 bg-white">
        <RegisterForm />
      </div>
    </div>
  );
}
