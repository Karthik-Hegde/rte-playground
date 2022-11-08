import React from "react";
import { useParams } from "react-router-dom";
import { breedImageServiceEnv } from "../AppEnv";
import {
  BreedImageServiceContext,
  useBreedImageRD,
} from "../hooks/useImageService";
import BreedAlbum from "./BreedAlbum";

const AlbumMain = () => {
  const { breed } = useParams();
  const breedImages = useBreedImageRD(breed ?? "");

  return (
    <BreedImageServiceContext.Provider value={breedImageServiceEnv}>
      <BreedAlbum imagesRD={breedImages} />
    </BreedImageServiceContext.Provider>
  );
};

export default AlbumMain;
