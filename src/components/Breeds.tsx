import React from "react";
import { Link } from "react-router-dom";
import { Breed } from "../model/Breed";
import { HttpJsonError } from "../service/http/HttpError";
import { pipe, RD } from "../utils/fpts";
import { getErrorMessage } from "../utils/helpers";

const Breeds = ({
  breedsRD,
}: {
  breedsRD: RD.RemoteData<HttpJsonError, Array<Breed>>;
}) => {
  return (
    <main style={{ padding: "20px" }}>
      <h1>Breeds</h1>
      {pipe(
        breedsRD,
        RD.fold(
          () => <h1>Welcome</h1>,
          () => <h1>Loading...</h1>,
          (error) => <h1>{getErrorMessage(error)}</h1>,
          (breeds) => (
            <ul>
              {breeds.map((breed) => (
                <li key={breed.name}>
                  <Link to={breed.name}>{breed.name}</Link>
                  <ul>
                    {breed.subBreeds.map((subBreed) => (
                      <li key={subBreed}>{subBreed}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )
        )
      )}
    </main>
  );
};

export default Breeds;
