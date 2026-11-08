import { SITE_CONFIG } from "@/constants";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50/50 py-8 text-center text-sm text-gray-500">
      <div className="max-w-5xl mx-auto px-4">
        <p>&copy; 2026 {SITE_CONFIG.englishName}. All rights reserved.</p>
      </div>
    </footer>
  );
}
