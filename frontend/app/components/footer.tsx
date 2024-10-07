"use client";

export default function Footer() {
  return (
    <footer className="bg-neutral-100 text-black py-1 w-full fixed bottom-0 left-0 max-h-60 min-h-[60] z-0 dark:bg-neutral-900 text-black dark:text-white">
      <div className="container mx-auto text-center">
        <p className="text-sm pt-0 mt-0">
          &copy; {new Date().getFullYear()} <a href="https://www.linkedin.com/in/rashidbawah/">Rashid Bawah.</a> All rights reserved.
        </p>
      </div>
    </footer>
  );
}
