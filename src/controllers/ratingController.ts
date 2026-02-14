import { carrierService } from "#libs/CarrierServices/CarrierServices.js";
import { isNormalizedRate, ReqRateValidated, ResRate } from "#types/ShippingRate.js";

export const ratingController = async (req: ReqRateValidated, res: ResRate) => {
  try {
    const rate = req.body;
    // TODO: In a real implementation, the carrier service ID should come from the request or be determined based on the client doing the request.
    const rateRes = await carrierService.getRate("UPS", rate);

    if (isNormalizedRate(rateRes)) {
      return res.status(200).json({
        data: rateRes,
        message: "Rate obtained successfully",
        status: true,
      });
    }

    return res.status(rateRes.statusCode || 500).json({ errors: rateRes.errors, message: "Error obtaining rate", status: false });
  } catch (error) {
    console.log("Error in ratingController:", error);
    return res.status(500).json({
      errors: ["Internal Server Error"],
      message: "Internal Server Error",
      status: false,
    });
  }
};
