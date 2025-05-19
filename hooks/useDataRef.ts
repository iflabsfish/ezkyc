import { useState, useRef, useEffect } from "react";

export const useStateRef = (state: any) => {
  const ref = useRef(state);

  useEffect(() => {
    ref.current = state;
  }, [state]);

  return ref;
};
