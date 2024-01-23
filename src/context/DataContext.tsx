import React, { ReactNode, useState } from 'react';
import { HighlightList } from '../utils/getHighlightList';

interface StrategySymbols {
  upFast1MinGroup: HighlightList[];
  downFast1MinGroup: HighlightList[];
  upFast3MinGroup: HighlightList[];
}

interface ObserverSymbols {
  upFastGroup: HighlightList[];
  downFastGroup: HighlightList[];
}

interface IDataContext {
  strategySymbols: StrategySymbols;
  setStrategySymbols: (newStrategySymbols: StrategySymbols) => void;
  isSpotMode: boolean;
  setIsSpotMode: (newValue: boolean) => void;
  notWatchList: string[];
  setNotWatchList: (newValue: string[]) => void;
  observerSymbols: ObserverSymbols;
  setObserverSymbols: (newObserverSymbols: ObserverSymbols) => void;
}

const initialState: IDataContext = {
  strategySymbols: {
    upFast1MinGroup: [],
    downFast1MinGroup: [],
    upFast3MinGroup: [],
  },
  setStrategySymbols: (newStrategySymbols: StrategySymbols) => {},
  isSpotMode: false,
  setIsSpotMode: (newValue: boolean) => {},
  notWatchList: [],
  setNotWatchList: (newValue: string[]) => {},
  observerSymbols: {
    upFastGroup: [],
    downFastGroup: [],
  },
  setObserverSymbols: (newvalue: ObserverSymbols) => {},
};

export const DataContext = React.createContext<IDataContext>(initialState);

export const useDataContext = (): IDataContext => React.useContext(DataContext);

export const DataContextConsumer = DataContext.Consumer;

export const DataContextProvider = ({ children }: { children: ReactNode }) => {
  const [strategySymbols, setStrategySymbols] = useState<StrategySymbols>({
    upFast1MinGroup: [],
    downFast1MinGroup: [],
    upFast3MinGroup: [],
  });
  const [isSpotMode, setIsSpotMode] = useState<boolean>(false);
  const [notWatchList, setNotWatchList] = useState<string[]>([]);
  const [observerSymbols, setObserverSymbols] = useState<ObserverSymbols>({
    upFastGroup: [],
    downFastGroup: [],
  });

  return (
    <DataContext.Provider
      value={{
        strategySymbols,
        setStrategySymbols,
        isSpotMode,
        setIsSpotMode,
        notWatchList,
        setNotWatchList,
        observerSymbols,
        setObserverSymbols,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
