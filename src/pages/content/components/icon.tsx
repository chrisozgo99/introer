import React from "react";

type IconProps = {
  introerIconUrl: string;
};

export default function Icon({ introerIconUrl }: IconProps) {
  return (
    <div className="introer-surround-div items-center justify-center flex w-7 h-7 rounded-md ml-1 p-[2px] hover:bg-zinc-100 cursor-pointer">
      <div
        className="introer-embedded-button relative z-1 flex items-center justify-center rounded w-full h-full cursor-default text-center hover:cursor-pointer"
        data-tooltip="Make an Intro"
        aria-label="Make an Intro"
      >
        <img
          src={introerIconUrl}
          className="introer-icon p-[2px]"
          style={{
            maxWidth: "70%",
            maxHeight: "70%",
          }}
          alt="Introer"
          width="34"
          height="34"
        />
      </div>
    </div>
  );
}
