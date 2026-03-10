export default function ComingSoon() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">

      <div className="text-center max-w-xl">

        {/* LOGO / BRAND */}
        <h1 className="text-4xl font-bold mb-6 tracking-wide">
          DONAVI.IN
        </h1>

        {/* TITLE */}
        <h2 className="text-3xl font-semibold mb-4">
          Website Coming Soon
        </h2>

        {/* DESCRIPTION */}
        <p className="text-gray-500 mb-8">
          We're working hard to launch our new fashion store.  
          Stay tuned for something amazing!
        </p>

        {/* COUNTDOWN TEXT */}
        <p className="text-sm text-gray-400 mb-6">
          Launching soon
        </p>

        {/* EMAIL INPUT */}
        <div className="flex gap-3 justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="border px-4 py-3 rounded w-64 text-sm"
          />
          <button className="bg-black text-white px-6 py-3 rounded text-sm">
            Notify Me
          </button>
        </div>

        {/* FOOTER */}
        <p className="text-xs text-gray-400 mt-10">
          © {new Date().getFullYear()} DONAVI. All rights reserved.
        </p>

      </div>

    </div>
  );
}