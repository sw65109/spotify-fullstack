const Footer = () => {
    const year = new Date().getFullYear();
  
    return (
      <footer className="border-t border-black/10 bg-white px-5 py-3 text-xs text-black/60">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>Educational project • Not affiliated with or endorsed by Spotify</div>
          <div>Tutorial followed: GreatStack • © {year}</div>
        </div>
      </footer>
    );
  };
  
  export default Footer;