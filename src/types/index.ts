export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

// export type IPost = {
//   $id: string
//   caption: string
//   location: string
//   tags: string[]
//   imageId: string
//   imageUrl: string
// }


export type ICreator = {
  $id: string
  name: string
  imageUrl?: string
}

// export type IPost = {
//   $id: string
//   $createdAt: string
//   caption: string
//   location: string
//   tags: string[]
//   imageId: string
//   imageUrl: string
//   creator: ICreator
// }

export type IPost = {
  $id: string
  $createdAt: string
  caption: string
  location: string
  tags: string[]
  imageId: string
  imageUrl: string
  likes: { $id: string }[]
  creator: ICreator
}

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUpdatePost = {
  postId: string
  caption: string
  imageId: string
  imageUrl: URL | string
  file: File[]
  location?: string
  tags?: string
}

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};