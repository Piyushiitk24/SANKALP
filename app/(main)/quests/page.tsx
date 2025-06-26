import { getUserProgress, getUserSubscription } from "@/db/queries";

import { QuestsClient } from "./page-client";

const QuestsPage = async () => {
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();

  const [userProgress, userSubscription] = await Promise.all([
    userProgressData,
    userSubscriptionData,
  ]);

  return (
    <QuestsClient
      initialUserProgress={userProgress}
      initialUserSubscription={userSubscription}
    />
  );
};

export default QuestsPage;
