# atg-tech-assessment
Project Overview
This is my submission for the Shopify Liquid Developer technical assessment. Due to time constraints, I wasn't able to fully complete the entire homepage, but I've implemented several key components to demonstrate my Liquid proficiency.

🎯 Implemented Features
(All components are merchant-configurable via Shopify admin and match Figma specs)

✅ Hero Banner
Dynamic Elements:

Admin-uploadable images

Editable headings (H1/H2) with typography controls

CTA buttons (text/URL customizable)

Tech: Uses {% schema %} for merchant-friendly controls

✅ Featured Collection (Desktop Carousel)
Smooth carousel navigation with vanilla JS

✅ Tabbed Collections
Dynamic tabs with active state styling:

javascript
$( "#tabs" ).tabs({
                create: function( event, ui ) {
                    {%  if section.settings.useslider %}
                        tabSlider()
                    {%  endif %}
                },
                activate: function( event, ui ) {
                    {%  if section.settings.useslider %}
                        tabSlider()
                    {%  endif %}
                }
            });

Pull collections dynamically:
{%- for product in block.settings.collection.products limit: 8 -%}
Zero hardcoded collections – fully admin-driven

✅ Product Grids
Hover Effects: CSS transitions for product cards

Subscribed Product CTA: Conditional rendering:

{% render 'card-product' %}

✅ Infinite Loop Marquee
Dynamic content blocks with adjustable speed:

javascript
function infiniteMarquee()

✅ Multi-Column Section
Hover states with CSS transforms

Responsive column collapse (3 → 2 → 1)

🟠 Partially Completed: Cart Drawer
Completed:

Item counter: {{ cart.item_count }}

Functional shipping progress bar:

liquid
{% if settings.enabled_shipping_bar and cart != empty %}
          {% render 'cart-shipping-bar' %}
 {% endif %}
Checkout button UI updates

Remaining: adding product collection

🔥 Technical Highlights
Merchant-First Approach
All sections include intuitive settings.schema for non-technical users

Tooltips in schema (e.g., "Upload 1440px-wide images for best results")

Performance & Compatibility
Vanilla JS for core interactions + jQuery fallback

Cart AJAX foundations:

javascript
fetch('/cart/update.js', { 
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
});

🧪 How to Test
Live Preview: ATG Tech Assessment MAIN

Admin Customization:

Hero Banner: Sections > Hero – Adjust slides/CRO elements

Tabbed Collections: Add/remove tabs via block system

🚀 Next Steps
With more time, I’d:

Complete Cart Drawer

Build Quick View Modal:

Fetch product data via {{ product | json }}

Thank you for your consideration! I’d love to discuss how I can contribute to Arctic Grey’s high-impact projects.

📧 Contact: amillasam.dev@gmail.com
💻 GitHub: merlinfuls/atg-tech-assessment
