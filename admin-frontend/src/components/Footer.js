/* eslint-disable jsx-a11y/anchor-is-valid -- decorative placeholder footer links, not yet wired to real pages */
import React from 'react';
const footerLinks = { Support: ['Help Centre','AirCover','Anti-discrimination','Disability support','Cancellation options','Report neighbourhood concern'], Community: ['Airbnb.org: disaster relief housing','Combating discrimination'], Hosting: ['Airbnb your home','AirCover for Hosts','Hosting resources','Community forum','Hosting responsibly','Join a free Hosting class'], Airbnb: ['Newsroom','New features','Careers','Investors','Gift cards','Airbnb.org emergency stays'] };
const Footer = () => (
  <footer className="public-footer">
    <div className="footer-main"><div className="footer-columns">
      {Object.entries(footerLinks).map(([title, links]) => (
        <div key={title} className="footer-column"><h4>{title}</h4><ul>{links.map(l => <li key={l}><a href="#">{l}</a></li>)}</ul></div>
      ))}
    </div></div>
    <div className="footer-copyright">
      <div className="copyright-left"><span>© 2026 Airbnb, Inc.</span><span>·</span><a href="#">Privacy</a><span>·</span><a href="#">Terms</a><span>·</span><a href="#">Sitemap</a></div>
      <div className="copyright-right"><span>🌐 English (ZA)</span><span>R ZAR</span><span><a href="#">Facebook</a> · <a href="#">Twitter</a> · <a href="#">Instagram</a></span></div>
    </div>
  </footer>
);
export default Footer;
