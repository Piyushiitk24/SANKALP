import {
  getTopTenUsers,
  getUserProgress,
  getUserSubscription,
} from "@/db/queries";

import { LeaderboardClient } from "./page-client";

const LeaderboardPage = async () => {
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();
  const leaderboardData = getTopTenUsers();

  const [userProgress, userSubscription, leaderboard] = await Promise.all([
    userProgressData,
    userSubscriptionData,
    leaderboardData,
  ]);

  return (
    <LeaderboardClient
      initialUserProgress={userProgress}
      initialUserSubscription={userSubscription}
      initialLeaderboard={leaderboard}
    />
  );
};

export default LeaderboardPage;
