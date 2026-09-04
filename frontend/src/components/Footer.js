const footerLinks = {
  Support: ['Help Centre', 'AirCover', 'Anti-discrimination', 'Disability support', 'Cancellation options', 'Report neighbourhood concern'],
  Community: ['AirStay.org: disaster relief housing', 'Combating discrimination'],
  Hosting: ['AirStay your home', 'AirCover for Hosts', 'Hosting resources', 'Community forum', 'Hosting responsibly', 'Join a free Hosting class'],
  AirStay: ['Newsroom', 'New features', 'Careers', 'Investors', 'Gift cards', 'Emergency stays'],
};

const Footer = () => (
  <footer className="public-footer">
    <div className="footer-main">
      <div className="footer-columns">
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title} className="footer-column">
            <h4>{title}</h4>
            <ul>{links.map((label) => <li key={label}><a href="/" onClick={(event) => event.preventDefault()}>{label}</a></li>)}</ul>
          </div>
        ))}
      </div>
    </div>
    <div className="footer-copyright">
      <div className="copyright-left"><span>© 2026 AirStay, Inc.</span><a href="/" onClick={(event) => event.preventDefault()}>Privacy</a><a href="/" onClick={(event) => event.preventDefault()}>Terms</a><a href="/" onClick={(event) => event.preventDefault()}>Sitemap</a></div>
      <div className="copyright-right"><button type="button" className="footer-control" aria-label="Choose language">Language: English (ZA)</button><button type="button" className="footer-control" aria-label="Choose currency">Currency: ZAR</button><span><a href="/" onClick={(event) => event.preventDefault()}>Facebook</a> · <a href="/" onClick={(event) => event.preventDefault()}>Instagram</a></span></div>
    </div>
  </footer>
);

export default Footer;
