import { Status } from "../reducers/status";

export const STATUS_LOADING = "STATUS_LOADING";
export const STATUS_UPDATE = "STATUS_UPDATE";

export const statusLoading = () => ({
  type: STATUS_LOADING,
});

export const statusUpdate = (data: {
  type: "STATUS_UPDATE";
  status?: Status;
  loading?: boolean;
  hidden?: boolean;
}) => ({
  type: STATUS_UPDATE,
  data,
});
