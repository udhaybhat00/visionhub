interface OrderPlacementSkeletonProps {
  step?: "validating" | "creating" | "emailing" | "redirecting";
  isCheckoutRedirect?: boolean;
}

export function OrderPlacementSkeleton({
  step = "creating",
  isCheckoutRedirect = false,
}: OrderPlacementSkeletonProps) {
  const getStepStatus = (currentStep: string) => {
    const steps = ["validating", "creating", "emailing", "redirecting"];
    const currentIndex = steps.indexOf(step);
    const stepIndex = steps.indexOf(currentStep);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  const getStepDisplay = (stepName: string) => {
    const status = getStepStatus(stepName);
    return {
      completed: "text-green-600 font-medium",
      active:
        "text-green-600 font-medium flex items-center justify-center gap-2",
      pending: "text-gray-400",
    }[status];
  };

  return (
    <div className="mx-auto w-full rounded-[28px] border border-white/20 bg-white p-5 shadow-2xl sm:p-8">
      <div className="space-y-7 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-black">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200 border-t-black animate-spin" />
              <span className="text-2xl text-white">✓</span>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-950">
              {isCheckoutRedirect &&
                step === "redirecting" &&
                "Redirecting to Checkout"}
              {!isCheckoutRedirect &&
                step === "validating" &&
                "Validating Your Order"}
              {!isCheckoutRedirect &&
                step === "creating" &&
                "Processing Your Order"}
              {!isCheckoutRedirect &&
                step === "emailing" &&
                "Sending Confirmation"}
              {!isCheckoutRedirect &&
                step === "redirecting" &&
                "Order Confirmed!"}
            </h3>
            <p className="mx-auto max-w-sm text-sm leading-6 text-gray-500">
              {isCheckoutRedirect &&
                step === "redirecting" &&
                "Taking you to the secure checkout page where you can complete your payment"}
              {!isCheckoutRedirect &&
                step === "validating" &&
                "Validating cart and customer details"}
              {!isCheckoutRedirect &&
                step === "creating" &&
                "Creating your secure Razorpay payment session"}
              {!isCheckoutRedirect &&
                step === "emailing" &&
                "Verifying stock and preparing confirmation"}
              {!isCheckoutRedirect &&
                step === "redirecting" &&
                "Taking you to the order confirmation page"}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-center px-2">
            {[1, 2, 3, 4].map((stepNum, index) => {
              const stepName = [
                "validating",
                "creating",
                "emailing",
                "redirecting",
              ][index];
              const status = getStepStatus(stepName);

              return (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
                      status === "completed"
                        ? "bg-black text-white scale-105"
                        : status === "active"
                        ? "bg-gray-950 text-white animate-pulse scale-105"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {status === "completed" ? "✓" : stepNum}
                  </div>
                  {index < 3 && (
                    <div
                      className={`mx-1 h-0.5 w-8 rounded-full transition-all duration-500 sm:w-14 ${
                        getStepStatus(
                          ["validating", "creating", "emailing", "redirecting"][
                            index + 1
                          ]
                        ) === "completed" ||
                        getStepStatus(
                          ["validating", "creating", "emailing", "redirecting"][
                            index + 1
                          ]
                        ) === "active"
                          ? "bg-green-600"
                          : "bg-gray-100"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mx-auto max-w-sm space-y-3 rounded-2xl bg-gray-50 p-4 text-left text-sm">
            <div className={getStepDisplay("validating")}>
              {getStepStatus("validating") === "completed" && (
                <span className="text-green-600 font-bold">✓</span>
              )}
              {getStepStatus("validating") === "active" && (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              )}
              <span className="ml-2">Validating Cart</span>
            </div>

            <div className={getStepDisplay("creating")}>
              {getStepStatus("creating") === "completed" && (
                <span className="text-green-600 font-bold">✓</span>
              )}
              {getStepStatus("creating") === "active" && (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              )}
              <span className="ml-2">Verifying Stock</span>
            </div>

            <div className={getStepDisplay("emailing")}>
              {getStepStatus("emailing") === "completed" && (
                <span className="text-green-600 font-bold">✓</span>
              )}
              {getStepStatus("emailing") === "active" && (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              )}
              <span className="ml-2">Creating Secure Payment Session</span>
            </div>

            <div className={getStepDisplay("redirecting")}>
              {getStepStatus("redirecting") === "completed" && (
                <span className="text-green-600 font-bold">✓</span>
              )}
              {getStepStatus("redirecting") === "active" && (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              )}
              <span className="ml-2">Redirecting To Razorpay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrderPlacementOverlay({
  step = "creating",
  isCheckoutRedirect = false,
}: OrderPlacementSkeletonProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md sm:p-6"
      style={{ zIndex: 9999 }}
    >
      <div className="w-full max-w-md max-h-[90vh] sm:max-w-lg animate-in fade-in-0 zoom-in-95 duration-300 overflow-y-auto">
        <OrderPlacementSkeleton
          step={step}
          isCheckoutRedirect={isCheckoutRedirect}
        />
      </div>
    </div>
  );
}
