import React, { useContext, useState } from "react";
import { breedImageServiceEnv } from "../AppEnv";
import { Image } from "../model/Image";
import { HttpJsonError } from "../service/http/HttpError";
import { E, Eq, RD } from "../utils/fpts";
import { useIO } from "./useIO";

export const BreedImageServiceContext =
  React.createContext(breedImageServiceEnv);
export const useBreedsImageService = () => {
  return useContext(BreedImageServiceContext);
};

export const useBreedImageRD = (breedName: string) => {
  const breedImageServiceEnv = useBreedsImageService();

  const [breedImage, setBreedImage] = useState<
    RD.RemoteData<HttpJsonError, Array<Image>>
  >(RD.initial);

  useIO(
    () => {
      setBreedImage(RD.pending);
      breedImageServiceEnv.breedImageService
        .getBreedImages({
          name: breedName,
          subBreeds: [],
        })()
        .then(
          E.fold(
            (error) => setBreedImage(RD.failure(error)),
            (result) => setBreedImage(RD.success(result))
          )
        );
    },
    [],
    Eq.getTupleEq()
  );

  return breedImage;
};
