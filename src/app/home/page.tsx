import Link from "next/link";
import SearchBar from "@/components/searchBar";
import SignInCardSection from "@/components/signInCardSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#EEE9DA] text-[#1a1a1a]">
      {/* Hero Section with Search Bar */}
      <section className="bg-white text-center py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#6096B4]">
          Find Your Next <span className="text-[#1a1a1a]">Tech Job</span> Here
        </h1>
        <p className="text-lg md:text-xl mb-10 text-[#4B5563]">
          Explore opportunities from top tech companies. For developers,
          designers, and IT professionals.
        </p>

        <SearchBar />
      </section>

      {/* Sign-in Card Section */}
      <SignInCardSection />

      {/* Features Section */}
      <section className="py-16 px-6 bg-[#EEE0C9]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#1a1a1a] mb-10">
            Why Use Our Platform?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-[#6096B4] mb-2">
                Verified Companies
              </h3>
              <p className="text-sm text-gray-700">
                Work with trusted tech companies actively hiring.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-[#6096B4] mb-2">
                Skill-Based Matching
              </h3>
              <p className="text-sm text-gray-700">
                Get job recommendations based on your tech skills.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-[#6096B4] mb-2">
                Developer-Friendly
              </h3>
              <p className="text-sm text-gray-700">
                Built with developers in mind – smooth UX, fast search.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-white py-14 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#6096B4]">
          Ready to take the next step in your tech career?
        </h2>
        <Link
          href="/auth/register"
          className="inline-block bg-[#6096B4] text-white px-8 py-3 mt-4 rounded-lg font-semibold hover:bg-[#4d7a96] transition"
        >
          Sign Up Today
        </Link>
      </section>
    </main>
  );
}
