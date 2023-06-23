import { ObjectId } from "mongodb";

export const resolutionSeeds = [
  {
    user: {
      displayName: "Example name",
      photo: "randomhoto.jpg",
    },
    resolution: "Occaecat cupidatat minim Lorem adipisicing do sint ipsum nulla ad labore consequat.",
    images: ["image.jpg", "otherimage.jpg"],
    category_id: new ObjectId(), // example
    shareType: "everyone",
    completed: false,
    dueDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
