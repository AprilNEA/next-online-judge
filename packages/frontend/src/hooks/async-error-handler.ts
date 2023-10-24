import { useState } from "react";

const useThrowAsyncError = () => {
  const [error, setError] = useState();

  return (e: any) => {
    setError(() => {
      throw e;
    });
  };
};

export default useThrowAsyncError;
