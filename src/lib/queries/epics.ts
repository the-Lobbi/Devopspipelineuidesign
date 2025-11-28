import { toast } from "sonner@2.0.3";

export function useCancelEpic() {
  return {
    mutate: (epicId: string) => {
      toast.info("Epic Cancelled", { description: `Epic ${epicId} has been cancelled.` });
    }
  };
}

export function useRetryEpic() {
  return {
    mutate: (epicId: string) => {
      toast.success("Epic Retried", { description: `Retrying execution for ${epicId}.` });
    }
  };
}

export function useCreateEpic() {
    return {
        mutateAsync: async (data: any) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    toast.success("Epic Created", { description: data.summary });
                    resolve(data);
                }, 1000);
            });
        },
        isPending: false
    }
}
