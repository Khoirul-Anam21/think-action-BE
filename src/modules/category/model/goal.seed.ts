import { ObjectId } from "mongodb";

export const resolutionSeeds = [
  {
    user: {
      id: new ObjectId(),
      displayName: "Example name",
      photo: "randomhoto.jpg",
    },
    resolution_id: new ObjectId(),
    goal: "Occaecat cupidatat minim Lorem adipisicing do sint ipsum nulla ad labore consequat.",
    images: ["image.jpg", "otherimage.jpg"],
    category_id: new ObjectId(), // example
    shareType: "everyone",
    dueDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
