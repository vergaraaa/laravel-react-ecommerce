import { Image } from '@/types';

interface Props {
  images: Image[];
}

export const Carousel = ({ images }: Props) => {
  return (
    <>
      <div className="items-start-gap-8 flex">
        <div className="flex flex-col items-center gap-2 py-2">
          {images.map((image, i) => (
            <a
              key={image.id}
              href={`#item${i}`}
              className="border-2 hover:border-blue-500"
            >
              <img src={image.thumb} alt="" className="w-[50px]" />
            </a>
          ))}
        </div>

        <div className="carousel w-full">
          {images.map((image, i) => (
            <div
              key={image.id}
              id={`item${i}`}
              className="carousel-item w-full"
            >
              <img src={image.large} alt="" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
