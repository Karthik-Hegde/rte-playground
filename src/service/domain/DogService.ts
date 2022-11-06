import * as t from "io-ts";
import { Breed, breedCodec } from "../../model/Breed";
import { decodeWithCodec } from "../../utils/decode";
import { A, R, Rec, RTE, TE, pipe } from "../../utils/fpts";
import { CacheServiceEnv, getWithCache } from "../cache/CacheService";
import { getJson, HttpClientEnv } from "../http/HttpClient";
import { HttpJsonError } from "../http/HttpError";

// service implementation

type GetBreedsRespose = {
  message: Record<string, Array<string>>;
};

const getBreedsResponseCodec: t.Type<GetBreedsRespose> = t.type({
  message: t.record(t.string, t.array(t.string)),
});

export const getBreeds: RTE.ReaderTaskEither<
  HttpClientEnv,
  HttpJsonError,
  Array<Breed>
> = pipe(
  getJson(
    "https://dog.ceo/api/breeds/list/all",
    decodeWithCodec(getBreedsResponseCodec)
  ),
  RTE.map((response) =>
    pipe(
      Rec.toArray(response.message),
      A.map(([name, subBreeds]) => ({ name, subBreeds }))
    )
  )
);

export const getBreedsWithCache: RTE.ReaderTaskEither<
  HttpClientEnv & CacheServiceEnv,
  HttpJsonError,
  Array<Breed>
> = getWithCache("breeds", t.array(breedCodec), getBreeds);

export interface BreedService<E> {
  getBreeds: TE.TaskEither<E, Array<Breed>>;
}

export type BreedServiceEnv<E> = {
  breedService: BreedService<E>;
};

export const makeBreedService: R.Reader<
  HttpClientEnv & CacheServiceEnv,
  BreedService<HttpJsonError>
> = (env) => ({
  getBreeds: getBreedsWithCache(env),
});
