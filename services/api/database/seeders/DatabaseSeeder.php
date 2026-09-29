<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Category;
use App\Models\CustomizationOption;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Review;
use App\Models\SellerProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Users
        $adminUser = User::create([
            'name' => 'DastKar Platform Admin',
            'email' => 'admin@dastkarhub.pk',
            'role' => 'admin',
            'phone' => '+923001234567',
            'password' => Hash::make('password123'),
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        $seller1User = User::create([
            'name' => 'Ustad Fayyaz Multani',
            'email' => 'fayyaz.kashigar@dastkarhub.pk',
            'role' => 'seller',
            'phone' => '+923129876543',
            'password' => Hash::make('password123'),
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        $seller2User = User::create([
            'name' => 'Mian Tariq Sheesham',
            'email' => 'tariq.woodcraft@dastkarhub.pk',
            'role' => 'seller',
            'phone' => '+923215554321',
            'password' => Hash::make('password123'),
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        $seller3User = User::create([
            'name' => 'Gul Meena & Zarina',
            'email' => 'gulmeena.crafts@dastkarhub.pk',
            'role' => 'seller',
            'phone' => '+923337778899',
            'password' => Hash::make('password123'),
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        $buyerUser = User::create([
            'name' => 'Ayesha Siddiqui',
            'email' => 'ayesha.buyer@dastkarhub.pk',
            'role' => 'buyer',
            'phone' => '+923014443322',
            'password' => Hash::make('password123'),
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        // Buyer Address
        $buyerAddress = Address::create([
            'user_id' => $buyerUser->id,
            'full_name' => 'Ayesha Siddiqui',
            'phone' => '+92 301 4443322',
            'address_line1' => 'House 42-B, Street 7, Block 4, Clifton',
            'address_line2' => 'Near Bilawal House',
            'city' => 'Karachi',
            'state_province' => 'Sindh',
            'postal_code' => '75600',
            'country' => 'Pakistan',
            'is_default' => true,
        ]);

        // 2. Create Seller Profiles
        $seller1 = SellerProfile::create([
            'user_id' => $seller1User->id,
            'business_name' => 'Kashigari Blue Pottery Studio',
            'slug' => 'kashigari-blue-pottery',
            'bio' => 'Preserving 800 years of indigenous ceramic heritage with pure clay and cobalt oxide blue glazes handcrafted in Multan.',
            'craft_description' => 'Traditional Kashikari Glazed Ceramic, Multani Terracotta, Hand-turned Floral Vessels',
            'location_city' => 'Multan',
            'location_region' => 'Punjab',
            'verification_status' => 'established',
            'seller_status' => 'active',
            'rating_average' => 4.95,
            'rating_count' => 84,
            'completed_orders' => 142,
            'total_sales' => 389000.00,
            'avatar_url' => 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
            'cover_url' => 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
            'social_links' => [
                'instagram' => 'https://instagram.com/kashigari.pottery',
                'facebook' => 'https://facebook.com/kashigaripotterypk',
            ],
        ]);

        $seller2 = SellerProfile::create([
            'user_id' => $seller2User->id,
            'business_name' => 'Chinioti Jharoka & Sheesham Guild',
            'slug' => 'chinioti-sheesham-guild',
            'bio' => 'Third-generation woodcarvers mastering brass inlay, Sheesham fretwork, and heritage Mughal jharokas.',
            'craft_description' => 'Seasoned Sheesham Wood, Hand Carving, Pure Brass Wire Tarkashi Inlay',
            'location_city' => 'Chiniot',
            'location_region' => 'Punjab',
            'verification_status' => 'verified',
            'seller_status' => 'active',
            'rating_average' => 4.88,
            'rating_count' => 62,
            'completed_orders' => 98,
            'total_sales' => 520000.00,
            'avatar_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
            'cover_url' => 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
            'social_links' => [
                'instagram' => 'https://instagram.com/chiniotiwoodguild',
            ],
        ]);

        $seller3 = SellerProfile::create([
            'user_id' => $seller3User->id,
            'business_name' => 'Indus Threads & Ajrak Artisans',
            'slug' => 'indus-threads-ajrak',
            'bio' => 'Women artisan collective creating authentic 16-stage organic indigo Ajrak shawls and handwoven camel-wool accents.',
            'craft_description' => 'Organic Indigo Dyeing, Wooden Block Printing on Pure Silk, Ralli Quilting',
            'location_city' => 'Bhit Shah',
            'location_region' => 'Sindh',
            'verification_status' => 'verified',
            'seller_status' => 'active',
            'rating_average' => 4.92,
            'rating_count' => 51,
            'completed_orders' => 76,
            'total_sales' => 295000.00,
            'avatar_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            'cover_url' => 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=1200&q=80',
            'social_links' => [
                'instagram' => 'https://instagram.com/industhreads.pk',
            ],
        ]);

        // 3. Create Categories
        $catHome = Category::create([
            'name' => 'Home Décor & Living',
            'slug' => 'home-decor',
            'icon' => 'Home',
            'image_url' => 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
            'sort_order' => 1,
        ]);

        $catPottery = Category::create([
            'name' => 'Ceramics & Pottery',
            'slug' => 'ceramics-pottery',
            'parent_id' => $catHome->id,
            'icon' => 'Sparkles',
            'sort_order' => 2,
        ]);

        $catFashion = Category::create([
            'name' => 'Fashion & Wearables',
            'slug' => 'fashion-wearables',
            'icon' => 'Shirt',
            'image_url' => 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=600&q=80',
            'sort_order' => 3,
        ]);

        $catJewelry = Category::create([
            'name' => 'Jewelry & Accessories',
            'slug' => 'jewelry-accessories',
            'icon' => 'Gem',
            'image_url' => 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
            'sort_order' => 4,
        ]);

        $catArt = Category::create([
            'name' => 'Art & Collectibles',
            'slug' => 'art-collectibles',
            'icon' => 'Palette',
            'image_url' => 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
            'sort_order' => 5,
        ]);

        $catKitchen = Category::create([
            'name' => 'Kitchen & Dining',
            'slug' => 'kitchen-dining',
            'icon' => 'Utensils',
            'image_url' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
            'sort_order' => 6,
        ]);

        // 4. Create Rich Products with variants, customization, and images
        // Product 1: Multani Blue Pottery Hand-painted Vase
        $p1 = Product::create([
            'seller_id' => $seller1->id,
            'category_id' => $catPottery->id,
            'title' => 'Multani Kashikari Hand-Painted Floral Ceramic Vase',
            'slug' => 'multani-kashikari-hand-painted-floral-ceramic-vase',
            'description' => 'A masterwork crafted using ancient Kashikari traditions in Multan. Made from refined riverbed red clay, double-fired at 1050°C, and meticulously hand-painted with cobalt blue and Persian turquoise pigments depicting lotus flower motifs. Glaze is 100% lead-free, waterproof, and heat resistant.',
            'base_price' => 4850.00,
            'compare_at_price' => 5500.00,
            'status' => 'published',
            'stock_quantity' => 12,
            'production_days' => 3,
            'is_customizable' => true,
            'materials' => 'Multan Terracotta Clay, Cobalt Glaze, Turquoise Quartz Pigment',
            'dimensions' => 'Height: 12 inches, Diameter: 6.5 inches',
            'care_instructions' => 'Wipe gently with a soft damp cloth. Avoid abrasive detergents.',
            'weight_grams' => 1400,
            'rating_average' => 4.95,
            'rating_count' => 38,
            'is_featured' => true,
            'published_at' => now()->subDays(20),
        ]);

        ProductImage::create([
            'product_id' => $p1->id,
            'image_url' => 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
            'alt_text' => 'Multani Blue Pottery Floral Vase front view',
            'is_primary' => true,
            'sort_order' => 1,
        ]);
        ProductImage::create([
            'product_id' => $p1->id,
            'image_url' => 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
            'alt_text' => 'Close-up of Kashikari hand-painted patterns',
            'is_primary' => false,
            'sort_order' => 2,
        ]);

        ProductVariant::create([
            'product_id' => $p1->id,
            'name' => '10-inch Tabletop (Turquoise & Cobalt)',
            'sku' => 'KSH-VAS-10',
            'price' => 4850.00,
            'stock_quantity' => 8,
            'attributes_json' => ['size' => '10 inches', 'motif' => 'Classic Lotus'],
        ]);
        ProductVariant::create([
            'product_id' => $p1->id,
            'name' => '14-inch Grand Hall (Deep Cobalt)',
            'sku' => 'KSH-VAS-14',
            'price' => 6900.00,
            'stock_quantity' => 4,
            'attributes_json' => ['size' => '14 inches', 'motif' => 'Mughal Arabesque'],
        ]);

        CustomizationOption::create([
            'product_id' => $p1->id,
            'name' => 'Custom Name or Family Inscription on Base',
            'type' => 'text',
            'price_delta' => 450.00,
            'is_required' => false,
        ]);

        // Product 2: Chiniot Handcarved Sheesham Wood Jewelry Box
        $p2 = Product::create([
            'seller_id' => $seller2->id,
            'category_id' => $catHome->id,
            'title' => 'Chiniot Hand-Carved Sheesham Jewelry Box with Brass Tarkashi Inlay',
            'slug' => 'chiniot-hand-carved-sheesham-jewelry-box-brass-inlay',
            'description' => 'Handcrafted by master woodcrafters in Chiniot using aged Pakistani Rosewood (Sheesham). Features delicate geometric lattice carving with hand-hammered pure brass wire inlay (Tarkashi) and royal crimson velvet interior lining. Includes brass latch and internal removable organizer tray.',
            'base_price' => 6200.00,
            'compare_at_price' => 7200.00,
            'status' => 'published',
            'stock_quantity' => 15,
            'production_days' => 4,
            'is_customizable' => true,
            'materials' => 'Pakistani Sheesham (Rosewood), Solid Brass Wire, Crimson Velvet',
            'dimensions' => '10 x 6 x 4.5 inches',
            'care_instructions' => 'Treat with natural beeswax polish twice a year. Keep away from direct excessive moisture.',
            'weight_grams' => 1250,
            'rating_average' => 4.90,
            'rating_count' => 24,
            'is_featured' => true,
            'published_at' => now()->subDays(15),
        ]);

        ProductImage::create([
            'product_id' => $p2->id,
            'image_url' => 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
            'alt_text' => 'Chiniot Carved Sheesham Box',
            'is_primary' => true,
            'sort_order' => 1,
        ]);

        ProductVariant::create([
            'product_id' => $p2->id,
            'name' => 'Standard Velvet Interior (Crimson Red)',
            'sku' => 'CHN-BOX-RED',
            'price' => 6200.00,
            'stock_quantity' => 10,
            'attributes_json' => ['interior' => 'Crimson Red Velvet'],
        ]);
        ProductVariant::create([
            'product_id' => $p2->id,
            'name' => 'Royal Emerald Velvet Interior',
            'sku' => 'CHN-BOX-EMR',
            'price' => 6500.00,
            'stock_quantity' => 5,
            'attributes_json' => ['interior' => 'Emerald Green Velvet'],
        ]);

        CustomizationOption::create([
            'product_id' => $p2->id,
            'name' => 'Personalized Brass Engraving (Initials / Date)',
            'type' => 'text',
            'price_delta' => 600.00,
            'is_required' => false,
        ]);

        // Product 3: Authentic Sindhi Hand-Blockprinted Pure Silk Ajrak Shawl
        $p3 = Product::create([
            'seller_id' => $seller3->id,
            'category_id' => $catFashion->id,
            'title' => 'Pure Silk Sindhi Ajrak Shawl with Natural Indigo & Madder Dye',
            'slug' => 'pure-silk-sindhi-ajrak-shawl-natural-indigo-madder',
            'description' => 'Authentic Sindhi Ajrak dyed through the time-honored 16-stage process using fermented wild indigo, pomegranate rinds, and madder root. Hand-blockprinted with carved teak stamps onto 100% mulberry silk. Every piece breathes Indus Valley history.',
            'base_price' => 8900.00,
            'compare_at_price' => 10500.00,
            'status' => 'published',
            'stock_quantity' => 9,
            'production_days' => 2,
            'is_customizable' => false,
            'materials' => '100% Pure Mulberry Silk, Natural Plant Dyes (Indigo, Madder)',
            'dimensions' => '2.5 meters length x 1 meter width',
            'care_instructions' => 'Dry clean only or delicate cold water wash with mild silk detergent.',
            'weight_grams' => 220,
            'rating_average' => 5.00,
            'rating_count' => 19,
            'is_featured' => true,
            'published_at' => now()->subDays(10),
        ]);

        ProductImage::create([
            'product_id' => $p3->id,
            'image_url' => 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=800&q=80',
            'alt_text' => 'Sindhi Hand-blocked Ajrak Shawl',
            'is_primary' => true,
            'sort_order' => 1,
        ]);

        // Product 4: Handwoven Multipurpose Natural Reed Basket
        $p4 = Product::create([
            'seller_id' => $seller1->id,
            'category_id' => $catHome->id,
            'title' => 'Handwoven Sarkanda Natural Reed Storage Basket with Handles',
            'slug' => 'handwoven-sarkanda-natural-reed-storage-basket',
            'description' => 'Woven by artisan women in rural Punjab using river reed (Sarkanda) and organic cotton cords. Sustainable, durable, and lightweight, ideal for blankets, plants, or rustic home styling.',
            'base_price' => 2600.00,
            'compare_at_price' => 3100.00,
            'status' => 'published',
            'stock_quantity' => 22,
            'production_days' => 1,
            'is_customizable' => false,
            'materials' => 'Wild Sarkanda Reeds, Unbleached Cotton Twine',
            'dimensions' => 'Diameter: 14 inches, Depth: 12 inches',
            'care_instructions' => 'Dust with dry brush or wipe with slightly damp cloth. Air dry thoroughly.',
            'weight_grams' => 650,
            'rating_average' => 4.80,
            'rating_count' => 15,
            'is_featured' => true,
            'published_at' => now()->subDays(5),
        ]);

        ProductImage::create([
            'product_id' => $p4->id,
            'image_url' => 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
            'alt_text' => 'Handwoven Sarkanda Basket',
            'is_primary' => true,
            'sort_order' => 1,
        ]);

        // Product 5: Hand-Hammered Tribal Lapiz Lazuli Silver Earrings
        $p5 = Product::create([
            'seller_id' => $seller3->id,
            'category_id' => $catJewelry->id,
            'title' => 'Hand-Hammered Sterling Silver Badakhshan Lapis Lazuli Earrings',
            'slug' => 'hand-hammered-sterling-silver-lapis-lazuli-earrings',
            'description' => 'Featuring genuine deep ultramarine Lapis Lazuli gemstones sourced from Northern Pakistan mountains, set in 925 sterling silver with traditional filigree filleting and drop bells.',
            'base_price' => 4200.00,
            'compare_at_price' => 4900.00,
            'status' => 'published',
            'stock_quantity' => 14,
            'production_days' => 2,
            'is_customizable' => false,
            'materials' => '925 Sterling Silver, Natural Lapis Lazuli Gemstone',
            'dimensions' => 'Length: 2.2 inches',
            'care_instructions' => 'Keep in provided zip pouch. Clean with specialized silver polishing cloth.',
            'weight_grams' => 28,
            'rating_average' => 4.88,
            'rating_count' => 31,
            'is_featured' => true,
            'published_at' => now()->subDays(8),
        ]);

        ProductImage::create([
            'product_id' => $p5->id,
            'image_url' => 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
            'alt_text' => 'Hand-hammered silver lapis earrings',
            'is_primary' => true,
            'sort_order' => 1,
        ]);

        // 5. Create Sample Completed Order for Historical Authenticity
        $order = Order::create([
            'order_number' => 'DKH-2026-89412',
            'buyer_id' => $buyerUser->id,
            'status' => 'delivered',
            'subtotal' => 4850.00,
            'shipping_fee' => 250.00,
            'discount_amount' => 0.00,
            'total_amount' => 5100.00,
            'currency' => 'PKR',
            'shipping_address_snapshot' => [
                'full_name' => $buyerAddress->full_name,
                'phone' => $buyerAddress->phone,
                'address_line1' => $buyerAddress->address_line1,
                'city' => $buyerAddress->city,
                'postal_code' => $buyerAddress->postal_code,
            ],
            'shipping_method' => 'standard',
            'payment_method' => 'cod',
            'payment_status' => 'paid',
            'notes' => 'Please pack with bubble wrap, it is fragile pottery.',
            'placed_at' => now()->subDays(6),
            'delivered_at' => now()->subDays(1),
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'seller_id' => $seller1->id,
            'product_id' => $p1->id,
            'variant_id' => null,
            'product_title' => $p1->title,
            'product_image' => 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
            'product_snapshot_json' => [
                'title' => $p1->title,
                'price' => 4850.00,
                'materials' => $p1->materials,
                'artisan' => $seller1->business_name,
            ],
            'customization_json' => [
                'Custom Name or Family Inscription on Base' => 'Siddiqui Residence',
            ],
            'quantity' => 1,
            'unit_price' => 4850.00,
            'subtotal' => 4850.00,
            'status' => 'delivered',
        ]);

        Payment::create([
            'order_id' => $order->id,
            'provider' => 'cod',
            'provider_reference' => 'TCS-COD-998811',
            'status' => 'paid',
            'amount' => 5100.00,
            'currency' => 'PKR',
            'paid_at' => now()->subDays(1),
        ]);

        Review::create([
            'order_id' => $order->id,
            'buyer_id' => $buyerUser->id,
            'seller_id' => $seller1->id,
            'product_id' => $p1->id,
            'rating' => 5,
            'comment' => 'The glaze and intricate floral work on this Multani vase is breathtaking! It arrived safely in triple-walled packaging with a personal handwritten note from Ustad Fayyaz. True Pakistani heritage craftsmanship.',
            'status' => 'published',
            'seller_response' => 'Shukriya Ayesha sahiba! Serving patrons of traditional crafts keeps our generational kilns burning.',
        ]);

        // Populate complete marketplace catalog and discovery data
        $this->call(DastKarMarketplaceSeeder::class);
    }
}
