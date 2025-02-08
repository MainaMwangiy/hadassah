const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear(); 
  return (
    <footer className="bg-white shadow-lg dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-4 mt-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Can add later */}
        {/* <div>
          <ul className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
            <li><a href="/">Terms and conditions</a></li>
            <li><a href="/">Privacy Policy</a></li>
            <li><a href="/">Licensing</a></li>
            <li><a href="/">Cookie Policy</a></li>
            <li><a href="/">Contact</a></li>
          </ul>
        </div> */}
        <div className="text-center md:text-right">
          <span>© {currentYear} Zao. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
