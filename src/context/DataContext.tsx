import React, { ReactNode, useState } from 'react';

interface IDataContext {
  notWatchList: string[];
  setNotWatchList: (newValue: string[]) => void;
}

const initialState: IDataContext = {
  notWatchList: [],
  setNotWatchList: (newValue: string[]) => {},
};

export const DataContext = React.createContext<IDataContext>(initialState);

export const useDataContext = (): IDataContext => React.useContext(DataContext);

export const DataContextConsumer = DataContext.Consumer;

export const DataContextProvider = ({ children }: { children: ReactNode }) => {
  const [notWatchList, setNotWatchList] = useState<string[]>([]);

  return (
    <DataContext.Provider
      value={{
        notWatchList,
        setNotWatchList,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
