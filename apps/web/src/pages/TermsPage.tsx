import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-1.5 text-xs text-gray-500 overflow-x-auto pb-1 scrollbar-none">
        <Link to="/" className="hover:text-gray-900 shrink-0">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span className="text-gray-900 font-medium truncate">Terms of Service</span>
      </div>

      <div className="border-b border-[#EBE5DA] pb-6 space-y-2">
        <div className="inline-flex items-center space-x-1.5 text-xs text-[#C25E34] font-semibold">
          <FileText className="w-4 h-4" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">
          Terms of Service &amp; Marketplace Guidelines
        </h1>
        <p className="text-xs text-gray-500">
          Last revised: September 2026 • DastKar Hub (Pvt) Ltd.
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <section className="space-y-3 bg-white p-6 rounded-2xl border border-[#EBE5DA]">
          <h2 className="font-serif font-bold text-base text-gray-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or transacting on DastKar Hub (&quot;the Marketplace&quot;), whether as a Patron (Buyer), Artisan Maker (Seller), or Visitor, you agree to comply with and be legally bound by these Terms of Service, our Privacy Policy, and the Artisan Ethics Charter.
          </p>
        </section>

        <section className="space-y-3 bg-white p-6 rounded-2xl border border-[#EBE5DA]">
          <h2 className="font-serif font-bold text-base text-gray-900">2. Handcrafted Product Authenticity</h2>
          <p>
            DastKar Hub exclusively showcases authentic handmade, artisanal, and culturally heritage-driven items produced within Pakistan.
          </p>
          <ul className="space-y-1.5 text-xs text-gray-600 pl-4 list-disc">
            <li><strong>Handmade Variations:</strong> Handcrafted products may showcase slight organic variations in dye hues, wood grain, stone patterns, or ceramic glazes. These are hallmarks of authenticity, not defects.</li>
            <li><strong>Prohibited Items:</strong> Mass-produced factory surplus, imported synthetic knockoffs, and counterfeit designer trademarks are strictly prohibited.</li>
          </ul>
        </section>

        <section className="space-y-3 bg-white p-6 rounded-2xl border border-[#EBE5DA]">
          <h2 className="font-serif font-bold text-base text-gray-900">3. Orders, Shipping &amp; Cash on Delivery (COD)</h2>
          <p>
            When placing an order on DastKar Hub:
          </p>
          <ul className="space-y-1.5 text-xs text-gray-600 pl-4 list-disc">
            <li>You agree to provide accurate recipient contact details and Pakistani postal addresses.</li>
            <li>For Cash on Delivery (COD) orders, patrons agree to keep the exact invoice amount ready upon courier delivery. Repeated refusal of delivered COD parcels may result in account restriction.</li>
            <li>Made-to-order crafts require specified artisan crafting lead times before courier dispatch.</li>
          </ul>
        </section>

        <section className="space-y-3 bg-white p-6 rounded-2xl border border-[#EBE5DA]">
          <h2 className="font-serif font-bold text-base text-gray-900">4. Returns, Damaged Items &amp; 7-Day Resolution</h2>
          <p>
            We stand behind every item shipped by our artisans:
          </p>
          <ul className="space-y-1.5 text-xs text-gray-600 pl-4 list-disc">
            <li>If an item arrives damaged or broken in transit (e.g. fragile Multani blue pottery), the buyer must submit unboxing photos within <strong>48 hours</strong> of courier delivery.</li>
            <li>Refunds or artisan replacements are processed swiftly through our dispute center after verification.</li>
          </ul>
        </section>

        <section className="space-y-3 bg-white p-6 rounded-2xl border border-[#EBE5DA]">
          <h2 className="font-serif font-bold text-base text-gray-900">5. Artisan Seller Obligations &amp; Escrow</h2>
          <p>
            All registered makers agree to maintain honest stock levels, ship orders within their declared processing timelines, and respect customer privacy. Seller earnings are held in secure platform escrow and disbursed following confirmed buyer receipt.
          </p>
        </section>
      </div>
    </div>
  );
};
