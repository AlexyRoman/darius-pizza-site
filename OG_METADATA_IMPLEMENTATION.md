# 🍕 Darius Pizza - Comprehensive Localized OG Metadata System

## 📋 **IMPLEMENTATION COMPLETE**

### ✅ **What's Been Implemented:**

#### 1. **Core OG Metadata System**
- **File**: `src/lib/og-metadata.ts`
- **Features**: 
  - Platform-specific metadata generation
  - Localized content support
  - Dynamic OG image generation
  - Multi-language support (EN, FR, DE, IT, ES)

#### 2. **Comprehensive Metadata Utility**
- **File**: `src/lib/metadata.ts`
- **Features**:
  - Full platform coverage (Facebook, Twitter, Instagram, WhatsApp, LinkedIn, Pinterest, Telegram, Discord)
  - Localized metadata generation
  - Page-specific metadata
  - SEO optimization

#### 3. **Localized Translations**
- **Files**: `src/locales/*.json`
- **Languages**: English, French, German, Italian, Spanish
- **Content**: Complete SEO metadata for all languages

#### 4. **Dynamic OG Image Generation**
- **File**: `src/app/api/og/route.ts`
- **Features**:
  - Edge runtime for fast generation
  - Localized content
  - Multiple image types (default, menu, info)
  - Beautiful pizza-themed designs

#### 5. **Updated Layouts**
- **Files**: `src/app/layout.tsx`, `src/app/[locale]/layout.tsx`
- **Features**: Comprehensive metadata integration

---

## 🌐 **Platform Coverage**

### **Facebook (Open Graph)**
```html
<meta property="og:title" content="Darius Pizza - Authentic Italian Pizza" />
<meta property="og:description" content="Experience the authentic taste..." />
<meta property="og:image" content="/static/hero-main-pizza.webp" />
<meta property="og:url" content="https://darius-pizza.com/en" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Darius Pizza" />
<meta property="og:locale" content="en" />
```

### **Twitter/X Cards**
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@dariuspizza" />
<meta name="twitter:creator" content="@dariuspizza" />
<meta name="twitter:title" content="Darius Pizza - Authentic Italian Pizza" />
<meta name="twitter:description" content="Experience the authentic taste..." />
<meta name="twitter:image" content="/static/hero-main-pizza.webp" />
```

### **Instagram**
- Uses Open Graph metadata
- Optimized for Instagram link previews

### **WhatsApp**
```html
<meta property="whatsapp:title" content="Darius Pizza - Authentic Italian Pizza" />
<meta property="whatsapp:description" content="Experience the authentic taste..." />
<meta property="whatsapp:image" content="/static/hero-main-pizza.webp" />
```

### **LinkedIn**
```html
<meta property="linkedin:title" content="Darius Pizza - Authentic Italian Pizza" />
<meta property="linkedin:description" content="Experience the authentic taste..." />
<meta property="linkedin:image" content="/static/hero-main-pizza.webp" />
```

### **Pinterest**
```html
<meta property="pinterest:title" content="Darius Pizza - Authentic Italian Pizza" />
<meta property="pinterest:description" content="Experience the authentic taste..." />
<meta property="pinterest:image" content="/static/hero-main-pizza.webp" />
```

### **Telegram & Discord**
- Uses Open Graph metadata
- Optimized for link previews

---

## 🌍 **Localization Support**

### **Languages Supported:**
- 🇺🇸 **English** (en)
- 🇫🇷 **French** (fr)
- 🇩🇪 **German** (de)
- 🇮🇹 **Italian** (it)
- 🇪🇸 **Spanish** (es)

### **Localized Content:**
- Page titles
- Descriptions
- Keywords
- Image alt text
- OG images with localized text

---

## 🖼️ **OG Image System**

### **Dynamic Generation**
- **URL**: `/api/og?title=Title&locale=en&type=default`
- **Sizes**: 1200x630px (optimal for all platforms)
- **Types**: default, menu, info
- **Features**: Localized text, pizza-themed design, platform-optimized

### **Static Images**
- **Primary**: `/static/hero-main-pizza.webp`
- **Fallback**: Multiple formats supported

---

## ⚙️ **Environment Variables Required**

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://darius-pizza.com

# Social Media
TWITTER_SITE=@dariuspizza
TWITTER_CREATOR=@dariuspizza
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_ADMINS=your_facebook_admin_ids
FACEBOOK_DOMAIN_VERIFICATION=your_facebook_domain_verification_code
LINKEDIN_AUTHOR=Darius Pizza

# Search Engine Verification
GOOGLE_SITE_VERIFICATION=your_google_verification_code
YANDEX_VERIFICATION=your_yandex_verification_code
YAHOO_VERIFICATION=your_yahoo_verification_code
```

---

## 🚀 **Usage Examples**

### **Generate Metadata for Any Page:**
```typescript
import { generateLocalizedMetadata } from '@/lib/metadata';

const metadata = await generateLocalizedMetadata({
  locale: 'fr',
  path: '/menu',
  type: 'menu',
  customTitle: 'Notre Menu - Darius Pizza',
  customDescription: 'Découvrez nos pizzas authentiques...'
});
```

### **Generate Page-Specific Metadata:**
```typescript
import { generatePageMetadata } from '@/lib/metadata';

const metadata = await generatePageMetadata('en', 'menu');
```

### **Generate OG Image URL:**
```typescript
import { generateOGImageUrl } from '@/lib/og-metadata';

const ogImageUrl = generateOGImageUrl('fr', 'Notre Menu', 'menu');
// Returns: /api/og?title=Notre%20Menu&locale=fr&type=menu
```

---

## 📱 **Platform-Specific Benefits**

### **Facebook**
- Rich link previews
- Proper image sizing
- Localized content
- App integration ready

### **Twitter/X**
- Large image cards
- Creator attribution
- Site verification ready
- Thread-friendly previews

### **Instagram**
- Story link previews
- Bio link optimization
- Shopping integration ready

### **WhatsApp**
- Chat link previews
- Business account ready
- Contact sharing optimized

### **LinkedIn**
- Professional sharing
- Company page integration
- Article sharing ready

### **Pinterest**
- Rich pins ready
- Board integration
- Shopping pins support

### **Telegram & Discord**
- Channel sharing
- Bot integration ready
- Group sharing optimized

---

## 🔧 **Technical Features**

### **Performance**
- Edge runtime for OG image generation
- Optimized image formats (WebP)
- Cached metadata generation
- Static generation support

### **SEO**
- Multi-language hreflang
- Canonical URLs
- Structured data ready
- Search engine verification

### **Accessibility**
- Proper alt text
- Screen reader friendly
- High contrast support
- Mobile optimized

---

## ✅ **Testing Your Implementation**

### **Facebook Debugger**
- URL: https://developers.facebook.com/tools/debug/
- Test: `https://darius-pizza.com/en`

### **Twitter Card Validator**
- URL: https://cards-dev.twitter.com/validator
- Test: `https://darius-pizza.com/en`

### **LinkedIn Post Inspector**
- URL: https://www.linkedin.com/post-inspector/
- Test: `https://darius-pizza.com/en`

### **WhatsApp Link Preview**
- Share link in WhatsApp chat
- Check preview appearance

### **Pinterest Rich Pins**
- URL: https://developers.pinterest.com/tools/url-debugger/
- Test: `https://darius-pizza.com/en`

---

## 🎯 **Next Steps**

1. **Set Environment Variables** - Add all required social media IDs
2. **Test All Platforms** - Use debuggers to verify metadata
3. **Monitor Performance** - Check OG image generation speed
4. **Update Content** - Customize titles/descriptions per page
5. **Analytics Setup** - Track social media traffic

---

## 📊 **Expected Results**

- ✅ Rich link previews on all platforms
- ✅ Localized content for all languages
- ✅ Professional social media presence
- ✅ Improved click-through rates
- ✅ Better brand recognition
- ✅ Enhanced SEO performance

Your Darius Pizza site now has **enterprise-level social media metadata** with **full localization support**! 🍕✨




