import React, { useContext } from "react";
import { fetchHttpClient } from "./service/http/FetchHttpClient";
import { HttpClient, HttpClientEnv } from "./service/http/HttpClient";
import { HttpJsonError } from "./service/http/HttpError";
import {
  BreedService,
  BreedServiceEnv,
  makeBreedService,
} from "./service/domain/DogService";
import {
  LocalStorage,
  LocalStorageEnv,
} from "./service/localStorage/LocalStorage";
import { domLocalStorage } from "./service/localStorage/DomLocalStorage";
import {
  CacheService,
  CacheServiceEnv,
  makeLocalStorageCacheService,
} from "./service/cache/CacheService";

const httpClient: HttpClient = fetchHttpClient;

export const httpClientEnv: HttpClientEnv = {
  httpClient,
};

const localStorage: LocalStorage = domLocalStorage;
export const localStorageEnv: LocalStorageEnv = {
  localStorage,
};

export const cacheService: CacheService =
  makeLocalStorageCacheService(localStorageEnv);

export const cacheServiceEnv: CacheServiceEnv = {
  cacheService,
};

export const breedService: BreedService<HttpJsonError> = makeBreedService({
  ...httpClientEnv,
  ...cacheServiceEnv,
});

export const breedServiceEnv: BreedServiceEnv<HttpJsonError> = {
  breedService,
};

export type AppEnv = HttpClientEnv &
  LocalStorageEnv &
  CacheServiceEnv &
  BreedServiceEnv<HttpJsonError>;

export const appEnv: AppEnv = {
  ...httpClientEnv,
  ...localStorageEnv,
  ...cacheServiceEnv,
  ...breedServiceEnv,
};
