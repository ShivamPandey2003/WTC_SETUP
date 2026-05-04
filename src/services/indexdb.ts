import localForage from "localforage";

export const indexedDBStorage = localForage.createInstance({
  name: "myAppDB_v2",
});