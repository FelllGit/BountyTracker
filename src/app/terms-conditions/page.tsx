import React, { FC } from "react";

const TermsConditions: FC = (): JSX.Element => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">
        VigilSeek Terms and Conditions
      </h1>
      <p className="mb-4">
        These Terms and Conditions outline the rules and regulations for the use
        of VigilSeek&apos;s Website, located at{" "}
        <a
          className="text-blue-600 dark:text-blue-300 underline"
          href="https://vigilseek.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://vigilseek.com
        </a>
        .
      </p>
      <p className="mb-4">
        By accessing this website we assume you accept these terms and
        conditions. Do not continue to use VigilSeek if you do not agree to take
        all of the terms and conditions stated on this page.
      </p>
      <p className="mb-4">
        These terms apply from the moment you access our website. We may update
        these terms at any time, and by continuing to use the site, you agree to
        any changes made.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">1. License to Use</h2>
      <p className="mb-4">
        Unless otherwise stated, VigilSeek owns the intellectual property rights
        for all material on the website. You may access this from VigilSeek for
        your own personal use subjected to restrictions set in these terms and
        conditions.
      </p>
      <p className="mb-4 font-semibold">You must not:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Republish material from VigilSeek</li>
        <li>Sell, rent or sub-license material from VigilSeek</li>
        <li>Reproduce, duplicate or copy material from VigilSeek</li>
        <li>Redistribute content from VigilSeek without permission</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">2. Acceptable Use</h2>
      <p className="mb-4">
        You must not use this website in any way that causes, or may cause,
        damage to the website or impairment of the availability or accessibility
        of VigilSeek, or in any way which is unlawful, illegal, fraudulent, or
        harmful.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Content</h2>
      <p className="mb-4">
        If you choose to submit any content to VigilSeek (e.g., via contact
        forms or feedback), you grant VigilSeek a non-exclusive, royalty-free,
        perpetual, and worldwide license to use, reproduce, modify, and publish
        such content.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">4. No Warranties</h2>
      <p className="mb-4">
        This website is provided “as is,” with all faults, and VigilSeek
        expresses no representations or warranties of any kind related to this
        website or the materials contained on this website.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        5. Limitation of Liability
      </h2>
      <p className="mb-4">
        In no event shall VigilSeek, nor any of its officers, directors, and
        employees, be held liable for anything arising out of or in any way
        connected with your use of this website whether such liability is under
        contract or otherwise. VigilSeek shall not be held liable for any
        indirect, consequential, or special liability arising out of or in any
        way related to your use of this website.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">6. Third-Party Links</h2>
      <p className="mb-4">
        This website may contain links to other websites. We are not responsible
        for the content or privacy policies of those websites.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        7. Changes to These Terms
      </h2>
      <p className="mb-4">
        We may revise these terms and conditions from time to time. Revised
        terms will apply to the use of this website from the date of
        publication. Please check this page regularly to ensure you are familiar
        with the current version.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">8. Governing Law</h2>
      <p className="mb-4">
        These terms and conditions are governed by and construed in accordance
        with the laws of the jurisdiction where VigilSeek operates.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        9. Contact Information
      </h2>
      <p className="mb-4">
        If you have any questions about these Terms and Conditions, please
        contact us at:
      </p>
      <p className="mb-4">
        <span role="img" aria-label="email">
          📧
        </span>{" "}
        <a
          className="text-blue-600 dark:text-blue-300 underline"
          href="mailto:elembounty@gmail.com"
        >
          elembounty@gmail.com
        </a>
      </p>
    </div>
  );
};

export default TermsConditions;
