import React from "react";
import Ifacebook from "../image/icon-facebook.png";
import Iinstagram from "../image/icon-instagram.png";
import Ilinkedin from "../image/icon-linkedin.png";
import Itiktok from "../image/icon-tiktok.png";
import Itwitter from "../image/icon-twitter.png";
import Iyoutube from "../image/icon-youtube.png";
import Igit from "../image/github.png";

function Footer() {
  return (
    <footer className=" bg-orange-400 rounded-tr-full px-8 py-10 items-center content-center gap-3  ">
      <div>
        <p className="justify-center text-center font-semibolg text-white mb-3">Contact Us</p>
      </div>
      <div className="flex gap-3 justify-center">
        <a href="https://www.instagram.com/kelvin.yi/?hl=en">
          <img src={Iinstagram} className="cursor-pointer"/>
        </a>
        <a href="https://www.linkedin.com/in/kelvin-yeliandi-132a1921b/">
          <img src={Ilinkedin} className="cursor-pointer" />
        </a>
        <a href="https://www.youtube.com/channel/UCnY2ntu-6BbA53hd8R47nXQ">
          <img src={Iyoutube} className="cursor-pointer"/>
        </a>
        <a href="https://github.com/KelvinY-hen/FOS-FYP-NEW">
          <img src={Igit} className="cursor-pointer w"/>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
