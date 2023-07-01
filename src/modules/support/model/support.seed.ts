import { ObjectId } from "mongodb";

export const supportingSeeds = [
  {
    user_id: new ObjectId(),
    supporter: {
      id: new ObjectId(),
      displayName: "tes name",
      photo: "randomhoto.jpg",
    },
  },
];
