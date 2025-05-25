import opencage from "opencage-api-client";

const getHumanReadableLocation = async (
  lat: number,
  lon: number
): Promise<string> => {
  try {
    const data = await opencage.geocode({
      key: process.env.NEXT_PUBLIC_OPENCAGE_API_KEY!,
      q: `${lat}, ${lon}`,
      language: "fr",
    });
    if (data.status.code === 200 && data.results.length > 0) {
      const city = data.results[0].components.city;
      const state = data.results[0].components.state;
      const res = city + " , " + state;
      // console.log(state);
      return res;
    } else {
      console.log("status", data.status.message);
      console.log("total_results", data.total_results);
      return "";
    }
  } catch (error: any) {
    console.log("error", error.message);
    if (error.status && error.status.code === 402) {
      console.log("hit free trial daily limit");
      console.log("become a customer: https://opencagedata.com/pricing");
    }
    return "";
  }
};
export default getHumanReadableLocation;
