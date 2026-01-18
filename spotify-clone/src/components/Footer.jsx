const Footer = () => {
    const year = new Date().getFullYear();
  
    return (
      <footer className="shrink-0 border-t border-white/10 bg-black/60 backdrop-blur px-4 py-3">
        <div className="mx-auto max-w-6xl text-xs text-white/60 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            Educational project • Not affiliated with or endorsed by Spotify
          </div>
          <div>
            Tutorial followed: GreatStack • © {year}
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;