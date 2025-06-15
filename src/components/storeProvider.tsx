"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";

interface Props {
  children: React.ReactNode;
}

const StoreProvider = ({ children }: Props) => {
  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
