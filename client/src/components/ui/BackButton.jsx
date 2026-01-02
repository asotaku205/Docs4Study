import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "wouter";
import React from "react";

const BackButton = (link) => {
  return (
    <Link href= {link}>
          <button className="mb-6 text-sm text-primary font-medium hover:underline bg-white/90 px-4 py-2 rounded-md shadow-md">
            <FontAwesomeIcon icon={faAngleLeft} /> Back to Blog
          </button>
    </Link>
  );
}
export default BackButton;
