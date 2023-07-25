import { ObjectId } from "mongodb";

export const cheerSeeds = [
  {
    userCheerer_id: new ObjectId().toString(),
    post_id: new ObjectId().toString(),
    postType: "resolution",
  },
];
