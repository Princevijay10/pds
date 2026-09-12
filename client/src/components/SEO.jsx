import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, path = "/" }) => {
  const fullTitle = title ? `${title} | Prince Digital Studio` : "Prince Digital Studio | Design. Develop. Grow.";
  const desc =
    description ||
    "Prince Digital Studio — premium website design, development, graphic design, social media design, and brand identity services.";
  const url = `https://princedigitalstudio.com${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
    </Helmet>
  );
};

export default SEO;
