import React, { useReducer, useState, useEffect } from "react";
import { appEnv, breedImageServiceEnv, breedServiceEnv } from "../AppEnv";
import {
  AppEnvContext,
  useAppEnvReducer,
  useAppEnvRemoteData,
  useAppEnvRT,
  useAppEnvRTE,
} from "../hooks/useAppEnv";
import { BreedServiceContext, useBreedsRD } from "../hooks/useDomain";
import { BreedImageServiceContext } from "../hooks/useImageService";
import { Breed } from "../model/Breed";
import {
  BreedService,
  getBreeds,
  getBreedsWithCache,
} from "../service/domain/DogService";
import { HttpJsonError } from "../service/http/HttpError";
import { Eq, pipe, RD, RT, RTE, TE } from "../utils/fpts";
import BreedImage from "./BreedAlbum";
import Breeds from "./Breeds";

const mockBreedService: BreedService<never> = {
  getBreeds: TE.right([
    { name: "breed1", subBreeds: ["sub1", "sub2"] },
    { name: "breed2", subBreeds: ["sub1"] },
  ]),
};

export const MainBreedService = () => {
  const breedsRD = useBreedsRD();

  return <Breeds breedsRD={breedsRD} />;
};

export const MainAppEnvRT = () => {
  const [breedsRD, setBreedsRD] = useState<
    RD.RemoteData<HttpJsonError, Array<Breed>>
  >(RD.initial);

  useAppEnvRT({
    rt: pipe(
      getBreeds,
      RTE.fold(
        (e: HttpJsonError) =>
          RT.fromIO(() => {
            setBreedsRD(RD.failure(e));
          }),
        (breeds: Array<Breed>) =>
          RT.fromIO(() => {
            setBreedsRD(RD.success(breeds));
          })
      )
    ),
    deps: [],
    eqDeps: Eq.getTupleEq(),
  });

  return <Breeds breedsRD={breedsRD} />;
};

export const MainAppEnvRTE = () => {
  const [breedsRD, setBreedsRD] = useState<
    RD.RemoteData<HttpJsonError, Array<Breed>>
  >(RD.initial);

  useAppEnvRTE({
    rte: getBreeds,
    onBefore: () => setBreedsRD(RD.pending),
    onError: (error) => setBreedsRD(RD.failure(error)),
    onSuccess: (breeds) => setBreedsRD(RD.success(breeds)),
    deps: [],
    eqDeps: Eq.getTupleEq(),
  });

  return <Breeds breedsRD={breedsRD} />;
};

/**
 * Using an RTE that manifests itself as a RemoteData state
 */
export const MainAppEnvRemoteData = () => {
  const breedsRD = useAppEnvRemoteData({
    rte: getBreeds,
    deps: [],
    eqDeps: Eq.getTupleEq(),
  });

  return <Breeds breedsRD={breedsRD} />;
};

/**
 * RTE reducer/redux
 */

type LoadingBreeds = { type: "loadingBreeds" };
type FailedBreeds = { type: "failedBreeds"; error: HttpJsonError };
type LoadedBreeds = { type: "loadedBreeds"; breeds: Array<Breed> };

type Action = LoadingBreeds | FailedBreeds | LoadedBreeds;

type State = { breedsRD: RD.RemoteData<HttpJsonError, Array<Breed>> };

const initialState = { breedsRD: RD.initial };

type Reducer = (state: State, action: Action) => State;

const reducer: Reducer = (_state: State, action: Action) => {
  switch (action.type) {
    case "loadingBreeds":
      return { breedsRD: RD.pending };
    case "failedBreeds":
      return { breedsRD: RD.failure(action.error) };
    case "loadedBreeds":
      return { breedsRD: RD.success(action.breeds) };
  }
};

const MainAppEnvReducer = () => {
  const [state, dispatch] = useReducer<Reducer>(reducer, initialState);

  useAppEnvReducer({
    rte: getBreedsWithCache,
    dispatch,
    getBeforeAction: (): Action => ({ type: "loadingBreeds" }),
    getErrorAction: (error): Action => ({ type: "failedBreeds", error }),
    getSuccessAction: (breeds): Action => ({
      type: "loadedBreeds",
      breeds,
    }),
    deps: [],
    eqDeps: Eq.getTupleEq(),
  });

  return <Breeds breedsRD={state.breedsRD} />;
};

const Main = () => {
  /**
   *  AppEnv context with ReaderTask-based hook
   */
  // return (
  //   <AppEnvContext.Provider value={appEnv}>
  //     <MainAppEnvRT />
  //   </AppEnvContext.Provider>
  // );
  /**
   *  AppEnv context with ReaderTaskEither-based hook
   */
  // return (
  //   <AppEnvContext.Provider value={appEnv}>
  //     <MainAppEnvRTE />
  //   </AppEnvContext.Provider>
  // );
  /**
   * AppEnv context with RemoteData-based hook
   */
  // return (
  //   <AppEnvContext.Provider value={appEnv}>
  //     <MainAppEnvRemoteData />
  //   </AppEnvContext.Provider>
  // );
  /**
   * AppEnv context with reducer-based hook
   */
  // return (
  //   <AppEnvContext.Provider value={appEnv}>
  //     <MainAppEnvReducer />
  //   </AppEnvContext.Provider>
  // );
  /**
   * BreedService context with real API
   */
  return (
    <BreedServiceContext.Provider value={breedServiceEnv}>
      <MainBreedService />
    </BreedServiceContext.Provider>
  );

  /**
   * BreedService context with mock data
   */
  // return (
  //   <BreedServiceContext.Provider value={{ breedService: mockBreedService }}>
  //     <MainBreedService />
  //   </BreedServiceContext.Provider>
  // );
};

export default Main;
