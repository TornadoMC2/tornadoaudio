import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './PrivacyPolicy.css'; // Reuse existing styling
import Header from './Header';

function ServiceAgreement() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="privacy-policy-page">
      <Helmet>
        <title>Service Agreement | Tornado Audio - Professional Audio Mixing Services</title>
        <meta name="description" content="Professional service agreement for Tornado Audio's mixing services. Clear terms, pricing, and project guidelines for audio mixing and mastering." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://tornadoaudio.net/service-agreement" />

        {/* Open Graph */}
        <meta property="og:title" content="Service Agreement | Tornado Audio" />
        <meta property="og:description" content="Professional service agreement for Tornado Audio's mixing services." />
        <meta property="og:url" content="https://tornadoaudio.net/service-agreement" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:title" content="Service Agreement | Tornado Audio" />
        <meta name="twitter:description" content="Professional service agreement for Tornado Audio's mixing services." />
      </Helmet>

      <Header />
      <div className="container">
        <div className="privacy-content">
          <h1>Professional Audio Services Agreement</h1>
          <p className="last-updated">Last updated: November 10, 2025</p>

          <section className="policy-section">
            <h2>1. Agreement Overview</h2>
            <p>This Service Agreement ("Agreement") is entered into between Tornado Audio ("Service Provider," "we," "our," or "us") and the client ("Client," "you," or "your") for professional audio mixing, mastering, and related services.</p>
            <p><strong>By booking our services, submitting audio files, or making payment, you agree to be legally bound by all terms of this Agreement.</strong></p>
          </section>

          <section className="policy-section">
            <h2>2. Services Provided</h2>
            <h3>2.1 Service Categories</h3>
            <p>Tornado Audio provides the following professional audio services:</p>
            <ul>
              <li><strong>Basic Mix:</strong> Up to 24 tracks, standard processing, 1 revision, 72-hour turnaround</li>
              <li><strong>Professional Mix:</strong> Up to 48 tracks, advanced processing, 3 revisions, 48-hour turnaround</li>
              <li><strong>Premium Mix & Master:</strong> Unlimited tracks, full treatment, unlimited revisions, 24-hour turnaround</li>
              <li><strong>Custom Services:</strong> Tailored solutions as agreed in writing</li>
              <li><strong>Free Sample Mix:</strong> 60-second preview mix (one per client)</li>
            </ul>

            <h3>2.2 Service Standards</h3>
            <p>All services include:</p>
            <ul>
              <li>Professional communication throughout the project</li>
              <li>Industry-standard audio processing techniques</li>
              <li>High-quality file delivery in requested formats</li>
              <li>Project files retained for 90 days post-delivery</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. Payment Terms & Pricing</h2>
            <h3>3.1 Pricing Structure</h3>
            <p>Service pricing is as listed on our website or as quoted directly. Current rates:</p>
            <ul>
              <li>Basic Mix: $40 per song</li>
              <li>Professional Mix: $75 per song (bulk discounts available)</li>
              <li>Premium Mix & Master: $200 per song (bulk discounts available)</li>
            </ul>

            <h3>3.2 Payment Schedule</h3>
            <ul>
              <li><strong>Payment:</strong> Full payment due upon completion of work before final file delivery</li>
              <li><strong>Payment Methods:</strong> PayPal, Venmo, Bank Transfer (Via Stripe Invoice)</li>
              <li><strong>Currency:</strong> All pricing in USD</li>
            </ul>

            <h3>3.3 Late Payment Policy</h3>
            <ul>
              <li>Final files held until payment received in full</li>
              <li>Projects abandoned for 30+ days may incur storage fees</li>
              <li>Chargebacks or payment disputes will result in immediate project termination and are subject to future DMCA claims</li>
              <li><strong>Rights Retention:</strong> Tornado Audio retains all rights to the finished mixed/mastered audio until final payment is received in full</li>
            </ul>

            <h3>3.4 Preview File Protection</h3>
            <ul>
              <li><strong>Preview files are for approval purposes only</strong> and remain the exclusive property of Tornado Audio until final payment</li>
              <li>Client is strictly prohibited from releasing, distributing, or using preview files for any commercial or public purpose</li>
              <li>Unauthorized use of preview files constitutes copyright infringement and will result in immediate DMCA takedown notices</li>
              <li>Preview files may contain watermarks or quality limitations to prevent unauthorized use</li>
              <li>Tornado Audio reserves the right to pursue full legal remedies for unauthorized use, including statutory damages up to $150,000 per work under U.S. Copyright Law</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>4. Project Workflow & Timeline</h2>
            <h3>4.1 Project Initiation</h3>
            <ol>
              <li>Client selects service and submits booking request</li>
              <li>Tornado Audio provides project quote and timeline</li>
              <li>Client confirms booking and submits source files via secure file transfer</li>
              <li>Work begins within 24 hours of file receipt and booking confirmation</li>
              <li>Payment collected upon completion before final file delivery</li>
            </ol>

            <h3>4.2 File Requirements</h3>
            <p><strong>Client must provide:</strong></p>
            <ul>
              <li>Individual track stems in WAV or AIFF format (minimum 44.1kHz/16-bit)</li>
              <li>Tracks properly labeled and organized</li>
              <li>Reference tracks or mixing notes (if applicable)</li>
              <li>Tempo and key information</li>
            </ul>

            <h3>4.3 Delivery Timeline</h3>
            <p>Standard turnaround times begin from receipt of all required files:</p>
            <ul>
              <li>Basic Mix: 72 hours</li>
              <li>Professional Mix: 48 hours</li>
              <li>Premium Mix & Master: 24 hours</li>
              <li>Bulk projects: Extended timelines as agreed</li>
            </ul>

            <h3>4.4 Force Majeure</h3>
            <p>Delivery timelines may be extended due to circumstances beyond our control including but not limited to equipment failure, illness, natural disasters, or technical issues.</p>
          </section>

          <section className="policy-section">
            <h2>5. Revision Policy</h2>
            <h3>5.1 Revision Allowances</h3>
            <ul>
              <li><strong>Basic Mix:</strong> 1 revision included</li>
              <li><strong>Professional Mix:</strong> 3 revisions included</li>
              <li><strong>Premium Mix & Master:</strong> Unlimited revisions</li>
            </ul>

            <h3>5.2 Revision Guidelines</h3>
            <ul>
              <li>Revision requests must be submitted within 14 days of mix delivery</li>
              <li>Feedback must be specific and actionable</li>
              <li>Major changes to creative direction may constitute a new project</li>
              <li>Additional revisions beyond package limits: $25 per revision</li>
            </ul>

            <h3>5.3 Revision Timeline</h3>
            <p>Revisions completed within 24-48 hours of receiving clear feedback.</p>
          </section>

          <section className="policy-section">
            <h2>6. Intellectual Property Rights</h2>
            <h3>6.1 Client Rights</h3>
            <p>Client retains all ownership rights to their original musical compositions, lyrics, and performances. <strong>However, Tornado Audio retains all rights to the finished mixed/mastered audio product until final payment is received in full.</strong> Upon full payment, client receives complete rights to the finished audio. Client grants Tornado Audio a limited license to:</p>
            <ul>
              <li>Use, modify, and process submitted audio for service delivery</li>
              <li>Retain working files for revision purposes (90 days)</li>
            </ul>

            <h3>6.2 Tornado Audio Rights</h3>
            <p>Tornado Audio retains all rights to:</p>
            <ul>
              <li>Mixing techniques, processes, and methodologies</li>
            <p>Client retains all ownership rights to their original musical compositions, lyrics, and performances. <strong>However, Tornado Audio retains all rights to the finished mixed/mastered audio product until final payment is received in full.</strong> Upon full payment, client receives complete rights to the finished audio.</p>

            <p><strong>Copyright Notice:</strong> All mixed and mastered audio files created by Tornado Audio are original derivative works subject to copyright protection under U.S. Copyright Law. Tornado Audio maintains exclusive copyright ownership of these derivative works until final payment transfer.</p>

            <p>Client grants Tornado Audio a limited license to:</p>
              <li>Business methods and operational procedures</li>
            </ul>

            <h3>6.3 Portfolio Usage</h3>

            <p><strong>Preview File Usage Restrictions:</strong></p>
            <ul>
              <li>Any audio files sent for client approval remain copyrighted material owned exclusively by Tornado Audio</li>
              <li>Client may listen to preview files solely for evaluation and feedback purposes</li>
              <li>Distribution, streaming, sale, or public performance of preview files is strictly prohibited</li>
              <li>Violation of preview file restrictions constitutes willful copyright infringement subject to statutory damages</li>
            </ul>
            <p>Unless client provides written objection before project completion, Tornado Audio may use up to 60 seconds of completed mixes for:</p>
            <ul>
              <li>Website portfolio</li>
              <li>Social media promotion</li>
              <li>Marketing materials</li>
              <li>Before/after audio examples</li>
            </ul>

            <h3>6.4 Copyright Compliance</h3>
            <p><strong>Client warrants that they own or have proper licenses for all submitted material.</strong> Client agrees to indemnify Tornado Audio against any copyright infringement claims.</p>
          </section>

          <section className="policy-section">
            <h2>7. Quality Standards & Satisfaction</h2>
            <h3>7.1 Professional Standards</h3>
            <p>All work performed to professional industry standards using:</p>
            <ul>
              <li>Professional monitoring systems</li>
              <li>Industry-standard software and plugins</li>
              <li>Proper acoustic treatment</li>
              <li>Quality control processes</li>
            </ul>

            <h3>7.2 Technical Specifications</h3>
            <p>Final deliverables provided in requested formats:</p>
            <ul>
              <li>Standard: 48kHz/24-bit WAV</li>
              <li>Higher-res options available upon request</li>
              <li>MP3 320kbps for demo purposes</li>
              <li>Stems available for Professional and Premium tiers</li>
            </ul>

            <h3>7.3 Client Satisfaction</h3>
            <p>If client is not satisfied with final mix after all included revisions:</p>
            <ul>
              <li>Additional revision round may be provided at our discretion</li>
              <li>Partial refund may be considered for unused services</li>
              <li>Mediation preferred over legal action</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>8. Liability Limitations & Risk Allocation</h2>
            <h3>8.1 Limitation of Liability</h3>
            <p><strong>Tornado Audio's total liability for any claim shall not exceed the amount paid for the specific project giving rise to the claim.</strong></p>

            <h3>8.2 Excluded Damages</h3>
            <p>Tornado Audio shall not be liable for:</p>
            <ul>
              <li>Lost profits or revenue</li>
              <li>Consequential or incidental damages</li>
              <li>Data loss or corruption</li>
              <li>Third-party copyright claims</li>
              <li>Delays in commercial release</li>
            </ul>

            <h3>8.3 Client Responsibilities</h3>
            <p>Client assumes responsibility for:</p>
            <ul>
              <li>Backup of original files</li>
              <li>Copyright clearance of submitted material</li>
              <li>Communication of project requirements</li>
              <li>Timely payment and feedback</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>9. Cancellation & Refund Policy</h2>
            <h3>9.1 Client Cancellation</h3>
            <ul>
              <li><strong>Before work begins:</strong> Full refund minus 3% processing fee</li>
              <li><strong>After work begins:</strong> No refund available</li>
              <li><strong>After first mix delivery:</strong> No refund available</li>
            </ul>

            <h3>9.2 Service Provider Cancellation</h3>
            <p>Tornado Audio may cancel projects due to:</p>
            <ul>
              <li>Copyright infringement concerns</li>
              <li>Inappropriate or offensive content</li>
              <li>Client breach of agreement</li>
              <li>Technical impossibility</li>
            </ul>
            <p>Full refund provided if cancelled by Tornado Audio.</p>
          </section>

          <section className="policy-section">
            <h2>10. Confidentiality</h2>
            <p>Both parties agree to maintain confidentiality regarding:</p>
            <ul>
              <li>Unreleased musical content</li>
              <li>Business methods and processes</li>
              <li>Personal and contact information</li>
              <li>Commercial terms and pricing</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>11. Dispute Resolution</h2>
            <h3>11.1 Preferred Resolution</h3>
            <p>Disputes should first be addressed through direct communication. If unresolved:</p>
            <ol>
              <li>Mediation through mutually agreed mediator</li>
              <li>Binding arbitration if mediation fails</li>
              <li>Legal action as last resort</li>
            </ol>

            <h3>11.2 Jurisdiction</h3>
            <p>This Agreement governed by United States law. Any legal proceedings shall be conducted in the appropriate jurisdiction where Tornado Audio is located.</p>
          </section>

          <section className="policy-section">
            <h2>12. Rush Orders & Special Services</h2>
            <h3>12.1 Rush Order Policy</h3>
            <ul>
              <li>Available subject to current workload</li>
              <li>1.5x standard pricing</li>
              <li>Must be requested before project booking</li>
              <li>Payment due upon completion like standard orders</li>
            </ul>

            <h3>12.2 Additional Services</h3>
            <ul>
              <li><strong>Stem Delivery:</strong> Individual track groups (drums, bass, etc.)</li>
              <li><strong>Multiple Formats:</strong> Various file formats and sample rates</li>
              <li><strong>Extended Retention:</strong> Project files held longer than 90 days</li>
              <li><strong>Re-mix Services:</strong> Future revisions to completed projects</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>13. Technical Support & Communication</h2>
            <h3>13.1 Communication Channels</h3>
            <ul>
              <li><strong>Primary:</strong> Email (hunter@tornadoaudio.com)</li>
              <li><strong>Response Time:</strong> Within 24 hours during business days</li>
              <li><strong>Business Hours:</strong> Monday-Friday, 9 AM - 6 PM EST</li>
            </ul>

            <h3>13.2 File Transfer</h3>
            <ul>
              <li>Large files via WeTransfer, Dropbox, or Google Drive</li>
              <li>Client responsible for maintaining file availability during project</li>
              <li>Tornado Audio not responsible for expired or deleted transfer links</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>14. Agreement Modifications</h2>
            <p>This Agreement may be modified only by written consent of both parties. Updates to standard terms will be posted on our website with 30 days notice.</p>

            <h3>14.1 Severability</h3>
            <p>If any provision of this Agreement is found unenforceable, the remaining provisions shall continue in full force and effect.</p>
          </section>

          <section className="policy-section">
            <h2>15. Contact Information</h2>
            <p>For questions regarding this Service Agreement:</p>
            <p>
              <strong>Tornado Audio</strong><br />
              Email: hunter@tornadoaudio.com<br />
              Website: tornadoaudio.net<br />
              Business Hours: Monday-Friday, 9 AM - 6 PM EST
            </p>
          </section>

          <section className="policy-section agreement-signature">
            <h2>16. Agreement Acceptance</h2>
            <p><strong>By booking services, submitting files, or making payment, Client acknowledges having read, understood, and agreed to be bound by all terms of this Service Agreement.</strong></p>

            <div className="signature-info">
              <p><strong>Service Provider:</strong> Tornado Audio<br />
              <strong>Date Agreement Effective:</strong> November 10, 2025</p>
            </div>
          </section>

          <div className="agreement-navigation">
            <Link to="/terms-of-service" className="related-link">View Terms of Service</Link>
            <Link to="/privacy-policy" className="related-link">View Privacy Policy</Link>
            <Link to="/#contact" className="related-link">Contact Us</Link>
          </div>
        </div>
      </div>

      <footer className="footer" role="contentinfo">
        <div className="container">
          <div className="footer-content">
            <div className="footer-social">
              <h4>Professional Audio Services</h4>
              <p>© 2025 Tornado Audio. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ServiceAgreement;
