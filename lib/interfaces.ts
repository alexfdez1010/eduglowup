export interface State {
  isError: boolean;
  message: string;
}

export interface ActionWithState {
  (
    prevState: State,
    formData: FormData,
  ): Promise<State> | State | void | Promise<void>;
}
