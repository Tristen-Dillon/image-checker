import React, { FC } from 'react';
  import Image from 'next/image';

  interface Props {
    src: string;
  }
  export const MasonryItem: FC<Props> = ({ src }) => {

    return (
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={src}
          layout="fill"
          objectFit="contain"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => {
            console.log("Image did not load correctly")
          }}
        />
      </div>
    );
  };