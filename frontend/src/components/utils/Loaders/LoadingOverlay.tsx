const LoadingOverlay = (props: { loadingMessage: string }) => {
  return (
    <div class="absolute inset-0 bg-base-200/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-box">
      <div class="flex flex-col items-center gap-3">
        <span class="loading loading-spinner loading-lg text-primary"></span>
        <p class="text-lg font-medium">{props.loadingMessage}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
