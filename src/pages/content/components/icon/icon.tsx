import React from "react";

type IconProps = {
  introerIconUrl: string;
};

export default function Icon({ introerIconUrl }: IconProps) {
  return (
    <div className="introer-surround-div">
      <div
        className="introer-embedded-button"
        data-tooltip="Make an Intro"
        aria-label="Make an Intro"
      >
        <img
          src={introerIconUrl}
          className="introer-icon"
          alt="Introer"
          width="34"
          height="34"
        />
      </div>
    </div>
  );
}
