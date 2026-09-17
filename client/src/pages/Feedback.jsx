import SEO from "../components/SEO.jsx";
import ReviewForm from "../components/ReviewForm.jsx";

const Feedback = () => {
  return (
    <>
      <SEO
        title="Share Your Experience"
        description="Share your experience with Prince Digital Studio and help us improve."
        path="/feedback"
      />

      <main className="section">
        <div className="container-px mx-auto max-w-2xl">
          <ReviewForm />
        </div>
      </main>
    </>
  );
};

export default Feedback;
