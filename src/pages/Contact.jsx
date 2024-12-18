import ContactForm from "../components/ContactForm";

const Contact = () => {
  return (
    <div className="p-6 md:p-4 contact-container">
      <h2 className="text-2xl font-bold mb-4 md:text-lg">Contact Us</h2>
      <ContactForm />
    </div>
  );
};

export default Contact;
