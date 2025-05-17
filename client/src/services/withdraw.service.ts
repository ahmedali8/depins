import { useMutation } from "@tanstack/react-query";
import { networkRequest, type NetworkRequestParams } from "./call-api";

const handleSuccess = (data: any) => {
  console.log("Success on auth service");
  console.log(data);
};

const handleError = (error: any) => {
  console.log("Error while having auth service: " + error);
};

export const useWithdrawService = () => {
  const {
    mutateAsync: withdraw,
    isPending: isWithdrawing,
    isSuccess,
    data,
  } = useMutation({
    mutationFn: async (params: NetworkRequestParams) => networkRequest(params),
    onSuccess: handleSuccess,
    onError: handleError,
    retry: false,
  });

  return { withdraw, isWithdrawing, isSuccess, data };
};
