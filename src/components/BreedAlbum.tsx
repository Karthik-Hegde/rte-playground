import React from "react";
import { Image } from "../model/Image";
import { HttpJsonError } from "../service/http/HttpError";
import { pipe, RD } from "../utils/fpts";
import { getErrorMessage } from "../utils/helpers";

const BreedAlbum = ({
  imagesRD,
}: {
  imagesRD: RD.RemoteData<HttpJsonError, Array<Image>>;
}) => {
  return (
    <div>
      {pipe(
        imagesRD,
        RD.fold(
          () => <h1>Welcome</h1>,
          () => <h1>Loading...</h1>,
          (error) => <h1>{getErrorMessage(error)}</h1>,
          (images) => (
            <div className="album">
              {images.map((image) => (
                <img
                  className="image"
                  key={image.url}
                  src={image.url}
                  alt="breed"
                />
              ))}
            </div>
          )
        )
      )}
    </div>
  );
};

export default BreedAlbum;
