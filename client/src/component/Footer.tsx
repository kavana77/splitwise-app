import FooterImg from "../assets/footer.png";
const Footer = () => {
  return (
    <footer>
      <div className="flex justify-between px-12 md:px-22 py-4 text-gray-600">
        <ul>
          <li className="text-emerald-600 font-semibold">SplitWise</li>
          <li>About</li>
          <li>Calculators</li>
        </ul>

        <ul>
          <li className="text-orange-800 font-semibold">Account</li>
          <li>Log in</li>
          <li>Sign up</li>
          <li>Reset password</li>
        </ul>

        <ul>
          <li className="font-semibold text-black">More</li>
          <li>Contact us</li>
          <li>FAQ</li>
          <li>Terms of Service</li>
          <li>Privacy Policy</li>
        </ul>
      </div>

      <img src={FooterImg} />
    </footer>
  );
};

export default Footer;
