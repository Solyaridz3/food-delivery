import { assets } from "../../assets/assets";
import "./Footer.css";

const Footer = () => {
    return (
        <div className="footer" id="footer">
            <div className="footer-content">
                <div className="footer-content-left">
                    {/* <img src={assets.servd_logo} alt="" /> */}
                    <h1>SERVD.</h1>
                    <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                        elit. Doloremque explicabo minima, nesciunt molestias
                        ipsam cumque ad expedita, error quisquam ut dicta
                        eveniet aperiam. Magni odio sint ab dolorum eius.
                        Dolore.
                    </p>
                    <div className="footer-social-icons">
                        <img src={assets.facebook_icon} alt="" />
                        <img src={assets.twitter_icon} alt="" />
                        <img src={assets.linkedin_icon} alt="" />
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>COMPANY</h2>
                    <ul>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li>+1-234-5678-910</li>
                        <li>cooking.laba@servd.com</li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className="footer-copyright">
                Copyright 2024 © Servd.com - All rights Reserved.
            </p>
        </div>
    );
};

export default Footer;
