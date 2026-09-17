import { Helmet } from "react-helmet-async";

const SITE_URL = "https://princedigitalstudio.com";
const DEFAULT_IMAGE = `${SITE_URL}/banner.jpg`;
const DEFAULT_LOGO = `${SITE_URL}/logo.jpg`;
const SOCIAL_PROFILES = [
  "https://instagram.com/Princedigitalstudios",
  "https://facebook.com/Princedigitalstudios",
];

const SEO = ({ title, description, path = "/", image = DEFAULT_IMAGE, noIndex = false }) => {
  const fullTitle = title ? `${title} | Prince Digital Studio` : "Prince Digital Studio | Design. Develop. Grow.";
  const desc =
    description ||
    "Prince Digital Studio — premium website design, development, graphic design, social media design, and brand identity services.";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${SITE_URL}${normalizedPath}`;
  const imageUrl = image.startsWith("http")
    ? image
    : `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Prince Digital Studio",
    description: desc,
    url: SITE_URL,
    logo: DEFAULT_LOGO,
    image: DEFAULT_IMAGE,
    sameAs: SOCIAL_PROFILES,
    areaServed: {
      "@type": "Country",
      name: "India",
    },
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Prince Digital Studio" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={imageUrl} />

      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
};

export default SEO;
