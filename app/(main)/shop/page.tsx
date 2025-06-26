import { getUserProgress, getUserSubscription } from "@/db/queries";

import { ShopClient } from "./page-client";

const ShopPage = async () => {
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();

  const [userProgress, userSubscription] = await Promise.all([
    userProgressData,
    userSubscriptionData,
  ]);

  return (
    <ShopClient
      initialUserProgress={userProgress}
      initialUserSubscription={userSubscription}
    />
  );
};

export default ShopPage;
